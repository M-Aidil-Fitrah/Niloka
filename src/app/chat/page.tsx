"use client";

import { Suspense } from "react";
import { ChatClient } from "@/components/chat/chat-client";

export default function ChatPage() {
  return (
    <main className="page-shell pt-32 pb-16 min-h-[90vh] bg-cream-50/20">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto rounded-[32px] border border-line bg-white-soft p-12 text-center shadow-sm animate-pulse">
          <span className="text-sm font-extrabold text-brand-950 block">Memuat Percakapan...</span>
          <span className="text-xs text-ink-600 block mt-1">Silakan tunggu sebentar.</span>
        </div>
      }>
        <ChatClient />
      </Suspense>
    </main>
  );
}
