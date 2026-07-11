"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { ChatMessageSenderRole } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import type { ChatThread, ChatMessage, MessageProductContext } from "@/lib/services/chat-service";

interface DbMessage {
  id: string;
  senderRole: ChatMessageSenderRole;
  body: string;
  createdAt: Date;
}

interface DbThread {
  id: string;
  buyerId: string | null;
  sellerId: string | null;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  buyer: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  } | null;
  seller: {
    id: string;
    displayName: string;
    locationCity: string;
  } | null;
  messages: DbMessage[];
}

// Helper to map DB thread + messages to UI contract
function mapDbThread(thread: DbThread): ChatThread {
  const messages: ChatMessage[] = thread.messages.map((msg) => {
    let productContext: undefined | MessageProductContext = undefined;
    let messageText = msg.body;

    if (msg.senderRole === ChatMessageSenderRole.SYSTEM) {
      try {
        const parsed = JSON.parse(msg.body);
        if (parsed && typeof parsed === "object" && parsed.id) {
          productContext = parsed;
          messageText = `Referensi Produk: ${parsed.name}`;
        }
      } catch {
        // Not a JSON context, use body directly
      }
    }

    return {
      id: msg.id,
      senderId:
        msg.senderRole === ChatMessageSenderRole.USER
          ? (thread.buyerId || "")
          : msg.senderRole === ChatMessageSenderRole.SYSTEM
          ? "system"
          : (thread.sellerId || ""),
      receiverId:
        msg.senderRole === ChatMessageSenderRole.USER
          ? (thread.sellerId || "")
          : (thread.buyerId || ""),
      sender:
        msg.senderRole === ChatMessageSenderRole.USER
          ? "buyer"
          : msg.senderRole === ChatMessageSenderRole.SYSTEM
          ? "system-product-ref"
          : "seller",
      receiver: msg.senderRole === ChatMessageSenderRole.USER ? "seller" : "buyer",
      message: messageText,
      timestamp: msg.createdAt.toISOString(),
      status: "read" as const,
      productContext,
    };
  });

  const lastMsgObj = messages[messages.length - 1];
  const lastMessage = lastMsgObj ? lastMsgObj.message : "";

  return {
    id: thread.id,
    sellerId: thread.sellerId || "",
    sellerName: thread.seller?.displayName || "Toko Atsiri",
    sellerCity: thread.seller?.locationCity || "Aceh",
    buyerId: thread.buyerId || "",
    buyerName: thread.buyer?.name || "Pengguna Niloka",
    buyerAvatar: thread.buyer?.image ?? "",
    buyerUsername: thread.buyer?.email?.split("@")[0] || "penggunaniloka",
    lastMessage,
    updatedAt: thread.updatedAt.toISOString(),
    unread: false,
    unreadCount: 0,
    messages,
  };
}

export async function getThreadsAction(): Promise<ChatThread[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    
    let whereClause: { sellerId?: string; buyerId?: string } = {};
    if (user.sellerId) {
      whereClause = { sellerId: user.sellerId };
    } else {
      whereClause = { buyerId: user.id };
    }

    const threads = await prisma.chatThread.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            displayName: true,
            locationCity: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return (threads as DbThread[]).map(mapDbThread);
  } catch (error) {
    console.error("Failed to get chat threads:", error);
    return [];
  }
}

const threadIdSchema = z.object({
  threadId: z.string().min(1),
});

function isThreadParticipant(
  user: { id: string; sellerId: string | null },
  thread: { buyerId: string | null; sellerId: string | null },
): boolean {
  return user.id === thread.buyerId || user.sellerId === thread.sellerId;
}

export async function getThreadAction(threadId: string): Promise<ChatThread | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const parsed = threadIdSchema.safeParse({ threadId });
    if (!parsed.success) return null;

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            displayName: true,
            locationCity: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!thread) return null;

    if (!isThreadParticipant(user, thread)) return null;

    return mapDbThread(thread as DbThread);
  } catch (error) {
    console.error("Failed to get chat thread:", error);
    return null;
  }
}

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

const sendMessageSchema = z.object({
  threadId: z.string().min(1),
  messageText: z.string().min(1, "Pesan tidak boleh kosong.").max(5000, "Pesan maksimal 5000 karakter."),
  senderRole: z.enum(["buyer", "seller"]),
});

