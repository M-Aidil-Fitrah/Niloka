import type {
  AdminValidationItem,
  AmpasListing,
  AmpasListingId,
  AromaMatchQuestion,
  AromaMatchRecommendation,
  Bundle,
  CartItem,
  NilamPassport,
  Product,
  ProductCategory,
  ProductId,
  Promo,
  PromoValidationResult,
  Review,
  Seller,
  SellerId,
} from "@/lib/contracts";
import {
  adminValidationItems,
  ampasListings,
  aromaMatchQuestions,
  aromaMatchRecommendations,
  bundles,
  nilamPassports,
  products,
  productCategories,
  promos,
  reviews,
  sellers,
} from "@/lib/mock-data";

function firstItem<TItem>(items: TItem[], label: string): TItem {
  const [item] = items;

  if (item === undefined) {
    throw new Error(`${label} mock data is empty.`);
  }

  return item;
}

export function getSellers(): Seller[] {
  return sellers;
}

export function getSellerById(sellerId: SellerId): Seller | null {
  return sellers.find((seller) => seller.id === sellerId) ?? null;
}

export function getPublishedProducts(): Product[] {
  return products.filter((product) => product.status === "published");
}

export function getProductCategories(): ProductCategory[] {
  return productCategories;
}

export function getFeaturedProductCategory(): ProductCategory {
  return firstItem(productCategories, "Product category");
}

export function getFeaturedProducts(limit: number): Product[] {
  return getPublishedProducts()
    .sort((first, second) => first.featuredRank - second.featuredRank)
    .slice(0, limit);
}

export function getProductById(productId: ProductId): Product | null {
  return products.find((product) => product.id === productId) ?? null;
}

export function getProductBySlug(slug: string): Product | null {
  return products.find((product) => product.slug === slug && product.status === "published") ?? null;
}

export function getPassportByProductId(productId: ProductId): NilamPassport | null {
  return (
    nilamPassports.find((passport) => passport.productId === productId) ?? null
  );
}

export function getPassports(): NilamPassport[] {
  return nilamPassports;
}

export function getFeaturedPassport(): NilamPassport {
  return firstItem(nilamPassports, "Nilam Passport");
}

export function getActiveAmpasListings(): AmpasListing[] {
  return ampasListings.filter((listing) => listing.status === "active");
}

export function getFeaturedAmpasListing(): AmpasListing {
  return firstItem(getActiveAmpasListings(), "Ampas listing");
}

export function getAmpasListingById(
  ampasListingId: AmpasListingId,
): AmpasListing | null {
  return ampasListings.find((listing) => listing.id === ampasListingId) ?? null;
}

export function getReviewsForProduct(productId: ProductId): Review[] {
  return reviews.filter((review) => review.productId === productId);
}

export function getPromosForSeller(sellerId: SellerId): Promo[] {
  return promos.filter((promo) => promo.sellerId === sellerId);
}

export function getActivePromosForSeller(sellerId: SellerId): Promo[] {
  return getPromosForSeller(sellerId).filter((promo) => promo.status === "active");
}

export function getActivePromosForProduct(productId: ProductId): Promo[] {
  const product = getProductById(productId);

  if (!product) {
    return [];
  }

  return promos.filter(
    (promo) =>
      promo.status === "active" &&
      promo.sellerId === product.sellerId &&
      (promo.productIds.length === 0 || promo.productIds.includes(productId)),
  );
}

export function getPublicPromoSuggestions(): Promo[] {
  return promos.filter((promo) => promo.status === "active");
}

function getPromoByCode(code: string): Promo | null {
  const normalizedCode = code.trim().toUpperCase();
  return promos.find((promo) => promo.code === normalizedCode) ?? null;
}

function getEligibleSubtotal(promo: Promo, items: CartItem[]): number {
  return items.reduce((subtotal, item) => {
    if (item.kind !== "product" || item.productId === null) {
      return subtotal;
    }

    const product = getProductById(item.productId);

    if (!product || product.sellerId !== promo.sellerId) {
      return subtotal;
    }

    const eligibleProduct =
      promo.productIds.length === 0 || promo.productIds.includes(product.id);

    if (!eligibleProduct) {
      return subtotal;
    }

    return subtotal + item.unitPrice.amount * item.quantity;
  }, 0);
}

function getPromoDiscountAmount(
  promo: Promo,
  eligibleSubtotal: number,
  shippingFee: number,
): number {
  switch (promo.type) {
    case "percentage":
      return Math.round(eligibleSubtotal * (promo.value / 100));
    case "fixed-amount":
      return Math.min(promo.value, eligibleSubtotal);
    case "free-shipping":
      return shippingFee;
  }
}

export function validatePromoCode(
  code: string,
  items: CartItem[],
  shippingFee: number,
  currentDate: Date = new Date(),
): PromoValidationResult {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      status: "empty",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Masukkan kode promo terlebih dahulu.",
    };
  }

  const promo = getPromoByCode(normalizedCode);

  if (!promo) {
    return {
      status: "not-found",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Kode promo tidak ditemukan.",
    };
  }

  if (promo.status === "disabled") {
    return {
      status: "disabled",
      promo,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Promo sedang dinonaktifkan seller.",
    };
  }

  if (currentDate < new Date(promo.startsAt) || promo.status === "scheduled") {
    return {
      status: "scheduled",
      promo,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Promo belum aktif.",
    };
  }

  if (currentDate > new Date(promo.endsAt) || promo.status === "expired") {
    return {
      status: "expired",
      promo,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Promo sudah berakhir.",
    };
  }

  if (promo.usedCount >= promo.usageLimit) {
    return {
      status: "usage-limit-reached",
      promo,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Kuota penggunaan promo sudah habis.",
    };
  }

  const eligibleSubtotal = getEligibleSubtotal(promo, items);

  if (eligibleSubtotal <= 0) {
    return {
      status: "no-eligible-items",
      promo,
      discountAmount: 0,
      eligibleSubtotal,
      message: "Tidak ada item yang memenuhi syarat promo ini.",
    };
  }

  if (eligibleSubtotal < promo.minSubtotal.amount) {
    return {
      status: "minimum-subtotal-not-met",
      promo,
      discountAmount: 0,
      eligibleSubtotal,
      message: `Subtotal produk eligible minimal Rp ${promo.minSubtotal.amount.toLocaleString("id-ID")}.`,
    };
  }

  return {
    status: "valid",
    promo,
    discountAmount: getPromoDiscountAmount(promo, eligibleSubtotal, shippingFee),
    eligibleSubtotal,
    message: "Promo berhasil diterapkan.",
  };
}

export function getBundles(): Bundle[] {
  return bundles;
}

export function getAromaMatchQuestions(): AromaMatchQuestion[] {
  return aromaMatchQuestions;
}

export function getAromaMatchRecommendations(): AromaMatchRecommendation[] {
  return aromaMatchRecommendations;
}

export function getAdminValidationItems(): AdminValidationItem[] {
  return adminValidationItems;
}
