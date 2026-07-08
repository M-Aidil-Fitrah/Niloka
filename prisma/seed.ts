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
  OrderStatus,
  PassportValidationStatus,
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
  await prisma.auditLog.deleteMany();
  await prisma.adminValidationItem.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
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
        grandTotalAmount: order.grandTotal.amount,
        grandTotalCurrency: order.grandTotal.currency,
        items: {
          create: order.items.map((item) => ({
            kind: toCartItemKind(item.kind),
            productId: item.productId,
            ampasListingId: item.ampasListingId,
            quantity: item.quantity,
            unitPriceAmount: item.unitPrice.amount,
            unitPriceCurrency: item.unitPrice.currency,
          })),
        },
        payments: {
          create: {
            provider: "midtrans-mock",
            status: "PENDING",
            amount: order.grandTotal.amount,
            currency: order.grandTotal.currency,
            externalId: `${order.id}-${cart.id}`,
          },
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
