"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  Loader2,
  MapPin,
  MessageSquare,
  Reply,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { CommunityPostDto } from "@/lib/dal/community-dal";
import {
  commentPostAction,
  deletePostAction,
  likePostAction,
} from "@/lib/actions/community-actions";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  sellerId: string | null;
} | null;

type PostDetailProps = {
  post: CommunityPostDto;
  currentUser: CurrentUser;
};

const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "BUDIDAYA", label: "Diskusi Budidaya" },
  { value: "PANEN", label: "Bagikan Panen/Produk" },
  { value: "REVIEW", label: "Review & Pengalaman" },
  { value: "PASAR", label: "Tanya Harga & Pasar" },
  { value: "UMUM", label: "Umum" },
] as const;

function getCategoryLabel(cat: string) {
  return CATEGORIES.find((c) => c.value === cat)?.label || cat;
}

function getCategoryBadgeClass(cat: string) {
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
}

function AuthorBadges({
  role,
  sellerVerified,
  isFarmer,
}: {
  role: string;
  sellerVerified: boolean;
  isFarmer: boolean;
}) {
  return (
    <>
      {role === "admin" && (
        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-red-700">
          Admin
        </span>
      )}
      {sellerVerified && (
        <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-800">
          Seller
        </span>
      )}
      {isFarmer && (
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
          Petani
        </span>
      )}
    </>
  );
}

