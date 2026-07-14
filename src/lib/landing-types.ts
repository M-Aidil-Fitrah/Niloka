import type { AmpasUsageTag, Review } from "@/lib/contracts";

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
  price: number;
  originalPrice?: number;
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

export type LandingPageData = {
  categoryTiles: CategoryTile[];
  bestSellerProducts: ProductCard[];
  newArrivalProducts: ProductCard[];
  passportItems: PassportItem[];
  circularUses: CircularUse[];
  storyMetrics: StoryMetric[];
  reviews: Review[];
};

export const footerColumns: FooterColumn[] = [
  {
    id: "marketplace",
    title: "Marketplace",
    links: ["Produk Nilam", "Ampas Nilam", "Berita & Artikel", "Nilam Passport"],
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
