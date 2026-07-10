"use server";

import { revalidatePath } from "next/cache";
import { OrderFulfillmentStatus } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/session";
import { getSellerOrdersDto } from "@/lib/dal/orders";
import { prisma } from "@/lib/db/prisma";

export async function getSellerOrdersAction() {
  const user = await requireUser();
  if (!user.sellerId) {
    throw new Error("Akun ini tidak terdaftar sebagai penjual.");
  }
  return getSellerOrdersDto(user.sellerId);
}

type FulfillResult =
  | { ok: true }
  | { ok: false; error: string };

export type SellerOrderDetail = Awaited<ReturnType<typeof getSellerOrderDetailAction>>;

export async function getSellerOrderDetailAction(orderId: string) {
  const user = await requireUser();
  const sellerId = user.sellerId;
  if (!sellerId) {
    throw new Error("Akun ini bukan penjual.");
  }

  const row = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: { some: { sellerId } },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        where: { sellerId },
        include: {
          product: { select: { name: true, sellerId: true } },
          ampasListing: { select: { slug: true, sellerId: true } },
        },
      },
      payments: { orderBy: { createdAt: "desc" } },
      fulfillments: {
        where: { sellerId },
        include: { seller: { select: { displayName: true } } },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!row) {
    return null;
  }

  const { user: buyer, ...orderData } = row;

  return {
    id: orderData.id,
    status: orderData.status,
    createdAt: orderData.createdAt.toISOString(),
    updatedAt: orderData.updatedAt.toISOString(),
    paymentExpiresAt: orderData.paymentExpiresAt?.toISOString() ?? "",
    subtotalAmount: orderData.subtotalAmount,
    platformFeeAmount: orderData.platformFeeAmount,
    shippingEstimateAmount: orderData.shippingEstimateAmount,
    discountAmount: orderData.discountAmount,
    grandTotalAmount: orderData.grandTotalAmount,
    promoCode: orderData.promoCode ?? "",
    shipping: {
      receiverName: orderData.receiverName ?? "",
      receiverPhone: orderData.receiverPhone ?? "",
      address: orderData.shippingAddress ?? "",
      city: orderData.shippingCity ?? "",
      province: orderData.shippingProvince ?? "",
      courierCode: orderData.courierCode ?? "",
      courierName: orderData.courierName ?? "",
    },
    buyer: {
      name: buyer?.name ?? "Pembeli",
      email: buyer?.email ?? "",
    },
    items: orderData.items.map((item) => ({
      id: item.id,
      name: item.product?.name ?? "Produk",
      quantity: item.quantity,
      unitPriceAmount: item.unitPriceAmount,
      subtotalAmount: item.unitPriceAmount * item.quantity,
    })),
    payments: orderData.payments.map((p) => ({
      id: p.id,
      method: p.paymentMethod,
      status: p.status,
      amount: p.amount,
      paidAt: p.paidAt?.toISOString() ?? "",
    })),
    fulfillments: orderData.fulfillments.map((f) => ({
      id: f.id,
      status: f.status,
      trackingNumber: f.trackingNumber ?? "",
      shippingNote: f.shippingNote ?? "",
      shippedAt: f.shippedAt?.toISOString() ?? "",
      deliveredAt: f.deliveredAt?.toISOString() ?? "",
      updatedAt: f.updatedAt.toISOString(),
    })),
  };
}

export async function processOrderAction(
  orderId: string,
): Promise<FulfillResult> {
  try {
    const user = await requireUser();
    const sellerId = user.sellerId;
    if (!sellerId) {
      return { ok: false, error: "Akun ini bukan penjual." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        items: {
          where: { sellerId },
          select: { id: true },
        },
      },
    });

    if (!order || order.items.length === 0) {
      return { ok: false, error: "Pesanan tidak ditemukan atau tidak mengandung barang Anda." };
    }

    await prisma.orderFulfillment.upsert({
      where: {
        orderId_sellerId: { orderId, sellerId },
      },
      create: {
        orderId,
        sellerId,
        status: OrderFulfillmentStatus.PROCESSING,
      },
      update: {
        status: OrderFulfillmentStatus.PROCESSING,
      },
    });

    revalidatePath("/seller");
    return { ok: true };
  } catch (err) {
    console.error("processOrderAction error:", err);
    return { ok: false, error: "Gagal memproses pesanan." };
  }
}

export async function shipOrderAction(
  orderId: string,
  trackingNumber: string,
): Promise<FulfillResult> {
  try {
    const user = await requireUser();
    const sellerId = user.sellerId;
    if (!sellerId) {
      return { ok: false, error: "Akun ini bukan penjual." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        items: {
          where: { sellerId },
          select: { id: true },
        },
      },
    });

    if (!order || order.items.length === 0) {
      return { ok: false, error: "Pesanan tidak ditemukan atau tidak mengandung barang Anda." };
    }

    await prisma.orderFulfillment.upsert({
      where: {
        orderId_sellerId: { orderId, sellerId },
      },
      create: {
        orderId,
        sellerId,
        status: OrderFulfillmentStatus.SHIPPED,
        trackingNumber,
        shippedAt: new Date(),
      },
      update: {
        status: OrderFulfillmentStatus.SHIPPED,
        trackingNumber,
        shippedAt: new Date(),
      },
    });

    revalidatePath("/seller");
    return { ok: true };
  } catch (err) {
    console.error("shipOrderAction error:", err);
    return { ok: false, error: "Gagal mengirim pesanan." };
  }
}
