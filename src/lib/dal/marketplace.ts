import "server-only";

import type {
  AmpasListing,
  Article,
  ArticleCategory as ContractArticleCategory,
  Bundle,
  BundleType as ContractBundleType,
  NilamPassport,
  Product,
  ProductCategory,
  ProductTargetMarket as ContractProductTargetMarket,
  Promo,
  Review,
  ReviewTag as ContractReviewTag,
  Seller,
} from "@/lib/contracts";
import {
  AmpasListingStatus,
  ArticleCategory,
  BundleType,
  Prisma,
  ProductStatus,
  ProductTargetMarket,
  PromoStatus,
  ReviewTag,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaAmpasCondition,
  fromPrismaAmpasStatus,
  fromPrismaAmpasUsageTag,
  fromPrismaPassportStatus,
  fromPrismaProductForm,
  fromPrismaProductFunction,
  fromPrismaProductTag,
  fromPrismaProductStatus,
  fromPrismaPromoStatus,
  fromPrismaPromoType,
  fromPrismaSellerType,
  fromPrismaSellerVerificationStatus,
} from "@/lib/prisma-mappers";

type ProductWithGallery = Prisma.ProductGetPayload<{
  include: {
    gallery: {
      orderBy: {
        sortOrder: "asc";
      };
    };
  };
}>;

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

type PassportRow = Prisma.NilamPassportGetPayload<{
  select: {
    id: true;
    productId: true;
    origin: true;
    productKind: true;
    aromaProfile: true;
    functions: true;
    usage: true;
    safetyNotes: true;
    validationStatus: true;
    validatedBy: true;
    validatedAt: true;
    batchCode: true;
    farmerGroup: true;
    gpsCoordinates: true;
  };
}>;

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

type ReviewRow = Prisma.ReviewGetPayload<{
  select: {
    id: true;
    productId: true;
    sellerId: true;
    authorName: true;
    rating: true;
    tags: true;
    body: true;
    createdAt: true;
  };
}>;

type PromoWithProducts = Prisma.PromoGetPayload<{
  include: {
    products: {
      select: {
        productId: true;
      };
    };
  };
}>;

type BundleWithProducts = Prisma.BundleGetPayload<{
  include: {
    products: {
      select: {
        productId: true;
      };
    };
  };
}>;

type ArticleRow = Prisma.ArticleGetPayload<Record<string, never>>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

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

function toContractReviewTag(value: ReviewTag): ContractReviewTag {
  switch (value) {
    case ReviewTag.AUTHENTIC_AROMA:
      return "authentic-aroma";
    case ReviewTag.FAST_DELIVERY:
      return "fast-delivery";
    case ReviewTag.CLEAR_PASSPORT:
      return "clear-passport";
    case ReviewTag.GOOD_PACKAGING:
      return "good-packaging";
    case ReviewTag.REPEAT_ORDER:
      return "repeat-order";
  }
}

function toContractBundleType(value: BundleType): ContractBundleType {
  switch (value) {
    case BundleType.SINGLE_SELLER:
      return "single-seller";
    case BundleType.CROSS_SELLER:
      return "cross-seller";
  }
}

function toContractArticleCategory(value: ArticleCategory): ContractArticleCategory {
  switch (value) {
    case ArticleCategory.PUPUK:
      return "pupuk";
    case ArticleCategory.ENERGI:
      return "energi";
    case ArticleCategory.BUDIDAYA:
      return "budidaya";
    case ArticleCategory.OLAHAN:
      return "olahan";
  }
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
  };
}

function mapPassport(row: PassportRow): NilamPassport {
  return {
    id: row.id,
    productId: row.productId,
    origin: row.origin,
    productKind: fromPrismaProductForm(row.productKind),
    aromaProfile: row.aromaProfile,
    functions: row.functions.map(fromPrismaProductFunction),
    usage: row.usage,
    safetyNotes: row.safetyNotes,
    validationStatus: fromPrismaPassportStatus(row.validationStatus),
    validatedBy: row.validatedBy ?? "",
    validatedAt: row.validatedAt ? toIsoString(row.validatedAt) : "",
    batchCode: row.batchCode ?? undefined,
    farmerGroup: row.farmerGroup ?? undefined,
    gpsCoordinates: row.gpsCoordinates ?? undefined,
  };
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

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.productId,
    sellerId: row.sellerId,
    authorName: row.authorName,
    rating: row.rating,
    tags: row.tags.map(toContractReviewTag),
    body: row.body,
    createdAt: toIsoString(row.createdAt),
  };
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

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    authorRole: row.authorRole ?? undefined,
    publishedAt: toIsoString(row.publishedAt),
    imageUrl: row.imageUrl,
    category: toContractArticleCategory(row.category),
    videoUrl: row.videoUrl ?? undefined,
    videoDuration: row.videoDuration ?? undefined,
    readTime: row.readTime,
    tags: row.tags,
  };
}

export async function getPublishedProductsDto(params?: {
  searchQuery?: string;
}): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

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
    },
    orderBy: {
      featuredRank: "asc",
    },
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

export async function getPassportByProductIdDto(
  productId: string,
): Promise<NilamPassport | null> {
  const row = await prisma.nilamPassport.findUnique({
    where: {
      productId,
    },
  });

  return row ? mapPassport(row) : null;
}

export async function getPassportsDto(): Promise<NilamPassport[]> {
  const rows = await prisma.nilamPassport.findMany({
    orderBy: {
      validatedAt: "desc",
    },
  });

  return rows.map(mapPassport);
}

export async function getFeaturedPassportDto(): Promise<NilamPassport | null> {
  const row = await prisma.nilamPassport.findFirst({
    orderBy: {
      validatedAt: "desc",
    },
  });

  return row ? mapPassport(row) : null;
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

export async function getReviewsForProductDto(
  productId: string,
): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map(mapReview);
}

export async function getRecentReviewsDto(limit: number): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return rows.map(mapReview);
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

export async function getPublicPromoSuggestionsDto(): Promise<Promo[]> {
  const rows = await prisma.promo.findMany({
    where: {
      status: PromoStatus.ACTIVE,
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

export async function getActiveAmpasListingsDto(): Promise<AmpasListing[]> {
  const rows = await prisma.ampasListing.findMany({
    where: {
      status: AmpasListingStatus.ACTIVE,
    },
    orderBy: {
      updatedAt: "desc",
    },
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

export async function getArticlesDto(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      author: true,
      authorRole: true,
      publishedAt: true,
      imageUrl: true,
      category: true,
      videoUrl: true,
      videoDuration: true,
      readTime: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: "",
    author: row.author,
    authorRole: row.authorRole ?? undefined,
    publishedAt: toIsoString(row.publishedAt),
    imageUrl: row.imageUrl,
    category: toContractArticleCategory(row.category),
    videoUrl: row.videoUrl ?? undefined,
    videoDuration: row.videoDuration ?? undefined,
    readTime: row.readTime,
    tags: row.tags,
  }));
}

export async function getArticleBySlugDto(
  slug: string,
): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  return row ? mapArticle(row) : null;
}
