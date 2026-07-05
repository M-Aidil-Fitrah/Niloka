import type {
  AdminValidationItem,
  AmpasListing,
  AromaMatchQuestion,
  AromaMatchRecommendation,
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
} from "@/lib/contracts";

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
];

export const nilamPassports: NilamPassport[] = [
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
  },
];

export const reviews: Review[] = [
  {
    id: "review-roll-on-001",
    productId: "product-roll-on-relief",
    sellerId: "seller-aceh-aroma",
    authorName: "Maya Putri",
    rating: 5,
    tags: ["authentic-aroma", "clear-passport", "good-packaging"],
    body: "Aromanya earthy dan tidak menusuk, informasi passport juga jelas.",
    createdAt: "2026-06-11T10:00:00.000Z",
  },
  {
    id: "review-essential-oil-001",
    productId: "product-essential-oil-aceh",
    sellerId: "seller-nilam-lestari",
    authorName: "Raka Pratama",
    rating: 5,
    tags: ["authentic-aroma", "repeat-order"],
    body: "Blend diffuser jadi lebih hangat dan tahan lama.",
    createdAt: "2026-06-13T10:00:00.000Z",
  },
];

export const promos: Promo[] = [
  {
    id: "promo-aroma-week",
    sellerId: "seller-aceh-aroma",
    title: "Aroma Week 10%",
    type: "percentage",
    value: 10,
    startsAt: "2026-07-01T00:00:00.000Z",
    endsAt: "2026-07-15T23:59:59.000Z",
    productIds: ["product-roll-on-relief", "product-artisan-soap"],
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
    status: "draft",
    items: cartItems,
    subtotal: idr(269000),
    platformFee: idr(9400),
    shippingEstimate: idr(28000),
    grandTotal: idr(306400),
  },
];

export const aromaMatchQuestions: AromaMatchQuestion[] = [
  {
    id: "aroma-purpose",
    step: 1,
    prompt: "Apa tujuan utama penggunaan produk nilam?",
    kind: "single-choice",
    options: [
      {
        id: "relax",
        label: "Relaksasi",
        productFunctions: ["relaxation", "sleep-support"],
      },
      {
        id: "room",
        label: "Aroma ruangan",
        productFunctions: ["home-fragrance", "focus"],
      },
    ],
  },
  {
    id: "aroma-form",
    step: 2,
    prompt: "Bentuk produk yang kamu sukai?",
    kind: "single-choice",
    options: [
      {
        id: "roll-on",
        label: "Roll-on",
        productFunctions: ["relaxation"],
      },
      {
        id: "diffuser",
        label: "Diffuser",
        productFunctions: ["home-fragrance"],
      },
    ],
  },
];

export const aromaMatchRecommendations: AromaMatchRecommendation[] = [
  {
    id: "recommend-roll-on-relief",
    productId: "product-roll-on-relief",
    score: 96,
    reason: "Cocok untuk pengguna yang mencari relaksasi ringan dan format praktis.",
    matchedTags: ["best-seller", "nilam-passport"],
  },
  {
    id: "recommend-diffuser-blend",
    productId: "product-diffuser-blend",
    score: 88,
    reason: "Aroma calm dan fungsi home fragrance cocok untuk ruang kerja.",
    matchedTags: ["aroma-calm"],
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
];
