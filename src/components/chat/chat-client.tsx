"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatService, type ChatThread } from "@/lib/services/chat-service";
import { BuyerChatView } from "./buyer-chat-view";
import { SellerChatView } from "./seller-chat-view";

export function ChatClient() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Safely get role and seller ID from ChatService
  const modeParam = searchParams.get("mode");
  const currentUserRole = modeParam === "seller" ? "seller" : "buyer";

  useEffect(() => {
    setCurrentSellerId(ChatService.getCurrentSellerId());
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Read seller ID from localStorage only after mount, avoids hydration mismatch
  useEffect(() => {
    setCurrentSellerId(ChatService.getCurrentSellerId());
  }, []);

  // Subscribe to threads updates
  useEffect(() => {
    const unsubscribe = ChatService.subscribe((updatedThreads) => {
      setThreads(updatedThreads);
    });
    return unsubscribe;
  }, []);

  // Handle incoming query parameters and default selection
  useEffect(() => {
    const sellerId = searchParams.get("sellerId");
    const productId = searchParams.get("productId") || undefined;
    const listingId = searchParams.get("listingId") || undefined;

    if (sellerId) {
      ChatService.getOrCreateThread(sellerId, { productId, listingId }).then(
        (thread) => {
          setActiveThreadId(thread.id);
          if (isMobileView) {
            setShowMobileChat(true);
          }
          // Clear parameters to keep URL clean
          window.history.replaceState({}, document.title, "/chat");
        },
      );
    } else {
      // Default selection logic
      ChatService.getThreads().then((currentThreads) => {
        if (currentUserRole === "seller" && currentSellerId) {
          // Filter seller's threads
          const sellerThreads = currentThreads.filter(
            (t) => t.sellerId === currentSellerId,
          );
          // Sort by updatedAt descending (most recent first)
          const sorted = [...sellerThreads].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
          if (sorted.length > 0 && !activeThreadId) {
            setActiveThreadId(sorted[0].id);
          }
        } else {
          // Default for buyer (show first thread)
          if (currentThreads.length > 0 && !activeThreadId) {
            setActiveThreadId(currentThreads[0].id);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isMobileView, currentUserRole, currentSellerId]);

  // Scroll to bottom of message logs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Mark active thread as read
  useEffect(() => {
    if (activeThreadId && activeThread) {
      ChatService.markAsRead(activeThreadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, activeThread?.unread, activeThread?.unreadCount]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId || !activeThread) return;

    ChatService.sendMessage(activeThreadId, inputText.trim(), currentUserRole);
    setInputText("");
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus seluruh riwayat chat dengan toko ini?",
      )
    ) {
      ChatService.deleteThread(threadId).then(() => {
        if (activeThreadId === threadId) {
          ChatService.getThreads().then((currentThreads) => {
            const role = ChatService.getCurrentUserRole();
            const sellerId = ChatService.getCurrentSellerId();
            const filtered =
              role === "seller" && sellerId
                ? currentThreads.filter((t) => t.sellerId === sellerId)
                : currentThreads;

            const sorted = [...filtered].sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            );

            setActiveThreadId(sorted[0]?.id || null);
          });
        }
      });
    }
  };

  if (currentUserRole === "seller") {
    const displayedThreads = currentSellerId
      ? threads.filter((t) => t.sellerId === currentSellerId)
      : [];

    return (
      <SellerChatView
        displayedThreads={displayedThreads}
        activeThreadId={activeThreadId}
        setActiveThreadId={setActiveThreadId}
        activeThread={activeThread}
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        handleDeleteThread={handleDeleteThread}
        messagesEndRef={messagesEndRef}
        isMobileView={isMobileView}
        showMobileChat={showMobileChat}
        setShowMobileChat={setShowMobileChat}
      />
    );
  }

  return (
    <BuyerChatView
      activeThread={activeThread}
      inputText={inputText}
      setInputText={setInputText}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
    />
  );
}
