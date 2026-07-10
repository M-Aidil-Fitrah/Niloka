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
