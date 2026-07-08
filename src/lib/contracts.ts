export type CurrencyCode = "IDR";

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type MarketplaceLocation = {
  province: string;
  city: string;
  district: string;
};

export type SellerId = string;
export type ProductCategoryId = string;
export type ProductId = string;
export type NilamPassportId = string;
export type AmpasListingId = string;
export type ReviewId = string;
export type PromoId = string;
export type BundleId = string;
export type CartItemId = string;
export type OrderId = string;
export type AdminValidationItemId = string;

export type SellerType = "umkm" | "distiller" | "cooperative";
export type SellerVerificationStatus = "pending" | "verified" | "rejected";

export type ProductTargetMarket = "b2c" | "b2b";
export type ProductStatus = "draft" | "published" | "archived";
export type ProductForm =
  | "essential-oil"
  | "roll-on"
  | "soap"
  | "diffuser"
  | "perfume"
  | "body-oil"
  | "bundle";
export type ProductFunction =
  | "relaxation"
  | "focus"
  | "sleep-support"
  | "skin-care"
  | "home-fragrance"
  | "gift";
export type ProductTag =
  | "best-seller"
  | "new-arrival"
  | "nilam-passport"
  | "aroma-calm"
  | "limited-batch";

export type PassportValidationStatus = "draft" | "pending-review" | "validated";

export type AmpasCondition = "wet" | "dry" | "mixed";
export type AmpasUsageTag =
  | "compost"
  | "briquette"
  | "mushroom-media"
  | "mulch"
  | "animal-feed"
  | "industrial-cellulose";
export type AmpasListingStatus = "draft" | "active" | "sold" | "archived";

export type ReviewTag =
  | "authentic-aroma"
  | "fast-delivery"
  | "clear-passport"
  | "good-packaging"
  | "repeat-order";

export type PromoType = "percentage" | "fixed-amount" | "free-shipping";
export type PromoStatus = "active" | "scheduled" | "expired" | "disabled";
export type BundleType = "single-seller" | "cross-seller";

export type CartItemKind = "product" | "ampas-listing";
export type OrderStatus = "draft" | "pending-payment" | "paid" | "fulfilled";

export type AdminValidationTarget = "seller" | "product" | "nilam-passport";
export type AdminValidationStatus = "queued" | "approved" | "rejected";

export type Seller = {
  id: SellerId;
  slug: string;
  displayName: string;
  type: SellerType;
  location: MarketplaceLocation;
  verificationStatus: SellerVerificationStatus;
  joinedAt: string;
  ratingAverage: number;
  totalReviews: number;
  contactChannel: string;
};

export type ProductCategory = {
  id: ProductCategoryId;
  slug: string;
  name: string;
  description: string;
  targetMarket: ProductTargetMarket;
  image: ImageAsset;
};

export type Product = {
  id: ProductId;
  slug: string;
  sellerId: SellerId;
  categoryId: ProductCategoryId;
  passportId: NilamPassportId;
  name: string;
  shortDescription: string;
  form: ProductForm;
  functions: ProductFunction[];
  tags: ProductTag[];
  price: Money;
  originalPrice?: Money;
  stock: number;
  status: ProductStatus;
  image: ImageAsset;
  gallery: ImageAsset[];
  featuredRank: number;
  createdAt: string;
  updatedAt: string;
};

export type NilamPassport = {
  id: NilamPassportId;
  productId: ProductId;
  origin: string;
  productKind: ProductForm;
  aromaProfile: string[];
  functions: ProductFunction[];
  usage: string;
  safetyNotes: string;
  validationStatus: PassportValidationStatus;
  validatedBy: string;
  validatedAt: string;
  batchCode?: string;
  farmerGroup?: string;
  gpsCoordinates?: string;
};

export type AmpasListing = {
  id: AmpasListingId;
  slug: string;
  sellerId: SellerId;
  condition: AmpasCondition;
  quantityKg: number;
  pricePerKg: Money;
  location: MarketplaceLocation;
  distillationProcess: string;
  usageTags: AmpasUsageTag[];
  status: AmpasListingStatus;
  image: ImageAsset;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
  distillationDate?: string;
  shippingOption?: "self-pickup" | "cargo" | "both";
  wholesaleEnabled?: boolean;
  wholesaleMinQtyKg?: number;
  wholesalePricePerKg?: Money;
};

export type Review = {
  id: ReviewId;
  productId: ProductId;
  sellerId: SellerId;
  authorName: string;
  rating: number;
  tags: ReviewTag[];
  body: string;
  createdAt: string;
};

export type Promo = {
  id: PromoId;
  sellerId: SellerId;
  title: string;
  code: string;
  status: PromoStatus;
  type: PromoType;
  value: number;
  startsAt: string;
  endsAt: string;
  minSubtotal: Money;
  usageLimit: number;
  usedCount: number;
  productIds: ProductId[];
};

export type PromoValidationStatus =
  | "valid"
  | "empty"
  | "not-found"
  | "scheduled"
  | "expired"
  | "disabled"
  | "usage-limit-reached"
  | "minimum-subtotal-not-met"
  | "no-eligible-items";

export type PromoValidationResult = {
  status: PromoValidationStatus;
  promo: Promo | null;
  discountAmount: number;
  eligibleSubtotal: number;
  message: string;
};

export type Bundle = {
  id: BundleId;
  slug: string;
  title: string;
  type: BundleType;
  productIds: ProductId[];
  price: Money;
  description: string;
};

export type CartItem = {
  id: CartItemId;
  kind: CartItemKind;
  productId: ProductId | null;
  ampasListingId: AmpasListingId | null;
  quantity: number;
  unitPrice: Money;
};

export type OrderSummary = {
  id: OrderId;
  status: OrderStatus;
  items: CartItem[];
  subtotal: Money;
  platformFee: Money;
  shippingEstimate: Money;
  grandTotal: Money;
};

export type AdminValidationItem = {
  id: AdminValidationItemId;
  target: AdminValidationTarget;
  targetId: string;
  status: AdminValidationStatus;
  submittedBy: SellerId;
  submittedAt: string;
  notes: string;
};

export type AiProvider = "gemini" | "groq" | "mock";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatProductSuggestion = {
  productId: ProductId;
  name: string;
  price: Money;
  href: string;
  reason: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatResponse = {
  answerMarkdown: string;
  providerUsed: AiProvider;
  suggestions: ChatProductSuggestion[];
  refused: boolean;
};

export type ProductDescriptionTone = "premium" | "educational" | "concise";

export type ProductDescriptionRequest = {
  productName: string;
  form: ProductForm;
  origin: string;
  aromaProfile: string;
  functions: ProductFunction[];
  safetyNotes: string;
  targetAudience: string;
  tone: ProductDescriptionTone;
};

export type PassportDraftSuggestion = {
  origin: string;
  aromaProfile: string[];
  functions: ProductFunction[];
  usage: string;
  safetyNotes: string;
};

export type ProductDescriptionResponse = {
  providerUsed: AiProvider;
  shortDescription: string;
  fullDescriptionMarkdown: string;
  suggestedTags: ProductTag[];
  suggestedFunctions: ProductFunction[];
  passportDraftSuggestion: PassportDraftSuggestion;
  safetyNotice: string;
  missingFields: string[];
};

export type ArticleCategory = "pupuk" | "energi" | "budidaya" | "olahan";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown format
  author: string;
  authorRole?: string;
  publishedAt: string;
  imageUrl: string;
  category: ArticleCategory;
  videoUrl?: string; // YouTube video URL
  videoDuration?: string;
  readTime: string;
  tags: string[];
};

