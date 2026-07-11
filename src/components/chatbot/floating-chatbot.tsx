"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, Send, Sparkles, X } from "lucide-react";
import type { ChatMessage, ChatResponse } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

const MarkdownMessage = dynamic(
  () => import("@/components/chatbot/markdown-message").then((module) => module.MarkdownMessage),
  {
    ssr: false,
  },
);

// Hidden only in checkout and authentication pages
const hiddenPrefixes = ["/checkout", "/auth"];

function shouldHideChatbot(pathname: string): boolean {
  return hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `chat-${role}-${Date.now()}-${content.length}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
  };
}

function getDynamicGreeting(path: string): string {
  if (path === "/products") {
    return "Halo! Aku **NILOKA Assistant**. Sedang mencari produk nilam terbaik? Tanyakan padaku rekomendasi minyak nilam, diffuser, sabun, atau produk lainnya sesuai kebutuhanmu!";
  }
  if (path.startsWith("/products/")) {
    return "Halo! Aku **NILOKA Assistant**. Sedang melihat detail produk ini? Kamu bisa menanyakan profil aroma, manfaat, cara penggunaan, atau mengecek transparansi **Nilam Passport** produk ini.";
  }
  if (path.startsWith("/ampas")) {
    return "Halo! Aku **NILOKA Assistant**. Tertarik dengan **Ampas Nilam B2B**? Tanyakan ketersediaan ampas aktif, harga per kg, lokasi pengiriman, atau cara memanfaatkannya menjadi briket/kompos!";
  }
  if (path.startsWith("/artikel")) {
    return "Halo! Aku **NILOKA Assistant**. Sedang membaca edukasi nilam? Kamu bisa menanyakan detail artikel, cara penyulingan nilam, atau pemanfaatan limbah nilam lainnya.";
  }
  if (path.startsWith("/admin")) {
    return "Halo **Admin NILOKA**! Aku siap membantumu. Tanyakan statistik produk, informasi validasi seller, atau cara kerja sistem administrasi NILOKA.";
  }
  if (path.startsWith("/seller")) {
    return "Halo **Mitra Seller NILOKA**! Butuh bantuan mengelola toko? Tanyakan cara membuat promo baru, mengelola ampas B2B, atau menggunakan AI Co-pilot untuk menulis deskripsi produk.";
  }
  return "Halo! Aku **NILOKA Assistant**. Aku bisa membantumu mencari produk nilam terbaik, mengecek **Nilam Passport**, mencari listing ampas B2B, mengecek promo, atau menjawab FAQ seputar cara belanja di NILOKA.";
}

function getStarterQuestions(path: string): string[] {
  if (path === "/products" || path.startsWith("/products/")) {
    return [
      "Rekomendasi minyak nilam untuk relaksasi?",
      "Bagaimana cara membaca Nilam Passport?",
      "Ada promo produk apa hari ini?"
    ];
  }
  if (path.startsWith("/ampas")) {
    return [
      "Berapa harga ampas nilam per kg?",
      "Ampas nilam kering bisa dipakai untuk apa?",
      "Bagaimana pengiriman ampas nilam B2B?"
    ];
  }
  if (path.startsWith("/artikel")) {
    return [
      "Bagaimana proses distilasi daun nilam?",
      "Apa manfaat pupuk organik ampas nilam?",
      "Bagaimana cara budidaya nilam?"
    ];
  }
  if (path.startsWith("/seller") || path.startsWith("/admin")) {
    return [
      "Bagaimana cara mendaftar jadi seller?",
      "Apa itu Nilam Passport?",
      "Bagaimana cara membuat promo toko?"
    ];
  }
  return [
    "Produk apa yang cocok untuk relaksasi?",
    "Apa itu Nilam Passport?",
    "Ada ampas nilam aktif?"
  ];
}

export function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize messages state with dynamic greeting
  useEffect(() => {
    setMessages([createMessage("assistant", getDynamicGreeting(pathname))]);
  }, []);

  // Update dynamic greeting on pathname change if user has not typed anything yet
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([createMessage("assistant", getDynamicGreeting(pathname))]);
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  if (shouldHideChatbot(pathname)) {
    return null;
  }

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, createMessage("user", trimmed)];
    
    // Limit to keeping max 20 messages in client state (10 user, 10 assistant)
    const slicedMessages = nextMessages.slice(-20);
    setMessages(slicedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        body: JSON.stringify({
          messages: slicedMessages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        let errorMessage = "Maaf, asisten NILOKA sedang tidak bisa merespons. Coba lagi sebentar.";
        try {
          const errData = await response.json();
          if (errData) {
            if (typeof errData.error === "string") {
              errorMessage = errData.error;
            } else if (typeof errData.answerMarkdown === "string") {
              errorMessage = errData.answerMarkdown;
            }
          }
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(errorMessage);
      }

      const data: ChatResponse = await response.json();
      setLastResponse(data);
      setMessages((current) => [
        ...current.slice(-19), // Keep room for the assistant response
        createMessage("assistant", data.answerMarkdown),
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Maaf, asisten NILOKA sedang tidak bisa merespons. Coba lagi sebentar.";
      setMessages((current) => [
        ...current.slice(-19),
        createMessage(
          "assistant",
          errorMessage,
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const starterQuestions = getStarterQuestions(pathname);

  return (
    <>
      <button
        aria-label={isOpen ? "Tutup Chatbot NILOKA" : "Buka Chatbot NILOKA"}
        className="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-white/30 bg-brand-950 text-white-soft shadow-2xl transition hover:bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        style={{ touchAction: "manipulation" }}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {isOpen && (
        <section
          aria-label="Chatbot NILOKA"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[78svh] flex-col overflow-hidden rounded-[28px] border border-line bg-white-soft shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[420px]"
        >
          <header className="border-b border-line bg-brand-950 p-4 text-white-soft">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white-soft/12">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold">NILOKA Assistant</h2>
                  <p className="text-[11px] font-medium text-white-soft/70">
                    Asisten AI Resmi Nilam & Marketplace
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Reset percakapan"
                  className="rounded-full p-2 text-white-soft/80 transition hover:bg-white-soft/10 hover:text-white-soft"
                  onClick={() => {
                    setMessages([createMessage("assistant", getDynamicGreeting(pathname))]);
                    setLastResponse(null);
                  }}
                  title="Mulai Ulang Chat"
                  type="button"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  aria-label="Tutup chatbot"
                  className="rounded-full p-2 text-white-soft/80 transition hover:bg-white-soft/10 hover:text-white-soft"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-line bg-cream-50 px-4 py-3 scrollbar-none">
            {starterQuestions.map((question) => (
              <button
                className="shrink-0 rounded-full border border-line bg-white-soft px-3 py-1.5 text-[11px] font-bold text-brand-900 hover:bg-cream-100 transition"
                key={question}
                onClick={() => sendMessage(question)}
                type="button"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" ref={scrollRef}>
            {messages.map((message) => (
              <div
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[86%] rounded-2xl bg-brand-900 px-4 py-2.5 text-sm font-medium text-white-soft shadow-sm"
                    : "mr-auto max-w-[92%] rounded-2xl border border-line bg-cream-50 px-4 py-2.5 text-sm leading-6 text-brand-950 shadow-sm"
                }
                key={message.id}
              >
                <div className="overflow-x-auto">
                  <MarkdownMessage content={message.content} />
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mr-auto flex items-center gap-1.5 rounded-2xl border border-line bg-cream-50 px-4 py-3 shadow-sm">
                <span className="text-xs font-bold text-ink-600">Menyusun jawaban NILOKA</span>
                <span className="flex gap-1 items-center justify-center pt-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700" style={{ animationDelay: "300ms" }}></span>
                </span>
              </div>
            )}

            {lastResponse && lastResponse.suggestions.length > 0 && !isLoading && (
              <div className="grid gap-2 mt-2">
                <p className="text-[11px] font-bold text-brand-950/60 uppercase tracking-wider px-1">Rekomendasi Produk:</p>
                {lastResponse.suggestions.map((suggestion) => (
                  <Link
                    className="rounded-2xl border border-line bg-white p-2.5 text-xs transition hover:border-brand-700 hover:shadow-md flex gap-3 items-center"
                    href={suggestion.href}
                    key={suggestion.productId}
                    onClick={() => setIsOpen(false)}
                  >
                    {suggestion.imageUrl && (
                      <img
                        alt={suggestion.name}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover border border-line bg-cream-50"
                        src={suggestion.imageUrl}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="block font-extrabold text-brand-950 truncate">
                        {suggestion.name}
                      </span>
                      <span className="block text-[10px] text-ink-500 line-clamp-1">
                        {suggestion.reason}
                      </span>
                    </div>
                    <span className="shrink-0 font-bold text-brand-900 bg-brand-50 px-2 py-1 rounded-lg text-[11px]">
                      {formatRupiah(suggestion.price.amount)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-end gap-2 border-t border-line bg-white-soft p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <label className="sr-only" htmlFor="niloka-chat-input">
              Tulis pertanyaan untuk chatbot NILOKA
            </label>
            <textarea
              className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-cream-50 px-3 py-2 text-sm font-medium text-brand-950 outline-none focus:border-brand-700"
              id="niloka-chat-input"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tanya produk, passport, promo..."
              value={input}
            />
            <button
              aria-label="Kirim pesan"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-950 text-white-soft transition hover:bg-brand-900 disabled:opacity-40"
              disabled={isLoading || !input.trim()}
              type="submit"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
