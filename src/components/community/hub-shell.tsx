"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MessageSquare,
  Heart,
  Plus,
  MapPin,
  Sparkles,
  X,
  ChevronDown,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Upload,
  TrendingUp,
  UsersRound,
  Flame,
  Sprout,
  BarChart3,
} from "lucide-react";
import type { CommunityDiagnoseResultDto, CommunityPostDto } from "@/lib/dal/community-dal";
import { createPostAction } from "@/lib/actions/community-actions";

type HubShellProps = {
  posts: CommunityPostDto[];
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    sellerId: string | null;
  } | null;
  initialSearch: string;
  initialCategory: string;
  initialLocation: string;
  initialSort: "newest" | "likes" | "replies";
};

const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "BUDIDAYA", label: "Diskusi Budidaya" },
  { value: "PANEN", label: "Bagikan Panen/Produk" },
  { value: "REVIEW", label: "Review & Pengalaman" },
  { value: "PASAR", label: "Tanya Harga & Pasar" },
  { value: "UMUM", label: "Umum" },
] as const;

const LOCATIONS = ["all", "Aceh Jaya", "Aceh Selatan", "Gayo Lues"] as const;

function parseRecentDiagnoses(value: string | null): CommunityDiagnoseResultDto[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CommunityDiagnoseResultDto[]) : [];
  } catch (error) {
    console.error("Failed to load diagnoses from localStorage:", error);
    return [];
  }
}

function formatDiagnosisDate(timestamp: CommunityDiagnoseResultDto["timestamp"]) {
  if (!timestamp) return "Tanggal tidak tersedia";

  return new Date(timestamp).toLocaleDateString("id-ID");
}