export async function sendMessageAction(
  threadId: string,
  messageText: string,
  senderRole: "buyer" | "seller",
): Promise<ChatMessage> {
  const user = await requireUser();
  const parsed = sendMessageSchema.safeParse({ threadId, messageText, senderRole });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Data pesan tidak valid.");
  }
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Find the thread to get participant IDs
  const thread = await prisma.chatThread.findUnique({
    where: { id: threadId },
    include: {
      seller: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
  });

  if (!thread) {
    throw new Error("Utas chat tidak ditemukan.");
  }

  if (!isThreadParticipant(user, thread)) {
    throw new Error("Anda tidak memiliki akses ke utas chat ini.");
  }

  const prismaSenderRole = senderRole === "buyer" ? ChatMessageSenderRole.USER : ChatMessageSenderRole.ASSISTANT;

  // Insert the user's message
  const msg = await prisma.chatMessage.create({
    data: {
      id: messageId,
      threadId,
      senderRole: prismaSenderRole,
      body: messageText,
    },
  });

  // Update thread last active time
  await prisma.chatThread.update({
    where: { id: threadId },
    data: {
      updatedAt: new Date(),
    },
  });

  // Simulate seller reply if sender was buyer
  if (senderRole === "buyer") {
    const replyId = `msg-reply-${Date.now()}`;
    const sellerName = thread.seller?.displayName || "Penjual";
    const replyText = getAutoReplyText(messageText, sellerName);

    // Insert reply message with 1 second later
    await prisma.chatMessage.create({
      data: {
        id: replyId,
        threadId,
        senderRole: ChatMessageSenderRole.ASSISTANT,
        body: replyText,
        createdAt: new Date(Date.now() + 1000), // 1s later
      },
    });

    // Update thread again for the reply
    await prisma.chatThread.update({
      where: { id: threadId },
      data: {
        updatedAt: new Date(Date.now() + 1000),
      },
    });
  }

  revalidatePath("/chat");

  return {
    id: msg.id,
    senderId: senderRole === "buyer" ? (thread.buyerId || user.id) : (thread.sellerId || ""),
    receiverId: senderRole === "buyer" ? (thread.sellerId || "") : (thread.buyerId || user.id),
    sender: senderRole,
    receiver: senderRole === "buyer" ? "seller" : "buyer",
    message: messageText,
    timestamp: msg.createdAt.toISOString(),
    status: "sent" as const,
  };
}

export async function getOrCreateThreadAction(
  sellerId: string,
  context?: { productId?: string; listingId?: string },
): Promise<ChatThread> {
  const user = await requireUser();
  const threadId = `thread-${user.id}-${sellerId}`;

  // Find or create thread
  let thread = await prisma.chatThread.findUnique({
    where: { id: threadId },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      seller: {
        select: {
          id: true,
          displayName: true,
          locationCity: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!thread) {
    // Verify seller exists
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      select: { displayName: true },
    });

    if (!seller) {
      throw new Error("Penjual tidak ditemukan.");
    }

    thread = await prisma.chatThread.create({
      data: {
        id: threadId,
        buyerId: user.id,
        sellerId: sellerId,
        subject: `Tanya jawab dengan ${seller.displayName}`,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            displayName: true,
            locationCity: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  // Handle product or ampas listing context
  let refProduct: { id: string; name: string; price: number; imageSrc: string; kind: "product" | "ampas-listing"; slug: string } | null = null;

  if (context?.productId) {
    const product = await prisma.product.findUnique({
      where: { id: context.productId },
      select: {
        id: true,
        name: true,
        priceAmount: true,
        imageSrc: true,
        slug: true,
      },
    });
    if (product) {
      refProduct = {
        id: product.id,
        name: product.name,
        price: product.priceAmount,
        imageSrc: product.imageSrc,
        kind: "product",
        slug: product.slug,
      };
    }
  } else if (context?.listingId) {
    const listing = await prisma.ampasListing.findUnique({
      where: { id: context.listingId },
      select: {
        id: true,
        slug: true,
        pricePerKgAmount: true,
        imageSrc: true,
      },
    });
    if (listing) {
      refProduct = {
        id: listing.id,
        name: listing.slug
          .split("-")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        price: listing.pricePerKgAmount,
        imageSrc: listing.imageSrc || "",
        kind: "ampas-listing",
        slug: listing.slug,
      };
    }
  }

  if (refProduct) {
    const contextMsgId = `context-${refProduct.kind}-${refProduct.id}`;
    // Check if system message for this context already exists in database
    const alreadyHasContext = await prisma.chatMessage.findFirst({
      where: {
        threadId,
        id: contextMsgId,
      },
    });

    if (!alreadyHasContext) {
      await prisma.chatMessage.create({
        data: {
          id: contextMsgId,
          threadId,
          senderRole: ChatMessageSenderRole.SYSTEM,
          body: JSON.stringify(refProduct),
        },
      });

      // Fetch the updated thread with the new message
      const updatedThread = await prisma.chatThread.findUnique({
        where: { id: threadId },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          seller: {
            select: {
              id: true,
              displayName: true,
              locationCity: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      if (updatedThread) {
        thread = updatedThread;
      }
    }
  }

  revalidatePath("/chat");
  return mapDbThread(thread as DbThread);
}

export async function deleteThreadAction(threadId: string): Promise<void> {
  try {
    const user = await requireUser();
    const parsed = threadIdSchema.safeParse({ threadId });
    if (!parsed.success) throw new Error("ID utas tidak valid.");

    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      select: { buyerId: true, sellerId: true },
    });

    if (!thread) throw new Error("Utas chat tidak ditemukan.");
    if (!isThreadParticipant(user, thread)) throw new Error("Anda tidak memiliki akses ke utas chat ini.");

    await prisma.chatThread.delete({
      where: { id: threadId },
    });
    revalidatePath("/chat");
  } catch (error) {
    console.error("Failed to delete chat thread:", error);
    throw error;
  }
}
