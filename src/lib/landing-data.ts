export type CategoryTile = {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
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
  id: string;
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

export const categoryTiles: CategoryTile[] = [
  {
    id: "aroma",
    label: "AromaMatch AI",
    description: "Temukan produk berdasarkan tujuan, aroma, bentuk, dan budget.",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Produk kosmetik dan aromaterapi di atas meja.",
  },
  {
    id: "passport",
    label: "Nilam Passport",
    description: "Lihat asal bahan, profil aroma, fungsi, cara pakai, dan keamanan.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Botol minyak atsiri di dekat tanaman hijau.",
  },
  {
    id: "ampas",
    label: "Ampas Nilam",
    description: "Listing B2B untuk kompos, briket, media tanam, dan biomassa.",
    imageUrl:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Bahan natural untuk ekonomi sirkular.",
  },
  {
    id: "seller",
    label: "Seller Terkurasi",
    description: "UMKM dan penyuling bergabung dalam ekosistem hulu-hilir.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423539-e951b9b3871c?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Produk natural tersusun rapi di studio.",
  },
];

export const bestSellerProducts: ProductCard[] = [
  {
    id: "roll-on-relief",
    name: "Roll-on Nilam Relief",
    tag: "Best seller",
    price: "Rp89.000",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Produk kosmetik natural dengan kuas dan botol kecil.",
  },
  {
    id: "essential-oil",
    name: "Essential Oil Aceh",
    tag: "Nilam Passport",
    price: "Rp145.000",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Botol essential oil amber di atas dudukan kayu.",
  },
  {
    id: "artisan-soap",
    name: "Sabun Nilam Artisan",
    tag: "New arrival",
    price: "Rp42.000",
    imageUrl:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Produk sabun natural di studio cerah.",
  },
  {
    id: "diffuser-blend",
    name: "Diffuser Blend Patchouli",
    tag: "Aroma calm",
    price: "Rp128.000",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Botol parfum dan aroma diffuser di meja elegan.",
  },
];

export const passportItems: PassportItem[] = [
  {
    id: "origin",
    label: "Asal bahan",
    value: "Aceh Selatan",
  },
  {
    id: "profile",
    label: "Profil aroma",
    value: "Woody, earthy, calming",
  },
  {
    id: "usage",
    label: "Cara pakai",
    value: "Roll-on titik nadi",
  },
  {
    id: "safety",
    label: "Catatan aman",
    value: "Patch test disarankan",
  },
];

export const circularUses: CircularUse[] = [
  {
    id: "compost",
    label: "Pupuk kompos",
  },
  {
    id: "briquette",
    label: "Briket biomassa",
  },
  {
    id: "mushroom",
    label: "Media tanam jamur",
  },
  {
    id: "mulch",
    label: "Mulsa pertanian",
  },
  {
    id: "cellulose",
    label: "Selulosa industri",
  },
];

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
