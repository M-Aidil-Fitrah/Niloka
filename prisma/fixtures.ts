import type {
  AdminValidationItem,
  AmpasListing,
  Bundle,
  CartItem,
  Money,
  NilamPassport,
  OrderSummary,
  Product,
  ProductCategory,
  Review,
  Seller,
  Promo,
  Article,
} from "../src/lib/contracts";

const idr = (amount: number): Money => ({
  amount,
  currency: "IDR",
});

export const sellers: Seller[] = [
  {
    id: "seller-aceh-aroma",
    slug: "aceh-aroma-house",
    displayName: "Aceh Aroma House",
    type: "umkm",
    location: {
      province: "Aceh",
      city: "Aceh Selatan",
      district: "Tapaktuan",
    },
    verificationStatus: "verified",
    joinedAt: "2026-01-12T09:00:00.000Z",
    ratingAverage: 4.9,
    totalReviews: 128,
    contactChannel: "WhatsApp Business",
  },
  {
    id: "seller-nilam-lestari",
    slug: "nilam-lestari-coop",
    displayName: "Koperasi Nilam Lestari",
    type: "cooperative",
    location: {
      province: "Aceh",
      city: "Aceh Jaya",
      district: "Panga",
    },
    verificationStatus: "verified",
    joinedAt: "2026-02-04T08:30:00.000Z",
    ratingAverage: 4.8,
    totalReviews: 86,
    contactChannel: "Marketplace chat",
  },
  {
    id: "seller-gayo-distill",
    slug: "gayo-distill-lab",
    displayName: "Gayo Distill Lab",
    type: "distiller",
    location: {
      province: "Aceh",
      city: "Gayo Lues",
      district: "Blangkejeren",
    },
    verificationStatus: "verified",
    joinedAt: "2026-02-20T10:15:00.000Z",
    ratingAverage: 4.7,
    totalReviews: 42,
    contactChannel: "WhatsApp Business",
  },
];

export const productCategories: ProductCategory[] = [
  {
    id: "category-aromatherapy",
    slug: "aromaterapi",
    name: "Aromaterapi",
    description: "Roll-on, essential oil, dan diffuser berbasis nilam Aceh.",
    targetMarket: "b2c",
    image: {
      src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      alt: "Botol essential oil amber di atas dudukan kayu.",
    },
  },
  {
    id: "category-body-care",
    slug: "body-care",
    name: "Body Care",
    description: "Sabun, body oil, dan perawatan natural dengan profil nilam.",
    targetMarket: "b2c",
    image: {
      src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
      alt: "Produk sabun natural di studio cerah.",
    },
  },
  {
    id: "category-home-fragrance",
    slug: "home-fragrance",
    name: "Home Fragrance",
    description: "Diffuser blend dan parfum ruangan dengan aroma woody.",
    targetMarket: "b2c",
    image: {
      src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      alt: "Botol parfum dan diffuser di meja elegan.",
    },
  },
];

