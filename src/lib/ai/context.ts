import { formatRupiah } from "@/lib/formatters";
import {
  getActiveAmpasListings,
  getPassports,
  getPublicPromoSuggestions,
  getPublishedProducts,
  getSellers,
} from "@/lib/mock-queries";

export function buildNilokaContext(): string {
  const products = getPublishedProducts()
    .map(
      (product) =>
        `- ${product.name} (${product.slug}) harga ${formatRupiah(product.price.amount)}, fungsi ${product.functions.join(", ")}, bentuk ${product.form}, seller ${product.sellerId}.`,
    )
    .join("\n");

  const passports = getPassports()
    .map(
      (passport) =>
        `- Passport ${passport.productId}: asal ${passport.origin}, aroma ${passport.aromaProfile.join(", ")}, cara pakai ${passport.usage}, catatan ${passport.safetyNotes}.`,
    )
    .join("\n");

  const ampas = getActiveAmpasListings()
    .map(
      (listing) =>
        `- ${listing.slug}: kondisi ${listing.condition}, ${listing.quantityKg} kg, harga ${formatRupiah(listing.pricePerKg.amount)}/kg, lokasi ${listing.location.city}, tag ${listing.usageTags.join(", ")}.`,
    )
    .join("\n");

  const sellers = getSellers()
    .map(
      (seller) =>
        `- ${seller.displayName}: ${seller.type}, ${seller.location.city}, status ${seller.verificationStatus}, rating ${seller.ratingAverage}.`,
    )
    .join("\n");

  const promos = getPublicPromoSuggestions()
    .map(
      (promo) =>
        `- ${promo.code}: ${promo.title}, tipe ${promo.type}, nilai ${promo.value}, minimal ${formatRupiah(promo.minSubtotal.amount)}.`,
    )
    .join("\n");

  return [
    "KONTEKS NILOKA:",
    "NILOKA adalah marketplace produk nilam Aceh, Nilam Passport, AromaMatch, dan listing B2B ampas nilam.",
    "Produk:",
    products,
    "Nilam Passport:",
    passports,
    "Ampas Nilam:",
    ampas,
    "Seller:",
    sellers,
    "Promo aktif:",
    promos,
  ].join("\n");
}
