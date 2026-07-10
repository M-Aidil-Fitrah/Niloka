import "server-only";

import type { Article, ArticleCategory as ContractArticleCategory } from "@/lib/contracts";
import { ArticleCategory, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

type ArticleRow = Prisma.ArticleGetPayload<Record<string, never>>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function toContractArticleCategory(value: ArticleCategory): ContractArticleCategory {
  switch (value) {
    case ArticleCategory.PUPUK:
      return "pupuk";
    case ArticleCategory.ENERGI:
      return "energi";
    case ArticleCategory.BUDIDAYA:
      return "budidaya";
    case ArticleCategory.OLAHAN:
      return "olahan";
  }
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    authorRole: row.authorRole ?? undefined,
    publishedAt: toIsoString(row.publishedAt),
    imageUrl: row.imageUrl,
    category: toContractArticleCategory(row.category),
    videoUrl: row.videoUrl ?? undefined,
    videoDuration: row.videoDuration ?? undefined,
    readTime: row.readTime,
    tags: row.tags,
  };
}

export async function getArticlesDto(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      author: true,
      authorRole: true,
      publishedAt: true,
      imageUrl: true,
      category: true,
      videoUrl: true,
      videoDuration: true,
      readTime: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: "",
    author: row.author,
    authorRole: row.authorRole ?? undefined,
    publishedAt: toIsoString(row.publishedAt),
    imageUrl: row.imageUrl,
    category: toContractArticleCategory(row.category),
    videoUrl: row.videoUrl ?? undefined,
    videoDuration: row.videoDuration ?? undefined,
    readTime: row.readTime,
    tags: row.tags,
  }));
}

export async function getArticleBySlugDto(
  slug: string,
): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  return row ? mapArticle(row) : null;
}