export const products: Product[] = [
  {
    id: "product-roll-on-relief",
    slug: "roll-on-nilam-relief",
    sellerId: "seller-aceh-aroma",
    categoryId: "category-aromatherapy",
    passportId: "passport-roll-on-relief",
    name: "Roll-on Nilam Relief",
    shortDescription: "Roll-on titik nadi untuk rutinitas relaksasi harian.",
    form: "roll-on",
    functions: ["relaxation", "sleep-support"],
    tags: ["best-seller", "nilam-passport"],
    price: idr(89000),
    originalPrice: idr(109000),
    stock: 42,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
      alt: "Produk kosmetik natural dengan kuas dan botol kecil.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
        alt: "Flatlay produk roll-on dan kosmetik natural.",
      },
    ],
    featuredRank: 1,
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-06-20T11:00:00.000Z",
  },
  {
    id: "product-essential-oil-aceh",
    slug: "essential-oil-aceh",
    sellerId: "seller-nilam-lestari",
    categoryId: "category-aromatherapy",
    passportId: "passport-essential-oil-aceh",
    name: "Essential Oil Aceh",
    shortDescription: "Minyak atsiri nilam Aceh untuk diffuser dan blend.",
    form: "essential-oil",
    functions: ["relaxation", "home-fragrance"],
    tags: ["nilam-passport", "limited-batch"],
    price: idr(145000),
    originalPrice: idr(175000),
    stock: 26,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      alt: "Botol essential oil amber di atas dudukan kayu.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
        alt: "Botol essential oil dengan bayangan daun.",
      },
    ],
    featuredRank: 2,
    createdAt: "2026-03-09T09:00:00.000Z",
    updatedAt: "2026-06-19T11:00:00.000Z",
  },
  {
    id: "product-artisan-soap",
    slug: "sabun-nilam-artisan",
    sellerId: "seller-aceh-aroma",
    categoryId: "category-body-care",
    passportId: "passport-artisan-soap",
    name: "Sabun Nilam Artisan",
    shortDescription: "Sabun natural batch kecil dengan aroma earthy lembut.",
    form: "soap",
    functions: ["skin-care", "gift"],
    tags: ["new-arrival"],
    price: idr(42000),
    originalPrice: idr(55000),
    stock: 64,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
      alt: "Produk sabun natural di studio cerah.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
        alt: "Sabun natural dengan kemasan bersih.",
      },
    ],
    featuredRank: 3,
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-06-18T11:00:00.000Z",
  },
  {
    id: "product-diffuser-blend",
    slug: "diffuser-blend-patchouli",
    sellerId: "seller-gayo-distill",
    categoryId: "category-home-fragrance",
    passportId: "passport-diffuser-blend",
    name: "Diffuser Blend Patchouli",
    shortDescription: "Blend diffuser patchouli untuk suasana ruang yang tenang.",
    form: "diffuser",
    functions: ["home-fragrance", "focus"],
    tags: ["aroma-calm"],
    price: idr(128000),
    originalPrice: idr(149000),
    stock: 31,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      alt: "Botol parfum dan aroma diffuser di meja elegan.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        alt: "Botol diffuser premium di studio.",
      },
    ],
    featuredRank: 4,
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-06-17T11:00:00.000Z",
  },
  {
    id: "product-body-oil-lux",
    slug: "body-oil-luxury",
    sellerId: "seller-aceh-aroma",
    categoryId: "category-body-care",
    passportId: "passport-body-oil-lux",
    name: "Body Oil Luxury",
    shortDescription: "Body oil premium dengan kandungan minyak nilam murni untuk hidrasi kulit.",
    form: "body-oil",
    functions: ["skin-care", "relaxation"],
    tags: ["new-arrival", "nilam-passport"],
    price: idr(175000),
    originalPrice: idr(199000),
    stock: 18,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      alt: "Botol body oil premium amber.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
        alt: "Detail botol body oil premium.",
      },
    ],
    featuredRank: 5,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-06-21T09:00:00.000Z",
  },
  {
    id: "product-candles-set",
    slug: "lilin-aromaterapi-nilam",
    sellerId: "seller-gayo-distill",
    categoryId: "category-aromatherapy",
    passportId: "passport-candles-set",
    name: "Lilin Aromaterapi Nilam",
    shortDescription: "Lilin aromaterapi nilam & lavender untuk membantu kualitas tidur.",
    form: "essential-oil",
    functions: ["relaxation", "sleep-support"],
    tags: ["new-arrival"],
    price: idr(95000),
    originalPrice: idr(115000),
    stock: 22,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
      alt: "Lilin aromaterapi menyala.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
        alt: "Lilin aromaterapi.",
      },
    ],
    featuredRank: 6,
    createdAt: "2026-05-15T09:00:00.000Z",
    updatedAt: "2026-06-22T10:00:00.000Z",
  },
  {
    id: "product-perfume-local",
    slug: "parfum-nilam-local",
    sellerId: "seller-aceh-aroma",
    categoryId: "category-aromatherapy",
    passportId: "passport-perfume-local",
    name: "Parfum Nilam Lokal",
    shortDescription: "Parfum eau de toilette dengan base note nilam Aceh autentik.",
    form: "perfume",
    functions: ["gift", "relaxation"],
    tags: ["best-seller", "nilam-passport"],
    price: idr(210000),
    originalPrice: idr(250000),
    stock: 15,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      alt: "Botol parfum nilam lokal premium.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        alt: "Detail botol parfum nilam.",
      },
    ],
    featuredRank: 7,
    createdAt: "2026-05-20T09:00:00.000Z",
    updatedAt: "2026-06-23T10:00:00.000Z",
  },
  {
    id: "product-roll-on-focus",
    slug: "roll-on-nilam-focus",
    sellerId: "seller-gayo-distill",
    categoryId: "category-aromatherapy",
    passportId: "passport-roll-on-focus",
    name: "Roll-on Nilam Focus",
    shortDescription: "Roll-on aromaterapi untuk meningkatkan konsentrasi saat bekerja.",
    form: "roll-on",
    functions: ["focus", "relaxation"],
    tags: ["new-arrival"],
    price: idr(79000),
    originalPrice: idr(99000),
    stock: 35,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
      alt: "Roll-on aromaterapi untuk fokus.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
        alt: "Detail roll-on aromaterapi.",
      },
    ],
    featuredRank: 8,
    createdAt: "2026-05-22T09:00:00.000Z",
    updatedAt: "2026-06-24T10:00:00.000Z",
  },
  {
    id: "product-soap-gift-set",
    slug: "sabun-nilam-gift-set",
    sellerId: "seller-nilam-lestari",
    categoryId: "category-body-care",
    passportId: "passport-soap-gift-set",
    name: "Sabun Nilam Gift Set",
    shortDescription: "Set tiga sabun artisan nilam dalam kemasan hadiah premium.",
    form: "soap",
    functions: ["skin-care", "gift"],
    tags: ["best-seller"],
    price: idr(120000),
    originalPrice: idr(140000),
    stock: 28,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
      alt: "Set sabun nilam dalam kemasan hadiah.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80",
        alt: "Detail sabun nilam gift set.",
      },
    ],
    featuredRank: 9,
    createdAt: "2026-05-25T09:00:00.000Z",
    updatedAt: "2026-06-25T10:00:00.000Z",
  },
  {
    id: "product-lotion-nilam",
    slug: "losion-nilam-hydrate",
    sellerId: "seller-aceh-aroma",
    categoryId: "category-body-care",
    passportId: "passport-lotion-nilam",
    name: "Losion Nilam Hydrate",
    shortDescription: "Losion pelembap ringan dengan ekstrak nilam untuk kulit kering.",
    form: "body-oil",
    functions: ["skin-care"],
    tags: ["nilam-passport"],
    price: idr(68000),
    originalPrice: idr(85000),
    stock: 50,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      alt: "Botol losion nilam untuk hidrasi kulit.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
        alt: "Detail losion nilam.",
      },
    ],
    featuredRank: 10,
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-26T10:00:00.000Z",
  },
  {
    id: "product-reed-diffuser",
    slug: "reed-diffuser-patchouli",
    sellerId: "seller-gayo-distill",
    categoryId: "category-home-fragrance",
    passportId: "passport-reed-diffuser",
    name: "Reed Diffuser Patchouli",
    shortDescription: "Reed diffuser elegan dengan aroma patchouli untuk ruang tamu dan kamar.",
    form: "diffuser",
    functions: ["home-fragrance", "relaxation"],
    tags: ["new-arrival", "aroma-calm"],
    price: idr(155000),
    originalPrice: idr(185000),
    stock: 12,
    status: "published",
    image: {
      src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      alt: "Reed diffuser patchouli di meja.",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        alt: "Detail reed diffuser patchouli.",
      },
    ],
    featuredRank: 11,
    createdAt: "2026-06-05T09:00:00.000Z",
    updatedAt: "2026-06-27T10:00:00.000Z",
  },
];

