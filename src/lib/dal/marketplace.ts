import "server-only";

import type {
  AmpasCondition as ContractAmpasCondition,
  AmpasListing,
  AmpasListingStatus as ContractAmpasListingStatus,
  AmpasUsageTag as ContractAmpasUsageTag,
  NilamPassport,
  PassportValidationStatus as ContractPassportValidationStatus,
  Product,
  ProductCategory,
  ProductForm as ContractProductForm,
  ProductFunction as ContractProductFunction,
  ProductStatus as ContractProductStatus,
  ProductTag as ContractProductTag,
  ProductTargetMarket as ContractProductTargetMarket,
  Promo,
  PromoStatus as ContractPromoStatus,
  PromoType as ContractPromoType,
  Review,
  ReviewTag as ContractReviewTag,
  Seller,
  SellerType as ContractSellerType,
  SellerVerificationStatus as ContractSellerVerificationStatus,
} from "@/lib/contracts";
import {
  AmpasCondition,
  AmpasListingStatus,
  AmpasUsageTag,
  PassportValidationStatus,
  Prisma,
  ProductForm,
  ProductFunction,
  ProductStatus,
  ProductTag,
  ProductTargetMarket,
  PromoStatus,
  PromoType,
  ReviewTag,
  SellerType,
  SellerVerificationStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

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

function toIsoString(date: Date): string {
  return date.toISOString();
}

function toContractSellerType(value: SellerType): ContractSellerType {
  switch (value) {
    case SellerType.UMKM:
      return "umkm";
    case SellerType.DISTILLER:
      return "distiller";
    case SellerType.COOPERATIVE:
      return "cooperative";
  }
}

function toContractSellerVerificationStatus(
  value: SellerVerificationStatus,
): ContractSellerVerificationStatus {
  switch (value) {
    case SellerVerificationStatus.PENDING:
      return "pending";
    case SellerVerificationStatus.VERIFIED:
      return "verified";
    case SellerVerificationStatus.REJECTED:
      return "rejected";
  }
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

function toContractProductStatus(
  value: ProductStatus,
): ContractProductStatus {
  switch (value) {
    case ProductStatus.DRAFT:
      return "draft";
    case ProductStatus.PUBLISHED:
      return "published";
    case ProductStatus.ARCHIVED:
      return "archived";
  }
}

function toContractProductForm(value: ProductForm): ContractProductForm {
  switch (value) {
    case ProductForm.ESSENTIAL_OIL:
      return "essential-oil";
    case ProductForm.ROLL_ON:
      return "roll-on";
    case ProductForm.SOAP:
      return "soap";
    case ProductForm.DIFFUSER:
      return "diffuser";
    case ProductForm.PERFUME:
      return "perfume";
    case ProductForm.BODY_OIL:
      return "body-oil";
    case ProductForm.BUNDLE:
      return "bundle";
  }
}

function toContractProductFunction(
  value: ProductFunction,
): ContractProductFunction {
  switch (value) {
    case ProductFunction.RELAXATION:
      return "relaxation";
    case ProductFunction.FOCUS:
      return "focus";
    case ProductFunction.SLEEP_SUPPORT:
      return "sleep-support";
    case ProductFunction.SKIN_CARE:
      return "skin-care";
    case ProductFunction.HOME_FRAGRANCE:
      return "home-fragrance";
    case ProductFunction.GIFT:
      return "gift";
  }
}

function toContractProductTag(value: ProductTag): ContractProductTag {
  switch (value) {
    case ProductTag.BEST_SELLER:
      return "best-seller";
    case ProductTag.NEW_ARRIVAL:
      return "new-arrival";
    case ProductTag.NILAM_PASSPORT:
      return "nilam-passport";
    case ProductTag.AROMA_CALM:
      return "aroma-calm";
    case ProductTag.LIMITED_BATCH:
      return "limited-batch";
  }
}

function toContractPassportValidationStatus(
  value: PassportValidationStatus,
): ContractPassportValidationStatus {
  switch (value) {
    case PassportValidationStatus.DRAFT:
      return "draft";
    case PassportValidationStatus.PENDING_REVIEW:
      return "pending-review";
    case PassportValidationStatus.VALIDATED:
      return "validated";
  }
}

function toContractAmpasCondition(
  value: AmpasCondition,
): ContractAmpasCondition {
  switch (value) {
    case AmpasCondition.WET:
      return "wet";
    case AmpasCondition.DRY:
      return "dry";
    case AmpasCondition.MIXED:
      return "mixed";
  }
}

function toContractAmpasUsageTag(
  value: AmpasUsageTag,
): ContractAmpasUsageTag {
  switch (value) {
    case AmpasUsageTag.COMPOST:
      return "compost";
    case AmpasUsageTag.BRIQUETTE:
      return "briquette";
    case AmpasUsageTag.MUSHROOM_MEDIA:
      return "mushroom-media";
    case AmpasUsageTag.MULCH:
      return "mulch";
    case AmpasUsageTag.ANIMAL_FEED:
      return "animal-feed";
    case AmpasUsageTag.INDUSTRIAL_CELLULOSE:
      return "industrial-cellulose";
  }
}

function toContractAmpasListingStatus(
  value: AmpasListingStatus,
): ContractAmpasListingStatus {
  switch (value) {
    case AmpasListingStatus.DRAFT:
      return "draft";
    case AmpasListingStatus.ACTIVE:
      return "active";
    case AmpasListingStatus.SOLD:
      return "sold";
    case AmpasListingStatus.ARCHIVED:
      return "archived";
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

function toContractPromoStatus(value: PromoStatus): ContractPromoStatus {
  switch (value) {
    case PromoStatus.ACTIVE:
      return "active";
    case PromoStatus.SCHEDULED:
      return "scheduled";
    case PromoStatus.EXPIRED:
      return "expired";
    case PromoStatus.DISABLED:
      return "disabled";
  }
}

function toContractPromoType(value: PromoType): ContractPromoType {
  switch (value) {
    case PromoType.PERCENTAGE:
      return "percentage";
    case PromoType.FIXED_AMOUNT:
      return "fixed-amount";
    case PromoType.FREE_SHIPPING:
      return "free-shipping";
  }
}

function mapSeller(row: SellerRow): Seller {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.displayName,
    type: toContractSellerType(row.type),
    location: {
      province: row.locationProvince,
      city: row.locationCity,
      district: row.locationDistrict,
    },
    verificationStatus: toContractSellerVerificationStatus(
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
    form: toContractProductForm(row.form),
    functions: row.functions.map(toContractProductFunction),
    tags: row.tags.map(toContractProductTag),
    price: {
      amount: row.priceAmount,
      currency: "IDR",
    },
    originalPrice:
      row.originalPriceAmount === null
        ? undefined
        : {
            amount: row.originalPriceAmount,
            currency: "IDR",
          },
    stock: row.stock,
    status: toContractProductStatus(row.status),
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
    productKind: toContractProductForm(row.productKind),
    aromaProfile: row.aromaProfile,
    functions: row.functions.map(toContractProductFunction),
    usage: row.usage,
    safetyNotes: row.safetyNotes,
    validationStatus: toContractPassportValidationStatus(row.validationStatus),
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
    condition: toContractAmpasCondition(row.condition),
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
    usageTags: row.usageTags.map(toContractAmpasUsageTag),
    status: toContractAmpasListingStatus(row.status),
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
            currency: "IDR",
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
    status: toContractPromoStatus(row.status),
    type: toContractPromoType(row.type),
    value: row.value,
    startsAt: toIsoString(row.startsAt),
    endsAt: toIsoString(row.endsAt),
    minSubtotal: {
      amount: row.minSubtotalAmount,
      currency: "IDR",
    },
    usageLimit: row.usageLimit,
    usedCount: row.usedCount,
    productIds: row.products.map((product) => product.productId),
  };
}

export async function getPublishedProductsDto(): Promise<Product[]> {
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
    },
    orderBy: {
      featuredRank: "asc",
    },
  });

  const passports = await prisma.nilamPassport.findMany({
    select: {
      id: true,
      productId: true,
    },
  });

  return rows.map((row) => {
    const product = mapProduct(row);
    const passport = passports.find((item) => item.productId === row.id);
    return {
      ...product,
      passportId: passport?.id ?? "",
    };
  });
}

export async function getFeaturedProductsDto(limit: number): Promise<Product[]> {
  const products = await getPublishedProductsDto();
  return products
    .sort((first, second) => first.featuredRank - second.featuredRank)
    .slice(0, limit);
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
  const [category] = await getProductCategoriesDto();
  return category ?? null;
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
    },
  });

  if (!row) {
    return null;
  }

  const passport = await prisma.nilamPassport.findUnique({
    where: {
      productId: row.id,
    },
    select: {
      id: true,
    },
  });
  const product = mapProduct(row);

  return {
    ...product,
    passportId: passport?.id ?? "",
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
  const [passport] = await getPassportsDto();
  return passport ?? null;
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
  const [listing] = await getActiveAmpasListingsDto();
  return listing ?? null;
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

