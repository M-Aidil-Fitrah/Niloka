import { ChatIntent } from "@/lib/contracts";

export function classifyIntent(message: string): ChatIntent {
  const normalized = message.toLowerCase();

  // 1. Greetings / Identity
  const greetingKeywords = [
    "halo", "hai", "helo", "hi", "pagi", "siang", "sore", "malam", "assalamualaikum",
    "kamu siapa", "siapa kamu", "siapa bot", "siapa asisten", "siapa anda", "tugasmu",
    "bisa apa", "fiturmu", "apa fitur", "apa saja fitur", "help", "bantuan", "hi!"
  ];
  if (greetingKeywords.some(kw => normalized.includes(kw))) {
    return "greeting";
  }

  // 2. Nilam Passport
  const passportKeywords = [
    "passport", "paspor", "transparansi", "asal-usul", "asal bahan", "lacak", "kebun",
    "gps", "koordinat", "kelompok tani", "distilasi", "penyulingan", "batch", "uji lab",
    "kemurnian", "transparan"
  ];
  if (passportKeywords.some(kw => normalized.includes(kw))) {
    return "passport_info";
  }

  // 3. Ampas Nilam B2B
  const ampasKeywords = [
    "ampas", "limbah", "daun nilam", "distilasi ampas", "pakan", "kompos", "pupuk",
    "briket", "jamur", "mulsa", "b2b ampas", "ton", "kg", "karung"
  ];
  if (ampasKeywords.some(kw => normalized.includes(kw))) {
    return "ampas_info";
  }

  // 4. Promo
  const promoKeywords = [
    "promo", "diskon", "potongan", "kode", "voucher", "gratis ongkir", "ongkir",
    "potongan harga", "kupon"
  ];
  if (promoKeywords.some(kw => normalized.includes(kw))) {
    return "promo_info";
  }

  // 5. Seller
  const sellerKeywords = [
    "seller", "toko", "umkm", "penyuling", "koperasi", "daftar seller", "profil seller",
    "gabung seller", "cara jadi seller", "jual", "apply seller", "mitra"
  ];
  if (sellerKeywords.some(kw => normalized.includes(kw))) {
    return "seller_info";
  }

  // 6. Article
  const articleKeywords = [
    "artikel", "edukasi", "berita", "baca", "panduan", "informasi", "cara suling",
    "proses suling", "cara budidaya", "tanam nilam", "hama nilam"
  ];
  if (articleKeywords.some(kw => normalized.includes(kw))) {
    return "article_info";
  }

  // 7. Order / Help / FAQ
  const orderKeywords = [
    "cara belanja", "cara bayar", "metode pembayaran", "tracking", "pesanan", "resi",
    "pengiriman", "kirim", "retur", "kembalikan", "garansi", "belanja", "beli", "checkout",
    "qris", "virtual account", "transfer"
  ];
  if (orderKeywords.some(kw => normalized.includes(kw))) {
    return "order_help";
  }

  // 8. Review
  const reviewKeywords = [
    "review", "ulasan", "bintang", "testimoni", "kata orang", "reaksi", "penilaian", "puas"
  ];
  if (reviewKeywords.some(kw => normalized.includes(kw))) {
    return "review_info";
  }

  // 9. Bundle
  const bundleKeywords = [
    "bundle", "bundel", "paket", "hemat", "single-seller", "cross-seller", "paket murah"
  ];
  if (bundleKeywords.some(kw => normalized.includes(kw))) {
    return "bundle_info";
  }

  // 10. Product Detail (asking details of a product)
  const detailKeywords = [
    "detail", "spesifikasi", "bahan", "kandungan", "manfaat", "fungsi", "aroma", "aroma profile",
    "roll-on", "essential oil", "atsiri", "diffuser", "soap", "sabun", "perfume", "parfum", "body oil"
  ];
  if (detailKeywords.some(kw => normalized.includes(kw))) {
    return "product_detail";
  }

  // 11. Product Search (general product query)
  const searchKeywords = [
    "cari", "rekomendasi", "bagus untuk", "daftar produk", "produk apa", "jual produk", "katalog", "stok", "ready"
  ];
  if (searchKeywords.some(kw => normalized.includes(kw))) {
    return "product_search";
  }

  // Default fallback
  return "general_niloka";
}
