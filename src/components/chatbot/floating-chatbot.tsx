"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import type { ChatMessage, ChatResponse } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

const MarkdownMessage = dynamic(
  () => import("@/components/chatbot/markdown-message").then((module) => module.MarkdownMessage),
  {
    ssr: false,
  },
);

const hiddenPrefixes = ["/admin", "/seller", "/checkout", "/auth"];

const starterQuestions = [
  "Produk nilam apa yang cocok untuk relaksasi?",
  "Bandingkan roll-on dan diffuser NILOKA.",
  "Ada promo untuk produk nilam?",
];

function shouldHideChatbot(pathname: string): boolean {
  return hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `chat-${role}-${Date.now()}-${content.length}`,
    role,
    content,
  };
}

export function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "Halo, aku Chatbot **NILOKA**. Aku bisa bantu soal produk nilam, Nilam Passport, promo, Berita & Artikel Edukasi Limbah Nilam, dan Ampas Nilam B2B.",
    ),
  ]);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        body: JSON.stringify({
          messages: nextMessages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      setLastResponse(data);
      setMessages((current) => [
        ...current,
        createMessage("assistant", data.answerMarkdown),
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "Maaf, asisten NILOKA sedang tidak bisa merespons. Coba lagi sebentar.",
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

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
                    Produk nilam, passport, promo, dan ampas B2B.
                  </p>
                </div>
              </div>
              <button
                aria-label="Tutup chatbot"
                className="rounded-full p-2 text-white-soft/80 transition hover:bg-white-soft/10 hover:text-white-soft"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-line bg-cream-50 px-4 py-3">
            {starterQuestions.map((question) => (
              <button
                className="shrink-0 rounded-full border border-line bg-white-soft px-3 py-1.5 text-[11px] font-bold text-brand-900"
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
                    ? "ml-auto max-w-[86%] rounded-2xl bg-brand-900 px-4 py-2.5 text-sm font-medium text-white-soft"
                    : "mr-auto max-w-[92%] rounded-2xl border border-line bg-cream-50 px-4 py-2.5 text-sm leading-6 text-brand-950"
                }
                key={message.id}
              >
                <div className="overflow-x-auto">
                  <MarkdownMessage content={message.content} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto rounded-2xl border border-line bg-cream-50 px-4 py-3 text-xs font-bold text-ink-600">
                Menyusun jawaban NILOKA...
              </div>
            )}
            {lastResponse && lastResponse.suggestions.length > 0 && (
              <div className="grid gap-2">
                {lastResponse.suggestions.map((suggestion) => (
                  <Link
                    className="rounded-2xl border border-line bg-white px-3 py-2 text-xs transition hover:border-brand-700"
                    href={suggestion.href}
                    key={suggestion.productId}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="block font-extrabold text-brand-950">
                      {suggestion.name}
                    </span>
                    <span className="mt-1 block text-ink-600">
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
              placeholder="Tanya produk nilam..."
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
