"use client";

import Link from "next/link";
import { Send, CheckCircle, MapPin, ArrowLeft, ShoppingBag, Sparkles, Trash2, MessageSquare } from "lucide-react";
import { formatRupiah } from "@/lib/formatters";
import { ChatThread } from "@/lib/services/chat-service";

export interface BuyerChatViewProps {
  displayedThreads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  activeThread: ChatThread | undefined;
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleDeleteThread: (threadId: string, e: React.MouseEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isMobileView: boolean;
  showMobileChat: boolean;
  setShowMobileChat: (show: boolean) => void;
}

export function BuyerChatView({
  displayedThreads,
  activeThreadId,
  setActiveThreadId,
  activeThread,
  inputText,
  setInputText,
  handleSendMessage,
  handleDeleteThread,
  messagesEndRef,
  isMobileView,
  showMobileChat,
  setShowMobileChat,
}: BuyerChatViewProps) {
  // Determine back link target based on product context inside the thread
  const contextMessage = activeThread?.messages.find(
    (m) => m.sender === "system-product-ref" && m.productContext
  );
  
  const backHref = contextMessage?.productContext
    ? contextMessage.productContext.kind === "product"
      ? `/products/${contextMessage.productContext.slug}`
      : `/ampas/${contextMessage.productContext.slug}`
    : "/products";

  const backLabel = contextMessage?.productContext
    ? `Kembali ke Detail ${contextMessage.productContext.name}`
    : "Kembali ke Katalog";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4">
      {/* Back Link Breadcrumb */}
      <div className="flex justify-between items-center px-4 lg:px-0">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-xs font-extrabold text-brand-950 hover:text-brand-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-[32px] border border-line bg-white-soft shadow-xl overflow-hidden min-h-[580px] grid lg:grid-cols-[320px_1fr]">
        {/* LEFT PANEL: THREADS LIST */}
        <div
          className={`border-r border-line flex flex-col bg-cream-50/20 ${
            isMobileView && showMobileChat ? "hidden" : "flex"
          }`}
        >
          {/* Panel Header */}
          <div className="p-5 border-b border-line bg-white-soft/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-900" />
              <h2 className="text-base font-extrabold text-brand-950">
                Pesan Saya
              </h2>
            </div>
            <span className="text-[10px] font-bold text-brand-900 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">
              {
                displayedThreads.filter((t) => t.unread || t.unreadCount > 0)
                  .length
              }{" "}
              Unread
            </span>
          </div>

          {/* Search / Filter placeholder */}
          <div className="p-3 border-b border-line bg-white-soft/40">
            <p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider pl-2">
              Daftar Toko
            </p>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-line/45">
            {displayedThreads.length === 0 ? (
              <div className="p-8 text-center text-ink-600 text-xs font-semibold">
                Belum ada percakapan.
              </div>
            ) : (
              displayedThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const formattedTime = new Date(
                  thread.updatedAt,
                ).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isThreadUnread = thread.unread || thread.unreadCount > 0;

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
                      isActive
                        ? "bg-cream-100/40 border-l-4 border-brand-900"
                        : ""
                    }`}
                  >
                    {/* Seller Initial Avatar */}
                    <div className="h-10 w-10 rounded-full bg-brand-900 text-white-soft font-bold flex items-center justify-center text-sm shrink-0 border border-line shadow-xs">
                      {(thread.sellerName || "?").charAt(0)}
                    </div>

                    {/* Info details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <h3
                          className={`text-xs font-extrabold truncate text-brand-950 ${
                            isThreadUnread ? "font-black" : ""
                          }`}
                        >
                          {thread.sellerName}
                        </h3>
                        <span className="text-[9px] font-semibold text-ink-500 shrink-0">
                          {formattedTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-brand-700" />
                        <span className="text-[9.5px] font-semibold text-ink-650 truncate">
                          {thread.sellerCity}, Aceh
                        </span>
                      </div>

                      <p
                        className={`text-[10.5px] truncate mt-1.5 ${
                          isThreadUnread
                            ? "text-brand-950 font-bold"
                            : "text-ink-650 font-medium"
                        }`}
                      >
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
        <div
          className={`flex flex-col bg-white-soft h-full ${
            isMobileView && !showMobileChat ? "hidden" : "flex"
          }`}
        >
          {activeThread ? (
            <>
              {/* Header info */}
              <div className="p-5 border-b border-line bg-white-soft/80 flex items-center gap-3">
                {isMobileView && (
                  <button
                    onClick={() => {
                      setShowMobileChat(false);
                      setActiveThreadId(null);
                    }}
                    className="p-2 hover:bg-cream-100 rounded-lg text-brand-950 shrink-0 cursor-pointer mr-1"
                    aria-label="Kembali ke inbox"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                )}

                <div className="h-10 w-10 rounded-full bg-brand-900 text-white-soft font-bold flex items-center justify-center text-sm border border-line shadow-xs shrink-0">
                  {(activeThread.sellerName || "?").charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-extrabold text-brand-950 truncate">
                      {activeThread.sellerName}
                    </h3>
                    <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-250 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      Verified Seller
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-ink-600 flex items-center gap-0.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-700" />
                    {activeThread.sellerCity}, Aceh
                  </span>
                </div>
              </div>

              {/* Message logs */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cream-50/10 max-h-[460px] min-h-[380px]">
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
                      const detailHref =
                        ctx.kind === "product"
                          ? `/products/${ctx.slug}`
                          : `/ampas/${ctx.slug}`;

                      return (
                        <div
                          key={message.id}
                          className="mx-auto max-w-md w-full bg-gold-50/50 border border-gold-200/50 rounded-2xl p-4 shadow-sm space-y-3 animate-in zoom-in-95 duration-200 my-2"
                        >
                          <div className="flex items-center gap-1.5 font-extrabold text-gold-800 text-[10px] uppercase tracking-wider">
                            <ShoppingBag className="h-4 w-4 text-gold-700" />
                            <span>Konteks Produk Referensi</span>
                          </div>

                          <div className="flex gap-3 items-center bg-white-soft p-2.5 rounded-xl border border-line/45">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-line bg-cream-100 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ctx.imageSrc}
                                alt={ctx.name}
                                className="object-cover h-full w-full"
                              />
                            </div>
                            <div className="min-w-0 flex-1 text-xs">
                              <h4 className="font-extrabold text-brand-950 truncate leading-snug">
                                {ctx.name}
                              </h4>
                              <p className="font-extrabold text-brand-900 mt-1">
                                {formatRupiah(ctx.price)}
                                {ctx.kind === "ampas-listing" && (
                                  <span className="text-[10px] text-ink-600 font-semibold">
                                    /kg
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10.5px] pt-1">
                            <span className="font-bold text-ink-500 uppercase tracking-widest text-[8px]">
                              {ctx.kind === "product"
                                ? "Produk Atsiri B2C"
                                : "Ampas Residu B2B"}
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

                    const formattedMsgTime = new Date(
                      message.timestamp,
                    ).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
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
                          <p>{message.message}</p>
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
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-line bg-white flex gap-2"
              >
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-ink-600 space-y-3 min-h-[580px] bg-white-soft">
              <div className="p-3 bg-brand-50 border border-brand-100 rounded-full text-brand-900">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-brand-950">Mulai Hubungi Penjual</p>
                <p className="text-xs max-w-xs mt-1 text-ink-600">
                  Pilih salah satu percakapan toko dari daftar di sebelah kiri untuk melihat pesan atau mengirim pesan baru.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