export function HubShell({
  posts,
  currentUser,
  initialSearch,
  initialCategory,
  initialLocation,
  initialSort,
}: HubShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & Filter State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  // UI Modals & Interaction States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<typeof CATEGORIES[number]["value"] | "">("");
  const [newLocation, setNewLocation] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [attachedDiagnose, setAttachedDiagnose] = useState<CommunityDiagnoseResultDto | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Local storage recent diagnoses
  const [recentDiagnoses, setRecentDiagnoses] = useState<CommunityDiagnoseResultDto[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setRecentDiagnoses(parseRecentDiagnoses(localStorage.getItem("niloka_recent_diagnoses")));
    });
  }, []);

  // Check if "share_diagnose" URL param is present on load to auto-open creation modal
  useEffect(() => {
    if (searchParams.get("share_diagnose") === "true") {
      queueMicrotask(() => {
        try {
          const list = parseRecentDiagnoses(localStorage.getItem("niloka_recent_diagnoses"));
          setRecentDiagnoses(list);

          if (list.length > 0) {
            const latestDiagnose = list[0];
            setAttachedDiagnose(latestDiagnose);
            setNewCategory("BUDIDAYA");
            setNewTitle("Diskusi Diagnosa AI: " + (latestDiagnose.diagnosis ?? "Tanaman Nilam"));
          }

          // Try to load the image from sessionStorage
          const imgBase64 = sessionStorage.getItem("niloka_share_image_base64");
          const imgName = sessionStorage.getItem("niloka_share_image_name");
          const imgType = sessionStorage.getItem("niloka_share_image_type");

          if (imgBase64 && imgName && imgType) {
            // Convert base64 to File
            const byteCharacters = atob(imgBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new File([byteArray], imgName, { type: imgType });

            setUploadedFiles([file]);
            setUploadedPreviews([URL.createObjectURL(file)]);

            // Clean up sessionStorage
            sessionStorage.removeItem("niloka_share_image_base64");
            sessionStorage.removeItem("niloka_share_image_name");
            sessionStorage.removeItem("niloka_share_image_type");
          }

          setIsCreateModalOpen(true);
        } catch (error) {
          console.error(error);
        }
      });
      // Clean up the URL parameter smoothly
      router.replace("/nilam-hub");
    }
  }, [searchParams, router]);

  // Handle live search / filters update by pushing router path
  const updateFilters = (
    newSearch: string,
    newCategory: string,
    newLocation: string,
    newSort: string
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory !== "all") params.set("category", newCategory);
    if (newLocation !== "all") params.set("location", newLocation);
    if (newSort !== "newest") params.set("sort", newSort);

    router.push(`/nilam-hub?${params.toString()}`);
  };

  const handleCategoryChange = (categoryVal: string) => {
    setSelectedCategory(categoryVal);
    updateFilters(search, categoryVal, selectedLocation, selectedSort);
  };

  const handleLocationChange = (locVal: string) => {
    setSelectedLocation(locVal);
    updateFilters(search, selectedCategory, locVal, selectedSort);
  };

  const handleSortChange = (sortVal: string) => {
    setSelectedSort(sortVal as "newest" | "likes" | "replies");
    updateFilters(search, selectedCategory, selectedLocation, sortVal);
  };

  // Image Upload handler for new post
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 3 images max
    const newFiles = [...uploadedFiles, ...files].slice(0, 3);
    setUploadedFiles(newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setUploadedPreviews(previews);
  };

  const removeUploadedFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    URL.revokeObjectURL(uploadedPreviews[index]);
    const newPreviews = uploadedPreviews.filter((_, i) => i !== index);
    setUploadedPreviews(newPreviews);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedPreviews]);

  // Auth Guard helper
  const ensureAuthenticated = (action: () => void) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };

  // Create Post Submit Handler
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newContent.trim()) {
      setPostError("Konten postingan wajib diisi.");
      return;
    }
    if (!newCategory) {
      setPostError("Kategori wajib dipilih.");
      return;
    }

    setIsSubmittingPost(true);
    setPostError(null);

    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("content", newContent);
      formData.append("category", newCategory);
      formData.append("location", newLocation);

      uploadedFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (attachedDiagnose) {
        formData.append("diagnoseResult", JSON.stringify(attachedDiagnose));
      }

      const res = await createPostAction(formData);

      if (res.ok) {
        // Reset states
        setNewTitle("");
        setNewContent("");
        setNewCategory("");
        setNewLocation("");
        setUploadedFiles([]);
        setUploadedPreviews([]);
        setAttachedDiagnose(null);
        setIsCreateModalOpen(false);
        router.refresh();
      } else {
        setPostError(res.message);
      }
    } catch {
      setPostError("Gagal membagikan postingan. Silakan coba lagi.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Get localized tag names and styling
  const getCategoryLabel = (cat: string) => {
    return CATEGORIES.find((c) => c.value === cat)?.label || cat;
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "BUDIDAYA":
        return "bg-teal-100 text-teal-800 border-teal-200/50";
      case "PANEN":
        return "bg-emerald-100 text-emerald-800 border-emerald-200/50";
      case "REVIEW":
        return "bg-amber-100 text-amber-800 border-amber-200/50";
      case "PASAR":
        return "bg-indigo-100 text-indigo-800 border-indigo-200/50";
      case "UMUM":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-brand-50 text-brand-900 border-brand-100";
    }
  };

  const totalReplies = posts.reduce((sum, post) => sum + post.commentsCount, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
  const topDiscussions = [...posts]
    .sort((a, b) => b.likesCount + b.commentsCount - (a.likesCount + a.commentsCount))
    .slice(0, 3);
  const activeLocations = Array.from(new Set(posts.map((post) => post.location).filter(Boolean))).slice(0, 3);
  const selectedCategoryLabel = getCategoryLabel(selectedCategory);

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 border-b border-line/60 pb-5 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-850">
            <UsersRound className="h-3.5 w-3.5" />
            Komunitas Nilam
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">
            Nilam <span className="font-accent italic text-brand-900">Hub</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-650">
            Diskusi singkat, tanya jawab budidaya, panen, review produk, dan info pasar dari komunitas NILOKA.
          </p>
        </div>
        <button
          onClick={() => ensureAuthenticated(() => setIsCreateModalOpen(true))}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-800 sm:w-fit"
        >
          <Plus className="h-4 w-4" />
          Buat Diskusi
        </button>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <section className="min-w-0 space-y-4">
          <button
            onClick={() => ensureAuthenticated(() => setIsCreateModalOpen(true))}
            className="flex w-full flex-col gap-3 rounded-2xl border border-line bg-white-soft p-4 text-left shadow-sm transition-all hover:border-brand-700/60 hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex w-full min-w-0 items-center gap-3 sm:flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-sm font-extrabold text-brand-950">
                {currentUser?.name?.charAt(0) ?? "N"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-brand-950">Apa yang ingin kamu diskusikan?</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-600 sm:truncate">
                  Bagikan pertanyaan, panen, review, atau update harga pasar.
                </p>
              </div>
            </div>
            <span className="inline-flex w-full justify-center rounded-full bg-brand-900 px-4 py-2 text-xs font-bold text-white sm:w-auto">
              Mulai
            </span>
          </button>

          <div className="rounded-2xl border border-line bg-white-soft p-3 shadow-sm">
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_190px_auto]">
              <div className="relative flex min-w-0 items-center sm:col-span-2 xl:col-span-1">
                <Search className="absolute left-3.5 h-4.5 w-4.5 text-brand-700/55" />
                <input
                  type="text"
                  placeholder="Cari diskusi, topik budidaya, atau harga ampas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFilters(search, selectedCategory, selectedLocation, selectedSort);
                    }
                  }}
                  className="w-full rounded-xl border border-line bg-cream-50/30 py-3 pl-11 pr-10 text-sm font-semibold text-brand-950 outline-none transition-all placeholder:text-ink-600/50 focus:border-brand-700 focus:bg-white"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      updateFilters("", selectedCategory, selectedLocation, selectedSort);
                    }}
                    className="absolute right-3 rounded-full p-1 text-ink-600 transition-all hover:bg-cream-100 hover:text-brand-950"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative min-w-0">
                <select
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-cream-50/30 py-3 pl-4 pr-10 text-xs font-bold text-brand-950 outline-none transition-all focus:border-brand-700 focus:bg-white"
                >
                  <option value="all">Semua Wilayah</option>
                  {LOCATIONS.filter((l) => l !== "all").map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-900" />
              </div>

              <div className="relative min-w-0">
                <select
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-cream-50/30 py-3 pl-4 pr-10 text-xs font-bold text-brand-950 outline-none transition-all focus:border-brand-700 focus:bg-white"
                >
                  <option value="newest">Terbaru</option>
                  <option value="likes">Terpopuler</option>
                  <option value="replies">Banyak Dibalas</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-900" />
              </div>

              <button
                onClick={() => updateFilters(search, selectedCategory, selectedLocation, selectedSort)}
                className="w-full rounded-xl bg-brand-900 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-brand-800 sm:col-span-2 xl:col-span-1"
              >
                Cari
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`max-w-full rounded-full border px-3.5 py-2 text-xs font-bold transition-all sm:px-4 ${
                      isActive
                        ? "border-brand-850 bg-brand-100 text-brand-900"
                        : "border-line bg-white text-ink-700 hover:border-brand-750 hover:text-brand-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-brand-950">{selectedCategoryLabel}</h2>
              <p className="text-xs text-ink-600">
                {posts.length} diskusi aktif dalam tampilan ini
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white-soft px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-650">
              <Flame className="h-3.5 w-3.5 text-red-650" />
              Live Feed
            </span>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => {
                const hasImages = post.images && post.images.length > 0;
                return (
                  <Link
                    key={post.id}
                    href={`/nilam-hub/${post.id}`}
                    className="group block min-w-0 rounded-2xl border border-line bg-white-soft p-4 shadow-sm transition-all hover:border-brand-700/55 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-sm font-extrabold text-brand-950">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="min-w-0 break-words text-sm font-extrabold text-brand-950">
                            {post.author.name}
                          </span>
                          {post.author.sellerVerified && (
                            <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-800">
                              Seller
                            </span>
                          )}
                          {post.author.isFarmer && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                              Petani
                            </span>
                          )}
                          <span className="text-xs text-ink-500">
                            {new Date(post.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(
                              post.category
                            )}`}
                          >
                            {getCategoryLabel(post.category)}
                          </span>
                          {post.location && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand-850">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {post.location}
                            </span>
                          )}
                          {post.diagnoseResult && (
                            <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-teal-800">
                              <Sparkles className="h-3 w-3" />
                              AI Diagnosa
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 break-words text-base font-extrabold leading-snug text-brand-950 group-hover:text-brand-800">
                          {post.title || "Diskusi Komunitas"}
                        </h3>
                        <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-ink-700">
                          {post.content}
                        </p>

                        {hasImages && (
                          <div className="relative mt-3 aspect-[16/9] max-h-60 overflow-hidden rounded-2xl border border-line bg-cream-200 sm:max-h-80">
                            <Image
                              src={post.images[0]}
                              alt={post.title || "Lampiran diskusi"}
                              fill
                              sizes="(max-width: 1024px) 100vw, 760px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          </div>
                        )}

                        {!hasImages && post.diagnoseResult && (
                          <div className="mt-3 rounded-2xl border border-teal-200/70 bg-teal-50/55 p-3">
                            <div className="flex items-center gap-2 text-xs font-extrabold text-teal-900">
                              <Sparkles className="h-4 w-4" />
                              {post.diagnoseResult.diagnosis ?? "AI Diagnosa Terlampir"}
                            </div>
                            {post.diagnoseResult.confidence && (
                              <p className="mt-1 text-xs font-semibold text-teal-800">
                                Tingkat keyakinan {post.diagnoseResult.confidence}%
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line/45 pt-3 text-xs font-bold text-ink-650">
                          <span className="flex items-center gap-1.5">
                            <Heart className={`h-4 w-4 ${post.likedByCurrentUser ? "fill-red-600 text-red-600" : ""}`} />
                            {post.likesCount} Suka
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4" />
                            {post.commentsCount} Komentar
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white-soft p-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-brand-700">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-base font-extrabold text-brand-950">Belum ada diskusi yang cocok</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
                Tidak ada postingan yang cocok dengan pencarian &quot;{search}&quot; atau filter yang aktif.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                  updateFilters("", "all", "all", selectedSort);
                }}
                className="mt-5 rounded-full bg-brand-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-800"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-brand-950">Ringkasan Komunitas</h2>
              <BarChart3 className="h-4 w-4 text-brand-850" />
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-xl bg-cream-50/50 py-3">
              <div className="min-w-0 px-2 text-center sm:px-3">
                <p className="text-base font-extrabold text-brand-950 sm:text-lg">{posts.length}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-600 sm:text-[10px]">Diskusi</p>
              </div>
              <div className="min-w-0 px-2 text-center sm:px-3">
                <p className="text-base font-extrabold text-brand-950 sm:text-lg">{totalReplies}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-600 sm:text-[10px]">Komentar</p>
              </div>
              <div className="min-w-0 px-2 text-center sm:px-3">
                <p className="text-base font-extrabold text-brand-950 sm:text-lg">{totalLikes}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-600 sm:text-[10px]">Suka</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-850" />
              <h2 className="text-sm font-extrabold text-brand-950">Diskusi Ramai</h2>
            </div>
            <div className="mt-3 space-y-3">
              {topDiscussions.length > 0 ? (
                topDiscussions.map((post) => (
                  <Link
                    key={post.id}
                    href={`/nilam-hub/${post.id}`}
                    className="block rounded-xl border border-line/60 bg-cream-50/35 p-3 transition-all hover:border-brand-700/55 hover:bg-white"
                  >
                    <p className="line-clamp-2 break-words text-xs font-extrabold leading-snug text-brand-950">
                      {post.title || "Diskusi Komunitas"}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-ink-600">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs leading-relaxed text-ink-600">Diskusi ramai akan tampil setelah ada postingan.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-brand-850" />
              <h2 className="text-sm font-extrabold text-brand-950">Topik Cepat</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.filter((cat) => cat.value !== "all").map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className="max-w-full rounded-full border border-line bg-cream-50/35 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-700 transition-all hover:border-brand-750 hover:text-brand-900"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {activeLocations.length > 0 && (
              <div className="mt-4 border-t border-line/50 pt-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-600">Wilayah Aktif</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-900"
                    >
                      <MapPin className="h-3 w-3" />
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* CREATE NEW POST MODAL */}
      {isCreateModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-line bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line/50 mb-5">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-brand-900" />
                <h3 className="font-bold text-brand-950 text-base">Buat Postingan Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-full bg-cream-100 p-2 text-ink-600 hover:bg-cream-200 transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Error Alert */}
            {postError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 border border-red-200 text-xs font-semibold text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{postError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5">
                  Judul Postingan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tanya takaran pupuk untuk tanaman 2 bulan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-line px-4 py-3 text-xs font-semibold outline-none focus:border-brand-700 transition-all text-brand-950"
                  maxLength={100}
                />
              </div>

              {/* Category & Location selectors */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1.5">
                    Kategori / Topik Forum <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as typeof CATEGORIES[number]["value"])
                    }
                    className="w-full rounded-xl border border-line px-4 py-3 text-xs font-semibold outline-none focus:border-brand-700 bg-white transition-all text-brand-950 cursor-pointer"
                  >
                    <option value="">Pilih topik...</option>
                    {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1.5">
                    Lokasi Wilayah (Opsional)
                  </label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-line px-4 py-3 text-xs font-semibold outline-none focus:border-brand-700 bg-white transition-all text-brand-950 cursor-pointer"
                  >
                    <option value="">Pilih asal wilayah...</option>
                    {LOCATIONS.filter((l) => l !== "all").map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5">
                  Isi Postingan / Teks <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  placeholder="Tuliskan pertanyaan, rincian produk, ulasan, atau obrolan bebas seputar nilam di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full h-32 rounded-xl border border-line p-4 text-xs font-semibold outline-none focus:border-brand-700 resize-none transition-all text-brand-950"
                  minLength={10}
                />
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1.5">
                  Unggah Foto (Opsional, Maksimal 3)
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-cream-50/30 text-center hover:border-brand-700 transition-all">
                    <Upload className="h-5 w-5 text-brand-800/60" />
                    <span className="text-[9px] font-bold text-ink-600 mt-1">Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploadedFiles.length >= 3}
                    />
                  </label>

                  {/* Previews */}
                  {uploadedPreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-20 rounded-xl overflow-hidden border border-line bg-cream-100"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(index)}
                        className="absolute top-1 right-1 rounded-full bg-brand-950/80 p-0.5 text-white hover:bg-brand-900 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attach Diagnose selection */}
              {recentDiagnoses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1.5">
                    Lampirkan Hasil Diagnosa AI Terakhir?
                  </label>
                  {attachedDiagnose ? (
                    <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/45 p-3.5 text-xs font-semibold text-teal-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-700" />
                        <span>
                          {attachedDiagnose.diagnosis} ({attachedDiagnose.confidence}%) -{" "}
                          {formatDiagnosisDate(attachedDiagnose.timestamp)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedDiagnose(null)}
                        className="text-teal-900 hover:text-red-650 font-bold ml-4 cursor-pointer"
                      >
                        Batal Lampirkan
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-28 overflow-y-auto rounded-xl border border-line divide-y divide-line/40">
                      {recentDiagnoses.map((diag, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 hover:bg-cream-50 transition-colors text-xs"
                        >
                          <div>
                            <span className="font-bold text-brand-950">
                              {diag.diagnosis} ({diag.confidence}%)
                            </span>
                            <span className="text-[10px] text-ink-500 block">
                              {formatDiagnosisDate(diag.timestamp)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAttachedDiagnose(diag);
                              setNewCategory("BUDIDAYA");
                            }}
                            className="rounded-full bg-brand-100 hover:bg-brand-200 text-brand-900 px-3 py-1 font-bold text-[10px] cursor-pointer"
                          >
                            Lampirkan
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-line/50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-xs font-bold text-ink-700 hover:bg-cream-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="rounded-full bg-brand-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50 flex items-center justify-center min-w-28 cursor-pointer"
                >
                  {isSubmittingPost ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin mr-1.5" /> Mengirim...
                    </>
                  ) : (
                    "Bagikan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN PROMPT MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-2xl text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-650 mx-auto mb-4 border border-red-150">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-brand-950 mb-2">Login Diperlukan</h3>
            <p className="text-xs text-ink-700 mb-6 leading-relaxed">
              Anda harus masuk ke akun NILOKA Anda terlebih dahulu sebelum dapat membuat postingan, menyukai diskusi, atau mengirim komentar.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-xs font-bold text-white bg-brand-950 hover:bg-brand-900 transition-all"
              >
                Masuk (Login)
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full flex justify-center py-2.5 px-4 border border-line rounded-full text-xs font-bold text-brand-950 bg-cream-50 hover:bg-cream-100 transition-all cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
