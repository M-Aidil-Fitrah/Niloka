import "server-only";

import type { Bundle, BundleType as ContractBundleType } from "@/lib/contracts";
import { BundleType, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type BundleWithProducts = Prisma.BundleGetPayload<{
  include: {
    products: {
      select: {
        productId: true;
      };
    };
  };
}>

function toContractBundleType(value: BundleType): ContractBundleType {
  switch (value) {
    case BundleType.SINGLE_SELLER:
      return "single-seller";
    case BundleType.CROSS_SELLER:
      return "cross-seller";
  }
}

function mapBundle(row: BundleWithProducts): Bundle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: toContractBundleType(row.type),
    productIds: row.products.map((product) => product.productId),
    price: {
      amount: row.priceAmount,
      currency: row.priceCurrency as "IDR",
    },
    description: row.description,
  };
}

export async function getBundlesDto(): Promise<Bundle[]> {
  const rows = await prisma.bundle.findMany({
    include: {
      products: {
        select: {
          productId: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return rows.map(mapBundle);
}