export const nilamPassports: NilamPassport[] = [
  {
    id: "passport-body-oil-lux",
    productId: "product-body-oil-lux",
    origin: "Gayo Lues",
    productKind: "body-oil",
    aromaProfile: ["warm woody", "sweet", "calming"],
    functions: ["skin-care", "relaxation"],
    usage: "Oleskan secukupnya pada area tubuh setelah mandi.",
    safetyNotes: "Hanya untuk pemakaian luar.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-21T09:00:00.000Z",
  },
  {
    id: "passport-roll-on-relief",
    productId: "product-roll-on-relief",
    origin: "Aceh Selatan",
    productKind: "roll-on",
    aromaProfile: ["woody", "earthy", "calming"],
    functions: ["relaxation", "sleep-support"],
    usage: "Roll-on tipis pada titik nadi, maksimal tiga kali sehari.",
    safetyNotes: "Patch test disarankan untuk kulit sensitif.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-21T08:00:00.000Z",
  },
  {
    id: "passport-essential-oil-aceh",
    productId: "product-essential-oil-aceh",
    origin: "Aceh Jaya",
    productKind: "essential-oil",
    aromaProfile: ["deep woody", "smoky", "green"],
    functions: ["relaxation", "home-fragrance"],
    usage: "Gunakan dua sampai tiga tetes pada diffuser berisi air.",
    safetyNotes: "Tidak untuk ditelan dan jauhkan dari anak-anak.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-21T08:05:00.000Z",
  },
  {
    id: "passport-artisan-soap",
    productId: "product-artisan-soap",
    origin: "Aceh Selatan",
    productKind: "soap",
    aromaProfile: ["soft earthy", "herbal"],
    functions: ["skin-care", "gift"],
    usage: "Basahi, busakan, lalu bilas sampai bersih.",
    safetyNotes: "Hentikan pemakaian jika terjadi iritasi.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-21T08:10:00.000Z",
  },
  {
    id: "passport-diffuser-blend",
    productId: "product-diffuser-blend",
    origin: "Gayo Lues",
    productKind: "diffuser",
    aromaProfile: ["woody", "amber", "calming"],
    functions: ["home-fragrance", "focus"],
    usage: "Tuang pada diffuser reed atau electric diffuser sesuai petunjuk alat.",
    safetyNotes: "Jauhkan dari sumber api dan permukaan mudah rusak.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-21T08:15:00.000Z",
  },
  {
    id: "passport-candles-set",
    productId: "product-candles-set",
    origin: "Gayo Lues",
    productKind: "essential-oil",
    aromaProfile: ["woody", "lavender", "calming"],
    functions: ["relaxation", "sleep-support"],
    usage: "Nyalakan di ruangan berventilasi baik, jauhkan dari benda mudah terbakar.",
    safetyNotes: "Jangan tinggalkan lilin menyala tanpa pengawasan.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-22T08:00:00.000Z",
  },
  {
    id: "passport-perfume-local",
    productId: "product-perfume-local",
    origin: "Aceh Selatan",
    productKind: "perfume",
    aromaProfile: ["patchouli", "musk", "amber"],
    functions: ["gift", "relaxation"],
    usage: "Semprotkan pada titik nadi seperti pergelangan tangan dan leher.",
    safetyNotes: "Hanya untuk pemakaian luar. Hindari kontak dengan mata.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-23T08:00:00.000Z",
  },
  {
    id: "passport-roll-on-focus",
    productId: "product-roll-on-focus",
    origin: "Gayo Lues",
    productKind: "roll-on",
    aromaProfile: ["minty woody", "fresh", "green"],
    functions: ["focus", "relaxation"],
    usage: "Roll-on pada pelipis atau pergelangan tangan saat butuh fokus.",
    safetyNotes: "Patch test disarankan untuk kulit sensitif.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-24T08:00:00.000Z",
  },
  {
    id: "passport-soap-gift-set",
    productId: "product-soap-gift-set",
    origin: "Aceh Jaya",
    productKind: "soap",
    aromaProfile: ["floral earthy", "herbal", "soft"],
    functions: ["skin-care", "gift"],
    usage: "Basahi, busakan, dan bilas. Cocok untuk semua jenis kulit.",
    safetyNotes: "Hentikan pemakaian jika terjadi iritasi kulit.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-25T08:00:00.000Z",
  },
  {
    id: "passport-lotion-nilam",
    productId: "product-lotion-nilam",
    origin: "Aceh Selatan",
    productKind: "body-oil",
    aromaProfile: ["soft woody", "creamy"],
    functions: ["skin-care"],
    usage: "Oleskan pada kulit setelah mandi untuk hasil terbaik.",
    safetyNotes: "Hanya untuk pemakaian luar.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-26T08:00:00.000Z",
  },
  {
    id: "passport-reed-diffuser",
    productId: "product-reed-diffuser",
    origin: "Gayo Lues",
    productKind: "diffuser",
    aromaProfile: ["deep patchouli", "woody", "warm"],
    functions: ["home-fragrance", "relaxation"],
    usage: "Tempatkan di meja, balik reed stick setiap minggu untuk menjaga aroma.",
    safetyNotes: "Jauhkan dari jangkauan anak-anak dan sumber api.",
    validationStatus: "validated",
    validatedBy: "admin-niloka-curation",
    validatedAt: "2026-06-27T08:00:00.000Z",
  },
];

export const ampasListings: AmpasListing[] = [
  {
    id: "ampas-gayo-dry-biomass",
    slug: "ampas-nilam-kering-gayo",
    sellerId: "seller-gayo-distill",
    condition: "dry",
    quantityKg: 850,
    pricePerKg: idr(1800),
    location: {
      province: "Aceh",
      city: "Gayo Lues",
      district: "Blangkejeren",
    },
    distillationProcess: "Penyulingan uap batch kecil, dikeringanginkan 48 jam.",
    usageTags: ["compost", "briquette", "mulch", "industrial-cellulose"],
    status: "active",
    image: {
      src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
      alt: "Bahan alami dan minyak nilam sebagai bagian ekonomi sirkular.",
    },
    disclaimer:
      "Tag penggunaan adalah klaim seller; NILOKA tidak memverifikasi kandungan atau kualitas ampas.",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-06-22T09:00:00.000Z",
    wholesaleEnabled: true,
    wholesaleMinQtyKg: 25,
    wholesalePricePerKg: idr(1500),
  },
  {
    id: "ampas-panga-wet-compost",
    slug: "ampas-nilam-basah-panga",
    sellerId: "seller-nilam-lestari",
    condition: "wet",
    quantityKg: 420,
    pricePerKg: idr(900),
    location: {
      province: "Aceh",
      city: "Aceh Jaya",
      district: "Panga",
    },
    distillationProcess: "Sisa penyulingan harian, belum dikeringkan.",
    usageTags: ["compost", "mushroom-media", "animal-feed"],
    status: "active",
    image: {
      src: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
      alt: "Produk natural dan bahan produksi tersusun rapi.",
    },
    disclaimer:
      "Tag penggunaan adalah klaim seller; NILOKA tidak memverifikasi kandungan atau kualitas ampas.",
    createdAt: "2026-05-13T09:00:00.000Z",
    updatedAt: "2026-06-22T09:30:00.000Z",
    wholesaleEnabled: false,
  },
];

export const reviews: Review[] = [
  {
    id: "review-roll-on-001",
    productId: "product-roll-on-relief",
    sellerId: "seller-aceh-aroma",
    authorName: "Maya Putri",
    rating: 5,
    tags: [],
    body: "Aromanya earthy dan tidak menusuk, informasi passport juga jelas.",
    createdAt: "2026-06-11T10:00:00.000Z",
  },
  {
    id: "review-essential-oil-001",
    productId: "product-essential-oil-aceh",
    sellerId: "seller-nilam-lestari",
    authorName: "Raka Pratama",
    rating: 5,
    tags: [],
    body: "Blend diffuser jadi lebih hangat dan tahan lama.",
    createdAt: "2026-06-13T10:00:00.000Z",
  },
  {
    id: "review-artisan-soap-001",
    productId: "product-artisan-soap",
    sellerId: "seller-aceh-aroma",
    authorName: "Faisal Ahmad",
    rating: 4,
    tags: [],
    body: "Sabun nilam artisan ini lembut sekali di kulit sensitif. Wanginya sangat natural.",
    createdAt: "2026-06-15T08:30:00.000Z",
  },
  {
    id: "review-diffuser-blend-001",
    productId: "product-diffuser-blend",
    sellerId: "seller-gayo-distill",
    authorName: "Nadia Lestari",
    rating: 5,
    tags: [],
    body: "Aromanya menenangkan sekali untuk kerja di rumah. Pelayanan cepat!",
    createdAt: "2026-06-20T14:20:00.000Z",
  },
  {
    id: "review-essential-oil-002",
    productId: "product-essential-oil-aceh",
    sellerId: "seller-nilam-lestari",
    authorName: "Hendra Wijaya",
    rating: 5,
    tags: [],
    body: "Kualitas minyak nilam terbaik dari Panga. Keterangan asal bahan di passport sangat membantu.",
    createdAt: "2026-06-22T11:45:00.000Z",
  },
  {
    id: "review-artisan-soap-002",
    productId: "product-artisan-soap",
    sellerId: "seller-aceh-aroma",
    authorName: "Cut Aura",
    rating: 5,
    tags: [],
    body: "Wangi minyak nilamnya benar-benar menenangkan. Kulit saya jadi terasa lebih lembap setelah mandi.",
    createdAt: "2026-06-25T09:15:00.000Z",
  },
];

