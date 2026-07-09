"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  toPrismaPromoStatus,
  fromPrismaPromoStatus,
  toPrismaPromoType,
  fromPrismaPromoType,
} from "@/lib/prisma-mappers";
import { z } from "zod";
import type { Promo } from "@/lib/contracts";

const promoSaveSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  title: z.string().min(3, "Judul promo wajib diisi (minimal 3 karakter)"),
  code: z.string().min(3, "Kode kupon wajib diisi (minimal 3 karakter)"),
  status: z.enum(["active", "scheduled", "expired", "disabled"]),
  type: z.enum(["percentage", "fixed-amount", "free-shipping"]),
  value: z.number().min(0, "Nilai promo tidak boleh negatif"),
  startsAt: z.string().min(1, "Tanggal mulai wajib diisi"),
  endsAt: z.string().min(1, "Tanggal berakhir wajib diisi"),
  minSubtotal: z.object({
    amount: z.number().min(0, "Minimal subtotal tidak boleh negatif"),
    currency: z.literal("IDR"),
  }),
  usageLimit: z.number().min(1, "Limit pemakaian minimal 1"),
  usedCount: z.number().optional().default(0),
  productIds: z.array(z.string()).optional().default([]),
});

export type PromoActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export async function savePromoAction(
  input: unknown,
): Promise<PromoActionResult> {
  const seller = await requireSeller();

  const validated = promoSaveSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ??
        "Data voucher promosi tidak valid.",
    };
  }

  const data = validated.data;

  // Prevent spoofing other sellerIds
  if (data.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Aksi tidak sah. ID Penjual tidak cocok.",
    };
  }

  const existing = await prisma.promo.findUnique({
    where: { id: data.id },
    select: { sellerId: true, code: true },
  });

  if (existing && existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengubah promo ini.",
    };
  }

  // Check code uniqueness (only if new promo or code changed)
  if (!existing || existing.code !== data.code) {
    const codeDup = await prisma.promo.findUnique({
      where: { code: data.code },
    });
    if (codeDup) {
      return {
        ok: false,
        message: `Kode promo "${data.code}" sudah digunakan oleh toko lain. Silakan buat kode yang unik.`,
      };
    }
  }

  const mappedStatus = toPrismaPromoStatus(data.status);
  const mappedType = toPrismaPromoType(data.type);

  await prisma.$transaction(async (tx) => {
    // 1. Upsert promo
    await tx.promo.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        sellerId: data.sellerId,
        title: data.title,
        code: data.code,
        status: mappedStatus,
        type: mappedType,
        value: data.value,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        minSubtotalAmount: data.minSubtotal.amount,
        minSubtotalCurrency: "IDR",
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
      },
      update: {
        title: data.title,
        code: data.code,
        status: mappedStatus,
        type: mappedType,
        value: data.value,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        minSubtotalAmount: data.minSubtotal.amount,
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
      },
    });

    // 2. Handle promo relations to products
    if (existing) {
      await tx.promoProduct.deleteMany({
        where: { promoId: data.id },
      });
    }

    if (data.productIds && data.productIds.length > 0) {
      await tx.promoProduct.createMany({
        data: data.productIds.map((productId) => ({
          promoId: data.id,
          productId,
        })),
      });
    }

    // 3. Write audit log
    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: existing ? "UPDATE_PROMO" : "CREATE_PROMO",
        target: "Promo",
        targetId: data.id,
        metadata: JSON.stringify({
          code: data.code,
          type: data.type,
          value: data.value,
        }),
      },
    });
  });

  revalidatePath("/seller");

  return { ok: true, id: data.id };
}

export async function deletePromoAction(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  const seller = await requireSeller();

  const existing = await prisma.promo.findUnique({
    where: { id },
    select: { sellerId: true, code: true },
  });

  if (!existing) {
    return { ok: false, message: "Kupon promo tidak ditemukan." };
  }

  if (existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk menghapus promo ini.",
    };
  }

  await prisma.$transaction(async (tx) => {
    // Delete promo (cascades to PromoProduct)
    await tx.promo.delete({
      where: { id },
    });

    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: "DELETE_PROMO",
        target: "Promo",
        targetId: id,
        metadata: JSON.stringify({ code: existing.code }),
      },
    });
  });

  revalidatePath("/seller");

  return { ok: true, message: "Kupon promo berhasil dihapus." };
}

export async function getSellerPromosAction(): Promise<Promo[]> {
  const seller = await requireSeller();
  if (!seller.sellerId) {
    throw new Error("Akun Anda tidak terhubung dengan profil Penjual.");
  }

  const rows = await prisma.promo.findMany({
    where: {
      sellerId: seller.sellerId,
    },
    include: {
      products: {
        select: {
          productId: true,
        },
      },
    },
    orderBy: {
      startsAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    sellerId: row.sellerId,
    title: row.title,
    code: row.code,
    status: fromPrismaPromoStatus(row.status),
    type: fromPrismaPromoType(row.type),
    value: row.value,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    minSubtotal: {
      amount: row.minSubtotalAmount,
      currency: "IDR",
    },
    usageLimit: row.usageLimit,
    usedCount: row.usedCount,
    productIds: row.products.map((p) => p.productId),
  }));
}
