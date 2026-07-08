"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Play, BookOpen, Clock, Tag, X, FileText, Video } from "lucide-react";
import { getArticles } from "@/lib/mock-queries";
import type { Article, ArticleCategory } from "@/lib/contracts";

const CATEGORIES: { value: "all" | ArticleCategory; label: string }[] = [
  { value: "all", label: "Semua Kategori" },
  { value: "pupuk", label: "Pupuk & Kompos" },
  { value: "energi", label: "Energi Terbarukan" },
  { value: "budidaya", label: "Budidaya Nilam" },
  { value: "olahan", label: "Hilirisasi & Olahan" },
];

const TYPES = [
  { value: "all", label: "Semua Tipe", icon: BookOpen },
  { value: "text", label: "Artikel Teks", icon: FileText },
  { value: "video", label: "Video Panduan", icon: Video },
];

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ArtikelPage() {
  const allArticles = useMemo(() => getArticles(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | ArticleCategory>("all");
  const [selectedType, setSelectedType] = useState<"all" | "text" | "video">("all");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);

  // Client-side filtering for immediate feedback
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // 1. Kategori
      if (selectedCategory !== "all" && article.category !== selectedCategory) {
        return false;
      }

      // 2. Tipe
      if (selectedType === "text" && article.videoUrl) {
        return false;
      }
      if (selectedType === "video" && !article.videoUrl) {
        return false;
      }

      // 3. Pencarian teks
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchAuthor = article.author.toLowerCase().includes(q);
        const matchTags = article.tags.some((tag) => tag.toLowerCase().includes(q));
        return matchTitle || matchExcerpt || matchAuthor || matchTags;
      }

      return true;
    });
  }, [allArticles, searchQuery, selectedCategory, selectedType]);

  const handlePlayVideo = (article: Article) => {
    if (article.videoUrl) {
      const ytId = getYouTubeId(article.videoUrl);
      if (ytId) {
        setActiveVideoId(ytId);
        setActiveVideoTitle(article.title);
      }
    }
  };

  const getCategoryBadgeColor = (cat: ArticleCategory) => {
    switch (cat) {
      case "pupuk":
        return "bg-emerald-100 text-emerald-800 border-emerald-200/50";
      case "energi":
        return "bg-amber-100 text-amber-800 border-amber-200/50";
      case "budidaya":
        return "bg-teal-100 text-teal-800 border-teal-200/50";
      case "olahan":
        return "bg-indigo-100 text-indigo-800 border-indigo-200/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (cat: ArticleCategory) => {
    return CATEGORIES.find((c) => c.value === cat)?.label || cat;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header / Hero */}
      <div className="relative mb-12 overflow-hidden px-4 py-4 text-center text-white-soft sm:px-4 lg:py-4">
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-gold-500/10 border border-gold-500/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-500">
            Pusat Edukasi &amp; Tani Sirkular
          </span>
          <h1 className="mt-6 text-2xl font-extrabold text-brand-950 tracking-tight sm:text-3xl md:text-4xl">
            Panduan &amp; Artikel <span className="text-brand-900 font-accent italic">Limbah Nilam</span>
          </h1>
          <p className="mt-6 text-base text-ink-600 sm:text-lg">
            Temukan panduan praktis, teknik pertanian ramah lingkungan, pembuatan energi terbarukan, dan optimalisasi ekonomi sirkular dari pengolahan limbah tanaman nilam.
          </p>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="mb-10 space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-brand-700/50" />
            <input
              type="text"
              placeholder="Cari artikel, video, atau topik pemupukan & limbah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-line bg-white-soft py-3.5 pl-12 pr-6 text-sm font-semibold outline-none shadow-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 transition-all text-brand-950 placeholder:text-ink-600/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 rounded-full p-1 text-ink-600 hover:bg-cream-100 hover:text-brand-950 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex rounded-full border border-line bg-white-soft p-1 shadow-sm overflow-x-auto whitespace-nowrap">
            {TYPES.map((t) => {
              const Icon = t.icon;
              const isActive = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value as any)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-900 text-white-soft shadow-sm"
                      : "text-ink-600 hover:text-brand-950 hover:bg-cream-100/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-ink-600 mr-2">Kategori:</span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-brand-800 bg-brand-100 text-brand-900 font-bold"
                    : "border-line bg-white-soft text-ink-700 hover:border-brand-700 hover:text-brand-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const isVideo = !!article.videoUrl;
            return (
              <article
                key={article.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white-soft shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/50 hover:shadow-md"
              >
                {/* Image & Type Indicator */}
                <div className="relative aspect-video w-full overflow-hidden bg-cream-200">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category overlay */}
                  <span
                    className={`absolute top-4 left-4 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm ${getCategoryBadgeColor(
                      article.category
                    )}`}
                  >
                    {getCategoryLabel(article.category)}
                  </span>

                  {/* Play video overlay if video */}
                  {isVideo ? (
                    <button
                      onClick={() => handlePlayVideo(article)}
                      className="absolute inset-0 flex items-center justify-center bg-brand-950/30 transition-opacity hover:bg-brand-950/45 cursor-pointer"
                      aria-label="Putar video"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white-soft/90 text-brand-900 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-6 w-6 fill-brand-900 pl-0.5" />
                      </div>
                    </button>
                  ) : null}

                  {/* Type icon top-right */}
                  <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-brand-950/60 text-white-soft backdrop-blur-sm shadow-sm">
                    {isVideo ? <Video className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Meta details */}
                  <div className="mb-3 flex items-center gap-4 text-xs font-semibold text-ink-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {isVideo ? `${article.videoDuration} durasi` : article.readTime}
                    </span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-bold leading-snug text-brand-950 line-clamp-2 group-hover:text-brand-800">
                    {isVideo ? (
                      <button
                        onClick={() => handlePlayVideo(article)}
                        className="text-left font-bold hover:underline cursor-pointer"
                      >
                        {article.title}
                      </button>
                    ) : (
                      <Link href={`/artikel/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    )}
                  </h3>

                  {/* Excerpt */}
                  <p className="mb-4 text-sm leading-relaxed text-ink-600 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-line/40 flex items-center justify-between">
                    {/* Author */}
                    <div>
                      <p className="text-xs font-bold text-brand-950">{article.author}</p>
                      {article.authorRole && (
                        <p className="text-[10px] text-ink-600">{article.authorRole}</p>
                      )}
                    </div>

                    {/* Action link */}
                    {isVideo ? (
                      <button
                        onClick={() => handlePlayVideo(article)}
                        className="flex items-center gap-1 text-xs font-extrabold text-gold-600 hover:text-gold-500 cursor-pointer"
                      >
                        Tonton Video <Play className="h-3 w-3 fill-gold-600" />
                      </button>
                    ) : (
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="flex items-center gap-1 text-xs font-extrabold text-brand-800 hover:text-brand-700"
                      >
                        Baca Selengkapnya <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-brand-700 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-brand-950">Tidak ada hasil ditemukan</h3>
          <p className="mt-2 text-sm text-ink-600 max-w-sm">
            Tidak ada artikel atau video yang cocok dengan pencarian &quot;{searchQuery}&quot; di kategori ini. Coba periksa ejaan atau ubah filter Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedType("all");
            }}
            className="mt-6 rounded-full bg-brand-900 px-6 py-2.5 text-xs font-bold text-white-soft hover:bg-brand-800 transition-all cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl border border-white-soft/10 bg-brand-950 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-brand-900 border-b border-white-soft/10">
              <div className="flex items-center gap-2 text-white-soft">
                <Video className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold text-sm md:text-base line-clamp-1">{activeVideoTitle}</h3>
              </div>
              <button
                onClick={() => {
                  setActiveVideoId(null);
                  setActiveVideoTitle(null);
                }}
                className="rounded-full bg-brand-950/50 p-2 text-white-soft/75 hover:bg-brand-950 hover:text-white-soft transition-all cursor-pointer"
                aria-label="Tutup video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Aspect ratio container for YouTube Embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title={activeVideoTitle || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
