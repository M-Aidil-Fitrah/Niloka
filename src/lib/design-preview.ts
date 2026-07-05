export type PreviewCategory = {
  id: string;
  label: string;
  description: string;
};

export type PreviewProduct = {
  id: string;
  label: string;
  tag: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
};

export type PreviewPrimitive = {
  id: string;
  label: string;
  description: string;
};

export const previewCategories: PreviewCategory[] = [
  {
    id: "produk-nilam",
    label: "Produk Nilam",
    description: "Parfum, aromaterapi, sabun, diffuser, dan body oil.",
  },
  {
    id: "ampas-nilam",
    label: "Ampas Nilam",
    description: "Listing B2B untuk bahan baku ekonomi sirkular.",
  },
  {
    id: "aromamatch",
    label: "AromaMatch AI",
    description: "Wizard rekomendasi produk berdasarkan kebutuhan.",
  },
  {
    id: "nilam-passport",
    label: "Nilam Passport",
    description: "Identitas produk yang transparan dan tervalidasi.",
  },
];

export const previewProducts: PreviewProduct[] = [
  {
    id: "roll-on",
    label: "Roll-on Nilam Relief",
    tag: "Best seller",
    price: "Rp89.000",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Produk perawatan dan aromaterapi bernuansa natural.",
  },
  {
    id: "essential-oil",
    label: "Essential Oil Aceh",
    tag: "Nilam Passport",
    price: "Rp145.000",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Botol essential oil di dekat tanaman hijau.",
  },
  {
    id: "soap",
    label: "Sabun Nilam Artisan",
    tag: "New arrival",
    price: "Rp42.000",
    imageUrl:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Produk sabun natural dengan tekstur lembut.",
  },
];

export const previewPrimitives: PreviewPrimitive[] = [
  {
    id: "tokens",
    label: "Design tokens",
    description: "Warna, font, radius, dan spacing disiapkan di global CSS.",
  },
  {
    id: "components",
    label: "Reusable UI",
    description: "Button, badge, card, section, search, dan icon action.",
  },
  {
    id: "responsive",
    label: "Responsive first",
    description: "Layout stabil untuk mobile, tablet, desktop, dan wide.",
  },
];
