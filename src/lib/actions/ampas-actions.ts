"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { getAmpasListingsBySellerIdDto } from "@/lib/dal/marketplace";
import type { AmpasListing } from "@/lib/contracts";
import {
  AdminValidationStatus,
  AdminValidationTarget,
  AmpasListingStatus,
} from "@/generated/prisma/client";
import {
  toPrismaAmpasCondition,
  toPrismaAmpasUsageTag,
  toPrismaAmpasStatus,
  generateSlug,
} from "@/lib/prisma-mappers";

const ampasListingSaveSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  condition: z.enum(["dry", "wet", "mixed"]),
  quantityKg: z.number().min(1, "Kuantitas minimal 1 kg"),
  pricePerKg: z.object({
    amount: z.number().min(0, "Harga minimal 0"),
    currency: z.literal("IDR"),
  }),
  location: z.object({
    province: z.string().min(1, "Provinsi wajib diisi"),
    city: z.string().min(1, "Kota wajib diisi"),
    district: z.string().optional().default(""),
  }),
  distillationProcess: z
    .string()
    .min(5, "Keterangan proses suling minimal 5 karakter"),
  usageTags: z.array(z.string()),
  status: z.enum(["draft", "active", "sold", "archived"]),
  image: z.object({
    src: z.string().min(1, "Gambar wajib ada"),
    alt: z.string().optional().default(""),
  }),
  disclaimer: z.string().optional().default("Platform NILOKA tidak memverifikasi kandungan kimia residue."),
  distillationDate: z.string().optional().nullable(),
  shippingOption: z.enum(["self-pickup", "cargo", "both"]).optional(),
  wholesaleEnabled: z.boolean().optional(),
  wholesaleMinQtyKg: z.number().min(1).optional().nullable(),
  wholesalePricePerKg: z
    .object({
      amount: z.number().min(0),
      currency: z.literal("IDR"),
    })
    .optional()
    .nullable(),
});



export type AmpasActionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function saveAmpasListingAction(
  input: unknown,
): Promise<AmpasActionResult> {
  const seller = await requireSeller();

  const validated = ampasListingSaveSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ??
        "Data listing ampas tidak valid.",
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

  const existing = await prisma.ampasListing.findUnique({
    where: { id: data.id },
    select: { sellerId: true, slug: true, status: true },
  });

  if (existing && existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengubah listing ini.",
    };
  }

  const slug = `ampas-${data.condition}-${generateSlug(data.location.city)}-${data.id.replace("ampas-", "")}`.replace(/^-+|-+$/g, "");

  const mappedCondition = toPrismaAmpasCondition(data.condition);
  const requestedStatus = toPrismaAmpasStatus(data.status);
  const needsAdminValidation =
    requestedStatus === AmpasListingStatus.ACTIVE &&
    existing?.status !== AmpasListingStatus.ACTIVE;
  const mappedStatus = needsAdminValidation ? AmpasListingStatus.DRAFT : requestedStatus;
  const mappedUsageTags = data.usageTags.map(toPrismaAmpasUsageTag);
  const parsedDistillationDate = data.distillationDate
    ? new Date(data.distillationDate)
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.ampasListing.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        slug,
        sellerId: data.sellerId,
        condition: mappedCondition,
        quantityKg: data.quantityKg,
        pricePerKgAmount: data.pricePerKg.amount,
        pricePerKgCurrency: "IDR",
        locationProvince: data.location.province,
        locationCity: data.location.city,
        locationDistrict: data.location.district || "",
        distillationProcess: data.distillationProcess,
        usageTags: mappedUsageTags,
        status: mappedStatus,
        imageSrc: data.image.src,
        imageAlt: data.image.alt || "",
        disclaimer: data.disclaimer,
        distillationDate: parsedDistillationDate,
        shippingOption: data.shippingOption || "both",
        wholesaleEnabled: data.wholesaleEnabled || false,
        wholesaleMinQtyKg: data.wholesaleMinQtyKg,
        wholesalePricePerKgAmount: data.wholesalePricePerKg?.amount ?? null,
        wholesalePricePerKgCurrency: data.wholesalePricePerKg ? "IDR" : null,
      },
      update: {
        condition: mappedCondition,
        quantityKg: data.quantityKg,
        pricePerKgAmount: data.pricePerKg.amount,
        locationProvince: data.location.province,
        locationCity: data.location.city,
        locationDistrict: data.location.district || "",
        distillationProcess: data.distillationProcess,
        usageTags: mappedUsageTags,
        status: mappedStatus,
        imageSrc: data.image.src,
        imageAlt: data.image.alt || "",
        disclaimer: data.disclaimer,
        distillationDate: parsedDistillationDate,
        shippingOption: data.shippingOption || "both",
        wholesaleEnabled: data.wholesaleEnabled || false,
        wholesaleMinQtyKg: data.wholesaleMinQtyKg,
        wholesalePricePerKgAmount: data.wholesalePricePerKg?.amount ?? null,
        wholesalePricePerKgCurrency: data.wholesalePricePerKg ? "IDR" : null,
      },
    });

    if (needsAdminValidation) {
      await tx.adminValidationItem.upsert({
        where: { id: `validation-ampas-${data.id}` },
        create: {
          id: `validation-ampas-${data.id}`,
          target: AdminValidationTarget.AMPAS_LISTING,
          targetId: data.id,
          status: AdminValidationStatus.QUEUED,
          submittedBy: data.sellerId,
          submittedAt: new Date(),
          notes: `Pengajuan publikasi listing ampas ${slug}`,
        },
        update: {
          status: AdminValidationStatus.QUEUED,
          submittedAt: new Date(),
          notes: `Pengajuan publikasi listing ampas ${slug}`,
        },
      });
    }

    // Write audit log
    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: existing ? "UPDATE_AMPAS_LISTING" : "CREATE_AMPAS_LISTING",
        target: "AmpasListing",
        targetId: data.id,
        metadata: JSON.stringify({
          slug,
          requestedStatus: data.status,
          savedStatus: mappedStatus,
          quantityKg: data.quantityKg,
        }),
      },
    });
  });

  revalidatePath("/ampas");
  revalidatePath(`/ampas/${slug}`);
  revalidatePath("/seller");

  return { ok: true };
}

export async function deleteAmpasListingAction(
  id: string,
): Promise<AmpasActionResult> {
  const seller = await requireSeller();

  const existing = await prisma.ampasListing.findUnique({
    where: { id },
    select: { sellerId: true, slug: true },
  });

  if (!existing) {
    return { ok: false, message: "Listing tidak ditemukan." };
  }

  if (existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk menghapus listing ini.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.ampasListing.delete({
      where: { id },
    });

    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: "DELETE_AMPAS_LISTING",
        target: "AmpasListing",
        targetId: id,
        metadata: JSON.stringify({ slug: existing.slug }),
      },
    });
  });

  revalidatePath("/ampas");
  revalidatePath(`/ampas/${existing.slug}`);
  revalidatePath("/seller");

  return { ok: true };
}

export async function getSellerAmpasListingsAction(): Promise<AmpasListing[]> {
  const seller = await requireSeller();
  if (!seller.sellerId) {
    throw new Error("Akun Anda tidak terhubung dengan profil Penjual.");
  }
  return getAmpasListingsBySellerIdDto(seller.sellerId);
}