export const promos: Promo[] = [
  {
    id: "promo-aroma-week",
    sellerId: "seller-aceh-aroma",
    title: "Aroma Week 10%",
    code: "ATSIRI10",
    status: "active",
    type: "percentage",
    value: 10,
    startsAt: "2026-07-01T00:00:00.000Z",
    endsAt: "2026-07-15T23:59:59.000Z",
    minSubtotal: idr(50000),
    usageLimit: 250,
    usedCount: 64,
    productIds: ["product-roll-on-relief", "product-artisan-soap"],
  },
  {
    id: "promo-coop-15k",
    sellerId: "seller-nilam-lestari",
    title: "Potongan Koperasi Rp15.000",
    code: "COOP15K",
    status: "active",
    type: "fixed-amount",
    value: 15000,
    startsAt: "2026-07-01T00:00:00.000Z",
    endsAt: "2026-07-20T23:59:59.000Z",
    minSubtotal: idr(120000),
    usageLimit: 100,
    usedCount: 21,
    productIds: ["product-essential-oil-aceh"],
  },
  {
    id: "promo-niloka-free",
    sellerId: "seller-aceh-aroma",
    title: "Gratis Ongkir Produk Body Care",
    code: "NILAMFREE",
    status: "active",
    type: "free-shipping",
    value: 0,
    startsAt: "2026-07-04T00:00:00.000Z",
    endsAt: "2026-07-30T23:59:59.000Z",
    minSubtotal: idr(150000),
    usageLimit: 80,
    usedCount: 12,
    productIds: ["product-body-oil-lux", "product-artisan-soap"],
  },
  {
    id: "promo-future-bundle",
    sellerId: "seller-gayo-distill",
    title: "Bundling Home Fragrance 12%",
    code: "GAYO12",
    status: "scheduled",
    type: "percentage",
    value: 12,
    startsAt: "2026-08-01T00:00:00.000Z",
    endsAt: "2026-08-15T23:59:59.000Z",
    minSubtotal: idr(200000),
    usageLimit: 120,
    usedCount: 0,
    productIds: ["product-diffuser-blend"],
  },
];

export const bundles: Bundle[] = [
  {
    id: "bundle-calm-home",
    slug: "calm-home-starter",
    title: "Calm Home Starter",
    type: "cross-seller",
    productIds: ["product-essential-oil-aceh", "product-diffuser-blend"],
    price: idr(249000),
    description: "Paket diffuser dan essential oil untuk ruang kerja tenang.",
  },
];

export const cartItems: CartItem[] = [
  {
    id: "cart-item-roll-on",
    kind: "product",
    productId: "product-roll-on-relief",
    ampasListingId: null,
    quantity: 1,
    unitPrice: idr(89000),
  },
  {
    id: "cart-item-ampas-gayo",
    kind: "ampas-listing",
    productId: null,
    ampasListingId: "ampas-gayo-dry-biomass",
    quantity: 100,
    unitPrice: idr(1800),
  },
];

export const orderSummaries: OrderSummary[] = [
  {
    id: "order-preview-001",
    status: "pending-payment",
    items: cartItems,
    subtotal: idr(269000),
    platformFee: idr(9400),
    shippingEstimate: idr(28000),
    grandTotal: idr(306400),
  },
  {
    id: "order-preview-002",
    status: "paid",
    items: [
      {
        id: "order-paid-roll-on",
        kind: "product",
        productId: "product-roll-on-relief",
        ampasListingId: null,
        quantity: 2,
        unitPrice: idr(89000),
      },
    ],
    subtotal: idr(178000),
    platformFee: idr(2000),
    shippingEstimate: idr(15000),
    grandTotal: idr(195000),
  },
  {
    id: "order-preview-003",
    status: "fulfilled",
    items: [
      {
        id: "order-fulfilled-ampas",
        kind: "ampas-listing",
        productId: null,
        ampasListingId: "ampas-gayo-dry-biomass",
        quantity: 100,
        unitPrice: idr(1800),
      },
    ],
    subtotal: idr(180000),
    platformFee: idr(5400),
    shippingEstimate: idr(28000),
    grandTotal: idr(213400),
  },
];

export const adminValidationItems: AdminValidationItem[] = [
  {
    id: "validation-passport-roll-on",
    target: "nilam-passport",
    targetId: "passport-roll-on-relief",
    status: "approved",
    submittedBy: "seller-aceh-aroma",
    submittedAt: "2026-06-20T08:00:00.000Z",
    notes: "Data asal bahan, profil aroma, dan safety notes lengkap.",
  },
  {
    id: "validation-seller-gayo",
    target: "seller",
    targetId: "seller-gayo-distill",
    status: "approved",
    submittedBy: "seller-gayo-distill",
    submittedAt: "2026-06-18T08:00:00.000Z",
    notes: "Seller distiller aktif dengan dokumen onboarding lengkap.",
  },
  {
    id: "validation-seller-nilam-lestari",
    target: "seller",
    targetId: "seller-nilam-lestari",
    status: "queued",
    submittedBy: "seller-nilam-lestari",
    submittedAt: "2026-07-02T10:15:00.000Z",
    notes: "Koperasi baru mendaftar. Menunggu verifikasi dokumen legalitas.",
  },
  {
    id: "validation-product-sabun-artisan",
    target: "product",
    targetId: "product-sabun-nilam-artisan",
    status: "queued",
    submittedBy: "seller-aceh-aroma",
    submittedAt: "2026-07-01T14:30:00.000Z",
    notes: "Produk baru dari seller terverifikasi. Perlu review klaim bahan alami.",
  },
  {
    id: "validation-passport-essential-oil",
    target: "nilam-passport",
    targetId: "passport-essential-oil-aceh",
    status: "approved",
    submittedBy: "seller-aceh-aroma",
    submittedAt: "2026-05-15T09:00:00.000Z",
    notes: "Kadar PA 34.2% sesuai hasil uji lab independen. Disetujui.",
  },
  {
    id: "validation-product-diffuser-gayo",
    target: "product",
    targetId: "product-diffuser-gayo",
    status: "approved",
    submittedBy: "seller-gayo-distill",
    submittedAt: "2026-06-10T11:00:00.000Z",
    notes: "Deskripsi produk jelas dan akurat. Listing disetujui.",
  },
  {
    id: "validation-passport-sabun-draft",
    target: "nilam-passport",
    targetId: "passport-sabun-nilam-artisan",
    status: "queued",
    submittedBy: "seller-aceh-aroma",
    submittedAt: "2026-07-03T16:45:00.000Z",
    notes: "Draf paspor baru diajukan. Belum ada lampiran hasil uji PA.",
  },
  {
    id: "validation-seller-aceh-aroma",
    target: "seller",
    targetId: "seller-aceh-aroma",
    status: "approved",
    submittedBy: "seller-aceh-aroma",
    submittedAt: "2026-01-15T08:00:00.000Z",
    notes: "UMKM aktif sejak Januari 2026. Semua dokumen lengkap.",
  },
  {
    id: "validation-product-body-oil",
    target: "product",
    targetId: "product-body-oil-nilam",
    status: "rejected",
    submittedBy: "seller-nilam-lestari",
    submittedAt: "2026-06-28T13:20:00.000Z",
    notes: "Ditolak: klaim 'menyembuhkan penyakit kulit' melanggar regulasi BPOM. Perlu revisi deskripsi.",
  },
];

