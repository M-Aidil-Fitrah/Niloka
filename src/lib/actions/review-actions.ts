"use server";

import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { OrderStatus, ReviewTag } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Review, ReviewTag as ContractReviewTag } from "@/lib/contracts";

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID wajib diisi"),
  sellerId: z.string().min(1, "Seller ID wajib diisi"),
  authorName: z.string().optional().default(""),
  rating: z.number().int().min(1).max(5, "Rating harus di antara 1 dan 5"),
  tags: z.array(z.string()).max(5, "Tag ulasan terlalu banyak."),
  body: z.string().trim().min(10, "Isi ulasan minimal 10 karakter."),
});

function toPrismaReviewTag(tag: string): ReviewTag {
  switch (tag) {
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
    default:
      throw new Error(`Tag ulasan tidak valid: ${tag}`);
  }
}

export async function submitReviewAction(
  input: z.input<typeof reviewSchema>,
): Promise<{ ok: boolean; message: string; review?: Review }> {
  try {
    const user = await requireUser();
    const validated = reviewSchema.safeParse(input);
    if (!validated.success) {
      return {
        ok: false,
        message: validated.error.issues[0]?.message ?? "Data ulasan tidak valid.",
      };
    }

    const data = validated.data;
    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true, slug: true, sellerId: true },
    });

    if (!product || product.sellerId !== data.sellerId) {
      return { ok: false, message: "Produk tidak valid untuk ulasan ini." };
    }

    const purchasedItem = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          userId: user.id,
          status: { in: [OrderStatus.PAID, OrderStatus.FULFILLED] },
        },
      },
      select: { id: true },
    });

    if (!purchasedItem) {
      return {
        ok: false,
        message: "Ulasan hanya bisa dikirim setelah Anda membeli produk ini.",
      };
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (existingReview) {
      return {
        ok: false,
        message: "Anda sudah mengirim ulasan untuk produk ini.",
      };
    }

    // Convert contract tags to prisma tags
    const prismaTags = data.tags.map(toPrismaReviewTag);

    const newReview = await prisma.review.create({
      data: {
        id: reviewId,
        productId: data.productId,
        sellerId: product.sellerId,
        userId: user.id,
        authorName: user.name ?? "Pembeli NILOKA",
        rating: data.rating,
        tags: prismaTags,
        body: data.body,
      },
    });

    // Recalculate average rating and total reviews for the seller
    const sellerReviewStats = await prisma.review.aggregate({
      where: { sellerId: product.sellerId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.seller.update({
      where: { id: product.sellerId },
      data: {
        ratingAverage: sellerReviewStats._avg.rating ?? 0,
        totalReviews: sellerReviewStats._count.rating,
      },
    });

    // Revalidate paths
    revalidatePath(`/products`);
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      message: "Ulasan Anda berhasil dikirim!",
      review: {
        id: newReview.id,
        productId: newReview.productId,
        sellerId: newReview.sellerId,
        authorName: newReview.authorName,
        rating: newReview.rating,
        tags: data.tags as ContractReviewTag[],
        body: newReview.body,
        createdAt: newReview.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirimkan ulasan." };
  }
}
