import "server-only";
import { createHash } from "node:crypto";

import snap from "midtrans-client";
import { PaymentMethod, PaymentStatus, Prisma } from "@/generated/prisma/client";
import type { OrderPayment, PaymentInstruction } from "@/lib/contracts";

export type PaymentChannel = "qris" | "virtual-account" | "ewallet";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  currency: "IDR";
  channel: PaymentChannel;
  expiresAt: Date;
};

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

function getSnapApi() {
  return new snap.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
}

function toPrismaPaymentMethod(channel: PaymentChannel): PaymentMethod {
  switch (channel) {
    case "virtual-account":
      return PaymentMethod.VIRTUAL_ACCOUNT;
    case "ewallet":
      return PaymentMethod.EWALLET;
    case "qris":
      return PaymentMethod.QRIS;
  }
}

export function resolvePaymentChannel(value: string): PaymentChannel {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "va" || normalizedValue === "virtual-account" || normalizedValue === "virtual_account") {
    return "virtual-account";
  }

  if (normalizedValue === "ewallet" || normalizedValue === "e-wallet" || normalizedValue === "gopay") {
    return "ewallet";
  }

  return "qris";
}

export async function createSnapPayment(
  tx: Prisma.TransactionClient,
  input: CreatePaymentInput,
): Promise<PaymentInstruction> {
  const snapApi = getSnapApi();

  const transactionParams = {
    transaction_details: {
      order_id: input.orderId,
      gross_amount: input.amount,
    },
    credit_card: {
      secure: true,
    },
    expiry: {
      start_time: formatMidtransDate(new Date()),
      unit: "minutes",
      duration: 60 * 24,
    },
  };

  const snapResponse = await snapApi.createTransaction(transactionParams);

  const snapToken: string = snapResponse.token;
  const redirectUrl: string = snapResponse.redirect_url;
  const snapTransactionId = `SNAP-${snapResponse.transaction_id || input.orderId}`;

  const title =
    input.channel === "virtual-account"
      ? "Virtual Account Midtrans"
      : input.channel === "ewallet"
        ? "E-wallet Midtrans"
        : "QRIS Midtrans";
  const description =
    "Klik tombol 'Bayar Sekarang' untuk menyelesaikan pembayaran melalui Midtrans Snap.";

  await tx.payment.create({
    data: {
      orderId: input.orderId,
      provider: "MIDTRANS_SNAP",
      paymentMethod: toPrismaPaymentMethod(input.channel),
      status: PaymentStatus.PENDING,
      amount: input.amount,
      currency: input.currency,
      externalId: input.orderId,
      snapToken,
      transactionId: snapTransactionId,
      transactionStatus: "pending",
      rawResponse: snapResponse,
      expiredAt: input.expiresAt,
      lastStatusSyncedAt: new Date(),
    },
  });

  return {
    method: input.channel,
    status: "pending",
    amount: { amount: input.amount, currency: input.currency },
    title,
    description,
    qrString: "",
    qrUrl: redirectUrl,
    vaNumber: "",
    deeplinkUrl: redirectUrl,
    snapToken,
    expiresAt: input.expiresAt.toISOString(),
    snapRedirectUrl: redirectUrl,
  };
}

export function mapPaymentToInstruction(payment: OrderPayment): PaymentInstruction {
  return {
    method: payment.method,
    status: payment.status === "paid" ? "paid" : payment.status === "failed" ? "failed" : payment.status === "expired" ? "expired" : "pending",
    amount: payment.amount,
    title:
      payment.method === "virtual-account"
        ? "Virtual Account Midtrans"
        : payment.method === "ewallet"
          ? "E-wallet Midtrans"
          : "QRIS Midtrans",
    description:
      "Klik tombol 'Bayar Sekarang' untuk menyelesaikan pembayaran melalui Midtrans Snap.",
    qrString: payment.qrString,
    qrUrl: payment.qrUrl,
    vaNumber: payment.vaNumber,
    deeplinkUrl: payment.deeplinkUrl,
    snapToken: payment.snapToken,
    expiresAt: payment.expiredAt,
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