export const articles: Article[] = [
  {
    id: "art-1",
    slug: "meracik-parfum-budget-kecil",
    title: "Meracik Parfum dengan Budget Yang Kecil, Bisa?",
    excerpt: "Temukan rahasia meracik parfum berkualitas premium menggunakan minyak nilam murni sebagai pengikat aroma (fixative) dengan modal yang sangat ekonomis.",
    content: `## Rahasia Meracik Parfum Premium dengan Budget Ekonomis

Minyak nilam (*patchouli oil*) dikenal luas di industri wewangian dunia sebagai **fixative** atau bahan pengikat aroma. Sifatnya yang tidak mudah menguap membuat keharuman parfum bertahan jauh lebih lama. 

Dalam panduan ini, **Muhammad Haikal (Founder Neelam Geutanyo)** membagikan cara meracik parfum berkualitas tinggi dengan budget ekonomis. Anda dapat memulai langkah ini dari rumah sebagai peluang usaha mikro:

### Bahan-Bahan Utama:
1. **Minyak Nilam Aceh (Niloka Pure Patchouli)**: Bertindak sebagai pengikat aroma (*base note*).
2. **Fragrance Oil / Essential Oil (Top & Middle Notes)**: Menentukan aroma utama (misalnya jeruk, mawar, atau kayu manis).
3. **Pelarut Alkohol / Etanol Khusus Parfum**: Untuk melarutkan aroma.
4. **Fixative Booster (Opsional)**: Untuk memperkuat daya pancar aroma.

### Langkah Meracik:
* Campurkan minyak nilam dengan fragrance oil pilihan Anda dengan perbandingan tertentu (biasanya 2-5% minyak nilam dari total konsentrat aroma).
* Tambahkan pelarut alkohol berkualitas secara perlahan sambil terus diaduk.
* Simpan racikan di tempat sejuk dan gelap selama beberapa hari (proses *aging*) untuk menyatukan molekul aroma secara sempurna.

Tonton video lengkapnya untuk mempelajari takaran detail dan tips pemasaran parfum lokal Anda!`,
    author: "Muhammad Haikal",
    authorRole: "Founder Neelam Geutanyo",
    publishedAt: "2026-05-12T10:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    category: "olahan",
    videoUrl: "https://youtu.be/WxyB91h8l-c",
    videoDuration: "14:25",
    readTime: "3 min read",
    tags: ["parfum", "neelam geutanyo", "umkm", "atsiri", "peluang usaha"]
  },
  {
    id: "art-2",
    slug: "nilam-aceh-smart-choice-daily-needs",
    title: "NILAM ACEH: Smart Choice for Your Daily Needs",
    excerpt: "Bagaimana minyak nilam Aceh yang mendunia dapat diintegrasikan ke dalam produk kebutuhan harian seperti sabun, disinfektan, dan kosmetik.",
    content: `## Mengapa Nilam Aceh Menjadi Pilihan Cerdas Kebutuhan Harian?

Minyak nilam Aceh terkenal di pasar global karena memiliki kadar **Patchouli Alcohol (PA)** yang sangat tinggi (sering kali di atas 30-34%). Kualitas ini menjadikannya salah satu minyak atsiri terbaik di dunia.

### Aplikasi Nilam Aceh dalam Kebutuhan Sehari-hari:
* **Sabun Mandi Herbal**: Kandungan antiseptik alami pada nilam membantu membunuh kuman sekaligus melembapkan kulit secara mendalam.
* **Aromaterapi & Diffuser**: Menghirup uap minyak nilam dapat memicu pelepasan hormon serotonin dan dopamin, membantu meredakan stres dan kecemasan.
* **Pembersih Rumah Tangga**: Campuran air hidrosol (sisa kondensasi penyulingan) dapat diolah menjadi pembersih lantai organik yang wangi dan bebas kuman.

Atsiri Research Center (ARC) Universitas Syiah Kuala terus mengembangkan inovasi produk turunan nilam untuk mendorong hilirisasi produk pertanian lokal Aceh agar memiliki nilai jual yang tinggi dan membuka lapangan pekerjaan baru.`,
    author: "ARC USK",
    authorRole: "Atsiri Research Center",
    publishedAt: "2026-06-01T09:30:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600",
    category: "olahan",
    videoUrl: "https://youtu.be/1qJucuC-d1Q",
    videoDuration: "08:12",
    readTime: "4 min read",
    tags: ["arc usk", "atsiri", "produk harian", "inovasi", "aceh"]
  },
  {
    id: "art-3",
    slug: "budidaya-nilam-dari-awal-hingga-suling",
    title: "Panduan Lengkap Budidaya Nilam dari Awal Hingga Penyulingan",
    excerpt: "Pelajari metode menanam nilam yang benar, pemeliharaan tanaman dari hama, hingga teknik penyulingan minyak atsiri bernilai tinggi.",
    content: `## Panduan Praktis Pertanian Nilam Modern

Menanam nilam membutuhkan ketelatenan, namun menawarkan keuntungan ekonomi yang menjanjikan. Berikut adalah rangkuman tahapan budidaya nilam dari penyiapan lahan hingga menghasilkan minyak suling yang jernih:

### 1. Pembibitan & Persiapan Lahan
* Pilih bibit nilam yang unggul dan sehat (bebas dari penyakit layu bakteri).
* Gemburkan tanah dengan pupuk organik dan buat bedengan dengan drainase yang baik karena tanaman nilam sensitif terhadap genangan air.

### 2. Perawatan & Pemupukan
* Lakukan penyiraman rutin terutama di musim kemarau.
* Berikan pemupukan berkala menggunakan pupuk NPK dan pupuk organik ampas nilam untuk merangsang pertumbuhan daun yang lebat.

### 3. Teknik Penyulingan (Distilasi)
* Panen daun nilam pada umur 6-8 bulan ketika kandungan minyaknya maksimal.
* Lakukan pelayuan (bukan dijemur di bawah terik matahari langsung) selama beberapa hari sebelum disuling.
* Gunakan tangki penyulingan stainless steel berkualitas untuk mencegah kontaminasi karat pada minyak atsiri yang dihasilkan.`,
    author: "Tani Mandiri",
    authorRole: "Kelompok Tani Atsiri",
    publishedAt: "2026-04-20T11:15:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600",
    category: "budidaya",
    videoUrl: "https://youtu.be/vpoid8g-4lM",
    videoDuration: "25:40",
    readTime: "6 min read",
    tags: ["budidaya", "penyulingan", "panduan tani", "distilasi"]
  },
  {
    id: "art-4",
    slug: "pemanfaatan-limbah-suling-menjadi-pupuk",
    title: "Pemanfaatan Limbah Suling Nilam Menjadi Pupuk Organik Cair",
    excerpt: "Jangan buang ampas hasil penyulingan nilam! Pelajari cara mengolah limbah padat dan cair nilam menjadi pupuk organik kaya nutrisi.",
    content: `## Zero Waste Farming: Mengubah Limbah Nilam Menjadi Pupuk Premium

Proses penyulingan minyak nilam menyisakan dua jenis limbah: ampas padat (daun/batang rebus) dan limbah cair (air sisa distilasi). Melalui metode *zero waste*, kedua bahan ini dapat diproses menjadi pupuk berkualitas tinggi untuk menyuburkan kembali kebun nilam Anda.

### Pembuatan Pupuk Organik Cair (POC) dari Limbah Cair:
1. Tampung air sisa kondensasi penyulingan yang sudah dingin.
2. Tambahkan bio-aktivator (seperti EM4 Pertanian) dan molase (tetes tebu) sebagai sumber energi mikroba.
3. Fermentasikan campuran dalam wadah tertutup rapat (aerob/anaerob) selama 7-14 hari.
4. Saring POC dan encerkan dengan air bersih sebelum disemprotkan ke tanah atau daun nilam.

### Manfaat Pupuk Organik Cair Nilam:
* Mengembalikan mikroba baik ke dalam tanah.
* Mengandung senyawa organik sisa yang membantu menangkal jamur patogen tanah.
* Mengurangi ketergantungan petani pada pupuk kimia sintetis yang mahal.`,
    author: "Dr. Ir. Rahmat M.Sc",
    authorRole: "Pakar Pertanian Atsiri",
    publishedAt: "2026-05-30T08:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    category: "pupuk",
    videoUrl: "https://youtu.be/Q5LlJb3WEe8",
    videoDuration: "18:30",
    readTime: "5 min read",
    tags: ["pupuk", "pupuk-cair", "zero-waste", "fermentasi", "limbah-nilam"]
  },
  {
    id: "art-5",
    slug: "pemberian-pupuk-npk-ditabur-atau-dikocor",
    title: "Pemberian Pupuk NPK Pada Tanaman Nilam: Ditabur atau Dikocor?",
    excerpt: "Perbandingan metode pengaplikasian pupuk NPK pada nilam untuk penyerapan nutrisi yang optimal dan pencegahan kerusakan akar.",
    content: `## Mana yang Lebih Efektif untuk Tanaman Nilam: Ditabur atau Dikocor?

Pupuk NPK sangat penting untuk menunjang pertumbuhan vegetatif tanaman nilam, khususnya pembentukan daun baru yang kaya akan kelenjar minyak atsiri. Namun, cara pemberian pupuk sangat memengaruhi efektivitas penyerapan nutrisi.

### Metode Ditabur (Dry Application):
* **Cara**: Pupuk ditaburkan secara melingkar di sekeliling tajuk tanaman, lalu ditutup tipis dengan tanah.
* **Kelebihan**: Praktis, cepat pengerjaannya untuk lahan yang sangat luas.
* **Kekurangan**: Tergantung pada kelembapan tanah; jika cuaca terlalu kering, pupuk sulit larut dan menguap sia-sia.

### Metode Dikocor (Liquid Application):
* **Cara**: Pupuk NPK dilarutkan terlebih dahulu di dalam air (misalnya 1-2 sendok makan per 10 liter air) kemudian disiramkan langsung ke pangkal tanaman.
* **Kelebihan**: Nutrisi langsung larut dan siap diserap oleh akar nilam secara instan. Sangat cocok diterapkan pada musim kemarau.
* **Kekurangan**: Membutuhkan lebih banyak tenaga kerja dan air bersih.

Simak video untuk melihat panduan perbandingan dosis dan demonstrasi penerapannya secara langsung di lapangan!`,
    author: "Agro Atsiri Channel",
    authorRole: "Edukator Tani",
    publishedAt: "2026-06-15T14:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "budidaya",
    videoUrl: "https://youtu.be/Y5sQCAdh26U",
    videoDuration: "10:45",
    readTime: "3 min read",
    tags: ["pupuk-npk", "pemupukan", "nutrisi", "tips-tani"]
  },
  {
    id: "art-6",
    slug: "kapan-pupuk-pertama-buat-nilam",
    title: "Kapan Pupuk Pertama Buat Nilam & Jenis Pupuk Terbaik",
    excerpt: "Menentukan waktu krusial pemupukan pertama tanaman nilam pasca tanam dan rekomendasi jenis pupuk agar bibit tumbuh cepat.",
    content: `## Menentukan Fase Emas Pemupukan Awal Tanaman Nilam

Banyak petani pemula melakukan kesalahan dengan langsung memberikan pupuk kimia dosis tinggi sesaat setelah bibit nilam dipindahkan ke lahan. Hal ini justru berisiko membuat akar bibit terbakar dan layu.

### Waktu Terbaik Pemupukan Pertama:
* Lakukan pemupukan pertama setelah tanaman berumur **14-21 hari setelah tanam (HST)**.
* Pastikan bibit sudah menunjukkan tanda-tanda adaptasi, seperti munculnya kuncup daun baru dan akar mulai mencengkeram tanah dengan kuat.

### Pilihan Pupuk Fase Awal:
* **Pupuk Organik Padat (Kompos Ampas Nilam)**: Berikan sebagai pupuk dasar di sekitar tanaman untuk memperbaiki struktur mikroba tanah.
* **Pupuk Nitrogen Tinggi (Urea / NPK)**: Diberikan dengan dosis sangat ringan secara dikocor untuk memicu pertumbuhan tunas dan daun hijau.

Ikuti petunjuk praktis ini agar tanaman nilam Anda tidak stres dan tumbuh seragam di seluruh area kebun.`,
    author: "Penyuluh Tani Aceh",
    authorRole: "Dinas Pertanian",
    publishedAt: "2026-03-10T10:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600",
    category: "budidaya",
    videoUrl: "https://youtu.be/chE8XciUqJI",
    videoDuration: "12:15",
    readTime: "4 min read",
    tags: ["pemupukan-awal", "pupuk-organik", "tunas-nilam", "fase-vegetatif"]
  },
  {
    id: "art-7",
    slug: "rahasia-agar-nilam-subur-lebat",
    title: "Rahasia Agar Tanaman Nilam Tumbuh Subur dan Daun Lebat",
    excerpt: "Tips dan trik dari petani berpengalaman untuk mengoptimalkan rimbunnya daun nilam yang menjadi kunci utama tingginya produksi minyak.",
    content: `## Kunci Sukses Daun Nilam Rimbun & Kaya Kandungan Minyak

Dalam budidaya nilam, target utama kita adalah menghasilkan **biomassa daun yang lebat** karena di sinilah kelenjar minyak atsiri (*glandular trichomes*) terbentuk. Berikut rahasia perawatan agar daun nilam tumbuh subur:

### Trik Praktis Perawatan Daun:
1. **Pemangkasan Pucuk (Pruning)**: Pangkas pucuk tanaman nilam pada umur 2-3 bulan untuk merangsang percabangan lateral. Semakin banyak cabang, semakin banyak daun yang dihasilkan.
2. **Pemberian Asam Humat & Asam Amino**: Tambahkan nutrisi organik ini secara berkala untuk mempermudah akar menyerap pupuk utama.
3. **Pengendalian Hama Ulat Daun**: Gunakan pestisida nabati secara rutin guna mencegah daun berlubang atau rontok akibat serangan hama ulat grayak.

Penerapan tips ini secara konsisten terbukti dapat meningkatkan rendemen minyak sulingan hingga 20-30% lebih tinggi per ton bahan baku.`,
    author: "Pak Sugeng",
    authorRole: "Petani Nilam Senior",
    publishedAt: "2026-06-25T16:30:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600",
    category: "budidaya",
    videoUrl: "https://youtu.be/3iRdwMYPr3c",
    videoDuration: "15:50",
    readTime: "4 min read",
    tags: ["daun-lebat", "tips-petani", "pruning", "hama-ulat", "rendemen-tinggi"]
  },
  {
    id: "art-8",
    slug: "briket-ampas-nilam-energi-alternatif",
    title: "Mengubah Ampas Nilam Menjadi Briket Energi Alternatif",
    excerpt: "Teknik memproses sisa limbah padat batang dan daun nilam menjadi briket bahan bakar padat berdaya kalori tinggi untuk kebutuhan industri rumah tangga.",
    content: `## Biobriket Ampas Nilam: Mengubah Limbah Menjadi Sumber Energi Terbarukan

Penyulingan nilam menyisakan limbah padat berupa ampas daun dan batang dalam jumlah yang sangat melimpah. Jika dibiarkan menumpuk, limbah ini dapat menimbulkan bau kurang sedap. Salah satu solusi tercerdas adalah mengolahnya menjadi **biobriket**.

### Keunggulan Briket Ampas Nilam:
* **Ramah Lingkungan**: Mengurangi emisi gas rumah kaca dibanding batubara atau kayu bakar konvensional.
* **Kalori Tinggi**: Mengandung sisa minyak atsiri dan selulosa rapat yang menghasilkan panas stabil dan tahan lama.
* **Nilai Ekonomis**: Dapat dijual kembali sebagai bahan bakar alternatif untuk industri batu bata, tahu, atau pemanas kandang ayam.

### Cara Pembuatan Sederhana:
1. **Pengeringan**: Jemur ampas padat nilam sisa suling hingga kadar air di bawah 15%.
2. **Pengarangan (Karbonisasi)**: Bakar ampas dalam wadah tertutup (drum pirolisis) hingga menjadi arang.
3. **Penghancuran & Pencampuran**: Giling arang ampas nilam hingga halus, lalu campurkan dengan perekat tepung kanji/tapioka (rasio 10:1).
4. **Pencetakan & Pengeringan Akhir**: Cetak adonan arang dengan alat cetak manual atau hidrolik, kemudian keringkan briket di bawah sinar matahari hingga mengeras sempurna.

Biobriket ini siap digunakan sebagai bahan bakar bersih dengan aroma khas nilam yang menenangkan.`,
    author: "Ir. Hendra Saputra",
    authorRole: "Peneliti Biomassa Energi",
    publishedAt: "2026-06-29T10:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&q=80&w=600",
    category: "energi",
    readTime: "5 min read",
    tags: ["briket", "biomassa", "energi-terbarukan", "pengarangan", "limbah-padat"]
  },
  {
    id: "art-9",
    slug: "hidrosol-pestisida-nabati",
    title: "Cara Mengolah Air Hidrosol Sisa Penyulingan Nilam Menjadi Pestisida Nabati",
    excerpt: "Air sisa hasil kondensasi penyulingan nilam (air hidrosol) ternyata mengandung senyawa aktif anti-serangga. Pelajari cara membuatnya di sini.",
    content: `## Memanfaatkan Air Hidrosol Nilam sebagai Pelindung Tanaman Organik

Saat menyuling nilam dengan metode uap-air, diperoleh dua fraksi cair: minyak nilam murni di lapisan atas, dan **air hidrosol (air bunga nilam)** di lapisan bawah. Seringkali air hidrosol ini dibuang begitu saja ke saluran air, padahal menyimpan manfaat luar biasa sebagai pestisida nabati.

### Senyawa Aktif dalam Hidrosol Nilam:
Meskipun minyak nilam utama telah terpisah, air hidrosol masih mengandung molekul terpenoid dan fenolik terlarut mikro yang bersifat anti-feedant (tidak disukai serangga) dan anti-fungal (mencegah jamur).

### Cara Mengaplikasikannya pada Tanaman:
1. **Penyaringan**: Saring air hidrosol dari sisa-sisa jelaga atau kotoran fisik penyulingan.
2. **Pencampuran Booster**: Campurkan 1 liter air hidrosol dengan 5 ml sabun cair pencuci piring organik (berfungsi sebagai *surfactant* atau perekat agar pestisida menempel di permukaan daun).
3. **Penyemprotan**: Semprotkan cairan langsung ke seluruh bagian daun dan batang tanaman nilam atau sayuran lain pada pagi atau sore hari.

### Hama yang Dapat Dikendalikan:
* Kutu kebul dan kutu daun (*Aphids*)
* Ulat daun skala kecil
* Mencegah infeksi jamur karat daun (*Puccinia*) pada tanaman hias dan sayuran.`,
    author: "Koperasi Nilam Lestari",
    authorRole: "Tim Litbang",
    publishedAt: "2026-07-03T09:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600",
    category: "olahan",
    readTime: "4 min read",
    tags: ["hidrosol", "pestisida-nabati", "organik", "hama-tanaman"]
  },
  {
    id: "art-10",
    slug: "pupuk-kompos-nilam",
    title: "Panduan Pembuatan Pupuk Kompos Organik dari Daun dan Batang Nilam",
    excerpt: "Mengubah ampas nilam yang melimpah menjadi pupuk kompos organik gembur yang kaya unsur hara makro untuk memperbaiki kesuburan tanah perkebunan.",
    content: `## Menghidupkan Kembali Tanah Kebun dengan Kompos Ampas Nilam

Tanaman nilam mengambil banyak unsur hara dari dalam tanah selama siklus pertumbuhannya. Mengembalikan ampas nilam yang telah didekomposisi (dikomposkan) ke kebun adalah langkah terbaik untuk menjaga kelestarian unsur hara tanah.

### Mengapa Ampas Nilam Baik untuk Kompos?
Ampas penyulingan nilam memiliki rasio C/N yang ideal setelah melalui pemanasan suhu tinggi saat distilasi. Pemanasan ini secara tidak langsung mensterilkan limbah dari biji gulma dan bakteri jahat pembawa penyakit layu.

### Tahapan Pembuatan Kompos Padat:
1. **Pengumpulan**: Kumpulkan ampas nilam basah dari bak suling, biarkan suhunya mendingin.
2. **Pencampuran Bahan**: Campurkan ampas nilam dengan kotoran ternak (sapi/kambing) dengan perbandingan 3:1. Tambahkan sekam padi atau serbuk gergaji untuk memperbaiki aerasi kompos.
3. **Inokulasi**: Larutkan starter kompos (seperti EM4) ke dalam air gula, lalu siramkan secara merata ke tumpukan bahan hingga kelembapan mencapai sekitar 50-60%.
4. **Pemeraman**: Tutup tumpukan dengan terpal. Lakukan pembalikan kompos seminggu sekali untuk menyuplai oksigen.
5. **Pematangan**: Dalam waktu 3-4 minggu, kompos akan matang ditandai dengan warna cokelat kehitaman, tekstur gembur mirip tanah, dan tidak berbau menyengat.

Aplikasikan kompos gembur ini sebanyak 1-2 kg per lubang tanam saat penyiapan lahan nilam baru!`,
    author: "Bakti Tani Lestari",
    authorRole: "Yayasan Pemberdayaan Petani",
    publishedAt: "2026-06-20T11:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600",
    category: "pupuk",
    readTime: "5 min read",
    tags: ["kompos", "pupuk-organik", "mikroba", "kesuburan-tanah"]
  },
  {
    id: "art-11",
    slug: "media-tanam-jamur-ampas-nilam",
    title: "Pemanfaatan Ampas Nilam sebagai Media Tanam Jamur Tiram yang Bernilai Ekonomis",
    excerpt: "Ampas nilam kering ternyata menjadi media pertumbuhan yang sangat disukai jamur tiram. Pelajari cara pembuatan baglog jamur dari ampas nilam.",
    content: `## Peluang Usaha Baru: Budidaya Jamur Tiram Berbasis Limbah Atsiri

Salah satu pemanfaatan limbah padat nilam yang memiliki nilai ekonomi tinggi secara instan adalah menjadikannya bahan campuran media tanam (baglog) **jamur tiram putih**. Kandungan lignoselulosa yang tinggi dalam ampas batang nilam sangat cocok sebagai nutrisi pertumbuhan miselium jamur.

### Komposisi Formula Baglog Jamur:
* Ampas nilam kering (telah dihaluskan): 60%
* Serbuk gergaji kayu sengon/albasia: 20%
* Dedak halus (bekatul) sebagai nutrisi tambahan: 15%
* Kapur pertanian (CaCO3) untuk menjaga pH: 3%
* Gips: 2%

### Cara Pengolahan:
1. **Pencampuran & Pengomposan Singkat**: Campur semua bahan di atas dengan air hingga basah merata (kadar air 60%), lalu diamkan selama 2-3 hari agar bahan melunak.
2. **Pengisian Baglog**: Masukkan adonan ke dalam plastik polipropilen (PP), padatkan, lalu pasang cincin plastik pada leher kantong.
3. **Sterilisasi**: Kukus baglog dalam drum pemanas bersuhu 90-100 derajat Celcius selama 6-8 jam untuk mematikan spora jamur liar.
4. **Inokulasi**: Setelah dingin, masukkan bibit jamur tiram berkualitas dalam ruangan steril.
5. **Inkubasi**: Letakkan baglog di kubung jamur yang sejuk dan lembap hingga miselium putih tumbuh merata.

Miselium jamur tumbuh subur pada media ampas nilam karena struktur serat selulosa yang telah melunak akibat proses perebusan penyulingan sebelumnya. Jamur tiram yang dihasilkan pun memiliki ukuran tudung yang tebal dan bobot yang mantap!`,
    author: "Rian Hidayat",
    authorRole: "Pengusaha Jamur & Alumni ARC",
    publishedAt: "2026-07-05T13:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600",
    category: "olahan",
    readTime: "5 min read",
    tags: ["jamur-tiram", "baglog", "peluang-bisnis", "selulosa", "limbah-padat"]
  },
  {
    id: "art-12",
    slug: "zero-waste-pakan-ternak",
    title: "Zero Waste Atsiri: Mengintegrasikan Limbah Nilam dengan Pakan Ternak Koperasi",
    excerpt: "Bagaimana koperasi tani di Aceh menyiasati tingginya biaya pakan ternak sapi dengan memanfaatkan fermentasi silase ampas daun nilam.",
    content: `## Inovasi Pakan Ternak Murah Berbasis Fermentasi Ampas Nilam

Konsep pertanian sirkular (*circular farming*) menyatukan sub-sektor perkebunan nilam dengan peternakan sapi/kambing dalam satu siklus tanpa limbah. Koperasi tani di Gayo Lues dan Aceh Jaya kini berhasil menghemat biaya pakan hingga 40% melalui integrasi ini.

### Daun Nilam untuk Pakan Ternak:
Daun nilam sisa penyulingan masih mengandung protein kasar dan serat yang baik untuk pencernaan hewan pemamah biak. Namun, karena aromanya yang menyengat karena sisa minyak atsiri, hewan ternak sering kali enggan memakannya secara langsung.

### Solusinya: Pembuatan Silase Fermentasi
Melalui proses silase (fermentasi anaerob), sisa senyawa atsiri yang tajam didegradasi menjadi senyawa organik berbau asam manis yang sangat disukai ternak.

### Cara Pembuatan Silase Ampas Nilam:
1. Angin-anginkan ampas daun nilam agar kadar airnya menurun menjadi sekitar 60%.
2. Campurkan ampas dengan bahan sumber energi karbohidrat cepat, seperti dedak padi atau konsentrat jagung (5-10% dari total bahan).
3. Semprotkan larutan probiotik ternak dan tetes tebu secara merata.
4. Masukkan bahan campuran ke dalam tong plastik silase, padatkan hingga tidak ada rongga udara tersisa, lalu tutup rapat.
5. Diamkan selama 14-21 hari. Pakan silase siap disajikan dan tahan disimpan hingga berbulan-bulan.

### Siklus Berkelanjutan:
Kotoran sapi dari peternakan ini nantinya dikumpulkan dan diolah kembali di unit biogas atau dikomposkan untuk memupuk kebun nilam. Siklus tertutup inilah yang mewujudkan pertanian berkelanjutan sesungguhnya!`,
    author: "Drh. Fahmi Rizal",
    authorRole: "Pakar Peternakan Sirkular",
    publishedAt: "2026-07-06T15:00:00.000Z",
    imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    category: "pupuk",
    readTime: "6 min read",
    tags: ["pakan-ternak", "silase", "sirkular", "koperasi-tani", "fermentasi"]
  }
];
