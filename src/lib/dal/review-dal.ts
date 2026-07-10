import "server-only";

import type { Review, ReviewTag as ContractReviewTag } from "@/lib/contracts";
import { Prisma, ReviewTag } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type ReviewRow = Prisma.ReviewGetPayload<{
  select: {
    id: true;
    productId: true;
    sellerId: true;
    authorName: true;
    rating: true;
    tags: true;
    body: true;
    createdAt: true;
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function toContractReviewTag(value: ReviewTag): ContractReviewTag {
  switch (value) {
    case ReviewTag.AUTHENTIC_AROMA:
      return "authentic-aroma";
    case ReviewTag.FAST_DELIVERY:
      return "fast-delivery";
    case ReviewTag.CLEAR_PASSPORT:
      return "clear-passport";
    case ReviewTag.GOOD_PACKAGING:
      return "good-packaging";
    case ReviewTag.REPEAT_ORDER:
      return "repeat-order";
  }
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.productId,
    sellerId: row.sellerId,
    authorName: row.authorName,
    rating: row.rating,
    tags: row.tags.map(toContractReviewTag),
    body: row.body,
    createdAt: toIsoString(row.createdAt),
  };
}

export async function getReviewsForProductDto(
  productId: string,
): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map(mapReview);
}

export async function getRecentReviewsDto(limit: number): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return rows.map(mapReview);
}
