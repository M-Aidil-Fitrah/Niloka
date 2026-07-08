import { ArticleShell } from "@/components/articles/article-shell";
import { getArticlesDto } from "@/lib/dal/marketplace";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panduan & Artikel Limbah Nilam - NILOKA",
  description:
    "Baca panduan dinamis dari database NILOKA tentang budidaya, pupuk, energi, dan hilirisasi limbah nilam.",
};

export default async function ArtikelPage() {
  const articles = await getArticlesDto();

  return <ArticleShell articles={articles} />;
}
