"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  PassportValidationStatus,
  AdminValidationTarget,
  AdminValidationStatus,
} from "@/generated/prisma/client";
import { z } from "zod";
import type { NilamPassport } from "@/lib/contracts";
import {
  toPrismaProductForm,
  fromPrismaProductForm,
  toPrismaProductFunction,
  fromPrismaProductFunction,
  fromPrismaPassportStatus,
} from "@/lib/prisma-mappers";

const passportSaveSchema = z.object({
  id: z.string(),
  productId: z.string(),
  origin: z.string().min(3, "Asal panen/distrik wajib diisi (minimal 3 karakter)"),
  productKind: z.enum([
    "essential-oil",
    "roll-on",
    "soap",
    "diffuser",
    "perfume",
    "body-oil",
    "bundle",
  ]),
  aromaProfile: z.array(z.string()).optional().default([]),
  functions: z.array(z.string()).optional().default([]),
  usage: z.string().min(5, "Instruksi cara pakai wajib diisi (minimal 5 karakter)"),
  safetyNotes: z.string().min(5, "Catatan keamanan wajib diisi (minimal 5 karakter)"),
  batchCode: z.string().min(1, "Nomor batch wajib diisi"),
  farmerGroup: z.string().min(1, "Kelompok tani wajib diisi"),
  gpsCoordinates: z.string().min(1, "Koordinat GPS wajib diisi"),
});



export async function savePassportAction(
  input: unknown,
): Promise<{ ok: boolean; message: string }> {
  const seller = await requireSeller();

  const validated = passportSaveSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ??
        "Data Nilam Passport tidak valid.",
    };
  }

  const data = validated.data;

  // Verify ownership via product
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { sellerId: true, name: true },
  });

  if (!product) {
    return { ok: false, message: "Produk terkait tidak ditemukan." };
  }

  if (product.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengedit passport produk ini.",
    };
  }

  const mappedForm = toPrismaProductForm(data.productKind);
  const mappedFunctions = data.functions.map(toPrismaProductFunction);
  const validationId = `val-passport-${data.productId.replace("product-", "").replace("prod-", "")}`;

  await prisma.$transaction(async (tx) => {
    // 1. Update passport to PENDING_REVIEW
    await tx.nilamPassport.update({
      where: { id: data.id },
      data: {
        origin: data.origin,
        productKind: mappedForm,
        aromaProfile: data.aromaProfile,
        functions: mappedFunctions,
        usage: data.usage,
        safetyNotes: data.safetyNotes,
        batchCode: data.batchCode,
        farmerGroup: data.farmerGroup,
        gpsCoordinates: data.gpsCoordinates,
        validationStatus: PassportValidationStatus.PENDING_REVIEW,
      },
    });

    // 2. Upsert admin validation item
    await tx.adminValidationItem.upsert({
      where: { id: validationId },
      create: {
        id: validationId,
        target: AdminValidationTarget.NILAM_PASSPORT,
        targetId: data.id,
        status: AdminValidationStatus.QUEUED,
        submittedBy: seller.sellerId!,
        submittedAt: new Date(),
        notes: `Pengajuan verifikasi Rantai Transparansi (Nilam Passport) untuk produk "${product.name}". Kelompok Tani: ${data.farmerGroup}, Batch: ${data.batchCode}`,
      },
      update: {
        status: AdminValidationStatus.QUEUED,
        submittedAt: new Date(),
        notes: `Pengajuan verifikasi Rantai Transparansi (Nilam Passport) untuk produk "${product.name}". Kelompok Tani: ${data.farmerGroup}, Batch: ${data.batchCode}`,
      },
    });

    // 3. Write audit log
    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: "SUBMIT_PASSPORT_FOR_REVIEW",
        target: "NilamPassport",
        targetId: data.id,
        metadata: JSON.stringify({
          batchCode: data.batchCode,
          farmerGroup: data.farmerGroup,
        }),
      },
    });
  });

  revalidatePath("/passport");
  revalidatePath("/seller");

  return { ok: true, message: "Nilam Passport berhasil diajukan untuk verifikasi!" };
}

export async function getSellerPassportsAction(): Promise<NilamPassport[]> {
  const seller = await requireSeller();
  if (!seller.sellerId) {
    throw new Error("Akun Anda tidak terhubung dengan profil Penjual.");
  }

  const rows = await prisma.nilamPassport.findMany({
    where: {
      product: {
        sellerId: seller.sellerId,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    productId: row.productId,
    origin: row.origin,
    productKind: fromPrismaProductForm(row.productKind),
    aromaProfile: row.aromaProfile,
    functions: row.functions.map(fromPrismaProductFunction),
    usage: row.usage,
    safetyNotes: row.safetyNotes,
    validationStatus: fromPrismaPassportStatus(row.validationStatus),
    validatedBy: row.validatedBy || "",
    validatedAt: row.validatedAt?.toISOString() || "",
    batchCode: row.batchCode ?? undefined,
    farmerGroup: row.farmerGroup ?? undefined,
    gpsCoordinates: row.gpsCoordinates ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}
