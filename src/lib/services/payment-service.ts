import "server-only";

import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@/generated/prisma/client";
import type {
  OrderPayment,
  PaymentInstruction,
} from "@/lib/contracts";

export type PaymentChannel = "qris" | "virtual-account" | "ewallet";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  currency: "IDR";
  channel: PaymentChannel;
  expiresAt: Date;
};

type MidtransCoreDraft = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  payment_type: string;
};

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

  if (
    normalizedValue === "va" ||
    normalizedValue === "virtual-account" ||
    normalizedValue === "virtual_account"
  ) {
    return "virtual-account";
  }

  if (
    normalizedValue === "ewallet" ||
    normalizedValue === "e-wallet" ||
    normalizedValue === "gopay"
  ) {
    return "ewallet";
  }

  return "qris";
}

function buildCoreDraft(input: CreatePaymentInput): MidtransCoreDraft {
  switch (input.channel) {
    case "virtual-account":
      return {
        transaction_details: {
          order_id: input.orderId,
          gross_amount: input.amount,
        },
        payment_type: "bank_transfer",
      };
    case "ewallet":
      return {
        transaction_details: {
          order_id: input.orderId,
          gross_amount: input.amount,
        },
        payment_type: "gopay",
      };
    case "qris":
      return {
        transaction_details: {
          order_id: input.orderId,
          gross_amount: input.amount,
        },
        payment_type: "qris",
      };
  }
}

function createInstruction(input: CreatePaymentInput): PaymentInstruction {
  const amount = {
    amount: input.amount,
    currency: input.currency,
  };

  switch (input.channel) {
    case "virtual-account":
      return {
        method: "virtual-account",
        status: "pending",
        amount,
        title: "Virtual Account Midtrans",
        description:
          "Transfer ke nomor virtual account berikut. Status akan diperbarui otomatis setelah bank mengonfirmasi pembayaran.",
        qrString: "",
        qrUrl: "",
        vaNumber: `8808${input.orderId.replace(/\D/g, "").slice(-10).padStart(10, "0")}`,
        deeplinkUrl: "",
        expiresAt: input.expiresAt.toISOString(),
      };
    case "ewallet":
      return {
        method: "ewallet",
        status: "pending",
        amount,
        title: "E-wallet Midtrans",
        description:
          "Buka tautan pembayaran e-wallet berikut dan selesaikan pembayaran. Status akan diperbarui otomatis.",
        qrString: "",
        qrUrl: "",
        vaNumber: "",
        deeplinkUrl: `/payments/core/${input.orderId}/ewallet`,
        expiresAt: input.expiresAt.toISOString(),
      };
    case "qris":
      return {
        method: "qris",
        status: "pending",
        amount,
        title: "QRIS Midtrans",
        description:
          "Scan QRIS dari aplikasi pembayaran favorit Anda. Status akan diperbarui otomatis setelah pembayaran terkonfirmasi.",
        qrString: `midtrans-core-qris:${input.orderId}:${input.amount}`,
        qrUrl: `/payments/core/${input.orderId}/qris`,
        vaNumber: "",
        deeplinkUrl: "",
        expiresAt: input.expiresAt.toISOString(),
      };
  }
}

export async function createCorePayment(
  tx: Prisma.TransactionClient,
  input: CreatePaymentInput,
): Promise<PaymentInstruction> {
  const instruction = createInstruction(input);
  const draft = buildCoreDraft(input);

  await tx.payment.create({
    data: {
      orderId: input.orderId,
      provider: process.env.MIDTRANS_SERVER_KEY
        ? "MIDTRANS_CORE"
        : "MIDTRANS_CORE_DEV",
      paymentMethod: toPrismaPaymentMethod(input.channel),
      status: PaymentStatus.PENDING,
      amount: input.amount,
      currency: input.currency,
      externalId: input.orderId,
      transactionId: `MT-CORE-${input.orderId}`,
      transactionStatus: "pending",
      vaNumber: instruction.vaNumber || undefined,
      qrString: instruction.qrString || undefined,
      qrUrl: instruction.qrUrl || undefined,
      deeplinkUrl: instruction.deeplinkUrl || undefined,
      rawResponse: draft,
      expiredAt: input.expiresAt,
      lastStatusSyncedAt: new Date(),
    },
  });

  return instruction;
}

export function mapPaymentToInstruction(payment: OrderPayment): PaymentInstruction {
  return {
    method: payment.method,
    status: "pending",
    amount: payment.amount,
    title:
      payment.method === "virtual-account"
        ? "Virtual Account Midtrans"
        : payment.method === "ewallet"
          ? "E-wallet Midtrans"
          : "QRIS Midtrans",
    description:
      "Selesaikan pembayaran melalui instruksi berikut. Status akan diperbarui otomatis dari server.",
    qrString: payment.qrString,
    qrUrl: payment.qrUrl,
    vaNumber: payment.vaNumber,
    deeplinkUrl: payment.deeplinkUrl,
    expiresAt: payment.expiredAt,
  };
}
