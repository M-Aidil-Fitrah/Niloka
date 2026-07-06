"use client";

import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { Review, ReviewTag } from "@/lib/contracts";

type ProductReviewsProps = {
  reviews: Review[];
  productId: string;
  sellerId: string;
};

// Preset photos that users can choose to mock "uploading a photo"
const PHOTO_PRESETS = [
  {
    id: "preset-1",
    label: "Aroma Terapi",
    src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
  },
  {
    id: "preset-2",
    label: "Kemasan Rapi",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
  },
  {
    id: "preset-3",
    label: "Bahan Organik",
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
  },
];

const AVAILABLE_TAGS: { key: ReviewTag; label: string }[] = [
  { key: "authentic-aroma", label: "✨ Aroma Autentik" },
  { key: "fast-delivery", label: "⚡ Pengiriman Cepat" },
  { key: "clear-passport", label: "📜 Transparansi Paspor" },
  { key: "good-packaging", label: "📦 Kemasan Rapi" },
  { key: "repeat-order", label: "🔄 Order Lagi" },
];

export function ProductReviews({ reviews: initialReviews, productId, sellerId }: ProductReviewsProps) {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>([]);
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState<string | null>(null);

  const ratingAverage =
    reviewsList.length > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
      : 0;

  const handleTagToggle = (tagKey: ReviewTag) => {
    setSelectedTags((prev) =>
      prev.includes(tagKey) ? prev.filter((t) => t !== tagKey) : [...prev, tagKey]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !body.trim()) return;

    const newReview: Review & { photo?: string } = {
      id: `review-mock-${Date.now()}`,
      productId,
      sellerId,
      authorName,
      rating,
      tags: selectedTags,
      body,
      createdAt: new Date().toISOString(),
    };

    if (selectedPhotoSrc) {
      newReview.photo = selectedPhotoSrc;
    }

    setReviewsList((prev) => [newReview, ...prev]);

    // Reset Form State
    setAuthorName("");
    setRating(5);
    setBody("");
    setSelectedTags([]);
    setSelectedPhotoSrc(null);
    setIsFormOpen(false);
  };

  return (
    <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 pb-5 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-brand-950">Ulasan Pelanggan</h3>
          <p className="text-xs text-ink-600">Pendapat jujur mereka yang telah mencoba produk ini</p>
        </div>

        <div className="flex items-center gap-4">
          {reviewsList.length > 0 && (
            <div className="flex items-center gap-2 bg-cream-50 px-3 py-1.5 rounded-2xl border border-line/50">
              <span className="text-xl font-extrabold text-brand-950">{ratingAverage.toFixed(1)}</span>
              <div className="flex flex-col">
                <div className="flex text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(ratingAverage) ? "fill-gold-500 text-gold-500" : "text-line"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-ink-600 mt-0.5">{reviewsList.length} ulasan</span>
              </div>
            </div>
          )}

          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="h-9 px-4 rounded-xl text-xs font-bold bg-brand-900 hover:bg-brand-850 text-white-soft shadow-sm"
          >
            {isFormOpen ? "Tutup Form" : "Tulis Ulasan"}
          </Button>
        </div>
      </div>

      {/* Write Review Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-cream-50/50 border border-line/65 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300 text-xs"
        >
          <h4 className="text-xs font-extrabold text-brand-950 uppercase tracking-wider">
            Bagikan Pengalaman Anda
          </h4>

          {/* Interactive Star Rating */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Rating Bintang *</span>
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: 5 }).map((_, i) => {
                const starVal = i + 1;
                const isLit = starVal <= (hoverRating ?? rating);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                  >
                    <StarIcon
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        isLit ? "fill-gold-500 text-gold-500" : "text-line/80 hover:text-gold-400"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-[11px] font-bold text-brand-900 ml-1.5">
                {rating === 5
                  ? "Sangat Puas (5)"
                  : rating === 4
                  ? "Puas (4)"
                  : rating === 3
                  ? "Cukup (3)"
                  : rating === 2
                  ? "Kecewa (2)"
                  : "Sangat Kecewa (1)"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Nama Anda *</label>
              <input
                type="text"
                required
                className="w-full h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                placeholder="Masukkan nama lengkap / anonim"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>

            {/* Experience Tags */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Tag Pengalaman</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.key);
                  return (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => handleTagToggle(tag.key)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                        isSelected
                          ? "bg-brand-900 border-brand-900 text-white-soft shadow-sm"
                          : "bg-white border-line text-brand-950 hover:bg-cream-100"
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Preset Selector */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Lampirkan Foto Ulasan (Opsional)</span>
              <div className="flex gap-3 mt-1.5">
                {PHOTO_PRESETS.map((preset) => {
                  const isSelected = selectedPhotoSrc === preset.src;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPhotoSrc(isSelected ? null : preset.src)}
                      className={`relative h-14 w-14 rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected ? "border-brand-900 ring-2 ring-brand-700/30 scale-95" : "border-line/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={preset.src} alt={preset.label} fill className="object-cover" sizes="56px" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-950/40 flex items-center justify-center">
                          <span className="text-white-soft font-bold text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Deskripsi Ulasan *</label>
              <textarea
                required
                rows={3}
                className="w-full rounded-xl border border-line bg-white p-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none resize-none"
                placeholder="Bagikan ulasan jujur Anda tentang kualitas produk, aroma, daya tahan, atau kemasan..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="h-9 px-4 rounded-xl border border-line hover:bg-cream-100 text-brand-950 font-bold"
            >
              Batal
            </button>
            <Button
              type="submit"
              className="h-9 px-5 rounded-xl bg-brand-900 hover:bg-brand-850 text-white-soft font-bold"
            >
              Kirim Ulasan
            </Button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviewsList.length > 0 ? (
        <div className="divide-y divide-line/60">
          {reviewsList.map((reviewItem) => {
            const review = reviewItem as Review & { photo?: string };
            return (
              <div key={review.id} className="py-5 first:pt-0 last:pb-0 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-brand-950">{review.authorName}</span>
                    <div className="mt-1 flex text-gold-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating ? "fill-gold-500 text-gold-500" : "text-line"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-ink-600 bg-cream-100/60 border border-line/40 px-2 py-0.5 rounded-lg">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Display Experience Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {review.tags.map((tagKey) => {
                      const matchedTag = AVAILABLE_TAGS.find((t) => t.key === tagKey);
                      return (
                        <span
                          key={tagKey}
                          className="text-[9px] font-bold text-brand-950 bg-cream-50 border border-line/45 px-2 py-0.5 rounded-full"
                        >
                          {matchedTag?.label || tagKey}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Review Text Body */}
                <p className="text-sm leading-relaxed text-ink-800 font-medium">{review.body}</p>

                {/* Render attached photo if any */}
                {"photo" in review && review.photo && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-line/45 bg-cream-100 shadow-sm transition-transform hover:scale-105 duration-200">
                    <Image
                      src={review.photo as string}
                      alt="Ulasan Foto"
                      className="object-cover"
                      fill
                      sizes="80px"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center bg-cream-50/20 border border-dashed border-line/80 rounded-2xl">
          <p className="text-xs text-ink-600 font-bold">Belum ada ulasan untuk produk ini.</p>
          <p className="text-[10px] text-ink-600 mt-1">Jadilah yang pertama untuk membagikan pengalaman Anda!</p>
        </div>
      )}
    </div>
  );
}
