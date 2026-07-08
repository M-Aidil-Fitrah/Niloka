import {
  getThreadsAction,
  getThreadAction,
  getOrCreateThreadAction,
  sendMessageAction,
  deleteThreadAction,
} from "@/lib/actions/chat-actions";

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
  unread: boolean;
  unreadCount: number;
  messages: ChatMessage[];
}

type ThreadsListener = (threads: ChatThread[]) => void;
type ThreadListener = (thread: ChatThread) => void;

class ChatServiceClass {
  private threadsListeners: Set<ThreadsListener> = new Set();
  private threadListeners: Map<string, Set<ThreadListener>> = new Map();
  private pollingThreadsInterval: ReturnType<typeof setInterval> | null = null;
  private pollingThreadIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();

  // Fetch all threads
  async getThreads(): Promise<ChatThread[]> {
    return getThreadsAction();
  }

  // Fetch a single thread by ID
  async getThread(threadId: string): Promise<ChatThread | null> {
    return getThreadAction(threadId);
  }

  // Get or create thread
  async getOrCreateThread(
    sellerId: string,
    context?: { productId?: string; listingId?: string },
  ): Promise<ChatThread> {
    const thread = await getOrCreateThreadAction(sellerId, context);
    this.triggerThreadsUpdate();
    this.triggerThreadUpdate(thread.id, thread);
    return thread;
  }

  // Send message
  async sendMessage(
    threadId: string,
    messageText: string,
    senderRole: "buyer" | "seller" = "buyer",
  ): Promise<ChatMessage> {
    const newMessage = await sendMessageAction(threadId, messageText, senderRole);
    
    // Trigger updates immediately
    this.getThreads().then((threads) => {
      this.notifyThreadsListeners(threads);
    });
    this.getThread(threadId).then((thread) => {
      if (thread) {
        this.notifyThreadListeners(threadId, thread);
      }
    });

    // If buyer sends the message, simulate waiting 1 second for the auto-reply to trigger on the server, then fetch again
    if (senderRole === "buyer") {
      setTimeout(() => {
        this.getThreads().then((threads) => {
          this.notifyThreadsListeners(threads);
        });
        this.getThread(threadId).then((thread) => {
          if (thread) {
            this.notifyThreadListeners(threadId, thread);
          }
        });
      }, 1500);
    }

    return newMessage;
  }

  // Mark thread as read (no-op in DB since status is not stored, but we can notify listeners)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async markAsRead(_threadId: string): Promise<void> {
    // Client-side read mapping
  }

  // Delete thread
  async deleteThread(threadId: string): Promise<void> {
    await deleteThreadAction(threadId);
    this.getThreads().then((threads) => {
      this.notifyThreadsListeners(threads);
    });
    this.threadListeners.delete(threadId);
  }

  // Helper to trigger threads updates manually
  private triggerThreadsUpdate() {
    this.getThreads().then((threads) => {
      this.notifyThreadsListeners(threads);
    });
  }

  // Helper to trigger thread updates manually
  private triggerThreadUpdate(threadId: string, thread: ChatThread) {
    this.notifyThreadListeners(threadId, thread);
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

  // Subscribe to threads list (with background polling)
  subscribe(onThreadsUpdated: ThreadsListener): () => void {
    this.threadsListeners.add(onThreadsUpdated);
    
    // Initial fetch
    this.getThreads().then((threads) => {
      onThreadsUpdated(threads);
    });

    // Start polling if not already running
    if (!this.pollingThreadsInterval && typeof window !== "undefined") {
      this.pollingThreadsInterval = setInterval(() => {
        this.getThreads().then((threads) => {
          this.notifyThreadsListeners(threads);
        });
      }, 4000);
    }

    return () => {
      this.threadsListeners.delete(onThreadsUpdated);
      if (this.threadsListeners.size === 0 && this.pollingThreadsInterval) {
        clearInterval(this.pollingThreadsInterval);
        this.pollingThreadsInterval = null;
      }
    };
  }

  // Subscribe to single thread (with background polling)
  subscribeToThread(
    threadId: string,
    onThreadUpdated: ThreadListener,
  ): () => void {
    if (!this.threadListeners.has(threadId)) {
      this.threadListeners.set(threadId, new Set());
    }
    this.threadListeners.get(threadId)!.add(onThreadUpdated);

    // Initial fetch
    this.getThread(threadId).then((thread) => {
      if (thread) {
        onThreadUpdated(thread);
      }
    });

    // Start polling for this thread if not already running
    if (!this.pollingThreadIntervals.has(threadId) && typeof window !== "undefined") {
      const interval = setInterval(() => {
        this.getThread(threadId).then((thread) => {
          if (thread) {
            this.notifyThreadListeners(threadId, thread);
          }
        });
      }, 3000);
      this.pollingThreadIntervals.set(threadId, interval);
    }

    return () => {
      const listeners = this.threadListeners.get(threadId);
      if (listeners) {
        listeners.delete(onThreadUpdated);
        if (listeners.size === 0) {
          this.threadListeners.delete(threadId);
          const interval = this.pollingThreadIntervals.get(threadId);
          if (interval) {
            clearInterval(interval);
            this.pollingThreadIntervals.delete(threadId);
          }
        }
      }
    };
  }

  // Get current user role safely
  getCurrentUserRole(): "buyer" | "seller" {
    if (typeof window === "undefined") return "buyer";
    const role = localStorage.getItem("niloka_current_user");
    return role && role !== "buyer" && role !== "user" ? "seller" : "buyer";
  }

  // Get current seller ID safely
  getCurrentSellerId(): string | null {
    if (typeof window === "undefined") return null;
    const role = localStorage.getItem("niloka_current_user");
    return role && role !== "buyer" && role !== "user" ? role : null;
  }
}

export const ChatService = new ChatServiceClass();
