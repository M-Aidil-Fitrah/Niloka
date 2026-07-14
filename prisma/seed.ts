import bcrypt from "bcryptjs";
import {
  adminValidationItems,
  ampasListings,
  articles,
  bundles,
  cartItems,
  nilamPassports,
  orderSummaries,
  productCategories,
  products,
  promos,
  reviews,
  sellers,
} from "./fixtures";
import type {
  AdminValidationStatus as ContractAdminValidationStatus,
  AdminValidationTarget as ContractAdminValidationTarget,
  AmpasCondition as ContractAmpasCondition,
  AmpasListingStatus as ContractAmpasListingStatus,
  AmpasUsageTag as ContractAmpasUsageTag,
  ArticleCategory as ContractArticleCategory,
  BundleType as ContractBundleType,
  CartItemKind as ContractCartItemKind,
  OrderStatus as ContractOrderStatus,
  PassportValidationStatus as ContractPassportValidationStatus,
  ProductForm as ContractProductForm,
  ProductFunction as ContractProductFunction,
  ProductStatus as ContractProductStatus,
  ProductTag as ContractProductTag,
  ProductTargetMarket as ContractProductTargetMarket,
  PromoStatus as ContractPromoStatus,
  PromoType as ContractPromoType,
  ReviewTag as ContractReviewTag,
  SellerType as ContractSellerType,
  SellerVerificationStatus as ContractSellerVerificationStatus,
} from "../src/lib/contracts";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdminValidationStatus,
  AdminValidationTarget,
  AmpasCondition,
  AmpasListingStatus,
  AmpasUsageTag,
  ArticleCategory,
  BundleType,
  CartItemKind,
  OrderFulfillmentStatus,
  OrderStatus,
  PassportValidationStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  ProductForm,
  ProductFunction,
  ProductStatus,
  ProductTag,
  ProductTargetMarket,
  PromoStatus,
  PromoType,
  ReviewTag,
  SellerType,
  SellerVerificationStatus,
  UserRole,
} from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed NILOKA.");
}

const destructiveSeedAllowed =
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  process.env.ALLOW_DESTRUCTIVE_SEED === "true";

