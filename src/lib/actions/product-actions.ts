"use server";

import { revalidatePath } from "next/cache";
import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  AdminValidationStatus,
  AdminValidationTarget,
  PassportValidationStatus,
  ProductStatus,
} from "@/generated/prisma/client";
import { z } from "zod";
import type { Product } from "@/lib/contracts";
import {
  toPrismaProductForm,
  fromPrismaProductForm,
  toPrismaProductFunction,
  fromPrismaProductFunction,
  toPrismaProductTag,
  fromPrismaProductTag,
  toPrismaProductStatus,
  fromPrismaProductStatus,
  generateSlug,
} from "@/lib/prisma-mappers";

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
    select: { sellerId: true, slug: true, status: true },
  });

  if (existing && existing.sellerId !== seller.sellerId) {
    return {
      ok: false,
      message: "Anda tidak memiliki hak untuk mengubah produk ini.",
    };
  }

  // Generate unique slug
  const slug = `${generateSlug(data.name)}-${data.id.replace("product-", "").replace("prod-", "").slice(0, 6)}`;

  const mappedForm = toPrismaProductForm(data.form);
  const requestedStatus = toPrismaProductStatus(data.status);
  const needsAdminValidation =
    requestedStatus === ProductStatus.PUBLISHED &&
    existing?.status !== ProductStatus.PUBLISHED;
  const mappedStatus = needsAdminValidation ? ProductStatus.DRAFT : requestedStatus;
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

    if (needsAdminValidation) {
      await tx.adminValidationItem.upsert({
        where: { id: `validation-product-${data.id}` },
        create: {
          id: `validation-product-${data.id}`,
          target: AdminValidationTarget.PRODUCT,
          targetId: data.id,
          status: AdminValidationStatus.QUEUED,
          submittedBy: data.sellerId,
          submittedAt: new Date(),
          notes: `Pengajuan publikasi produk ${data.name}`,
        },
        update: {
          status: AdminValidationStatus.QUEUED,
          submittedAt: new Date(),
          notes: `Pengajuan publikasi produk ${data.name}`,
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
          requestedStatus: data.status,
          savedStatus: mappedStatus,
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

export type SearchPreviewItem = {
  id: string;
  slug: string;
  name: string;
  form: string;
  price: { amount: number; currency: string };
  image: { src: string; alt: string };
};

export async function searchProductPreviewAction(
  query: string,
): Promise<SearchPreviewItem[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      form: true,
      priceAmount: true,
      priceCurrency: true,
      imageSrc: true,
      imageAlt: true,
    },
    orderBy: { featuredRank: "asc" },
    take: 6,
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    form: fromPrismaProductForm(row.form),
    price: { amount: row.priceAmount, currency: row.priceCurrency as "IDR" },
    image: { src: row.imageSrc, alt: row.imageAlt },
  }));
}
