import {
  ProductForm,
  ProductFunction,
  ProductTag,
  ProductStatus,
  PassportValidationStatus,
  AmpasCondition,
  AmpasUsageTag,
  AmpasListingStatus,
  PromoType,
  PromoStatus,
  SellerType,
  SellerVerificationStatus,
} from "@/generated/prisma/client";
import type {
  ProductForm as ContractProductForm,
  ProductFunction as ContractProductFunction,
  ProductTag as ContractProductTag,
  ProductStatus as ContractProductStatus,
  PassportValidationStatus as ContractPassportStatus,
  AmpasCondition as ContractAmpasCondition,
  AmpasUsageTag as ContractAmpasUsageTag,
  AmpasListingStatus as ContractAmpasStatus,
  PromoType as ContractPromoType,
  PromoStatus as ContractPromoStatus,
  SellerType as ContractSellerType,
  SellerVerificationStatus as ContractSellerVerificationStatus,
} from "@/lib/contracts";

function invalidMapperValue(mapper: string, value: string): never {
  throw new Error(`Invalid ${mapper}: ${String(value)}`);
}

export function toPrismaProductForm(form: string): ProductForm {
  switch (form) {
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
    default:
      return invalidMapperValue("product form", form);
  }
}

export function fromPrismaProductForm(form: ProductForm): ContractProductForm {
  switch (form) {
    case ProductForm.ESSENTIAL_OIL:
      return "essential-oil";
    case ProductForm.ROLL_ON:
      return "roll-on";
    case ProductForm.SOAP:
      return "soap";
    case ProductForm.DIFFUSER:
      return "diffuser";
    case ProductForm.PERFUME:
      return "perfume";
    case ProductForm.BODY_OIL:
      return "body-oil";
    case ProductForm.BUNDLE:
      return "bundle";
  }
}

export function toPrismaProductFunction(func: string): ProductFunction {
  switch (func) {
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
    default:
      return invalidMapperValue("product function", func);
  }
}

export function fromPrismaProductFunction(func: ProductFunction): ContractProductFunction {
  switch (func) {
    case ProductFunction.RELAXATION:
      return "relaxation";
    case ProductFunction.FOCUS:
      return "focus";
    case ProductFunction.SLEEP_SUPPORT:
      return "sleep-support";
    case ProductFunction.SKIN_CARE:
      return "skin-care";
    case ProductFunction.HOME_FRAGRANCE:
      return "home-fragrance";
    case ProductFunction.GIFT:
      return "gift";
  }
}

export function toPrismaProductTag(tag: string): ProductTag {
  switch (tag) {
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
    default:
      return invalidMapperValue("product tag", tag);
  }
}

export function fromPrismaProductTag(tag: ProductTag): ContractProductTag {
  switch (tag) {
    case ProductTag.BEST_SELLER:
      return "best-seller";
    case ProductTag.NEW_ARRIVAL:
      return "new-arrival";
    case ProductTag.NILAM_PASSPORT:
      return "nilam-passport";
    case ProductTag.AROMA_CALM:
      return "aroma-calm";
    case ProductTag.LIMITED_BATCH:
      return "limited-batch";
  }
}

export function toPrismaProductStatus(status: string): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "published":
      return ProductStatus.PUBLISHED;
    case "archived":
      return ProductStatus.ARCHIVED;
    default:
      return invalidMapperValue("product status", status);
  }
}

export function fromPrismaProductStatus(status: ProductStatus): ContractProductStatus {
  switch (status) {
    case ProductStatus.DRAFT:
      return "draft";
    case ProductStatus.PUBLISHED:
      return "published";
    case ProductStatus.ARCHIVED:
      return "archived";
  }
}

export function toPrismaPassportStatus(status: string): PassportValidationStatus {
  switch (status) {
    case "draft":
      return PassportValidationStatus.DRAFT;
    case "pending-review":
      return PassportValidationStatus.PENDING_REVIEW;
    case "validated":
      return PassportValidationStatus.VALIDATED;
    default:
      return invalidMapperValue("passport status", status);
  }
}

export function fromPrismaPassportStatus(status: PassportValidationStatus): ContractPassportStatus {
  switch (status) {
    case PassportValidationStatus.DRAFT:
      return "draft";
    case PassportValidationStatus.PENDING_REVIEW:
      return "pending-review";
    case PassportValidationStatus.VALIDATED:
      return "validated";
  }
}

export function toPrismaAmpasCondition(condition: string): AmpasCondition {
  switch (condition) {
    case "wet":
      return AmpasCondition.WET;
    case "dry":
      return AmpasCondition.DRY;
    case "mixed":
      return AmpasCondition.MIXED;
    default:
      return invalidMapperValue("ampas condition", condition);
  }
}