export function PostDetail({ post, currentUser }: PostDetailProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState<Record<string, boolean>>({});

  const canDelete = currentUser && (currentUser.id === post.author.id || currentUser.role === "admin");
  const recommendations = post.diagnoseResult?.rekomendasi ?? [];

  const ensureAuthenticated = (action: () => void) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    action();
  };

  const handleLike = async () => {
    ensureAuthenticated(async () => {
      setInteractionLoading((prev) => ({ ...prev, [`like-${post.id}`]: true }));
      try {
        await likePostAction(post.id);
        router.refresh();
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`like-${post.id}`]: false }));
      }
    });
  };

  const handleComment = async () => {
    ensureAuthenticated(async () => {
      if (!commentText.trim()) return;

      setInteractionLoading((prev) => ({ ...prev, [`comment-${post.id}`]: true }));
      try {
        const res = await commentPostAction(post.id, commentText);
        if (res.ok) {
          setCommentText("");
          router.refresh();
        } else {
          alert(res.message);
        }
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`comment-${post.id}`]: false }));
      }
    });
  };

  const handleReply = async (commentId: string) => {
    ensureAuthenticated(async () => {
      const text = replyText[commentId] || "";
      if (!text.trim()) return;

      setInteractionLoading((prev) => ({ ...prev, [`reply-${commentId}`]: true }));
      try {
        const res = await commentPostAction(post.id, text, commentId);
        if (res.ok) {
          setReplyText((prev) => ({ ...prev, [commentId]: "" }));
          setReplyToCommentId(null);
          router.refresh();
        } else {
          alert(res.message);
        }
      } finally {
        setInteractionLoading((prev) => ({ ...prev, [`reply-${commentId}`]: false }));
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus postingan ini secara permanen?")) return;

    const res = await deletePostAction(post.id);
    if (res.ok) {
      router.push("/nilam-hub");
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6">
        <Link
          href="/nilam-hub"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white-soft px-4 py-2 text-xs font-bold text-brand-950 shadow-sm transition-all hover:border-brand-700 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <article className="min-w-0 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          <div className="p-4 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-200/50 bg-cream-100 text-sm font-bold text-brand-950">
                  {post.author.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-brand-950">{post.author.name}</span>
                    <AuthorBadges
                      role={post.author.role}
                      sellerVerified={post.author.sellerVerified}
                      isFarmer={post.author.isFarmer}
                    />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-600">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {post.location && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5 font-medium text-brand-850">
                          <MapPin className="h-3 w-3" />
                          {post.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-650 transition-all hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              )}
            </div>

            <span
              className={`inline-block rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(
                post.category
              )}`}
            >
              {getCategoryLabel(post.category)}
            </span>

            <h1 className="mt-5 break-words text-2xl font-extrabold leading-tight text-brand-950 sm:text-3xl">
              {post.title || "Diskusi Komunitas"}
            </h1>
            <p className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-ink-750 sm:text-base">
              {post.content}
            </p>
          </div>

          {post.images.length > 0 && (
            <div className="grid gap-2 border-y border-line/45 bg-cream-50 p-3">
              {post.images.map((src, index) => (
                <div key={src} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-cream-200">
                  <Image
                    src={src}
                    alt={`${post.title || "Lampiran diskusi"} ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {post.diagnoseResult && (
            <div className="border-b border-line/45 bg-gradient-to-br from-brand-900/5 to-gold-50/10 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-brand-700" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
                  Lampiran AI Diagnosa Kesehatan Tanaman
                </h2>
              </div>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                    Diagnosis
                  </span>
                  <span className="break-words font-bold text-brand-950">{post.diagnoseResult.diagnosis}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                    Tingkat Keyakinan
                  </span>
                  <span className="font-bold text-brand-900">{post.diagnoseResult.confidence}%</span>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-ink-750">
                {post.diagnoseResult.kemungkinanTambahan && (
                  <p>
                    <span className="font-bold text-brand-950">Kemungkinan Tambahan: </span>
                    {post.diagnoseResult.kemungkinanTambahan}
                  </p>
                )}
                {post.diagnoseResult.penyebab && (
                  <p>
                    <span className="font-bold text-brand-950">Penyebab: </span>
                    {post.diagnoseResult.penyebab}
                  </p>
                )}
                {post.diagnoseResult.alasan && (
                  <p>
                    <span className="font-bold text-brand-950">Alasan Visual AI: </span>
                    {post.diagnoseResult.alasan}
                  </p>
                )}
                {recommendations.length > 0 && (
                  <div>
                    <span className="font-bold text-brand-950">Rekomendasi Penanganan</span>
                    <ul className="mt-1 space-y-1">
                      {recommendations.map((step, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-bold text-brand-800">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-b border-line/45 p-5 text-xs font-bold text-ink-650 sm:px-8">
            <button
              onClick={handleLike}
              disabled={interactionLoading[`like-${post.id}`]}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all hover:bg-red-50 hover:text-red-600 ${
                post.likedByCurrentUser ? "bg-red-50 text-red-600" : ""
              }`}
            >
              {interactionLoading[`like-${post.id}`] ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              ) : (
                <Heart className={`h-4 w-4 ${post.likedByCurrentUser ? "fill-red-600 text-red-600" : ""}`} />
              )}
              <span>{post.likesCount} Suka</span>
            </button>
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50/50 px-3.5 py-1.5 text-brand-900">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentsCount} Komentar</span>
            </span>
          </div>

          <section className="space-y-4 p-4 sm:p-8">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">
              Komentar Diskusi ({post.comments.length})
            </h2>

            {post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="space-y-2.5">
                    <div className="min-w-0 rounded-2xl border border-line/20 bg-cream-100/30 p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-xs font-bold text-brand-950">
                          {comment.author.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-brand-950">{comment.author.name}</span>
                            <AuthorBadges
                              role={comment.author.role}
                              sellerVerified={comment.author.sellerVerified}
                              isFarmer={comment.author.isFarmer}
                            />
                          </div>
                          <span className="block text-[9px] text-ink-500">
                            {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="whitespace-pre-line break-words pl-0 text-xs leading-relaxed text-ink-750 sm:pl-9">
                        {comment.content}
                      </p>
                      <div className="mt-2 pl-0 sm:pl-9">
                        <button
                          onClick={() =>
                            currentUser
                              ? setReplyToCommentId(replyToCommentId === comment.id ? null : comment.id)
                              : setIsAuthModalOpen(true)
                          }
                          className="flex items-center gap-1 text-[10px] font-extrabold text-brand-850 hover:text-brand-700"
                        >
                          <Reply className="h-3 w-3" />
                          Balas
                        </button>
                      </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-2 space-y-2.5 border-l-2 border-line/65 pl-3 sm:ml-4.5 sm:pl-6">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="min-w-0 rounded-2xl border border-line/10 bg-cream-50/40 p-3.5">
                            <div className="mb-1.5 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-200 text-[10px] font-bold text-brand-950">
                                {reply.author.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-brand-950">{reply.author.name}</span>
                                  <AuthorBadges
                                    role={reply.author.role}
                                    sellerVerified={reply.author.sellerVerified}
                                    isFarmer={reply.author.isFarmer}
                                  />
                                </div>
                                <span className="block text-[8px] text-ink-500">
                                  {new Date(reply.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <p className="whitespace-pre-line break-words pl-0 text-xs leading-relaxed text-ink-750 sm:pl-8">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyToCommentId === comment.id && (
                      <div className="flex flex-col gap-2 pl-0 sm:flex-row sm:pl-6">
                        <input
                          type="text"
                          placeholder={`Balas ${comment.author.name}...`}
                          value={replyText[comment.id] || ""}
                          onChange={(event) =>
                            setReplyText((prev) => ({ ...prev, [comment.id]: event.target.value }))
                          }
                          className="min-w-0 flex-1 rounded-full border border-line bg-cream-50/15 px-4 py-2 text-xs font-semibold text-brand-950 outline-none transition-all focus:border-brand-700"
                        />
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={interactionLoading[`reply-${comment.id}`]}
                          className="shrink-0 rounded-full bg-brand-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50"
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
              <p className="py-6 text-center text-xs text-ink-600/70">
                Belum ada komentar. Tulis tanggapan pertama Anda di bawah!
              </p>
            )}

            {currentUser ? (
              <div className="flex flex-col gap-3 border-t border-line/35 pt-4 sm:flex-row">
                <input
                  type="text"
                  placeholder="Tulis tanggapan atau saran Anda..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-3 text-xs font-semibold text-brand-950 outline-none transition-all focus:border-brand-700"
                />
                <button
                  onClick={handleComment}
                  disabled={interactionLoading[`comment-${post.id}`]}
                  className="flex shrink-0 items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {interactionLoading[`comment-${post.id}`] ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Kirim"
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-cream-50/50 p-4 text-center text-xs text-ink-600">
                Kamu harus{" "}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-bold text-brand-900 hover:underline"
                >
                  login
                </button>{" "}
                terlebih dahulu untuk menulis komentar.
              </div>
            )}
          </section>
        </article>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-line bg-white-soft p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-brand-950">Info Diskusi</h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-ink-600">Kategori</dt>
                <dd className="text-right font-bold text-brand-950">{getCategoryLabel(post.category)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-ink-600">Suka</dt>
                <dd className="font-bold text-brand-950">{post.likesCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-ink-600">Komentar</dt>
                <dd className="font-bold text-brand-950">{post.commentsCount}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-150 bg-red-50 text-red-650">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-base font-extrabold text-brand-950">Login Diperlukan</h2>
            <p className="mb-6 text-xs leading-relaxed text-ink-700">
              Anda harus masuk ke akun NILOKA Anda terlebih dahulu sebelum dapat menyukai diskusi atau mengirim komentar.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                className="flex w-full justify-center rounded-full border border-transparent bg-brand-950 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-900"
              >
                Masuk (Login)
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="flex w-full justify-center rounded-full border border-line bg-cream-50 px-4 py-2.5 text-xs font-bold text-brand-950 transition-all hover:bg-cream-100"
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
