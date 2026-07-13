import "server-only";

import type { Seller } from "@/lib/contracts";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaSellerType,
  fromPrismaSellerVerificationStatus,
} from "@/lib/prisma-mappers";

type SellerRow = Prisma.SellerGetPayload<{
  select: {
    id: true;
    slug: true;
    displayName: true;
    type: true;
    locationProvince: true;
    locationCity: true;
    locationDistrict: true;
    verificationStatus: true;
    joinedAt: true;
    ratingAverage: true;
    totalReviews: true;
    contactChannel: true;
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function mapSeller(row: SellerRow): Seller {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.displayName,
    type: fromPrismaSellerType(row.type),
    location: {
      province: row.locationProvince,
      city: row.locationCity,
      district: row.locationDistrict,
    },
    verificationStatus: fromPrismaSellerVerificationStatus(
      row.verificationStatus,
    ),
    joinedAt: toIsoString(row.joinedAt),
    ratingAverage: row.ratingAverage,
    totalReviews: row.totalReviews,
    contactChannel: row.contactChannel,
  };
}

export async function getSellersDto(): Promise<Seller[]> {
  const rows = await prisma.seller.findMany({
    orderBy: {
      displayName: "asc",
    },
  });

  return rows.map(mapSeller);
}

export async function getSellerByIdDto(
  sellerId: string,
): Promise<Seller | null> {
  const row = await prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
  });

  return row ? mapSeller(row) : null;
}

export async function getSellerBySlugDto(
  slug: string,
): Promise<Seller | null> {
  const row = await prisma.seller.findUnique({
    where: {
      slug,
    },
  });

  return row ? mapSeller(row) : null;
}

