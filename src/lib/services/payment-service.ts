import "server-only";
import { createHash } from "node:crypto";

import { Prisma, PaymentMethod, PaymentStatus } from "@/generated/prisma/client";
import type { OrderPayment, PaymentInstruction } from "@/lib/contracts";

export type PaymentChannel = "bank_transfer" | "gopay" | "qris";
export type PaymentBank = "bca" | "mandiri" | "bni";

const BANK_LABELS: Record<PaymentBank, { title: string; description: string }> = {
  bca: { title: "BCA Virtual Account", description: "Bayar melalui mobile banking, ATM, atau internet banking BCA." },
  mandiri: { title: "Mandiri Virtual Account", description: "Bayar melalui Mandiri Online, ATM, atau Livin'." },
  bni: { title: "BNI Virtual Account", description: "Bayar melalui mobile banking, ATM, atau internet banking BNI." },
};

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  currency: "IDR";
  channel: PaymentChannel;
  bank?: PaymentBank;
  expiresAt: Date;
};

export function calculatePlatformFee(channel: PaymentChannel, subtotal: number): number {
  switch (channel) {
    case "bank_transfer":
      return 4500;
    case "gopay":
      return Math.round(subtotal * 0.02) + 2000;
    case "qris":
      return Math.round(subtotal * 0.007);
  }
}

export function getChannelFromMethod(method: string): { channel: PaymentChannel; bank?: PaymentBank } {
  if (method === "gopay") return { channel: "gopay" };
  if (method === "qris") return { channel: "qris" };
  if (method === "bca") return { channel: "bank_transfer", bank: "bca" };
  if (method === "mandiri") return { channel: "bank_transfer", bank: "mandiri" };
  if (method === "bni") return { channel: "bank_transfer", bank: "bni" };
  return { channel: "bank_transfer", bank: "bca" };
}

function getCoreApiUrl(): string {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return isProduction
    ? "https://api.midtrans.com/v2"
    : "https://api.sandbox.midtrans.com/v2";
}

async function midtransCharge(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY is not configured");

  const auth = Buffer.from(serverKey + ":").toString("base64");
  const res = await fetch(`${getCoreApiUrl()}/charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  });
  const body = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(`Midtrans charge failed (${res.status}): ${JSON.stringify(body)}`);
  return body;
}

function formatMidtransDate(date: Date): string {
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const tz = -date.getTimezoneOffset();
  const tzSign = tz >= 0 ? "+" : "-";
  const tzHours = String(Math.floor(Math.abs(tz) / 60)).padStart(2, "0");
  const tzMins = String(Math.abs(tz) % 60).padStart(2, "0");
  return `${y}-${M}-${d} ${h}:${m}:${s} ${tzSign}${tzHours}${tzMins}`;
}

function toPrismaPaymentMethod(channel: PaymentChannel): PaymentMethod {
  switch (channel) {
    case "bank_transfer": return PaymentMethod.VIRTUAL_ACCOUNT;
    case "gopay": return PaymentMethod.EWALLET;
    case "qris": return PaymentMethod.QRIS;
  }
}

function toContractMethod(channel: PaymentChannel): "virtual-account" | "ewallet" | "qris" {
  switch (channel) {
    case "bank_transfer": return "virtual-account";
    case "gopay": return "ewallet";
    case "qris": return "qris";
  }
}

function getMethodTitle(channel: PaymentChannel, bank?: PaymentBank): string {
  if (channel === "bank_transfer" && bank) return BANK_LABELS[bank].title;
  if (channel === "gopay") return "GoPay";
  return "QRIS";
}

function getMethodDescription(channel: PaymentChannel, bank?: PaymentBank): string {
  if (channel === "bank_transfer" && bank) return BANK_LABELS[bank].description;
  if (channel === "gopay") return "Bayar melalui aplikasi Gojek menggunakan GoPay.";
  return "Scan QRIS menggunakan aplikasi e-wallet atau mobile banking.";
}

export async function createCorePayment(
  tx: Prisma.TransactionClient,
  input: CreatePaymentInput,
): Promise<PaymentInstruction> {
  const chargePayload: Record<string, unknown> = {
    payment_type: input.channel,
    transaction_details: {
      order_id: input.orderId,
      gross_amount: input.amount,
    },
    expiry: {
      start_time: formatMidtransDate(new Date()),
      unit: "minutes",
      duration: 60 * 24,
    },
  };

  if (input.channel === "bank_transfer" && input.bank) {
    chargePayload.bank_transfer = { bank: input.bank };
  }

  const response = await midtransCharge(chargePayload);

  const transactionId = (response.transaction_id as string) || input.orderId;
  const transactionStatus = (response.transaction_status as string) || "pending";

  let vaNumber = "";
  let qrString = "";
  let qrUrl = "";
  let deeplinkUrl = "";

  if (input.channel === "bank_transfer") {
    const vaArray = response.va_numbers as Array<{ bank: string; va_number: string }> | undefined;
    if (vaArray && vaArray.length > 0) {
      vaNumber = vaArray[0].va_number;
    }
  } else {
    const actions = response.actions as Array<{ name: string; url: string }> | undefined;
    if (actions) {
      for (const action of actions) {
        if (action.name === "generate-qr-code") qrUrl = action.url;
        else if (action.name === "deeplink-redirect") deeplinkUrl = action.url;
      }
      if (qrUrl) qrString = qrUrl;
    }
  }

  await tx.payment.create({
    data: {
      orderId: input.orderId,
      provider: "MIDTRANS_CORE",
      paymentMethod: toPrismaPaymentMethod(input.channel),
      status: PaymentStatus.PENDING,
      amount: input.amount,
      currency: input.currency,
      externalId: input.orderId,
      transactionId,
      transactionStatus,
      vaNumber: vaNumber || null,
      qrString: qrString || null,
      qrUrl: qrUrl || null,
      deeplinkUrl: deeplinkUrl || null,
      rawResponse: response as Prisma.InputJsonValue,
      expiredAt: input.expiresAt,
      lastStatusSyncedAt: new Date(),
    },
  });

  return {
    method: toContractMethod(input.channel),
    status: "pending",
    amount: { amount: input.amount, currency: input.currency },
    title: getMethodTitle(input.channel, input.bank),
    description: getMethodDescription(input.channel, input.bank),
    qrString,
    qrUrl,
    vaNumber,
    deeplinkUrl,
    expiresAt: input.expiresAt.toISOString(),
  };
}

export function mapPaymentToInstruction(payment: OrderPayment): PaymentInstruction {
  const isVA = payment.method === "virtual-account";
  return {
    method: payment.method,
    status: payment.status === "paid" ? "paid" : payment.status === "failed" ? "failed" : payment.status === "expired" ? "expired" : "pending",
    amount: payment.amount,
    title: isVA ? "Virtual Account" : payment.method === "ewallet" ? "GoPay" : "QRIS",
    description: isVA ? "Bayar melalui transfer ke Virtual Account." : payment.method === "ewallet" ? "Bayar via GoPay." : "Scan QR menggunakan aplikasi pembayaran.",
    qrString: payment.qrString || "",
    qrUrl: payment.qrUrl || "",
    vaNumber: payment.vaNumber || "",
    deeplinkUrl: payment.deeplinkUrl || "",
    expiresAt: payment.expiredAt || "",
  };
}

export function verifyWebhookSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string,
): boolean {
  const hash = createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");
  return hash === signatureKey;
}