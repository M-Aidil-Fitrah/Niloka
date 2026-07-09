import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { PaymentStatus, OrderStatus } from "@/generated/prisma/client";
import { corsHeaders } from "@/lib/cors";

type MidtransNotification = {
  transaction_status: string;
  fraud_status: string;
  order_id: string;
  transaction_id: string;
  payment_type: string;
  gross_amount: string;
  status_code: string;
  signature_key: string;
};

function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus: string,
): { paymentStatus: PaymentStatus; orderStatus: OrderStatus } | null {
  const ts = transactionStatus.toLowerCase();
  const fs = fraudStatus.toLowerCase();

  if (ts === "capture" || ts === "settlement") {
    if (fs === "accept") {
      return {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PAID,
      };
    }
  }

  if (ts === "pending") {
    return {
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING_PAYMENT,
    };
  }

  if (ts === "deny" || ts === "cancel" || ts === "expire") {
    return {
      paymentStatus: PaymentStatus.FAILED,
      orderStatus: OrderStatus.PENDING_PAYMENT,
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request.headers.get("origin")),
    });
  }

  try {
    const notification: MidtransNotification = await request.json();
    const { order_id, transaction_status, fraud_status } = notification;

    if (!order_id) {
      return Response.json({ ok: false, message: "order_id is required" }, { status: 400 });
    }

    const statuses = mapMidtransStatus(transaction_status, fraud_status);

    if (!statuses) {
      return Response.json({ ok: false, message: "Unknown transaction status" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { orderId: order_id },
        data: {
          transactionStatus: transaction_status,
          fraudStatus: fraud_status,
          status: statuses.paymentStatus,
          rawNotification: notification,
          lastStatusSyncedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: order_id },
        data: { status: statuses.orderStatus },
      });
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}
