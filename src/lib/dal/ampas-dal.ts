import "server-only";

import type { AmpasListing } from "@/lib/contracts";
import { AmpasListingStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaAmpasCondition,
  fromPrismaAmpasStatus,
  fromPrismaAmpasUsageTag,
} from "@/lib/prisma-mappers";

type AmpasListingRow = Prisma.AmpasListingGetPayload<{
  select: {
    id: true;
    slug: true;
    sellerId: true;
    condition: true;
    quantityKg: true;
    pricePerKgAmount: true;
    pricePerKgCurrency: true;
    locationProvince: true;
    locationCity: true;
    locationDistrict: true;
    distillationProcess: true;
    usageTags: true;
    status: true;
    imageSrc: true;
    imageAlt: true;
    disclaimer: true;
    createdAt: true;
    updatedAt: true;
    distillationDate: true;
    shippingOption: true;
    wholesaleEnabled: true;
    wholesaleMinQtyKg: true;
    wholesalePricePerKgAmount: true;
    wholesalePricePerKgCurrency: true;
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function mapAmpasListing(row: AmpasListingRow): AmpasListing {
  return {
    id: row.id,
    slug: row.slug,
    sellerId: row.sellerId,
    condition: fromPrismaAmpasCondition(row.condition),
    quantityKg: row.quantityKg,
    pricePerKg: {
      amount: row.pricePerKgAmount,
      currency: "IDR",
    },
    location: {
      province: row.locationProvince,
      city: row.locationCity,
      district: row.locationDistrict,
    },
    distillationProcess: row.distillationProcess,
    usageTags: row.usageTags.map(fromPrismaAmpasUsageTag),
    status: fromPrismaAmpasStatus(row.status),
    image: {
      src: row.imageSrc,
      alt: row.imageAlt,
    },
    disclaimer: row.disclaimer,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
    distillationDate: row.distillationDate
      ? toIsoString(row.distillationDate)
      : undefined,
    shippingOption:
      row.shippingOption === "self-pickup" ||
      row.shippingOption === "cargo" ||
      row.shippingOption === "both"
        ? row.shippingOption
        : undefined,
    wholesaleEnabled: row.wholesaleEnabled,
    wholesaleMinQtyKg: row.wholesaleMinQtyKg ?? undefined,
    wholesalePricePerKg:
      row.wholesalePricePerKgAmount === null
        ? undefined
        : {
            amount: row.wholesalePricePerKgAmount,
            currency: (row.wholesalePricePerKgCurrency ?? "IDR") as "IDR",
          },
  };
}

export async function getActiveAmpasListingsDto(params?: {
  limit?: number;
}): Promise<AmpasListing[]> {
  const rows = await prisma.ampasListing.findMany({
    where: {
      status: AmpasListingStatus.ACTIVE,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: params?.limit ?? 80,
  });

  return rows.map(mapAmpasListing);
}

export async function getFeaturedAmpasListingDto(): Promise<AmpasListing | null> {
  const row = await prisma.ampasListing.findFirst({
    where: {
      status: AmpasListingStatus.ACTIVE,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return row ? mapAmpasListing(row) : null;
}

export async function getAmpasListingBySlugDto(
  slug: string,
): Promise<AmpasListing | null> {
  const row = await prisma.ampasListing.findFirst({
    where: {
      slug,
      status: AmpasListingStatus.ACTIVE,
    },
  });

  return row ? mapAmpasListing(row) : null;
}

export async function getAmpasListingsBySellerIdDto(
  sellerId: string,
): Promise<AmpasListing[]> {
  const rows = await prisma.ampasListing.findMany({
    where: {
      sellerId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map(mapAmpasListing);
}
