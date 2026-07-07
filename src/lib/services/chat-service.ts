import { getSellerById, getProductById, getAmpasListingById } from "@/lib/mock-queries";

export interface MessageProductContext {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  kind: "product" | "ampas-listing";
  slug: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  sender: "buyer" | "seller" | "system-product-ref";
  receiver: "buyer" | "seller" | "system-product-ref";
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  productContext?: MessageProductContext;
}

export interface ChatThread {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  buyerUsername?: string;
  lastMessage: string;
  updatedAt: string;
  unread: boolean; // unread status for buyer
  unreadCount: number;
  messages: ChatMessage[];
}

// Initial Default Mock Chats for cold-start with rich buyer data
const DEFAULT_THREADS: ChatThread[] = [
  {
    id: "thread-seller-nilam-lestari",
    sellerId: "seller-nilam-lestari",
    sellerName: "Koperasi Nilam Lestari",
    sellerCity: "Aceh Jaya",
    buyerId: "buyer-id-1",
    buyerName: "Andi Wijaya",
    buyerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    buyerUsername: "andiwijaya",
    lastMessage: "Halo Kak, ready banyak. Rencana mau ambil berapa ton?",
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    unread: true,
    unreadCount: 1,
    messages: [
      {
        id: "msg-init-1",
        senderId: "buyer-id-1",
        receiverId: "seller-nilam-lestari",
        sender: "buyer",
        receiver: "seller",
        message: "Halo, apakah stok ampas basah ready untuk minggu depan?",
        timestamp: new Date(Date.now() - 3600000 * 2.2).toISOString(),
        status: "read",
      },
      {
        id: "msg-init-2",
        senderId: "seller-nilam-lestari",
        receiverId: "buyer-id-1",
        sender: "seller",
        receiver: "buyer",
        message: "Halo Kak, ready banyak. Rencana mau ambil berapa ton?",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "delivered",
      },
    ],
  },
  {
    id: "thread-seller-aceh-aroma",
    sellerId: "seller-aceh-aroma",
    sellerName: "Aceh Aroma House",
    sellerCity: "Aceh Selatan",
    buyerId: "buyer-id-2",
    buyerName: "Siti Rahma",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    buyerUsername: "sitirahma",
    lastMessage: "Bisa banget Kak, kami biasa kirim pakai J&T atau cargo logistik.",
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    unread: false,
    unreadCount: 0,
    messages: [
      {
        id: "msg-init-3",
        senderId: "buyer-id-2",
        receiverId: "seller-aceh-aroma",
        sender: "buyer",
        receiver: "seller",
        message: "Halo, minyak atsiri calming blend ini apa bisa dikirim ke Jawa?",
        timestamp: new Date(Date.now() - 3600000 * 24.5).toISOString(),
        status: "read",
      },
      {
        id: "msg-init-4",
        senderId: "seller-aceh-aroma",
        receiverId: "buyer-id-2",
        sender: "seller",
        receiver: "buyer",
        message: "Bisa banget Kak, kami biasa kirim pakai J&T atau cargo logistik.",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "read",
      },
    ],
  },
];

function getAutoReplyText(buyerMessage: string, sellerName: string): string {
  const text = buyerMessage.toLowerCase();
  if (text.includes("stok") || text.includes("ready") || text.includes("ada")) {
    return `Halo Kak! Stok produk kami di ${sellerName} selalu ready dan ter-update. Rencana mau pesan berapa banyak Kak?`;
  }
  if (text.includes("kirim") || text.includes("ongkir") || text.includes("logistik") || text.includes("ekspedisi")) {
    return `Untuk pengiriman, kami menyediakan kurir standar (J&T, JNE) dan kargo logistik untuk partai besar. Bisa dikirim ke seluruh Indonesia kok Kak!`;
  }
  if (text.includes("harga") || text.includes("diskon") || text.includes("grosir") || text.includes("promo")) {
    return `Halo Kak, harga terbaik sudah tertera di halaman produk. Jika membeli dalam jumlah banyak (grosir), diskon harga akan langsung terpotong otomatis saat checkout ya!`;
  }
  if (text.includes("passport") || text.includes("asal") || text.includes("sertifikasi")) {
    return `Produk kami sudah dilengkapi dengan sertifikat Nilam Passport terverifikasi oleh UPTD Atsiri, menjamin keaslian 100% dari perkebunan lokal Aceh.`;
  }
  return `Halo! Terima kasih sudah menghubungi ${sellerName}. Pesan Anda telah kami terima, silakan tunggu sebentar ya Kak, admin kami akan segera membalas detailnya.`;
}

type ThreadsListener = (threads: ChatThread[]) => void;
type ThreadListener = (thread: ChatThread) => void;

class ChatServiceClass {
  private threadsListeners: Set<ThreadsListener> = new Set();
  private threadListeners: Map<string, Set<ThreadListener>> = new Map();

