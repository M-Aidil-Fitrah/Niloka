"use server";

import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { ReviewTag } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Review, ReviewTag as ContractReviewTag } from "@/lib/contracts";

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID wajib diisi"),
  sellerId: z.string().min(1, "Seller ID wajib diisi"),
  authorName: z.string().min(1, "Nama penulis wajib diisi"),
  rating: z.number().int().min(1).max(5, "Rating harus di antara 1 dan 5"),
  tags: z.array(z.string()),
  body: z.string().min(1, "Isi ulasan wajib diisi"),
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

export async function submitReviewAction(input: unknown): Promise<{ ok: boolean; message: string; review?: Review }> {
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

    // Convert contract tags to prisma tags
    const prismaTags = data.tags.map(toPrismaReviewTag);

    const newReview = await prisma.review.create({
      data: {
        id: reviewId,
        productId: data.productId,
        sellerId: data.sellerId,
        userId: user.id,
        authorName: data.authorName,
        rating: data.rating,
        tags: prismaTags,
        body: data.body,
      },
    });

    // Recalculate average rating and total reviews for the seller
    const allSellerReviews = await prisma.review.findMany({
      where: { sellerId: data.sellerId },
      select: { rating: true },
    });
    const totalReviews = allSellerReviews.length;
    const ratingAverage = totalReviews > 0
      ? allSellerReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
      : 0;

    await prisma.seller.update({
      where: { id: data.sellerId },
      data: {
        ratingAverage,
        totalReviews,
      },
    });

    // Revalidate paths
    revalidatePath(`/products`);
    // Find the product slug to revalidate product detail page
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { slug: true },
    });
    if (product) {
      revalidatePath(`/products/${product.slug}`);
    }

    return {
      ok: true,
      message: "Ulasan Anda berhasil dikirim!",
      review: {
        id: newReview.id,
        productId: newReview.productId,
        sellerId: newReview.sellerId,
        authorName: newReview.authorName,
        rating: newReview.rating,
        tags: data.tags as ContractReviewTag[], // Cast specific tags array to correct types
        body: newReview.body,
        createdAt: newReview.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { ok: false, message: error instanceof Error ? error.message : "Gagal mengirimkan ulasan." };
  }
}
