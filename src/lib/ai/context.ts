import { formatRupiah } from "@/lib/formatters";
import {
  getActiveAmpasListingsDto,
  getPassportsDto,
  getPublicPromoSuggestionsDto,
  getPublishedProductsDto,
  getSellersDto,
} from "@/lib/dal/marketplace";

export async function buildNilokaContext(): Promise<string> {
  const [publishedProducts, passportsData, ampasListings, sellersData, promosData] =
    await Promise.all([
      getPublishedProductsDto(),
      getPassportsDto(),
      getActiveAmpasListingsDto(),
      getSellersDto(),
      getPublicPromoSuggestionsDto(),
    ]);

  const products = publishedProducts
    .map(
      (product) =>
        `- ${product.name} (${product.slug}) harga ${formatRupiah(product.price.amount)}, fungsi ${product.functions.join(", ")}, bentuk ${product.form}, seller ${product.sellerId}.`,
    )
    .join("\n");

  const passports = passportsData
    .map(
      (passport) =>
        `- Passport ${passport.productId}: asal ${passport.origin}, aroma ${passport.aromaProfile.join(", ")}, cara pakai ${passport.usage}, catatan ${passport.safetyNotes}.`,
    )
    .join("\n");

  const ampas = ampasListings
    .map(
      (listing) =>
        `- ${listing.slug}: kondisi ${listing.condition}, ${listing.quantityKg} kg, harga ${formatRupiah(listing.pricePerKg.amount)}/kg, lokasi ${listing.location.city}, tag ${listing.usageTags.join(", ")}.`,
    )
    .join("\n");

  const sellers = sellersData
    .map(
      (seller) =>
        `- ${seller.displayName}: ${seller.type}, ${seller.location.city}, status ${seller.verificationStatus}, rating ${seller.ratingAverage}.`,
    )
    .join("\n");

  const promos = promosData
    .map(
      (promo) =>
        `- ${promo.code}: ${promo.title}, tipe ${promo.type}, nilai ${promo.value}, minimal ${formatRupiah(promo.minSubtotal.amount)}.`,
    )
    .join("\n");

  return [
    "KONTEKS NILOKA:",
    "NILOKA adalah marketplace produk nilam Aceh, Nilam Passport, Berita & Artikel Edukasi Limbah Nilam (/artikel), dan listing B2B ampas nilam.",
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
