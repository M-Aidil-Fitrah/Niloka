import type {
  AdminValidationItem,
  AmpasListing,
  AmpasListingId,
  AromaMatchQuestion,
  AromaMatchRecommendation,
  Bundle,
  NilamPassport,
  Product,
  ProductCategory,
  ProductId,
  Promo,
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
