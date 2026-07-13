import "server-only";

import type { Product } from "@/lib/contracts";
import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaProductForm,
  fromPrismaProductFunction,
  fromPrismaProductTag,
  fromPrismaProductStatus,
} from "@/lib/prisma-mappers";

type ProductWithGallery = Prisma.ProductGetPayload<{
  include: {
    gallery: {
      orderBy: {
        sortOrder: "asc";
      };
    };
    seller: {
      select: {
        displayName: true;
        slug: true;
      };
    };
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function mapProduct(row: ProductWithGallery): Product {
  return {
    id: row.id,
    slug: row.slug,
    sellerId: row.sellerId,
    categoryId: row.categoryId,
    passportId: "",
    name: row.name,
    shortDescription: row.shortDescription,
    form: fromPrismaProductForm(row.form),
    functions: row.functions.map(fromPrismaProductFunction),
    tags: row.tags.map(fromPrismaProductTag),
    price: {
      amount: row.priceAmount,
      currency: row.priceCurrency as "IDR",
    },
    originalPrice:
      row.originalPriceAmount === null
        ? undefined
        : {
            amount: row.originalPriceAmount,
            currency: row.priceCurrency as "IDR",
          },
    stock: row.stock,
    status: fromPrismaProductStatus(row.status),
    image: {
      src: row.imageSrc,
      alt: row.imageAlt,
    },
    gallery: row.gallery.map((image) => ({
      src: image.src,
      alt: image.alt,
    })),
    featuredRank: row.featuredRank,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
    sellerName: row.seller?.displayName,
    sellerSlug: row.seller?.slug,
  };
}

export async function getPublishedProductsDto(params?: {
  searchQuery?: string;
  limit?: number;
  sellerId?: string;
}): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

  if (params?.sellerId) {
    where.sellerId = params.sellerId;
  }

  if (params?.searchQuery) {
    const q = params.searchQuery.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.product.findMany({
    where,
    include: {
      gallery: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      passport: {
        select: {
          id: true,
        },
      },
      seller: {
        select: {
          displayName: true,
          slug: true,
        },
      },
    },
    orderBy: {
      featuredRank: "asc",
    },
    take: params?.limit ?? 120,
  });

  return rows.map((row) => {
    const product = mapProduct(row);
    return {
      ...product,
      passportId: row.passport?.id ?? "",
    };
  });
}

export async function getFeaturedProductsDto(limit: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
    },
    include: {
      gallery: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      passport: {
        select: {
          id: true,
        },
      },
      seller: {
        select: {
          displayName: true,
          slug: true,
        },
      },
    },
    orderBy: {
      featuredRank: "asc",
    },
    take: limit,
  });

  return rows.map((row) => {
    const product = mapProduct(row);
    return {
      ...product,
      passportId: row.passport?.id ?? "",
    };
  });
}

export async function getProductBySlugDto(
  slug: string,
): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: {
      slug,
      status: ProductStatus.PUBLISHED,
    },
    include: {
      gallery: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      passport: {
        select: {
          id: true,
        },
      },
      seller: {
        select: {
          displayName: true,
          slug: true,
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  const product = mapProduct(row);

  return {
    ...product,
    passportId: row.passport?.id ?? "",
  };
}
