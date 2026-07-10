import "server-only";

import type { ProductCategory, ProductTargetMarket as ContractProductTargetMarket } from "@/lib/contracts";
import { Prisma, ProductTargetMarket } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type ProductCategoryRow = Prisma.ProductCategoryGetPayload<{
  select: {
    id: true;
    slug: true;
    name: true;
    description: true;
    targetMarket: true;
    imageSrc: true;
    imageAlt: true;
  };
}>;

function toContractProductTargetMarket(
  value: ProductTargetMarket,
): ContractProductTargetMarket {
  switch (value) {
    case ProductTargetMarket.B2C:
      return "b2c";
    case ProductTargetMarket.B2B:
      return "b2b";
  }
}

function mapProductCategory(row: ProductCategoryRow): ProductCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    targetMarket: toContractProductTargetMarket(row.targetMarket),
    image: {
      src: row.imageSrc,
      alt: row.imageAlt,
    },
  };
}

export async function getProductCategoriesDto(): Promise<ProductCategory[]> {
  const rows = await prisma.productCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return rows.map(mapProductCategory);
}

export async function getFeaturedProductCategoryDto(): Promise<ProductCategory | null> {
  const row = await prisma.productCategory.findFirst({
    orderBy: {
      name: "asc",
    },
  });

  return row ? mapProductCategory(row) : null;
}
