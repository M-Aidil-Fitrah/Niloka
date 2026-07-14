"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Trash2,
  X,
  ChevronDown,
  Reply,
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle2,
  User,
  Upload,
} from "lucide-react";
import type { CommunityPostDto, CommunityCommentDto } from "@/lib/dal/community-dal";
import {
  createPostAction,
  likePostAction,
  commentPostAction,
  deletePostAction,
} from "@/lib/actions/community-actions";

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
  const [selectedPost, setSelectedPost] = useState<CommunityPostDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);

  // New Post Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<typeof CATEGORIES[number]["value"] | "">("");
  const [newLocation, setNewLocation] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [attachedDiagnose, setAttachedDiagnose] = useState<any | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Comments / Interaction Input State
  const [commentText, setCommentText] = useState<Record<string, string>>({}); // postId -> text
  const [replyText, setReplyText] = useState<Record<string, string>>({}); // commentId -> text
  const [interactionLoading, setInteractionLoading] = useState<Record<string, boolean>>({});

  // Local storage recent diagnoses
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([]);

  // Find latest state of selected post from the posts prop, keeping modal details in sync
  const currentSelectedPost = useMemo(() => {
    if (!selectedPost) return null;
    return posts.find((p) => p.id === selectedPost.id) || selectedPost;
  }, [posts, selectedPost]);

  // Load recent diagnoses on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("niloka_recent_diagnoses");
      if (stored) {
        setRecentDiagnoses(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load diagnoses from localStorage:", e);
    }
  }, []);

  // Check if "share_diagnose" URL param is present on load to auto-open creation modal
  useEffect(() => {
    if (searchParams.get("share_diagnose") === "true") {
      try {
        const stored = localStorage.getItem("niloka_recent_diagnoses");
        if (stored) {
          const list = JSON.parse(stored);
          if (list.length > 0) {
            // Auto-attach the most recent diagnosis
            setAttachedDiagnose(list[0]);
            setNewCategory("BUDIDAYA");
            setNewTitle("Diskusi Diagnosa AI: " + list[0].diagnosis);
          }
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
      } catch (e) {
        console.error(e);
      }
      setIsCreateModalOpen(true);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, selectedCategory, selectedLocation, selectedSort);
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
    } catch (err) {
      setPostError("Gagal membagikan postingan. Silakan coba lagi.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Like Post handler
  const handleLike = async (postId: string) => {
    ensureAuthenticated(async () => {
      setInteractionLoading((prev) => ({ ...prev, [`like-${postId}`]: true }));
      try {
        await likePostAction(postId);
        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`like-${postId}`]: false }));
      }
    });
  };

  // Comment Post handler
  const handleComment = async (postId: string) => {
    ensureAuthenticated(async () => {
      const text = commentText[postId] || "";
      if (!text.trim()) return;

      setInteractionLoading((prev) => ({ ...prev, [`comment-${postId}`]: true }));
      try {
        const res = await commentPostAction(postId, text);
        if (res.ok) {
          setCommentText((prev) => ({ ...prev, [postId]: "" }));
          router.refresh();
        } else {
          alert(res.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`comment-${postId}`]: false }));
      }
    });
  };

  // Reply Comment handler
  const handleReply = async (postId: string, commentId: string) => {
    ensureAuthenticated(async () => {
      const text = replyText[commentId] || "";
      if (!text.trim()) return;

      setInteractionLoading((prev) => ({ ...prev, [`reply-${commentId}`]: true }));
      try {
        const res = await commentPostAction(postId, text, commentId);
        if (res.ok) {
          setReplyText((prev) => ({ ...prev, [commentId]: "" }));
          setReplyToCommentId(null);
          router.refresh();
        } else {
          alert(res.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`reply-${commentId}`]: false }));
      }
    });
  };

  // Delete Post handler
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus postingan ini secara permanen?")) return;
    try {
      const res = await deletePostAction(postId);
      if (res.ok) {
        router.refresh();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Title */}
      <div className="relative mb-12 text-center">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="mt-6 text-2xl font-extrabold text-brand-950 tracking-tight sm:text-3xl md:text-4xl">
            Nilam <span className="text-brand-900 font-accent italic">Hub</span>
          </h1>
          <p className="mt-4 text-sm text-ink-600 sm:text-base max-w-2xl mx-auto leading-relaxed">
            Forum diskusi, berbagi panen, review produk, dan pantauan harga pasar.
            Terintegrasi langsung dengan hasil AI Diagnosa kesehatan tanaman.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => ensureAuthenticated(() => setIsCreateModalOpen(true))}
              className="flex items-center gap-2 rounded-full bg-brand-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-800 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <Plus className="h-4 w-4" /> Buat Diskusi Baru
            </button>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="mb-10 space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-brand-700/50" />
            <input
              type="text"
              placeholder="Cari kata kunci, topik budidaya, atau harga ampas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-line bg-white-soft py-3.5 pl-12 pr-6 text-sm font-semibold outline-none shadow-sm focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 transition-all text-brand-950 placeholder:text-ink-600/50"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  updateFilters("", selectedCategory, selectedLocation, selectedSort);
                }}
                className="absolute right-4 rounded-full p-1 text-ink-600 hover:bg-cream-100 hover:text-brand-950 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="appearance-none w-full md:w-52 rounded-full border border-line bg-white-soft py-3.5 pl-5 pr-10 text-xs font-bold text-brand-950 shadow-sm focus:border-brand-700 outline-none transition-all cursor-pointer"
            >
              <option value="all">Semua Wilayah</option>
              {LOCATIONS.filter((l) => l !== "all").map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-900 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none w-full md:w-56 rounded-full border border-line bg-white-soft py-3.5 pl-5 pr-10 text-xs font-bold text-brand-950 shadow-sm focus:border-brand-700 outline-none transition-all cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="likes">Terpopuler (Disukai)</option>
              <option value="replies">Paling Banyak Dibalas</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-900 pointer-events-none" />
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
                onClick={() => handleCategoryChange(cat.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-brand-850 bg-brand-100 text-brand-900 font-bold"
                    : "border-line bg-white-soft text-ink-700 hover:border-brand-750 hover:text-brand-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Grid (Styled EXACTLY like ArticleShell) */}
      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const hasImages = post.images && post.images.length > 0;
            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white-soft shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/50 hover:shadow-md cursor-pointer"
              >
                {/* Image or AI Placeholder at top */}
                {hasImages ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-cream-200">
                    <Image
                      src={post.images[0]}
                      alt={post.title || "Image preview"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : post.diagnoseResult ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-teal-900/10 to-emerald-50/20 flex flex-col items-center justify-center p-4 text-center">
                    <Sparkles className="h-7 w-7 text-teal-800 mb-1.5 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-900">
                      AI Diagnosa Terlampir
                    </span>
                    <span className="text-xs font-bold text-brand-950 mt-1 line-clamp-1">
                      {post.diagnoseResult.diagnosis} ({post.diagnoseResult.confidence}%)
                    </span>
                  </div>
                ) : (
                  <div className="relative h-10 w-full bg-gradient-to-r from-cream-100/30 to-cream-50/30" />
                )}

                {/* Card Content Area */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Meta tag / Location info */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(
                        post.category
                      )}`}
                    >
                      {getCategoryLabel(post.category)}
                    </span>
                    {post.location && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-brand-850">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {post.location}
                      </span>
                    )}
                  </div>

                  {/* Post Title */}
                  <h3 className="mb-2 text-sm font-bold leading-snug text-brand-950 line-clamp-2 group-hover:text-brand-800">
                    {post.title || "Diskusi Komunitas"}
                  </h3>

                  {/* Post Excerpt */}
                  <p className="mb-4 text-xs leading-relaxed text-ink-600 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-auto pt-4 border-t border-line/40 flex items-center justify-between">
                    {/* Author block */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-200 text-brand-950 font-bold text-[10px]">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-brand-950 truncate max-w-[120px]">
                          {post.author.name}
                        </p>
                        <p className="text-[8px] text-ink-500">
                          {new Date(post.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Stats Icons */}
                    <div className="flex items-center gap-3 text-ink-600 text-[10px] font-bold">
                      <span className="flex items-center gap-1.5 hover:text-red-650 transition-colors">
                        <Heart className={`h-3.5 w-3.5 ${post.likedByCurrentUser ? "fill-red-600 text-red-600" : ""}`} />
                        {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-brand-800 transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {post.commentsCount}
                      </span>
                    </div>
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
            Tidak ada postingan yang cocok dengan pencarian &quot;{search}&quot;. Coba ganti kata kunci
            atau filter Anda.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSelectedLocation("all");
              updateFilters("", "all", "all", selectedSort);
            }}
            className="mt-6 rounded-full bg-brand-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-800 transition-all cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* DETAIL POST MODAL */}
      {currentSelectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Close Button */}
            <button
              onClick={() => {
                setSelectedPost(null);
                setReplyToCommentId(null);
              }}
              className="absolute top-6 right-6 rounded-full bg-cream-100 p-2 text-ink-600 hover:bg-cream-250 hover:text-brand-950 transition-all cursor-pointer z-10"
              aria-label="Tutup diskusi"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Author Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-100 border border-brand-200/50 text-brand-950 font-bold text-sm">
                  {currentSelectedPost.author.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-brand-950">
                      {currentSelectedPost.author.name}
                    </span>
                    {currentSelectedPost.author.role === "admin" && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-red-700">
                        Admin
                      </span>
                    )}
                    {currentSelectedPost.author.sellerVerified && (
                      <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-800">
                        Seller
                      </span>
                    )}
                    {currentSelectedPost.author.isFarmer && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                        Petani
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-600">
                    <span>
                      {new Date(currentSelectedPost.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {currentSelectedPost.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-brand-850 font-medium">
                          <MapPin className="h-3 w-3" />
                          {currentSelectedPost.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Topic badge */}
              <div>
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(
                    currentSelectedPost.category
                  )}`}
                >
                  {getCategoryLabel(currentSelectedPost.category)}
                </span>
              </div>

              {/* Title */}
              {currentSelectedPost.title && (
                <h2 className="text-xl font-bold text-brand-950 leading-snug">
                  {currentSelectedPost.title}
                </h2>
              )}

              {/* Content text */}
              <p className="text-sm leading-relaxed text-ink-700 whitespace-pre-line">
                {currentSelectedPost.content}
              </p>

              {/* Attached Photos */}
              {currentSelectedPost.images && currentSelectedPost.images.length > 0 && (
                <div className="grid gap-2 overflow-hidden rounded-2xl border border-line/45 max-w-xl">
                  {currentSelectedPost.images.map((src, i) => (
                    <div key={i} className="relative aspect-video w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Attached image ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Attached AI Diagnose result */}
              {currentSelectedPost.diagnoseResult && (
                <div className="rounded-2xl border border-line bg-gradient-to-br from-brand-900/5 to-gold-50/10 p-5 shadow-inner">
                  <div className="flex items-center gap-2 mb-3 border-b border-line/60 pb-2">
                    <Sparkles className="h-4.5 w-4.5 text-brand-700" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
                      Lampiran AI Diagnosa Kesehatan Tanaman
                    </h4>
                  </div>
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                          Diagnosis
                        </span>
                        <span className="text-sm font-bold text-brand-950">
                          {currentSelectedPost.diagnoseResult.diagnosis}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                          Tingkat Keyakinan
                        </span>
                        <span className="text-sm font-bold text-brand-900 font-sans">
                          {currentSelectedPost.diagnoseResult.confidence}%
                        </span>
                      </div>
                    </div>

                    {currentSelectedPost.diagnoseResult.kemungkinanTambahan && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                          Kemungkinan Tambahan
                        </span>
                        <p className="text-xs font-semibold text-ink-700">
                          {currentSelectedPost.diagnoseResult.kemungkinanTambahan}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                        Penyebab
                      </span>
                      <p className="text-xs text-ink-750">{currentSelectedPost.diagnoseResult.penyebab}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                        Alasan Visual AI
                      </span>
                      <p className="text-xs leading-relaxed text-ink-700">
                        {currentSelectedPost.diagnoseResult.alasan}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                        Rekomendasi Penanganan
                      </span>
                      <ul className="mt-1 space-y-1">
                        {currentSelectedPost.diagnoseResult.rekomendasi?.map((step: string, i: number) => (
                          <li key={i} className="flex gap-2 text-xs text-ink-750">
                            <span className="font-bold text-brand-800">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Post Button (Author/Admin) */}
              {currentUser && (currentUser.id === currentSelectedPost.author.id || currentUser.role === "admin") && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      handleDeletePost(currentSelectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-650 hover:bg-red-50 rounded-full transition-all cursor-pointer border border-red-200"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus Diskusi
                  </button>
                </div>
              )}

              {/* Like & Comments Stats Panel */}
              <div className="flex items-center gap-6 border-t border-line/50 pt-4 text-xs font-bold text-ink-650">
                <button
                  onClick={() => handleLike(currentSelectedPost.id)}
                  disabled={interactionLoading[`like-${currentSelectedPost.id}`]}
                  className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer ${
                    currentSelectedPost.likedByCurrentUser ? "text-red-600 bg-red-50" : ""
                  }`}
                >
                  {interactionLoading[`like-${currentSelectedPost.id}`] ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  ) : (
                    <Heart className={`h-4 w-4 ${currentSelectedPost.likedByCurrentUser ? "fill-red-600 text-red-600" : ""}`} />
                  )}
                  <span>{currentSelectedPost.likesCount} Suka</span>
                </button>
                <span className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-brand-50/50 text-brand-900">
                  <MessageSquare className="h-4 w-4" />
                  <span>{currentSelectedPost.commentsCount} Komentar</span>
                </span>
              </div>

              {/* Comments Feed Area */}
              <div className="space-y-4 pt-4 border-t border-line/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">
                  Komentar Diskusi ({currentSelectedPost.comments.length})
                </h4>

                {currentSelectedPost.comments.length > 0 ? (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                    {currentSelectedPost.comments.map((comment) => (
                      <div key={comment.id} className="space-y-2.5">
                        <div className="bg-cream-100/30 rounded-2xl p-4 border border-line/20">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-brand-950 font-bold text-xs">
                                {comment.author.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-brand-950">{comment.author.name}</span>
                                  {comment.author.role === "admin" && (
                                    <span className="rounded bg-red-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-red-700 scale-90">
                                      Admin
                                    </span>
                                  )}
                                  {comment.author.sellerVerified && (
                                    <span className="rounded bg-brand-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-brand-800 scale-90">
                                      Seller
                                    </span>
                                  )}
                                  {comment.author.isFarmer && (
                                    <span className="rounded bg-emerald-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-emerald-800 scale-90">
                                      Petani
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-ink-500 block">
                                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-ink-750 leading-relaxed whitespace-pre-line pl-9">
                            {comment.content}
                          </p>
                          <div className="mt-2 pl-9">
                            <button
                              onClick={() =>
                                setReplyToCommentId(replyToCommentId === comment.id ? null : comment.id)
                              }
                              className="text-[10px] font-extrabold text-brand-850 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Reply className="h-3 w-3" /> Balas
                            </button>
                          </div>
                        </div>

                        {/* Replies (nested) */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="pl-6 space-y-2.5 border-l-2 border-line/65 ml-4.5">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="bg-cream-50/40 rounded-2xl p-3.5 border border-line/10">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-200 text-brand-950 font-bold text-[10px]">
                                    {reply.author.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-brand-950">{reply.author.name}</span>
                                      {reply.author.role === "admin" && (
                                        <span className="rounded bg-red-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-red-700 scale-90">
                                          Admin
                                        </span>
                                      )}
                                      {reply.author.sellerVerified && (
                                        <span className="rounded bg-brand-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-brand-800 scale-90">
                                          Seller
                                        </span>
                                      )}
                                      {reply.author.isFarmer && (
                                        <span className="rounded bg-emerald-100 px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wider text-emerald-800 scale-90">
                                          Petani
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[8px] text-ink-500 block">
                                      {new Date(reply.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-ink-750 leading-relaxed whitespace-pre-line pl-8">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Reply Input Box */}
                        {replyToCommentId === comment.id && (
                          <div className="pl-6 flex gap-2 animate-in slide-in-from-left-2 duration-150">
                            <input
                              type="text"
                              placeholder={`Balas ${comment.author.name}...`}
                              value={replyText[comment.id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment.id]: e.target.value,
                                }))
                              }
                              className="flex-1 rounded-full border border-line bg-cream-50/15 px-4 py-2 text-xs font-semibold outline-none focus:border-brand-700 transition-all text-brand-950"
                            />
                            <button
                              onClick={async () => {
                                await handleReply(currentSelectedPost.id, comment.id);
                              }}
                              disabled={interactionLoading[`reply-${comment.id}`]}
                              className="rounded-full bg-brand-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50 shrink-0 cursor-pointer"
                            >
                              {interactionLoading[`reply-${comment.id}`] ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Balas"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center text-ink-600/70 py-6">
                    Belum ada komentar. Tulis tanggapan pertama Anda di bawah!
                  </p>
                )}

                {/* New Comment Input Box inside Modal */}
                {currentUser ? (
                  <div className="flex gap-3 pt-3 border-t border-line/35">
                    <input
                      type="text"
                      placeholder="Tulis tanggapan atau saran Anda..."
                      value={commentText[currentSelectedPost.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [currentSelectedPost.id]: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-full border border-line bg-white px-4 py-3 text-xs font-semibold outline-none focus:border-brand-700 transition-all text-brand-950"
                    />
                    <button
                      onClick={async () => {
                        await handleComment(currentSelectedPost.id);
                      }}
                      disabled={interactionLoading[`comment-${currentSelectedPost.id}`]}
                      className="rounded-full bg-brand-900 px-5 py-3 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      {interactionLoading[`comment-${currentSelectedPost.id}`] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Kirim"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-cream-50/50 p-4 border border-dashed border-line text-center text-xs text-ink-600">
                    Kamu harus{" "}
                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        setIsAuthModalOpen(true);
                      }}
                      className="font-bold text-brand-900 hover:underline cursor-pointer"
                    >
                      login
                    </button>{" "}
                    terlebih dahulu untuk menulis komentar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                          {new Date(attachedDiagnose.timestamp || Date.now()).toLocaleDateString(
                            "id-ID"
                          )}
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
                              {new Date(diag.timestamp || Date.now()).toLocaleDateString("id-ID")}
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