if (!destructiveSeedAllowed) {
  throw new Error(
    "Refusing to run destructive demo seed outside localhost. Set ALLOW_DESTRUCTIVE_SEED=true if you intentionally want this.",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function toSellerType(value: ContractSellerType): SellerType {
  switch (value) {
    case "umkm":
      return SellerType.UMKM;
    case "distiller":
      return SellerType.DISTILLER;
    case "cooperative":
      return SellerType.COOPERATIVE;
  }
}

function toSellerVerificationStatus(
  value: ContractSellerVerificationStatus,
): SellerVerificationStatus {
  switch (value) {
    case "pending":
      return SellerVerificationStatus.PENDING;
    case "verified":
      return SellerVerificationStatus.VERIFIED;
    case "rejected":
      return SellerVerificationStatus.REJECTED;
  }
}

function toProductTargetMarket(
  value: ContractProductTargetMarket,
): ProductTargetMarket {
  switch (value) {
    case "b2c":
      return ProductTargetMarket.B2C;
    case "b2b":
      return ProductTargetMarket.B2B;
  }
}

function toProductStatus(value: ContractProductStatus): ProductStatus {
  switch (value) {
    case "draft":
      return ProductStatus.DRAFT;
    case "published":
      return ProductStatus.PUBLISHED;
    case "archived":
      return ProductStatus.ARCHIVED;
  }
}

function toProductForm(value: ContractProductForm): ProductForm {
  switch (value) {
    case "essential-oil":
      return ProductForm.ESSENTIAL_OIL;
    case "roll-on":
      return ProductForm.ROLL_ON;
    case "soap":
      return ProductForm.SOAP;
    case "diffuser":
      return ProductForm.DIFFUSER;
    case "perfume":
      return ProductForm.PERFUME;
    case "body-oil":
      return ProductForm.BODY_OIL;
    case "bundle":
      return ProductForm.BUNDLE;
  }
}

function toProductFunction(value: ContractProductFunction): ProductFunction {
  switch (value) {
    case "relaxation":
      return ProductFunction.RELAXATION;
    case "focus":
      return ProductFunction.FOCUS;
    case "sleep-support":
      return ProductFunction.SLEEP_SUPPORT;
    case "skin-care":
      return ProductFunction.SKIN_CARE;
    case "home-fragrance":
      return ProductFunction.HOME_FRAGRANCE;
    case "gift":
      return ProductFunction.GIFT;
  }
}

function toProductTag(value: ContractProductTag): ProductTag {
  switch (value) {
    case "best-seller":
      return ProductTag.BEST_SELLER;
    case "new-arrival":
      return ProductTag.NEW_ARRIVAL;
    case "nilam-passport":
      return ProductTag.NILAM_PASSPORT;
    case "aroma-calm":
      return ProductTag.AROMA_CALM;
    case "limited-batch":
      return ProductTag.LIMITED_BATCH;
  }
}

function toPassportValidationStatus(
  value: ContractPassportValidationStatus,
): PassportValidationStatus {
  switch (value) {
    case "draft":
      return PassportValidationStatus.DRAFT;
    case "pending-review":
      return PassportValidationStatus.PENDING_REVIEW;
    case "validated":
      return PassportValidationStatus.VALIDATED;
  }
}

function toAmpasCondition(value: ContractAmpasCondition): AmpasCondition {
  switch (value) {
    case "wet":
      return AmpasCondition.WET;
    case "dry":
      return AmpasCondition.DRY;
    case "mixed":
      return AmpasCondition.MIXED;
  }
}

function toAmpasUsageTag(value: ContractAmpasUsageTag): AmpasUsageTag {
  switch (value) {
    case "compost":
      return AmpasUsageTag.COMPOST;
    case "briquette":
      return AmpasUsageTag.BRIQUETTE;
    case "mushroom-media":
      return AmpasUsageTag.MUSHROOM_MEDIA;
    case "mulch":
      return AmpasUsageTag.MULCH;
    case "animal-feed":
      return AmpasUsageTag.ANIMAL_FEED;
    case "industrial-cellulose":
      return AmpasUsageTag.INDUSTRIAL_CELLULOSE;
  }
}

function toAmpasListingStatus(
  value: ContractAmpasListingStatus,
): AmpasListingStatus {
  switch (value) {
    case "draft":
      return AmpasListingStatus.DRAFT;
    case "active":
      return AmpasListingStatus.ACTIVE;
    case "sold":
      return AmpasListingStatus.SOLD;
    case "archived":
      return AmpasListingStatus.ARCHIVED;
  }
}

function toReviewTag(value: ContractReviewTag): ReviewTag {
  switch (value) {
    case "authentic-aroma":
      return ReviewTag.AUTHENTIC_AROMA;
    case "fast-delivery":
      return ReviewTag.FAST_DELIVERY;
    case "clear-passport":
      return ReviewTag.CLEAR_PASSPORT;
    case "good-packaging":
      return ReviewTag.GOOD_PACKAGING;
    case "repeat-order":
      return ReviewTag.REPEAT_ORDER;
  }
}

function toPromoStatus(value: ContractPromoStatus): PromoStatus {
  switch (value) {
    case "active":
      return PromoStatus.ACTIVE;
    case "scheduled":
      return PromoStatus.SCHEDULED;
    case "expired":
      return PromoStatus.EXPIRED;
    case "disabled":
      return PromoStatus.DISABLED;
  }
}

function toPromoType(value: ContractPromoType): PromoType {
  switch (value) {
    case "percentage":
      return PromoType.PERCENTAGE;
    case "fixed-amount":
      return PromoType.FIXED_AMOUNT;
    case "free-shipping":
      return PromoType.FREE_SHIPPING;
  }
}

function toBundleType(value: ContractBundleType): BundleType {
  switch (value) {
    case "single-seller":
      return BundleType.SINGLE_SELLER;
    case "cross-seller":
      return BundleType.CROSS_SELLER;
  }
}

function toCartItemKind(value: ContractCartItemKind): CartItemKind {
  switch (value) {
    case "product":
      return CartItemKind.PRODUCT;
    case "ampas-listing":
      return CartItemKind.AMPAS_LISTING;
  }
}

function toOrderStatus(value: ContractOrderStatus): OrderStatus {
  switch (value) {
    case "draft":
      return OrderStatus.DRAFT;
    case "pending-payment":
      return OrderStatus.PENDING_PAYMENT;
    case "paid":
      return OrderStatus.PAID;
    case "fulfilled":
      return OrderStatus.FULFILLED;
  }
}

function getOrderItemSellerId(item: {
  kind: ContractCartItemKind;
  productId: string | null;
  ampasListingId: string | null;
}): string {
  if (item.kind === "product" && item.productId) {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product?.sellerId ?? "seller-aceh-aroma";
  }

  if (item.kind === "ampas-listing" && item.ampasListingId) {
    const listing = ampasListings.find(
      (candidate) => candidate.id === item.ampasListingId,
    );
    return listing?.sellerId ?? "seller-koperasi-lestari";
  }

  return "seller-aceh-aroma";
}

function getFulfillmentStatus(
  status: ContractOrderStatus,
): OrderFulfillmentStatus {
  switch (status) {
    case "paid":
      return OrderFulfillmentStatus.READY_TO_PROCESS;
    case "fulfilled":
      return OrderFulfillmentStatus.DELIVERED;
    case "draft":
    case "pending-payment":
      return OrderFulfillmentStatus.PENDING_PAYMENT;
  }
}

function getPaymentStatus(status: ContractOrderStatus): PaymentStatus {
  switch (status) {
    case "paid":
    case "fulfilled":
      return PaymentStatus.PAID;
    case "draft":
    case "pending-payment":
      return PaymentStatus.PENDING;
  }
}

function getMidtransTransactionStatus(status: ContractOrderStatus): string {
  switch (status) {
    case "paid":
    case "fulfilled":
      return "settlement";
    case "draft":
    case "pending-payment":
      return "pending";
  }
}

function toAdminValidationTarget(
  value: ContractAdminValidationTarget,
): AdminValidationTarget {
  switch (value) {
    case "seller":
      return AdminValidationTarget.SELLER;
    case "product":
      return AdminValidationTarget.PRODUCT;
    case "nilam-passport":
      return AdminValidationTarget.NILAM_PASSPORT;
    case "ampas-listing":
      return AdminValidationTarget.AMPAS_LISTING;
  }
}

function toAdminValidationStatus(
  value: ContractAdminValidationStatus,
): AdminValidationStatus {
  switch (value) {
    case "queued":
      return AdminValidationStatus.QUEUED;
    case "approved":
      return AdminValidationStatus.APPROVED;
    case "rejected":
      return AdminValidationStatus.REJECTED;
  }
}

function toArticleCategory(value: ContractArticleCategory): ArticleCategory {
  switch (value) {
    case "pupuk":
      return ArticleCategory.PUPUK;
    case "energi":
      return ArticleCategory.ENERGI;
    case "budidaya":
      return ArticleCategory.BUDIDAYA;
    case "olahan":
      return ArticleCategory.OLAHAN;
  }
}

async function clearDemoData() {
  await prisma.communityComment.deleteMany();
  await prisma.communityLike.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.adminValidationItem.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.orderFulfillment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bundleProduct.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.promoProduct.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.ampasListing.deleteMany();
  await prisma.nilamPassport.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.sellerApplication.deleteMany();
  await prisma.user.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.article.deleteMany();
}

async function seedSellers() {
  for (const seller of sellers) {
    await prisma.seller.create({
      data: {
        id: seller.id,
        slug: seller.slug,
        displayName: seller.displayName,
        type: toSellerType(seller.type),
        locationProvince: seller.location.province,
        locationCity: seller.location.city,
        locationDistrict: seller.location.district,
        verificationStatus: toSellerVerificationStatus(
          seller.verificationStatus,
        ),
        joinedAt: new Date(seller.joinedAt),
        ratingAverage: seller.ratingAverage,
        totalReviews: seller.totalReviews,
        contactChannel: seller.contactChannel,
      },
    });
  }
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash("niloka123", 12);

  await prisma.user.createMany({
    data: [
      {
        id: "user-buyer-1",
        name: "Budi Handoko",
        email: "buyer@niloka.com",
        role: UserRole.BUYER,
        passwordHash,
      },
      {
        id: "user-seller-1",
        name: "Ahmad Atsiri (Aceh Aroma House)",
        email: "seller@niloka.com",
        role: UserRole.SELLER,
        passwordHash,
        sellerId: "seller-aceh-aroma",
        locationProvince: "Aceh",
        locationCity: "Aceh Selatan",
        locationDistrict: "Tapaktuan",
      },
      {
        id: "user-admin-1",
        name: "Siti Rahma (Admin)",
        email: "admin@niloka.com",
        role: UserRole.ADMIN,
        passwordHash,
      },
      {
        id: "user-farmer-1",
        name: "Pak Eko (Petani Nilam)",
        email: "farmer@niloka.com",
        role: UserRole.BUYER,
        isFarmer: true,
        passwordHash,
        locationProvince: "Aceh",
        locationCity: "Gayo Lues",
        locationDistrict: "Blangkejeren",
      },
    ],
  });
}

async function seedProducts() {
  for (const category of productCategories) {
    await prisma.productCategory.create({
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        targetMarket: toProductTargetMarket(category.targetMarket),
        imageSrc: category.image.src,
        imageAlt: category.image.alt,
      },
    });
  }

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        sellerId: product.sellerId,
        categoryId: product.categoryId,
        name: product.name,
        shortDescription: product.shortDescription,
        form: toProductForm(product.form),
        functions: product.functions.map(toProductFunction),
        tags: product.tags.map(toProductTag),
        priceAmount: product.price.amount,
        priceCurrency: product.price.currency,
        originalPriceAmount: product.originalPrice?.amount,
        originalPriceCurrency: product.originalPrice?.currency,
        stock: product.stock,
        status: toProductStatus(product.status),
        imageSrc: product.image.src,
        imageAlt: product.image.alt,
        featuredRank: product.featuredRank,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        gallery: {
          create: product.gallery.map((image, index) => ({
            src: image.src,
            alt: image.alt,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

async function seedPassportsAndAmpas() {
  for (const passport of nilamPassports) {
    await prisma.nilamPassport.create({
      data: {
        id: passport.id,
        productId: passport.productId,
        origin: passport.origin,
        productKind: toProductForm(passport.productKind),
        aromaProfile: passport.aromaProfile,
        functions: passport.functions.map(toProductFunction),
        usage: passport.usage,
        safetyNotes: passport.safetyNotes,
        validationStatus: toPassportValidationStatus(passport.validationStatus),
        validatedBy: passport.validatedBy,
        validatedAt: passport.validatedAt
          ? new Date(passport.validatedAt)
          : undefined,
        batchCode: passport.batchCode,
        farmerGroup: passport.farmerGroup,
        gpsCoordinates: passport.gpsCoordinates,
      },
    });
  }

  for (const listing of ampasListings) {
    await prisma.ampasListing.create({
      data: {
        id: listing.id,
        slug: listing.slug,
        sellerId: listing.sellerId,
        condition: toAmpasCondition(listing.condition),
        quantityKg: listing.quantityKg,
        pricePerKgAmount: listing.pricePerKg.amount,
        pricePerKgCurrency: listing.pricePerKg.currency,
        locationProvince: listing.location.province,
        locationCity: listing.location.city,
        locationDistrict: listing.location.district,
        distillationProcess: listing.distillationProcess,
        usageTags: listing.usageTags.map(toAmpasUsageTag),
        status: toAmpasListingStatus(listing.status),
        imageSrc: listing.image.src,
        imageAlt: listing.image.alt,
        disclaimer: listing.disclaimer,
        distillationDate: listing.distillationDate
          ? new Date(listing.distillationDate)
          : undefined,
        shippingOption: listing.shippingOption,
        wholesaleEnabled: listing.wholesaleEnabled ?? false,
        wholesaleMinQtyKg: listing.wholesaleMinQtyKg,
        wholesalePricePerKgAmount: listing.wholesalePricePerKg?.amount,
        wholesalePricePerKgCurrency: listing.wholesalePricePerKg?.currency,
        createdAt: new Date(listing.createdAt),
        updatedAt: new Date(listing.updatedAt),
      },
    });
  }
}

async function seedCommerce() {
  for (const review of reviews) {
    await prisma.review.create({
      data: {
        id: review.id,
        productId: review.productId,
        sellerId: review.sellerId,
        authorName: review.authorName,
        rating: review.rating,
        tags: review.tags.map(toReviewTag),
        body: review.body,
        createdAt: new Date(review.createdAt),
      },
    });
  }

  for (const promo of promos) {
    await prisma.promo.create({
      data: {
        id: promo.id,
        sellerId: promo.sellerId,
        title: promo.title,
        code: promo.code,
        status: toPromoStatus(promo.status),
        type: toPromoType(promo.type),
        value: promo.value,
        startsAt: new Date(promo.startsAt),
        endsAt: new Date(promo.endsAt),
        minSubtotalAmount: promo.minSubtotal.amount,
        minSubtotalCurrency: promo.minSubtotal.currency,
        usageLimit: promo.usageLimit,
        usedCount: promo.usedCount,
        products: {
          create: promo.productIds.map((productId) => ({
            productId,
          })),
        },
      },
    });
  }

  for (const bundle of bundles) {
    await prisma.bundle.create({
      data: {
        id: bundle.id,
        slug: bundle.slug,
        title: bundle.title,
        type: toBundleType(bundle.type),
        priceAmount: bundle.price.amount,
        priceCurrency: bundle.price.currency,
        description: bundle.description,
        products: {
          create: bundle.productIds.map((productId) => ({
            productId,
          })),
        },
      },
    });
  }
}

async function seedCartAndOrders() {
  const cart = await prisma.cart.create({
    data: {
      userId: "user-buyer-1",
      items: {
        create: cartItems.map((item) => ({
          id: item.id,
          kind: toCartItemKind(item.kind),
          productId: item.productId,
          ampasListingId: item.ampasListingId,
          quantity: item.quantity,
          unitPriceAmount: item.unitPrice.amount,
          unitPriceCurrency: item.unitPrice.currency,
        })),
      },
    },
  });

  for (const order of orderSummaries) {
    await prisma.order.create({
      data: {
        id: order.id,
        userId: "user-buyer-1",
        status: toOrderStatus(order.status),
        subtotalAmount: order.subtotal.amount,
        subtotalCurrency: order.subtotal.currency,
        platformFeeAmount: order.platformFee.amount,
        platformFeeCurrency: order.platformFee.currency,
        shippingEstimateAmount: order.shippingEstimate.amount,
        shippingEstimateCurrency: order.shippingEstimate.currency,
        discountAmount: 0,
        discountCurrency: "IDR",
        grandTotalAmount: order.grandTotal.amount,
        grandTotalCurrency: order.grandTotal.currency,
        receiverName: "Budi Handoko",
        receiverPhone: "081234567890",
        shippingAddress: "Jl. Teuku Umar No. 12",
        shippingCity: "Banda Aceh",
        shippingProvince: "Aceh",
        courierCode: "jne",
        courierName: "JNE Regular",
        paymentExpiresAt: new Date("2026-07-09T10:00:00.000Z"),
        items: {
          create: order.items.map((item) => ({
            kind: toCartItemKind(item.kind),
            productId: item.productId,
            ampasListingId: item.ampasListingId,
            sellerId: getOrderItemSellerId(item),
            quantity: item.quantity,
            unitPriceAmount: item.unitPrice.amount,
            unitPriceCurrency: item.unitPrice.currency,
          })),
        },
        payments: {
          create: {
            provider: "MIDTRANS_CORE_MOCK",
            paymentMethod: PaymentMethod.QRIS,
            status: getPaymentStatus(order.status),
            amount: order.grandTotal.amount,
            currency: order.grandTotal.currency,
            externalId: `${order.id}-${cart.id}`,
            transactionId: `MT-DEMO-${order.id}`,
            transactionStatus: getMidtransTransactionStatus(order.status),
            qrString: `midtrans-demo-qr-${order.id}`,
            qrUrl: `/payments/demo/${order.id}/qr`,
            paidAt:
              order.status === "paid" || order.status === "fulfilled"
                ? new Date("2026-07-08T10:00:00.000Z")
                : undefined,
            expiredAt: new Date("2026-07-09T10:00:00.000Z"),
            lastStatusSyncedAt: new Date("2026-07-08T10:00:00.000Z"),
          },
        },
        fulfillments: {
          create: Array.from(
            new Set(order.items.map((item) => getOrderItemSellerId(item))),
          ).map((sellerId) => ({
            sellerId,
            status: getFulfillmentStatus(order.status),
            trackingNumber:
              order.status === "fulfilled" ? `NILOKA-${order.id}` : undefined,
            shippingNote:
              order.status === "fulfilled"
                ? "Pesanan demo sudah sampai ke pembeli."
                : undefined,
            shippedAt:
              order.status === "fulfilled"
                ? new Date("2026-07-07T10:00:00.000Z")
                : undefined,
            deliveredAt:
              order.status === "fulfilled"
                ? new Date("2026-07-08T10:00:00.000Z")
                : undefined,
          })),
        },
      },
    });
  }
}

async function seedValidationAndArticles() {
  for (const item of adminValidationItems) {
    await prisma.adminValidationItem.create({
      data: {
        id: item.id,
        target: toAdminValidationTarget(item.target),
        targetId: item.targetId,
        status: toAdminValidationStatus(item.status),
        submittedBy: item.submittedBy,
        submittedAt: new Date(item.submittedAt),
        notes: item.notes,
      },
    });
  }

  for (const article of articles) {
    await prisma.article.create({
      data: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        authorRole: article.authorRole,
        publishedAt: new Date(article.publishedAt),
        imageUrl: article.imageUrl,
        category: toArticleCategory(article.category),
        videoUrl: article.videoUrl,
        videoDuration: article.videoDuration,
        readTime: article.readTime,
        tags: article.tags,
      },
    });
  }
}

async function main() {
  await clearDemoData();
  await seedSellers();
  await seedUsers();
  await seedProducts();
  await seedPassportsAndAmpas();
  await seedCommerce();
  await seedCartAndOrders();
  await seedValidationAndArticles();
  await seedCommunityHub();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: Error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seedCommunityHub() {
  const postsData = [
    {
      id: "post-1",
      title: "Daun Nilam Menguning dan Bintik Hitam - Apakah ini Budok?",
      content:
        "Selamat malam rekan-rekan petani nilam. Saya Eko dari Gayo Lues, baru-baru ini daun tanaman nilam saya yang berumur 3 bulan mulai menguning dan muncul bintik-bintik hitam di permukaannya. Pertumbuhannya juga agak lambat. Saya lampirkan hasil diagnosa AI di bawah ini. Mohon masukannya apakah ini benar Budok dan bagaimana penanganannya? Terima kasih.",
      category: "BUDIDAYA" as const,
      location: "Gayo Lues",
      authorId: "user-farmer-1",
      diagnoseResult: {
        diagnosis: "Budok",
        confidence: 85,
        kemungkinanTambahan: "Bercak Daun",
        penyebab: "Jamur Synchytrium pogostemonis",
        alasan:
          "Gambar daun menunjukkan benjolan-benjolan kecil mirip kutil disertai bercak kecokelatan di tepi daun, yang merupakan indikasi kuat infeksi jamur Synchytrium pogostemonis.",
        rekomendasi: [
          "Pangkas dan bakar bagian tanaman nilam yang terinfeksi berat",
          "Semprotkan fungisida kontak berbahan aktif tembaga hidroksida secara berkala",
          "Perbaiki drainase tanah untuk mengurangi kelembapan tinggi",
          "Jangan gunakan bibit dari tanaman yang sudah terinfeksi",
        ],
        providerUsed: "gemini",
      },
      images: ["/images/komunitas/budok.jpg"],
    },
    {
      id: "post-2",
      title: "Hasil Panen Minyak Nilam Melimpah Batch Juli 2026",
      content:
        "Alhamdulillah, penyulingan batch pertama selesai! Minyak nilam super Aceh Selatan kami siap diproduksi menjadi produk aromaterapi dengan campuran minyak kelapa & jojoba. Yuk mampir ke toko kami untuk melihat produk-produk aromaterapi pilihan!",
      category: "PANEN" as const,
      location: "Aceh Selatan",
      authorId: "user-seller-1",
      diagnoseResult: null,
      images: ["/images/komunitas/aroma.jpg"],
    },
    {
      id: "post-3",
      title: "Review Minyak Nilam Niloka - Kualitas Tidur Sangat Membaik",
      content:
        "Mau share pengalaman pribadi pakai essential oil Nilam dari brand lokal Aceh Aroma House. Biasanya saya susah tidur nyenyak karena stres kerjaan. Coba pakai diffuser diisi 3 tetes minyak nilam sebelum tidur, aromanya menenangkan banget, woodsy dan manis di saat bersamaan. Tidur jadi lebih pulas dan pas bangun kerasa seger banget. Nilam Passport-nya juga jelas, kelihatan diproduksi berkelanjutan di Aceh Selatan. Highly recommended!",
      category: "REVIEW" as const,
      location: "Aceh Selatan",
      authorId: "user-buyer-1",
      diagnoseResult: null,
      images: [],
    },
    {
      id: "post-4",
      title: "Tanya Update Harga Ampas Nilam Kering untuk Kompos",
      content:
        "Halo, ada yang tahu harga pasaran ampas nilam kering per ton di wilayah Aceh Jaya saat ini? Kami berencana membeli dalam jumlah besar (10-15 ton) untuk bahan baku media pupuk organik. Terima kasih.",
      category: "PASAR" as const,
      location: "Aceh Jaya",
      authorId: "user-buyer-1",
      diagnoseResult: null,
      images: [],
    },
  ];

  for (const post of postsData) {
    await prisma.communityPost.create({
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        location: post.location,
        authorId: post.authorId,
        diagnoseResult: post.diagnoseResult || undefined,
        images: post.images
      }
    });
  }

  // Seed comment & replies
  await prisma.communityComment.createMany({
    data: [
      {
        id: "comment-1",
        postId: "post-1",
        userId: "user-seller-1",
        content: "Halo pak Eko. Salam kenal, saya Ahmad dari Tapaktuan. Berdasarkan hasil AI Diagnosa itu betul gejala Budok. Sebaiknya segera dipisahkan tanaman yang kena agar tidak menular ke baris lain. Pengalaman kami, penggunaan bio-fungisida trichoderma saat awal tanam sangat membantu mencegah hal ini.",
      },
      {
        id: "comment-2",
        postId: "post-1",
        userId: "user-admin-1",
        content: "Betul sekali saran dari pak Ahmad. Tim penyuluh kami juga menyarankan rotasi tanaman setelah panen agar jamur Synchytrium pogostemonis tidak menetap di tanah.",
      }
    ]
  });

  // Reply to comment-1 (1-level nesting)
  await prisma.communityComment.create({
    data: {
      id: "reply-1",
      postId: "post-1",
      userId: "user-farmer-1",
      parentId: "comment-1",
      content: "Terima kasih pak Ahmad masukannya! Sangat membantu. Untuk bio-fungisida trichoderma biasanya bapak beli merk apa ya? Atau bikin sendiri?",
    }
  });

  // Likes
  await prisma.communityLike.createMany({
    data: [
      { id: "like-1", postId: "post-1", userId: "user-seller-1" },
      { id: "like-2", postId: "post-1", userId: "user-admin-1" },
      { id: "like-3", postId: "post-2", userId: "user-buyer-1" },
      { id: "like-4", postId: "post-3", userId: "user-seller-1" }
    ]
  });
}
