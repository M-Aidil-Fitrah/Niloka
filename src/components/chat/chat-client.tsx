"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle,
  MapPin,
  ArrowLeft,
  Trash2,
  ShoppingBag,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { getSellerById, getProductById, getAmpasListingById } from "@/lib/mock-queries";
import { formatRupiah } from "@/lib/formatters";

type MessageProductContext = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  kind: "product" | "ampas-listing";
  slug: string;
};

type ChatMessage = {
  id: string;
  sender: "buyer" | "seller" | "system-product-ref";
  text: string;
  timestamp: string;
  productContext?: MessageProductContext;
};

type ChatThread = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  lastMessage: string;
  updatedAt: string;
  unread: boolean;
  messages: ChatMessage[];
};

// Initial Default Mock Chats
const defaultThreads: ChatThread[] = [
  {
    id: "thread-seller-nilam-lestari",
    sellerId: "seller-nilam-lestari",
    sellerName: "Koperasi Nilam Lestari",
    sellerCity: "Aceh Jaya",
    lastMessage: "Halo Kak, ready banyak. Rencana mau ambil berapa ton?",
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    unread: true,
    messages: [
      {
        id: "msg-init-1",
        sender: "buyer",
        text: "Halo, apakah stok ampas basah ready untuk minggu depan?",
        timestamp: new Date(Date.now() - 3600000 * 2.2).toISOString(),
      },
      {
        id: "msg-init-2",
        sender: "seller",
        text: "Halo Kak, ready banyak. Rencana mau ambil berapa ton?",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: "thread-seller-aceh-aroma",
    sellerId: "seller-aceh-aroma",
    sellerName: "Aceh Aroma House",
    sellerCity: "Aceh Selatan",
    lastMessage: "Bisa banget Kak, kami biasa kirim pakai J&T atau cargo logistik.",
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    unread: false,
    messages: [
      {
        id: "msg-init-3",
        sender: "buyer",
        text: "Halo, minyak atsiri calming blend ini apa bisa dikirim ke Jawa?",
        timestamp: new Date(Date.now() - 3600000 * 24.5).toISOString(),
      },
      {
        id: "msg-init-4",
        sender: "seller",
        text: "Bisa banget Kak, kami biasa kirim pakai J&T atau cargo logistik.",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
  },
];

export function ChatClient() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize and load threads from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("niloka_chats");
      let currentThreads: ChatThread[] = stored ? JSON.parse(stored) : defaultThreads;

      // Handle incoming URL parameters (context creation)
      const sellerId = searchParams.get("sellerId");
      const productId = searchParams.get("productId");
      const listingId = searchParams.get("listingId");

      if (sellerId) {
        const seller = getSellerById(sellerId);
        if (seller) {
          const threadId = `thread-${sellerId}`;
          let threadIndex = currentThreads.findIndex((t) => t.id === threadId);
          let targetThread: ChatThread;

          if (threadIndex > -1) {
            targetThread = { ...currentThreads[threadIndex] };
          } else {
            targetThread = {
              id: threadId,
              sellerId: sellerId,
              sellerName: seller.displayName,
              sellerCity: seller.location.city,
              lastMessage: "",
              updatedAt: new Date().toISOString(),
              unread: false,
              messages: [],
            };
            currentThreads = [targetThread, ...currentThreads];
            threadIndex = 0;
          }

          // Resolve product reference context if provided
          let refProduct: MessageProductContext | null = null;
          if (productId) {
            const product = getProductById(productId);
            if (product) {
              refProduct = {
                id: product.id,
                name: product.name,
                price: product.price.amount,
                imageSrc: product.image.src,
                kind: "product",
                slug: product.slug,
              };
            }
          } else if (listingId) {
            const listing = getAmpasListingById(listingId);
            if (listing) {
              refProduct = {
                id: listing.id,
                name: listing.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
                price: listing.pricePerKg.amount,
                imageSrc: listing.image.src,
                kind: "ampas-listing",
                slug: listing.slug,
              };
            }
          }

          // If we have a product reference, add a system message referencing it
          if (refProduct) {
            const contextMsgId = `context-${refProduct.kind}-${refProduct.id}`;
            const alreadyHasContext = targetThread.messages.some((m) => m.id === contextMsgId);

            if (!alreadyHasContext) {
              const refMessage: ChatMessage = {
                id: contextMsgId,
                sender: "system-product-ref",
                text: `Referensi Produk: ${refProduct.name}`,
                timestamp: new Date().toISOString(),
                productContext: refProduct,
              };
              targetThread.messages = [...targetThread.messages, refMessage];
              targetThread.lastMessage = `[Referensi: ${refProduct.name}]`;
              targetThread.updatedAt = new Date().toISOString();

              // Update in list
              if (threadIndex > -1) {
                currentThreads[threadIndex] = targetThread;
              }
            }
          }

          // Save and set active
          localStorage.setItem("niloka_chats", JSON.stringify(currentThreads));
          setActiveThreadId(threadId);
          if (isMobileView) {
            setShowMobileChat(true);
          }

          // Clear parameters to keep URL clean
          window.history.replaceState({}, document.title, "/chat");
        }
      } else {
        // No query parameters, load normally
        if (currentThreads.length > 0 && !activeThreadId) {
          setActiveThreadId(currentThreads[0].id);
        }
        localStorage.setItem("niloka_chats", JSON.stringify(currentThreads));
      }

      setThreads(currentThreads);
    } catch (e) {
      console.error("Failed to load or initialize chats", e);
    }
  }, [searchParams, isMobileView]);

  // Scroll to bottom of message logs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Mark active thread as read
  useEffect(() => {
    if (activeThread && (activeThread.unread || (activeThread as any).unreadByBuyer)) {
      setThreads((prev) => {
        const updated = prev.map((t) => {
          if (t.id === activeThread.id) {
            return { ...t, unread: false, unreadByBuyer: false };
          }
          return t;
        });
        localStorage.setItem("niloka_chats", JSON.stringify(updated));
        return updated;
      });
    }
  }, [activeThreadId, activeThread?.unread, (activeThread as any)?.unreadByBuyer]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId || !activeThread) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "buyer",
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...activeThread.messages, newMessage];
    const updatedThread = {
      ...activeThread,
      messages: updatedMessages,
      lastMessage: newMessage.text,
      updatedAt: newMessage.timestamp,
      unreadBySeller: true,
      unreadByBuyer: false,
    };

    const updatedThreads = threads.map((t) => (t.id === activeThreadId ? updatedThread : t));
    setThreads(updatedThreads);
    localStorage.setItem("niloka_chats", JSON.stringify(updatedThreads));
    setInputText("");
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat chat dengan toko ini?")) {
      const updated = threads.filter((t) => t.id !== threadId);
      setThreads(updated);
      localStorage.setItem("niloka_chats", JSON.stringify(updated));
      if (activeThreadId === threadId) {
        setActiveThreadId(updated[0]?.id || null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto rounded-[32px] border border-line bg-white-soft shadow-xl overflow-hidden min-h-[580px] grid lg:grid-cols-[320px_1fr]">
      
      {/* LEFT PANEL: THREADS LIST */}
      <div className={`border-r border-line flex flex-col bg-cream-50/20 ${isMobileView && showMobileChat ? "hidden" : "flex"}`}>
        {/* Panel Header */}
        <div className="p-5 border-b border-line bg-white-soft/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-900" />
            <h2 className="text-base font-extrabold text-brand-950">Kotak Masuk Chat</h2>
          </div>
          <span className="text-[10px] font-bold text-brand-900 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">
            {threads.filter(t => t.unread || (t as any).unreadByBuyer).length} Unread
          </span>
        </div>

        {/* Search / Filter placeholder */}
        <div className="p-3 border-b border-line bg-white-soft/40">
          <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider pl-2">Percakapan Anda</p>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-line/45">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-ink-600 text-xs font-semibold">
              Belum ada percakapan aktif.
            </div>
          ) : (
            threads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              const formattedTime = new Date(thread.updatedAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
              });
              const isThreadUnread = thread.unread || (thread as any).unreadByBuyer;

              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    if (isMobileView) {
                      setShowMobileChat(true);
                    }
                  }}
                  className={`p-4 flex gap-3 cursor-pointer transition-colors relative hover:bg-cream-50/50 ${
                    isActive ? "bg-cream-100/40 border-l-4 border-brand-900" : ""
                  }`}
                >
                  {/* Fake Avatar */}
                  <div className="h-10 w-10 rounded-full bg-brand-900 text-white-soft font-bold flex items-center justify-center text-sm shrink-0 border border-line shadow-xs">
                    {thread.sellerName.charAt(0)}
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-1">
                      <h3 className={`text-xs font-extrabold truncate text-brand-950 ${isThreadUnread ? "font-black" : ""}`}>
                        {thread.sellerName}
                      </h3>
                      <span className="text-[9px] font-semibold text-ink-500 shrink-0">
                        {formattedTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-ink-600" />
                      <span className="text-[9.5px] font-semibold text-ink-650 truncate">{thread.sellerCity}</span>
                    </div>

                    <p className={`text-[10.5px] truncate mt-1.5 ${
                      isThreadUnread ? "text-brand-950 font-bold" : "text-ink-650 font-medium"
                    }`}>
                      {thread.lastMessage || "Belum ada pesan"}
                    </p>
                  </div>

                  {/* Badges / Controls */}
                  <div className="flex flex-col justify-between items-end shrink-0">
                    {isThreadUnread && (
                      <span className="h-2 w-2 rounded-full bg-brand-900 animate-pulse" />
                    )}
                    <button
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      className="p-1 text-ink-600 hover:text-red-650 hover:bg-red-50 rounded transition-colors mt-2"
                      aria-label="Hapus percakapan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div className={`flex flex-col bg-white-soft h-full ${isMobileView && !showMobileChat ? "hidden" : "flex"}`}>
        {activeThread ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-line bg-white-soft/80 flex items-center gap-3">
              {isMobileView && (
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-2 hover:bg-cream-100 rounded-lg text-brand-950 shrink-0 cursor-pointer"
                  aria-label="Kembali ke inbox"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
              )}
              
              <div className="h-10 w-10 rounded-full bg-brand-900 text-white-soft font-bold flex items-center justify-center text-sm border border-line shadow-xs">
                {activeThread.sellerName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-extrabold text-brand-950 truncate">{activeThread.sellerName}</h3>
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-250 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-ink-600 flex items-center gap-0.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-700" />
                  {activeThread.sellerCity}, Aceh
                </span>
              </div>
            </div>

            {/* Message logs */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cream-50/10">
              {activeThread.messages.length === 0 ? (
                <div className="text-center py-20 text-ink-600 text-xs font-semibold">
                  Mulai percakapan dengan mengirimkan pesan di bawah ini.
                </div>
              ) : (
                activeThread.messages.map((message) => {
                  const isUser = message.sender === "buyer";
                  const isSystemRef = message.sender === "system-product-ref";

                  if (isSystemRef && message.productContext) {
                    const ctx = message.productContext;
                    const detailHref = ctx.kind === "product" ? `/products/${ctx.slug}` : `/ampas/${ctx.slug}`;

                    return (
                      <div key={message.id} className="mx-auto max-w-md w-full bg-gold-50/50 border border-gold-200/50 rounded-2xl p-4 shadow-sm space-y-3 animate-in zoom-in-95 duration-200 my-2">
                        <div className="flex items-center gap-1.5 font-extrabold text-gold-800 text-[10px] uppercase tracking-wider">
                          <ShoppingBag className="h-4 w-4 text-gold-700" />
                          <span>Konteks Produk Referensi</span>
                        </div>
                        
                        <div className="flex gap-3 items-center bg-white-soft p-2.5 rounded-xl border border-line/45">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-line bg-cream-100 shrink-0">
                            <img
                              src={ctx.imageSrc}
                              alt={ctx.name}
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1 text-xs">
                            <h4 className="font-extrabold text-brand-950 truncate leading-snug">{ctx.name}</h4>
                            <p className="font-extrabold text-brand-900 mt-1">
                              {formatRupiah(ctx.price)}
                              {ctx.kind === "ampas-listing" && <span className="text-[10px] text-ink-600 font-semibold">/kg</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10.5px] pt-1">
                          <span className="font-bold text-ink-500 uppercase tracking-widest text-[8px]">
                            {ctx.kind === "product" ? "Produk Atsiri B2C" : "Ampas Residu B2B"}
                          </span>
                          <Link href={detailHref}>
                            <span className="font-bold text-brand-950 hover:text-brand-900 border-b border-brand-950 flex items-center gap-0.5 cursor-pointer">
                              Lihat Halaman Detail &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  const formattedMsgTime = new Date(message.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col max-w-[80%] ${
                        isUser ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs font-semibold leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-brand-950 text-white-soft rounded-tr-none"
                            : "bg-white border border-line/60 text-brand-950 rounded-tl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                      <span className="text-[8.5px] font-semibold text-ink-600 mt-1">
                        {formattedMsgTime}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-line bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tulis pesan ke penjual..."
                className="flex-1 h-10 rounded-xl border border-line bg-cream-50 px-4 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none placeholder:text-ink-600/70"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                  inputText.trim()
                    ? "bg-brand-950 hover:bg-brand-900 text-white-soft cursor-pointer shadow-sm"
                    : "bg-ink-600/10 text-ink-600/40 cursor-not-allowed"
                }`}
                aria-label="Kirim pesan"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-ink-600 space-y-3">
            <div className="p-3 bg-brand-50 border border-brand-100 rounded-full text-brand-900">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-brand-950">Mulai Hubungi Penjual</p>
              <p className="text-xs max-w-xs mt-1">
                Pilih percakapan dari kotak masuk atau hubungi penjual melalui halaman produk untuk berdiskusi.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
