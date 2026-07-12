"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, Send, X } from "lucide-react";
import type { ChatMessage, ChatResponse } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

const MarkdownMessage = dynamic(
  () => import("@/components/chatbot/markdown-message").then((m) => m.MarkdownMessage),
  { ssr: false },
);

// ─── Config ───────────────────────────────────────────────────────────────────

const HIDDEN_PREFIXES = ["/checkout", "/auth"];

function shouldHideChatbot(pathname: string) {
  return HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
}

// ─── Message helpers ──────────────────────────────────────────────────────────

type TimestampedMessage = ChatMessage & { sentAt: number };

function createMessage(role: ChatMessage["role"], content: string, sentAt: number): TimestampedMessage {
  return {
    id: `${role}-${sentAt}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    sentAt,
  };
}

function formatTime(ts: number): string {
  if (ts <= 0) return "";

  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Greeting & starter questions ─────────────────────────────────────────────

function getDynamicGreeting(path: string): string {
  if (path === "/products" || path.startsWith("/products/"))
    return "Sedang cari produk nilam? Tanyakan rekomendasi, manfaat, atau bahan baku langsung dari penyuling Aceh.";
  if (path.startsWith("/ampas"))
    return "Tertarik Ampas Nilam B2B? Tanyakan ketersediaan, harga per kg, atau opsi pengiriman ke lokasi kamu.";
  if (path.startsWith("/artikel"))
    return "Ada pertanyaan tentang artikel yang sedang kamu baca? Atau ingin tahu lebih soal dunia nilam Aceh?";
  if (path.startsWith("/admin"))
    return "Halo Admin. Ada yang bisa dibantu terkait operasional atau data platform?";
  if (path.startsWith("/seller"))
    return "Butuh bantuan kelola toko? Tanyakan cara buat promo, daftarkan ampas B2B, atau gunakan AI untuk deskripsi produk.";
  return "Halo! Aku NILOKA Assistant — bisa bantu soal produk nilam, Nilam Passport, ampas B2B, atau cara belanja di platform ini.";
}

function getStarterQuestions(path: string): string[] {
  if (path === "/products" || path.startsWith("/products/"))
    return ["Nilam untuk relaksasi?", "Cara baca Nilam Passport?", "Promo hari ini?"];
  if (path.startsWith("/ampas"))
    return ["Harga ampas per kg?", "Ampas bisa dipakai untuk?", "Cara kirim B2B?"];
  if (path.startsWith("/artikel"))
    return ["Cara distilasi nilam?", "Manfaat ampas nilam?", "Budidaya nilam?"];
  if (path.startsWith("/seller") || path.startsWith("/admin"))
    return ["Daftar jadi seller?", "Apa itu Nilam Passport?", "Cara buat promo?"];
  return ["Produk untuk relaksasi?", "Apa itu Nilam Passport?", "Cek ampas nilam aktif?"];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TimestampedMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);

  // null = idle, "waiting" = loading before first token, string = streaming content
  const [streamState, setStreamState] = useState<null | "waiting" | string>(null);
  // timestamp when assistant starts responding (for streaming bubble)
  const [streamStartedAt, setStreamStartedAt] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = streamState !== null;
  const displayMessages: TimestampedMessage[] =
    messages.length > 0
      ? messages
      : [
          {
            id: `assistant-greeting-${pathname}`,
            role: "assistant",
            content: getDynamicGreeting(pathname),
            sentAt: 0,
          },
        ];

  const resetGreeting = useCallback(() => {
    setMessages([]);
    setLastResponse(null);
    setStreamState(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamState]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 112)}px`;
  }, [input]);

  const sendMessage = useCallback(async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const requestTime = Date.now();
    const userMsg = createMessage("user", trimmed, requestTime);

    const currentMessages =
      messages.length > 0
        ? messages
        : [createMessage("assistant", getDynamicGreeting(pathname), requestTime)];
    const nextMessages = [...currentMessages, userMsg].slice(-20);
    setMessages(nextMessages);
    setInput("");
    setStreamState("waiting"); // show typing indicator
    setStreamStartedAt(requestTime);
    setLastResponse(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        let msg = "Asisten tidak bisa merespons. Coba lagi sebentar.";
        try {
          const err = await response.json();
          if (typeof err.error === "string") msg = err.error;
          else if (typeof err.answerMarkdown === "string") msg = err.answerMarkdown;
        } catch { /* ignore */ }
        throw new Error(msg);
      }

      if (!response.body) throw new Error("Tidak ada respons.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let finalMeta: ChatResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const nullIdx = chunk.indexOf("\x00");

        if (nullIdx !== -1) {
          accumulated += chunk.slice(0, nullIdx);
          setStreamState(accumulated); // switch from "waiting" to streaming text
          try { finalMeta = JSON.parse(chunk.slice(nullIdx + 1)) as ChatResponse; } catch { /* ignore */ }
        } else {
          accumulated += chunk;
          // Only switch away from "waiting" when we have actual text
          if (accumulated.length > 0) setStreamState(accumulated);
        }
      }

      const finalText = accumulated || "Tidak ada respons yang diterima.";
      if (finalMeta) setLastResponse({ ...finalMeta, answerMarkdown: finalText });
      setStreamState(null);

      const assistantMsg = createMessage("assistant", finalText, requestTime);
      setMessages((cur) => [...cur.slice(-19), assistantMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Asisten tidak bisa merespons. Coba lagi.";
      setStreamState(null);
      const assistantErrorMsg = createMessage("assistant", msg, requestTime);
      setMessages((cur) => [...cur.slice(-19), assistantErrorMsg]);
    }
  }, [isLoading, messages, pathname]);

  const starterQuestions = getStarterQuestions(pathname);
  const isStreaming = typeof streamState === "string" && streamState !== "waiting";
  const isWaiting = streamState === "waiting";

  if (shouldHideChatbot(pathname)) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        aria-label={isOpen ? "Tutup Chatbot NILOKA" : "Buka Chatbot NILOKA"}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-950 text-white shadow-lg ring-1 ring-white/10 transition-all hover:bg-brand-800 active:scale-95"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {isOpen && (
        <section
          aria-label="Chatbot NILOKA"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[80svh] flex-col overflow-hidden rounded-2xl border border-line shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[400px]"
          style={{ background: "var(--cream-50)" }}
        >
          {/* Header — warm brand tone, not plain white */}
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-brand-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight text-white">NILOKA Assistant</p>
                <p className="text-[10px] text-white/60">Nilam &amp; Marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Reset percakapan"
                title="Mulai ulang"
                onClick={resetGreeting}
                className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Tutup chatbot"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          {/* Starter questions — fixed height, never shrinks, horizontal scroll */}
          <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-line bg-cream-100 px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {starterQuestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={isLoading}
                onClick={() => sendMessage(q)}
                className="shrink-0 whitespace-nowrap rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-ink-700 transition hover:border-brand-700 hover:text-brand-950 disabled:pointer-events-none disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
          >
            {displayMessages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex flex-col items-end gap-0.5">
                  <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-brand-950 px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                    {msg.content}
                  </div>
                  {msg.sentAt > 0 && (
                    <time className="px-1 text-[10px] text-ink-600/70">
                      {formatTime(msg.sentAt)}
                    </time>
                  )}
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col items-start gap-0.5">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-brand-950">
                    <div className="overflow-x-auto">
                      <MarkdownMessage content={msg.content} />
                    </div>
                  </div>
                  {msg.sentAt > 0 && (
                    <time className="px-1 text-[10px] text-ink-600/70">
                      {formatTime(msg.sentAt)}
                    </time>
                  )}
                </div>
              )
            )}

            {/* Typing indicator — visible while waiting for first token */}
            {isWaiting && (
              <div className="flex flex-col items-start gap-1">
                <div className="rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "300ms" }} />
                    </span>
                    <span className="text-[11px] text-ink-600">NILOKA Assistant sedang mengetik…</span>
                  </div>
                </div>
                <time className="px-1 text-[10px] text-ink-600/70">
                  {formatTime(streamStartedAt)}
                </time>
              </div>
            )}

            {/* Streaming bubble — shown token by token */}
            {isStreaming && (
              <div className="flex flex-col items-start gap-0.5">
                <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-line bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-brand-950">
                  <div className="overflow-x-auto">
                    <MarkdownMessage content={streamState} />
                  </div>
                  <span aria-hidden className="mt-0.5 inline-block h-3 w-0.5 animate-pulse rounded-full bg-brand-700 align-middle" />
                </div>
                <time className="px-1 text-[10px] text-ink-600/70">
                  {formatTime(streamStartedAt)}
                </time>
              </div>
            )}

            {/* Product suggestions */}
            {lastResponse && lastResponse.suggestions.length > 0 && !isLoading && (
              <div className="space-y-1.5">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                  Rekomendasi
                </p>
                {lastResponse.suggestions.map((s) => (
                  <Link
                    key={s.productId}
                    href={s.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-2.5 transition hover:border-brand-700"
                  >
                    {s.imageUrl && (
                      <Image
                        src={s.imageUrl}
                        alt={s.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 rounded-lg border border-line object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-brand-950">{s.name}</p>
                      <p className="line-clamp-1 text-[10px] text-ink-600">{s.reason}</p>
                    </div>
                    <p className="shrink-0 text-[11px] font-bold text-brand-900">
                      {formatRupiah(s.price.amount)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Input area — warm cream background, not plain white */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex shrink-0 items-end gap-2 border-t border-line bg-cream-100 p-3"
          >
            <label className="sr-only" htmlFor="niloka-chat-input">Tulis pesan</label>
            <textarea
              ref={textareaRef}
              id="niloka-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Tulis pesan… (Enter kirim, Shift+Enter baris baru)"
              className="max-h-28 w-full flex-1 resize-none overflow-hidden rounded-xl border border-line bg-white px-3 py-2 text-[13px] text-brand-950 placeholder:text-ink-600/50 outline-none transition focus:border-brand-700 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              rows={1}
            />
            <button
              type="submit"
              aria-label="Kirim pesan"
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-950 text-white transition hover:bg-brand-800 disabled:opacity-30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
