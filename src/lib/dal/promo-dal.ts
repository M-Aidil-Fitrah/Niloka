import "server-only";

import type { Promo } from "@/lib/contracts";
import { Prisma, PromoStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaPromoStatus,
  fromPrismaPromoType,
} from "@/lib/prisma-mappers";

type PromoWithProducts = Prisma.PromoGetPayload<{
  include: {
    products: {
      select: {
        productId: true;
      };
    };
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function mapPromo(row: PromoWithProducts): Promo {
  return {
    id: row.id,
    sellerId: row.sellerId,
    title: row.title,
    code: row.code,
    status: fromPrismaPromoStatus(row.status),
    type: fromPrismaPromoType(row.type),
    value: row.value,
    startsAt: toIsoString(row.startsAt),
    endsAt: toIsoString(row.endsAt),
    minSubtotal: {
      amount: row.minSubtotalAmount,
      currency: row.minSubtotalCurrency as "IDR",
    },
    usageLimit: row.usageLimit,
    usedCount: row.usedCount,
    productIds: row.products.map((product) => product.productId),
  };
}

export async function getPromosForSellerDto(
  sellerId: string,
): Promise<Promo[]> {
  const rows = await prisma.promo.findMany({
    where: {
      sellerId,
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

  return rows.map(mapPromo);
}

export async function getPublicPromoSuggestionsDto(params?: {
  limit?: number;
}): Promise<Promo[]> {
  const now = new Date();
  const rows = await prisma.promo.findMany({
    where: {
      status: PromoStatus.ACTIVE,
      startsAt: { lte: now },
      endsAt: { gte: now },
      usedCount: { lt: prisma.promo.fields.usageLimit },
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
    take: params?.limit ?? 20,
  });

  return rows.map(mapPromo);
}
