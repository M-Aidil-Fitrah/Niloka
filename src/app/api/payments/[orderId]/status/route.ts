import type { NextRequest } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { getBuyerOrderDto } from "@/lib/dal/orders";
import { mapPaymentToInstruction } from "@/lib/services/payment-service";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const user = await requireUser();
  const { orderId } = await params;
  const order = await getBuyerOrderDto(user.id, orderId);

  if (!order) {
    return Response.json(
      {
        ok: false,
        message: "Order tidak ditemukan.",
      },
      { status: 404 },
    );
  }

  const pendingPayment = order.payments.find(
    (payment) => payment.status === "pending",
  );

  return Response.json({
    ok: true,
    orderId: order.id,
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
    payment: pendingPayment ? mapPaymentToInstruction(pendingPayment) : null,
    updatedAt: order.updatedAt,
  });
}