  private isValidThread(t: unknown): t is ChatThread {
    if (typeof t !== "object" || t === null) return false;
    const thread = t as Record<string, unknown>;
    return (
      typeof thread.id === "string" &&
      typeof thread.sellerId === "string" &&
      typeof thread.sellerName === "string" &&
      typeof thread.buyerId === "string" &&
      typeof thread.buyerName === "string" &&
      Array.isArray(thread.messages)
    );
  }

  private getStorageThreads(): ChatThread[] {
    if (typeof window === "undefined") return DEFAULT_THREADS;
    try {
      const stored = localStorage.getItem("niloka_chats");
      if (!stored) {
        localStorage.setItem("niloka_chats", JSON.stringify(DEFAULT_THREADS));
        return DEFAULT_THREADS;
      }
      const parsed = JSON.parse(stored);
      if (
        !Array.isArray(parsed) ||
        !parsed.every((t) => this.isValidThread(t))
      ) {
        console.warn(
          "Stored chats do not match current schema, resetting to defaults",
        );
        localStorage.setItem("niloka_chats", JSON.stringify(DEFAULT_THREADS));
        return DEFAULT_THREADS;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to read chats from storage", e);
      return DEFAULT_THREADS;
    }
  }

  private saveStorageThreads(threads: ChatThread[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("niloka_chats", JSON.stringify(threads));
    } catch (e) {
      console.error("Failed to save chats to storage", e);
    }
  }

  private notifyThreadsListeners(threads: ChatThread[]) {
    this.threadsListeners.forEach((cb) => cb(threads));
  }

  private notifyThreadListeners(threadId: string, thread: ChatThread) {
    const listeners = this.threadListeners.get(threadId);
    if (listeners) {
      listeners.forEach((cb) => cb(thread));
    }
  }

  // Fetch all threads
  async getThreads(): Promise<ChatThread[]> {
    return this.getStorageThreads();
  }

  // Fetch a single thread by ID
  async getThread(threadId: string): Promise<ChatThread | null> {
    const threads = this.getStorageThreads();
    return threads.find((t) => t.id === threadId) || null;
  }

  // Get or create thread
  async getOrCreateThread(
    sellerId: string,
    context?: { productId?: string; listingId?: string },
  ): Promise<ChatThread> {
    const threads = this.getStorageThreads();
    const threadId = `thread-${sellerId}`;
    let thread = threads.find((t) => t.id === threadId);
    let updatedThreads = [...threads];

    if (!thread) {
      const seller = getSellerById(sellerId);
      thread = {
        id: threadId,
        sellerId,
        sellerName: seller?.displayName || "Toko Atsiri Aceh",
        sellerCity: seller?.location.city || "Aceh",
        buyerId: "buyer-id-default",
        buyerName: "Pengguna Niloka",
        buyerAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
        buyerUsername: "penggunaniloka",
        lastMessage: "",
        updatedAt: new Date().toISOString(),
        unread: false,
        unreadCount: 0,
        messages: [],
      };
      updatedThreads = [thread, ...updatedThreads];
    }

    let refProduct: MessageProductContext | null = null;
    if (context?.productId) {
      const product = getProductById(context.productId);
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
    } else if (context?.listingId) {
      const listing = getAmpasListingById(context.listingId);
      if (listing) {
        refProduct = {
          id: listing.id,
          name: listing.slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          price: listing.pricePerKg.amount,
          imageSrc: listing.image.src,
          kind: "ampas-listing",
          slug: listing.slug,
        };
      }
    }

    if (refProduct) {
      const contextMsgId = `context-${refProduct.kind}-${refProduct.id}`;
      const alreadyHasContext = thread.messages.some(
        (m) => m.id === contextMsgId,
      );
      if (!alreadyHasContext) {
        const refMessage: ChatMessage = {
          id: contextMsgId,
          senderId: "system",
          receiverId: thread.buyerId,
          sender: "system-product-ref",
          receiver: "buyer",
          message: `Referensi Produk: ${refProduct.name}`,
          timestamp: new Date().toISOString(),
          status: "read",
          productContext: refProduct,
        };
        thread.messages = [...thread.messages, refMessage];
        thread.lastMessage = `[Referensi: ${refProduct.name}]`;
        thread.updatedAt = new Date().toISOString();
      }
    }

    const index = updatedThreads.findIndex((t) => t.id === threadId);
    if (index > -1) {
      updatedThreads[index] = thread;
    }
    this.saveStorageThreads(updatedThreads);
    this.notifyThreadsListeners(updatedThreads);
    this.notifyThreadListeners(threadId, thread);

    return thread;
  }

  // Send message
  async sendMessage(
    threadId: string,
    messageText: string,
    senderRole: "buyer" | "seller" = "buyer",
  ): Promise<ChatMessage> {
    const threads = this.getStorageThreads();
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    if (threadIndex === -1) {
      throw new Error(`Thread with ID ${threadId} not found`);
    }

    const thread = threads[threadIndex];
    const senderId = senderRole === "buyer" ? thread.buyerId : thread.sellerId;
    const receiverId =
      senderRole === "buyer" ? thread.sellerId : thread.buyerId;
    const receiverRole = senderRole === "buyer" ? "seller" : "buyer";

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      sender: senderRole,
      receiver: receiverRole,
      message: messageText,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    thread.messages.push(newMessage);
    thread.lastMessage = messageText;
    thread.updatedAt = newMessage.timestamp;

    if (senderRole === "buyer") {
      thread.unread = false;
      thread.unreadCount = 0;
    } else {
      thread.unread = true;
      thread.unreadCount += 1;
    }

    // Sort threads so the most recently updated thread comes first
    const sortedThreads = threads.map((t) => (t.id === threadId ? thread : t));

    this.saveStorageThreads(sortedThreads);
    this.notifyThreadsListeners(sortedThreads);
    this.notifyThreadListeners(threadId, thread);

    if (senderRole === "buyer") {
      setTimeout(
        async () => {
          try {
            const currentThreads = this.getStorageThreads();
            const tIdx = currentThreads.findIndex((t) => t.id === threadId);
            if (tIdx === -1) return;
            const currentThread = currentThreads[tIdx];

            const replyText = getAutoReplyText(
              messageText,
              currentThread.sellerName,
            );
            const replyMessage: ChatMessage = {
              id: `msg-reply-${Date.now()}`,
              senderId: currentThread.sellerId,
              receiverId: currentThread.buyerId,
              sender: "seller",
              receiver: "buyer",
              message: replyText,
              timestamp: new Date().toISOString(),
              status: "delivered",
            };

            currentThread.messages.push(replyMessage);
            currentThread.lastMessage = replyText;
            currentThread.updatedAt = replyMessage.timestamp;
            currentThread.unread = true;
            currentThread.unreadCount += 1;

            const reSorted = currentThreads.map((t) =>
              t.id === threadId ? currentThread : t,
            );
            this.saveStorageThreads(reSorted);
            this.notifyThreadsListeners(reSorted);
            this.notifyThreadListeners(threadId, currentThread);
          } catch (err) {
            console.error("Auto-reply simulation failed", err);
          }
        },
        1000 + Math.random() * 1000,
      );
    }

    return newMessage;
  }

  // Mark thread as read
  async markAsRead(threadId: string): Promise<void> {
    const threads = this.getStorageThreads();
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    if (threadIndex === -1) return;

    const thread = threads[threadIndex];
    if (thread.unread || thread.unreadCount > 0) {
      thread.unread = false;
      thread.unreadCount = 0;
      thread.messages = thread.messages.map((m) => {
        if (m.receiver === "buyer" && m.status !== "read") {
          return { ...m, status: "read" };
        }
        return m;
      });
      threads[threadIndex] = thread;
      this.saveStorageThreads(threads);
      this.notifyThreadsListeners(threads);
      this.notifyThreadListeners(threadId, thread);
    }
  }

  // Delete thread
  async deleteThread(threadId: string): Promise<void> {
    const threads = this.getStorageThreads();
    const filtered = threads.filter((t) => t.id !== threadId);
    this.saveStorageThreads(filtered);
    this.notifyThreadsListeners(filtered);
    this.threadListeners.delete(threadId);
  }

  // Subscribe to threads list
  subscribe(onThreadsUpdated: ThreadsListener): () => void {
    this.threadsListeners.add(onThreadsUpdated);
    onThreadsUpdated(this.getStorageThreads());

    return () => {
      this.threadsListeners.delete(onThreadsUpdated);
    };
  }

  // Subscribe to single thread
  subscribeToThread(
    threadId: string,
    onThreadUpdated: ThreadListener,
  ): () => void {
    if (!this.threadListeners.has(threadId)) {
      this.threadListeners.set(threadId, new Set());
    }
    this.threadListeners.get(threadId)!.add(onThreadUpdated);

    const thread = this.getStorageThreads().find((t) => t.id === threadId);
    if (thread) {
      onThreadUpdated(thread);
    }

    return () => {
      const listeners = this.threadListeners.get(threadId);
      if (listeners) {
        listeners.delete(onThreadUpdated);
        if (listeners.size === 0) {
          this.threadListeners.delete(threadId);
        }
      }
    };
  }

  // Get current user role safely
  getCurrentUserRole(): "buyer" | "seller" {
    if (typeof window === "undefined") return "buyer";
    const role = localStorage.getItem("niloka_current_user");
    return role && role !== "buyer" ? "seller" : "buyer";
  }

  // Get current seller ID safely
  getCurrentSellerId(): string | null {
    if (typeof window === "undefined") return null;
    const role = localStorage.getItem("niloka_current_user");
    return role && role !== "buyer" ? role : null;
  }
}

export const ChatService = new ChatServiceClass();
