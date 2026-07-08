"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  ProductForm,
  ProductFunction,
  ProductTag,
  ProductStatus,
  PassportValidationStatus,
} from "@/generated/prisma/client";
import { z } from "zod";
import type { Product } from "@/lib/contracts";

const productSaveSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  categoryId: z.string().min(1, "Kategori wajib diisi"),
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  shortDescription: z.string().min(5, "Deskripsi produk minimal 5 karakter"),
  price: z.object({
    amount: z.number().min(0, "Harga tidak boleh negatif"),
    currency: z.literal("IDR"),
  }),
  originalPrice: z
    .object({
      amount: z.number().min(0).optional().nullable(),
      currency: z.literal("IDR").optional(),
    })
    .optional()
    .nullable(),
  stock: z.number().min(0, "Stok tidak boleh negatif"),
  status: z.enum(["draft", "published", "archived"]),
  form: z.enum([
    "essential-oil",
    "roll-on",
    "soap",
    "diffuser",
    "perfume",
    "body-oil",
    "bundle",
  ]),
  functions: z.array(z.string()),
  tags: z.array(z.string()),
  image: z.object({
    src: z.string().min(1, "Gambar utama wajib ada"),
    alt: z.string().optional().default(""),
  }),
  gallery: z.array(
    z.object({
      src: z.string(),
      alt: z.string().optional().default(""),
    }),
  ).optional().default([]),
});

function toPrismaProductForm(form: string): ProductForm {
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
      return ProductForm.ESSENTIAL_OIL;
  }
}

function toPrismaProductFunction(func: string): ProductFunction {
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
      return ProductFunction.RELAXATION;
  }
}

function toPrismaProductTag(tag: string): ProductTag {
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
      return ProductTag.NEW_ARRIVAL;
  }
}

function toPrismaProductStatus(status: string): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "published":
      return ProductStatus.PUBLISHED;
    case "archived":
      return ProductStatus.ARCHIVED;
    default:
      return ProductStatus.DRAFT;
  }
}