export function fromPrismaAmpasCondition(condition: AmpasCondition): ContractAmpasCondition {
  switch (condition) {
    case AmpasCondition.WET:
      return "wet";
    case AmpasCondition.DRY:
      return "dry";
    case AmpasCondition.MIXED:
      return "mixed";
  }
}

export function toPrismaAmpasUsageTag(tag: string): AmpasUsageTag {
  switch (tag) {
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
    default:
      return invalidMapperValue("ampas usage tag", tag);
  }
}

export function fromPrismaAmpasUsageTag(tag: AmpasUsageTag): ContractAmpasUsageTag {
  switch (tag) {
    case AmpasUsageTag.COMPOST:
      return "compost";
    case AmpasUsageTag.BRIQUETTE:
      return "briquette";
    case AmpasUsageTag.MUSHROOM_MEDIA:
      return "mushroom-media";
    case AmpasUsageTag.MULCH:
      return "mulch";
    case AmpasUsageTag.ANIMAL_FEED:
      return "animal-feed";
    case AmpasUsageTag.INDUSTRIAL_CELLULOSE:
      return "industrial-cellulose";
  }
}

export function toPrismaAmpasStatus(status: string): AmpasListingStatus {
  switch (status) {
    case "draft":
      return AmpasListingStatus.DRAFT;
    case "active":
      return AmpasListingStatus.ACTIVE;
    case "sold":
      return AmpasListingStatus.SOLD;
    case "archived":
      return AmpasListingStatus.ARCHIVED;
    default:
      return invalidMapperValue("ampas status", status);
  }
}

export function fromPrismaAmpasStatus(status: AmpasListingStatus): ContractAmpasStatus {
  switch (status) {
    case AmpasListingStatus.DRAFT:
      return "draft";
    case AmpasListingStatus.ACTIVE:
      return "active";
    case AmpasListingStatus.SOLD:
      return "sold";
    case AmpasListingStatus.ARCHIVED:
      return "archived";
  }
}

export function toPrismaPromoType(type: string): PromoType {
  switch (type) {
    case "percentage":
      return PromoType.PERCENTAGE;
    case "fixed-amount":
      return PromoType.FIXED_AMOUNT;
    case "free-shipping":
      return PromoType.FREE_SHIPPING;
    default:
      return invalidMapperValue("promo type", type);
  }
}

export function fromPrismaPromoType(type: PromoType): ContractPromoType {
  switch (type) {
    case PromoType.PERCENTAGE:
      return "percentage";
    case PromoType.FIXED_AMOUNT:
      return "fixed-amount";
    case PromoType.FREE_SHIPPING:
      return "free-shipping";
  }
}

export function toPrismaPromoStatus(status: string): PromoStatus {
  switch (status) {
    case "active":
      return PromoStatus.ACTIVE;
    case "scheduled":
      return PromoStatus.SCHEDULED;
    case "expired":
      return PromoStatus.EXPIRED;
    case "disabled":
      return PromoStatus.DISABLED;
    default:
      return invalidMapperValue("promo status", status);
  }
}

export function fromPrismaPromoStatus(status: PromoStatus): ContractPromoStatus {
  switch (status) {
    case PromoStatus.ACTIVE:
      return "active";
    case PromoStatus.SCHEDULED:
      return "scheduled";
    case PromoStatus.EXPIRED:
      return "expired";
    case PromoStatus.DISABLED:
      return "disabled";
  }
}

export function toPrismaSellerType(type: string): SellerType {
  switch (type) {
    case "umkm":
      return SellerType.UMKM;
    case "distiller":
      return SellerType.DISTILLER;
    case "cooperative":
      return SellerType.COOPERATIVE;
    default:
      return invalidMapperValue("seller type", type);
  }
}

export function fromPrismaSellerType(type: SellerType): ContractSellerType {
  switch (type) {
    case SellerType.UMKM:
      return "umkm";
    case SellerType.DISTILLER:
      return "distiller";
    case SellerType.COOPERATIVE:
      return "cooperative";
  }
}

export function toPrismaSellerVerificationStatus(status: string): SellerVerificationStatus {
  switch (status) {
    case "pending":
      return SellerVerificationStatus.PENDING;
    case "verified":
      return SellerVerificationStatus.VERIFIED;
    case "rejected":
      return SellerVerificationStatus.REJECTED;
    default:
      return invalidMapperValue("seller verification status", status);
  }
}

export function fromPrismaSellerVerificationStatus(status: SellerVerificationStatus): ContractSellerVerificationStatus {
  switch (status) {
    case SellerVerificationStatus.PENDING:
      return "pending";
    case SellerVerificationStatus.VERIFIED:
      return "verified";
    case SellerVerificationStatus.REJECTED:
      return "rejected";
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
