import type { AmpasUsageTag, ProductTag } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";
import {
  getFeaturedAmpasListing,
  getFeaturedPassport,
  getFeaturedProductCategory,
  getFeaturedProducts,
} from "@/lib/mock-queries";

export type CategoryTile = {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

export type ProductCard = {
  id: string;
  name: string;
  tag: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
};

export type PassportItem = {
  id: string;
  label: string;
  value: string;
};

export type CircularUse = {
  id: AmpasUsageTag;
  label: string;
};

export type StoryMetric = {
  id: string;
  value: string;
  label: string;
};

export type FooterColumn = {
  id: string;
  title: string;
  links: string[];
};

const productTagLabels: { id: ProductTag; label: string }[] = [
  {
    id: "best-seller",
    label: "Best seller",
  },
  {
    id: "new-arrival",
    label: "New arrival",
  },
  {
    id: "nilam-passport",
    label: "Nilam Passport",
  },
  {
    id: "aroma-calm",
    label: "Aroma calm",
  },
  {
    id: "limited-batch",
    label: "Limited batch",
  },
];

const ampasUsageLabels: CircularUse[] = [
  {
    id: "compost",
    label: "Pupuk kompos",
  },
  {
    id: "briquette",
    label: "Briket biomassa",
  },
  {
    id: "mushroom-media",
    label: "Media tanam jamur",
  },
  {
    id: "mulch",
    label: "Mulsa pertanian",
  },
  {
    id: "animal-feed",
    label: "Pakan ternak",
  },
  {
    id: "industrial-cellulose",
    label: "Selulosa industri",
  },
];

function getProductTagLabel(tags: ProductTag[]): string {
  const label = productTagLabels.find((item) => tags.includes(item.id));
  return label?.label ?? "Curated";
}

const featuredPassport = getFeaturedPassport();
const featuredAmpasListing = getFeaturedAmpasListing();
const featuredProductCategory = getFeaturedProductCategory();

export const categoryTiles: CategoryTile[] = [
  {
    id: "aroma",
    label: "AromaMatch AI",
    description: "Temukan produk berdasarkan tujuan, aroma, bentuk, dan budget.",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Produk kosmetik dan aromaterapi di atas meja.",
    href: "#aromamatch",
  },
  {
    id: "passport",
    label: "Nilam Passport",
    description: "Lihat asal bahan, profil aroma, fungsi, cara pakai, dan keamanan.",
    imageUrl: featuredProductCategory.image.src,
    imageAlt: featuredProductCategory.image.alt,
    href: "#passport",
  },
  {
    id: "ampas",
    label: "Ampas Nilam",
    description: "Listing B2B untuk kompos, briket, media tanam, dan biomassa.",
    imageUrl: featuredAmpasListing.image.src,
    imageAlt: featuredAmpasListing.image.alt,
    href: "#circular",
  },
  {
    id: "products",
    label: "Produk Nilam",
    description: "Minyak atsiri, roll-on relief, sabun artisan, dan produk turunan nilam.",
    imageUrl:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Koleksi produk turunan nilam siap pakai.",
    href: "/products",
  },
];

export const bestSellerProducts: ProductCard[] = getFeaturedProducts(4).map(
  (product) => ({
    id: product.id,
    name: product.name,
    tag: getProductTagLabel(product.tags),
    price: formatRupiah(product.price.amount),
    imageUrl: product.image.src,
    imageAlt: product.image.alt,
  }),
);

export const passportItems: PassportItem[] = [
  {
    id: "origin",
    label: "Asal bahan",
    value: featuredPassport.origin,
  },
  {
    id: "profile",
    label: "Profil aroma",
    value: featuredPassport.aromaProfile.join(", "),
  },
  {
    id: "usage",
    label: "Cara pakai",
    value: featuredPassport.usage,
  },
  {
    id: "safety",
    label: "Catatan aman",
    value: featuredPassport.safetyNotes,
  },
];

export const circularUses: CircularUse[] = ampasUsageLabels.filter((item) =>
  featuredAmpasListing.usageTags.includes(item.id),
);

export const storyMetrics: StoryMetric[] = [
  {
    id: "supply",
    value: "80-90%",
    label: "pasokan minyak nilam dunia berasal dari Indonesia",
  },
  {
    id: "farmers",
    value: "2.759",
    label: "KK petani nilam aktif di Aceh berdasarkan data 2023",
  },
  {
    id: "models",
    value: "B2C+B2B",
    label: "dua model transaksi dalam satu marketplace terkurasi",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    id: "marketplace",
    title: "Marketplace",
    links: ["Produk Nilam", "Ampas Nilam", "AromaMatch AI", "Nilam Passport"],
  },
  {
    id: "seller",
    title: "Seller",
    links: ["Daftar Seller", "Dashboard", "Promo Toko", "Validasi Produk"],
  },
  {
    id: "company",
    title: "NILOKA",
    links: ["Tentang", "Riset Nilam", "Ekonomi Sirkular", "Kontak"],
  },
];