// Map contract enums from DB enums for get
function fromPrismaProductForm(form: ProductForm): "essential-oil" | "roll-on" | "soap" | "diffuser" | "perfume" | "body-oil" | "bundle" {
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

function fromPrismaProductFunction(func: ProductFunction): "relaxation" | "focus" | "sleep-support" | "skin-care" | "home-fragrance" | "gift" {
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

function fromPrismaProductTag(tag: ProductTag): "best-seller" | "new-arrival" | "nilam-passport" | "aroma-calm" | "limited-batch" {
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

function fromPrismaProductStatus(status: ProductStatus): "draft" | "published" | "archived" {
  switch (status) {
    case ProductStatus.DRAFT:
      return "draft";
    case ProductStatus.PUBLISHED:
      return "published";
    case ProductStatus.ARCHIVED:
      return "archived";
  }
}

export type ProductActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export async function saveProductAction(
  input: unknown,
): Promise<ProductActionResult> {
  const seller = await requireSeller();

  const validated = productSaveSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ??
        "Data katalog produk tidak valid.",
    };
  }

  const data = validated.data;

  // Prevent spoofing other sellerIds
  if (data.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Aksi tidak sah. ID Penjual tidak cocok.",
    };
  }

  const existing = await prisma.product.findUnique({
    where: { id: data.id },
    select: { sellerId: true, slug: true },
  });

  if (existing && existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengubah produk ini.",
    };
  }

  // Generate unique slug
  const rawSlug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${rawSlug}-${data.id.replace("product-", "").replace("prod-", "").slice(0, 6)}`;

  const mappedForm = toPrismaProductForm(data.form);
  const mappedStatus = toPrismaProductStatus(data.status);
  const mappedFunctions = data.functions.map(toPrismaProductFunction);
  const mappedTags = data.tags.map(toPrismaProductTag);

  await prisma.$transaction(async (tx) => {
    // 1. Upsert product
    await tx.product.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        slug,
        sellerId: data.sellerId,
        categoryId: data.categoryId,
        name: data.name,
        shortDescription: data.shortDescription,
        form: mappedForm,
        functions: mappedFunctions,
        tags: mappedTags,
        priceAmount: data.price.amount,
        priceCurrency: "IDR",
        originalPriceAmount: data.originalPrice?.amount ?? null,
        originalPriceCurrency: data.originalPrice?.amount ? "IDR" : null,
        stock: data.stock,
        status: mappedStatus,
        imageSrc: data.image.src,
        imageAlt: data.image.alt || "",
      },
      update: {
        categoryId: data.categoryId,
        name: data.name,
        shortDescription: data.shortDescription,
        form: mappedForm,
        functions: mappedFunctions,
        tags: mappedTags,
        priceAmount: data.price.amount,
        originalPriceAmount: data.originalPrice?.amount ?? null,
        originalPriceCurrency: data.originalPrice?.amount ? "IDR" : null,
        stock: data.stock,
        status: mappedStatus,
        imageSrc: data.image.src,
        imageAlt: data.image.alt || "",
      },
    });

    // 2. Handle gallery images (delete old, insert new)
    if (existing) {
      await tx.productImage.deleteMany({
        where: { productId: data.id },
      });
    }

    if (data.gallery && data.gallery.length > 0) {
      await tx.productImage.createMany({
        data: data.gallery.map((image, index) => ({
          productId: data.id,
          src: image.src,
          alt: image.alt || "",
          sortOrder: index,
        })),
      });
    }

    // 3. Create Nilam Passport draft if this is a brand new product
    if (!existing) {
      const passportId = `passport-${data.id.replace("product-", "").replace("prod-", "")}`;
      await tx.nilamPassport.create({
        data: {
          id: passportId,
          productId: data.id,
          origin: "",
          productKind: mappedForm,
          aromaProfile: [],
          functions: [],
          usage: "",
          safetyNotes: "",
          validationStatus: PassportValidationStatus.DRAFT,
        },
      });
    }

    // 4. Write audit log
    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: existing ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
        target: "Product",
        targetId: data.id,
        metadata: JSON.stringify({
          slug,
          status: data.status,
          stock: data.stock,
        }),
      },
    });
  });

  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/seller");

  return { ok: true, id: data.id };
}

export async function deleteProductAction(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  const seller = await requireSeller();

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { sellerId: true, slug: true },
  });

  if (!existing) {
    return { ok: false, message: "Produk tidak ditemukan." };
  }

  if (existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk menghapus produk ini.",
    };
  }

  await prisma.$transaction(async (tx) => {
    // Delete product (cascades to NilamPassport, ProductImage, Review, CartItem, etc.)
    await tx.product.delete({
      where: { id },
    });

    await tx.auditLog.create({
      data: {
        userId: seller.id,
        action: "DELETE_PRODUCT",
        target: "Product",
        targetId: id,
        metadata: JSON.stringify({ slug: existing.slug }),
      },
    });
  });

  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath("/seller");

  return { ok: true, message: "Produk berhasil dihapus." };
}

export async function getSellerProductsAction(): Promise<Product[]> {
  const seller = await requireSeller();
  if (!seller.sellerId) {
    throw new Error("Akun Anda tidak terhubung dengan profil Penjual.");
  }

  const rows = await prisma.product.findMany({
    where: {
      sellerId: seller.sellerId,
    },
    include: {
      gallery: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      passport: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    sellerId: row.sellerId,
    categoryId: row.categoryId,
    passportId: row.passport?.id ?? "",
    name: row.name,
    shortDescription: row.shortDescription,
    form: fromPrismaProductForm(row.form),
    functions: row.functions.map(fromPrismaProductFunction),
    tags: row.tags.map(fromPrismaProductTag),
    price: {
      amount: row.priceAmount,
      currency: "IDR",
    },
    originalPrice:
      row.originalPriceAmount === null
        ? undefined
        : {
            amount: row.originalPriceAmount,
            currency: "IDR",
          },
    stock: row.stock,
    status: fromPrismaProductStatus(row.status),
    image: {
      src: row.imageSrc,
      alt: row.imageAlt,
    },
    gallery: row.gallery.map((image) => ({
      src: image.src,
      alt: image.alt,
    })),
    featuredRank: row.featuredRank,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}
