"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  AmpasCondition,
  AmpasListingStatus,
  AmpasUsageTag,
} from "@/generated/prisma/client";
import { z } from "zod";
import { getAmpasListingsBySellerIdDto } from "@/lib/dal/marketplace";
import type { AmpasListing } from "@/lib/contracts";

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

function toPrismaCondition(cond: string): AmpasCondition {
  switch (cond) {
    case "wet":
      return AmpasCondition.WET;
    case "dry":
      return AmpasCondition.DRY;
    case "mixed":
      return AmpasCondition.MIXED;
    default:
      return AmpasCondition.MIXED;
  }
}

function toPrismaStatus(status: string): AmpasListingStatus {
  switch (status) {
    case "draft":
      return AmpasListingStatus.DRAFT;
    case "active":
      return AmpasListingStatus.ACTIVE;
    case "sold":
      return AmpasListingStatus.SOLD;
    case "archived":
      return AmpasListingStatus.ARCHIVED;
    default:
      return AmpasListingStatus.DRAFT;
  }
}

function toPrismaUsageTag(tag: string): AmpasUsageTag {
  switch (tag) {
    case "compost":
      return AmpasUsageTag.COMPOST;
    case "briquette":
      return AmpasUsageTag.BRIQUETTE;
    case "mushroom-media":
      return AmpasUsageTag.MUSHROOM_MEDIA;
    case "mulch":
      return AmpasUsageTag.MULCH;
    case "animal-feed":
      return AmpasUsageTag.ANIMAL_FEED;
    case "industrial-cellulose":
      return AmpasUsageTag.INDUSTRIAL_CELLULOSE;
    default:
      throw new Error(`Invalid usage tag: ${tag}`);
  }
}

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
    select: { sellerId: true, slug: true },
  });

  if (existing && existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengubah listing ini.",
    };
  }

  // Generate unique slug
  const rawSlug = `ampas-${data.condition}-${data.location.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${data.id.replace("ampas-", "")}`;
  const slug = rawSlug.replace(/^-+|-+$/g, "");

  const mappedCondition = toPrismaCondition(data.condition);
  const mappedStatus = toPrismaStatus(data.status);
  const mappedUsageTags = data.usageTags.map(toPrismaUsageTag);
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

    // Write audit log
    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: existing ? "UPDATE_AMPAS_LISTING" : "CREATE_AMPAS_LISTING",
        target: "AmpasListing",
        targetId: data.id,
        metadata: JSON.stringify({
          slug,
          status: data.status,
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
