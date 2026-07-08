import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { getArticleBySlug, getArticles } from "@/lib/mock-queries";
import type { ArticleCategory } from "@/lib/contracts";

type Props = {
  params: Promise<{ slug: string }>;
};

const CATEGORIES: Record<ArticleCategory, string> = {
  pupuk: "Pupuk & Kompos",
  energi: "Energi Terbarukan",
  budidaya: "Budidaya Nilam",
  olahan: "Hilirisasi & Olahan",
};

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related articles (same category, excluding current article)
  const allArticles = getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back to list link */}
      <div className="mb-8">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-800 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel &amp; Berita
        </Link>
      </div>

      <article>
        {/* Article Meta / Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-600 mb-4">
            <span className="rounded-full bg-brand-100 border border-brand-200/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-900">
              {CATEGORIES[article.category]}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl md:text-5xl leading-tight mb-6">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 py-4 border-y border-line/45">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-900">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-950">{article.author}</p>
              {article.authorRole && (
                <p className="text-xs text-ink-600">{article.authorRole}</p>
              )}
            </div>
          </div>
        </header>

        {/* Feature Image */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-3xl border border-line bg-cream-200 shadow-sm">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-center"
          />
        </div>

        {/* Markdown Content */}
        <div className="niloka-markdown prose prose-emerald max-w-none text-ink-900 text-base leading-relaxed mb-16">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Tags section */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-16 pt-6 border-t border-line/40">
          <h4 className="text-xs font-extrabold uppercase text-ink-600 tracking-wider mb-3">Tag Terkait:</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-cream-100 border border-line/40 px-3 py-1.5 text-xs font-semibold text-brand-950"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-line pt-12">
          <h3 className="text-xl font-bold text-brand-950 mb-8 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold-600" /> Artikel Terkait
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/artikel/${rel.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line/60 bg-white-soft shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand-700/40 hover:shadow-sm"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-cream-200">
                  <Image
                    src={rel.imageUrl}
                    alt={rel.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-gold-600">
                    {CATEGORIES[rel.category]}
                  </span>
                  <h4 className="text-sm font-bold leading-snug text-brand-950 line-clamp-2 group-hover:text-brand-850 group-hover:underline">
                    {rel.title}
                  </h4>
                  <p className="mt-2 text-xs text-ink-600 line-clamp-2">
                    {rel.excerpt}
                  </p>
                  <span className="mt-4 text-[10px] font-extrabold text-brand-800 flex items-center gap-0.5 mt-auto">
                    Baca <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
