import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { PaymentStatus, OrderStatus } from "@/generated/prisma/client";
import { corsHeaders } from "@/lib/cors";
import { verifyWebhookSignature } from "@/lib/services/payment-service";

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
    if (fs === "deny") {
      return {
        paymentStatus: PaymentStatus.FAILED,
        orderStatus: OrderStatus.PENDING_PAYMENT,
      };
    }
  }

  if (ts === "pending") {
    return {
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING_PAYMENT,
    };
  }

  if (ts === "expire") {
    return {
      paymentStatus: PaymentStatus.EXPIRED,
      orderStatus: OrderStatus.PENDING_PAYMENT,
    };
  }

  if (ts === "deny" || ts === "cancel") {
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
    const { order_id, transaction_status, fraud_status, status_code, gross_amount, signature_key } = notification;

    if (!order_id) {
      return Response.json({ ok: false, message: "order_id is required" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return Response.json({ ok: false, message: "MIDTRANS_SERVER_KEY not configured" }, { status: 500 });
    }

    if (!verifyWebhookSignature(order_id, status_code, gross_amount, serverKey, signature_key)) {
      return Response.json({ ok: false, message: "Invalid signature" }, { status: 403 });
    }

    const statuses = mapMidtransStatus(transaction_status, fraud_status);

    if (!statuses) {
      return Response.json({ ok: false, message: "Unknown transaction status" }, { status: 400 });
    }

    const orderExists = await prisma.order.findUnique({
      where: { id: order_id },
      select: { id: true },
    });

    if (!orderExists) {
      return Response.json({ ok: false, message: "Order not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: order_id },
        select: {
          status: true,
          payments: {
            select: { status: true },
            take: 1,
          },
        },
      });

      if (!existingOrder) {
        return;
      }

      const isAlreadyPaid =
        existingOrder.status === OrderStatus.PAID ||
        existingOrder.status === OrderStatus.FULFILLED ||
        existingOrder.payments.some((payment) => payment.status === PaymentStatus.PAID);
      const effectivePaymentStatus =
        isAlreadyPaid && statuses.paymentStatus !== PaymentStatus.PAID
          ? PaymentStatus.PAID
          : statuses.paymentStatus;
      const effectiveOrderStatus =
        isAlreadyPaid && statuses.orderStatus !== OrderStatus.PAID
          ? existingOrder.status
          : statuses.orderStatus;

      await tx.payment.updateMany({
        where: { orderId: order_id },
        data: {
          transactionId: notification.transaction_id,
          transactionStatus: transaction_status,
          fraudStatus: fraud_status,
          status: effectivePaymentStatus,
          rawNotification: notification,
          lastStatusSyncedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: order_id },
        data: { status: effectiveOrderStatus },
      });

      if (effectivePaymentStatus === PaymentStatus.PAID) {
        await tx.payment.updateMany({
          where: { orderId: order_id },
          data: { paidAt: new Date() },
        });

        await tx.orderFulfillment.updateMany({
          where: { orderId: order_id },
          data: { status: "READY_TO_PROCESS" },
        });
      }
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
