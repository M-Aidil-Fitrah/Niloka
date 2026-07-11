import { formatRupiah } from "@/lib/formatters";
import {
  getActiveAmpasListingsDto,
  getPassportsDto,
  getPublicPromoSuggestionsDto,
  getPublishedProductsDto,
  getSellersDto,
  getBundlesDto,
  getArticlesDto,
  getRecentReviewsDto,
} from "@/lib/dal/marketplace";
import { ChatIntent } from "@/lib/contracts";
import { STATIC_KNOWLEDGE_BASE } from "./knowledge-base";

export async function buildContextForIntent(
  intent: ChatIntent,
  query: string,
): Promise<string> {
  const parts: string[] = [];

  switch (intent) {
    case "greeting":
      parts.push("=== INFORMASI UMUM NILOKA ===");
      parts.push(STATIC_KNOWLEDGE_BASE.overview);
      parts.push("=== FITUR YANG BISA DITANYAKAN ===");
      parts.push("- Nilam Passport (transparansi asal produk)");
      parts.push("- Ampas Nilam B2B (limbah hasil distilasi nilam)");
      parts.push("- Produk (essential oil, roll-on, diffuser, sabun, parfum)");
      parts.push("- Promo aktif");
      parts.push("- FAQ / Bantuan cara belanja dan pembayaran");
      break;

    case "product_search":
    case "product_detail": {
      parts.push("=== DATA PRODUK NILOKA ===");
      const products = await getPublishedProductsDto({ limit: 40 });
      const normalizedQuery = query.toLowerCase();
      const matchedProducts = products.filter((p) => {
        return (
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.shortDescription.toLowerCase().includes(normalizedQuery) ||
          p.form.toLowerCase().includes(normalizedQuery) ||
          p.functions.some((f) => f.toLowerCase().includes(normalizedQuery))
        );
      });
      const targetProducts = matchedProducts.length > 0 ? matchedProducts : products.slice(0, 15);

      const productsStr = targetProducts
        .map(
          (p) =>
            `- Nama: ${p.name}\n  Slug: ${p.slug}\n  Harga: ${formatRupiah(p.price.amount)}\n  Deskripsi: ${p.shortDescription}\n  Fungsi: ${p.functions.join(", ")}\n  Bentuk: ${p.form}\n  Stok: ${p.stock}\n  Toko: ${p.sellerId}`,
        )
        .join("\n\n");
      parts.push(productsStr || "Tidak ada produk yang terdaftar saat ini.");
      break;
    }

    case "passport_info": {
      parts.push("=== PENJELASAN NILAM PASSPORT ===");
      parts.push(STATIC_KNOWLEDGE_BASE.features.nilamPassport);
      parts.push("=== DATA PASSPORT AKTIF ===");
      const passportsData = await getPassportsDto();
      const passportsStr = passportsData
        .slice(0, 10)
        .map(
          (p) =>
            `- Passport ID: ${p.id}\n  Produk ID: ${p.productId}\n  Asal: ${p.origin}\n  Aroma: ${p.aromaProfile.join(", ")}\n  Cara Pakai: ${p.usage}\n  Catatan Keamanan: ${p.safetyNotes}\n  Kelompok Tani: ${p.farmerGroup || "Tidak disebut"}\n  Koordinat GPS: ${p.gpsCoordinates || "Tidak disebut"}`,
        )
        .join("\n\n");
      parts.push(passportsStr || "Belum ada paspor yang tervalidasi.");
      break;
    }

    case "ampas_info": {
      parts.push("=== PENJELASAN AMPAS NILAM B2B ===");
      parts.push(STATIC_KNOWLEDGE_BASE.features.ampasB2B);
      parts.push("=== LISTING AMPAS NILAM AKTIF ===");
      const ampasListings = await getActiveAmpasListingsDto({ limit: 10 });
      const ampasStr = ampasListings
        .map(
          (a) =>
            `- Judul/Slug: ${a.slug}\n  Kondisi: ${a.condition}\n  Kuantitas: ${a.quantityKg} kg\n  Harga/kg: ${formatRupiah(a.pricePerKg.amount)}/kg\n  Lokasi: ${a.location.province}, ${a.location.city}\n  Proses Distilasi: ${a.distillationProcess}\n  Pemanfaatan: ${a.usageTags.join(", ")}`,
        )
        .join("\n\n");
      parts.push(ampasStr || "Tidak ada listing ampas aktif saat ini.");
      break;
    }

    case "promo_info": {
      parts.push("=== PENJELASAN PROMO ===");
      parts.push(STATIC_KNOWLEDGE_BASE.features.promos);
      parts.push("=== DAFTAR PROMO SELLER AKTIF ===");
      const promosData = await getPublicPromoSuggestionsDto({ limit: 10 });
      const promosStr = promosData
        .map(
          (p) =>
            `- Kode: ${p.code}\n  Judul: ${p.title}\n  Tipe: ${p.type}\n  Nilai: ${p.value}${p.type === "percentage" ? "%" : ""}\n  Minimal Belanja: ${formatRupiah(p.minSubtotal.amount)}\n  Batas Penggunaan: ${p.usageLimit} (Terpakai: ${p.usedCount})`,
        )
        .join("\n\n");
      parts.push(promosStr || "Tidak ada promo aktif saat ini.");
      break;
    }

    case "seller_info": {
      parts.push("=== DATA SELLER NILOKA ===");
      const sellersData = await getSellersDto();
      const sellersStr = sellersData
        .map(
          (s) =>
            `- Nama Toko: ${s.displayName}\n  Tipe: ${s.type}\n  Lokasi: ${s.location.city}, ${s.location.province}\n  Status: ${s.verificationStatus}\n  Rating: ${s.ratingAverage} (${s.totalReviews} ulasan)\n  Kontak: ${s.contactChannel}`,
        )
        .join("\n\n");
      parts.push(sellersStr);
      break;
    }

    case "article_info": {
      parts.push("=== ARTIKEL & EDUKASI NILOKA ===");
      const articlesData = await getArticlesDto();
      const articlesStr = articlesData
        .slice(0, 8)
        .map(
          (a) =>
            `- Judul: ${a.title}\n  Slug: ${a.slug}\n  Kategori: ${a.category}\n  Ringkasan: ${a.excerpt}\n  Link: /artikel/${a.slug}`,
        )
        .join("\n\n");
      parts.push(articlesStr || "Belum ada artikel edukasi.");
      break;
    }

    case "order_help": {
      parts.push("=== FAQ & BANTUAN BELANJA ===");
      const faqStr = STATIC_KNOWLEDGE_BASE.faq
        .map((f) => `Tanya: ${f.question}\nJawab: ${f.answer}`)
        .join("\n\n");
      parts.push(faqStr);
      parts.push("=== CATATAN KEAMANAN PRODUK ===");
      parts.push(STATIC_KNOWLEDGE_BASE.safetyNotice);
      break;
    }

    case "review_info": {
      parts.push("=== ULASAN / REVIEW TERBARU ===");
      const reviewsData = await getRecentReviewsDto(10);
      const reviewsStr = reviewsData
        .map(
          (r) =>
            `- Penulis: ${r.authorName}\n  Rating: ${r.rating}/5\n  Isi Ulasan: "${r.body}"\n  Produk ID: ${r.productId}\n  Tag: ${r.tags.join(", ")}`,
        )
        .join("\n\n");
      parts.push(reviewsStr || "Belum ada review dari pembeli.");
      break;
    }

    case "bundle_info": {
      parts.push("=== PENJELASAN BUNDLE ===");
      parts.push(STATIC_KNOWLEDGE_BASE.features.bundles);
      parts.push("=== PAKET BUNDLE AKTIF ===");
      const bundlesData = await getBundlesDto();
      const bundlesStr = bundlesData
        .map(
          (b) =>
            `- Paket: ${b.title}\n  Slug: ${b.slug}\n  Tipe: ${b.type}\n  Harga: ${formatRupiah(b.price.amount)}\n  Deskripsi: ${b.description}`,
        )
        .join("\n\n");
      parts.push(bundlesStr || "Tidak ada paket bundle saat ini.");
      break;
    }

    case "general_niloka":
    default: {
      parts.push("=== PENJELASAN UMUM NILOKA ===");
      parts.push(STATIC_KNOWLEDGE_BASE.overview);
      parts.push("=== FITUR UTAMA NILOKA ===");
      parts.push(`1. Nilam Passport: ${STATIC_KNOWLEDGE_BASE.features.nilamPassport}`);
      parts.push(`2. Ampas Nilam B2B: ${STATIC_KNOWLEDGE_BASE.features.ampasB2B}`);
      break;
    }
  }

  return parts.join("\n\n");
}

export async function buildNilokaContext(): Promise<string> {
  return buildContextForIntent("general_niloka", "");
}
