"use server";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { CartItemKind } from "@/generated/prisma/client";
import type { CartItem } from "@/lib/contracts";
import { revalidatePath } from "next/cache";

interface CartItemQueryResult {
  id: string;
  kind: CartItemKind;
  productId: string | null;
  ampasListingId: string | null;
  quantity: number;
  unitPriceAmount: number;
  unitPriceCurrency: string;
}

// Helper to convert Prisma CartItem to domain CartItem contract
function mapToCartItemDto(item: CartItemQueryResult): CartItem {
  return {
    id: item.id,
    kind: item.kind === "PRODUCT" ? "product" : "ampas-listing",
    productId: item.productId,
    ampasListingId: item.ampasListingId,
    quantity: item.quantity,
    unitPrice: {
      amount: item.unitPriceAmount,
      currency: item.unitPriceCurrency as "IDR",
    },
  };
}

export async function fetchCartAction(): Promise<CartItem[]> {
  const user = await requireUser();

  // Find or create Cart
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: { id: "asc" }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
      include: {
        items: {
          orderBy: { id: "asc" }
        }
      }
    });
  }

  return cart.items.map(mapToCartItemDto);
}

export async function addToCartAction(item: Omit<CartItem, "id">): Promise<{ ok: boolean; message?: string; items?: CartItem[] }> {
  const user = await requireUser();

  // Find or create Cart
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id }
    });
  }

  const kindEnum = item.kind === "product" ? CartItemKind.PRODUCT : CartItemKind.AMPAS_LISTING;

  // Resolve price (handling wholesale if it's an ampas listing)
  let resolvedPriceAmount = item.unitPrice.amount;
  if (item.kind === "ampas-listing" && item.ampasListingId) {
    const listing = await prisma.ampasListing.findUnique({
      where: { id: item.ampasListingId }
    });
    if (listing && listing.wholesaleEnabled && listing.wholesaleMinQtyKg && listing.wholesalePricePerKgAmount) {
      if (item.quantity >= listing.wholesaleMinQtyKg) {
        resolvedPriceAmount = listing.wholesalePricePerKgAmount;
      } else {
        resolvedPriceAmount = listing.pricePerKgAmount;
      }
    }
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      kind: kindEnum,
      productId: item.productId,
      ampasListingId: item.ampasListingId,
    }
  });

  if (existingItem) {
    // Update quantity and re-resolve price based on new total quantity
    const newQty = existingItem.quantity + item.quantity;
    let newPriceAmount = resolvedPriceAmount;
    if (item.kind === "ampas-listing" && item.ampasListingId) {
      const listing = await prisma.ampasListing.findUnique({
        where: { id: item.ampasListingId }
      });
      if (listing && listing.wholesaleEnabled && listing.wholesaleMinQtyKg && listing.wholesalePricePerKgAmount) {
        if (newQty >= listing.wholesaleMinQtyKg) {
          newPriceAmount = listing.wholesalePricePerKgAmount;
        } else {
          newPriceAmount = listing.pricePerKgAmount;
        }
      }
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: newQty,
        unitPriceAmount: newPriceAmount
      }
    });
  } else {
    // Generate manual id since CartItem.id doesn't default to cuid in schema
    const id = `cart-item-${crypto.randomUUID()}`;
    await prisma.cartItem.create({
      data: {
        id,
        cartId: cart.id,
        kind: kindEnum,
        productId: item.productId,
        ampasListingId: item.ampasListingId,
        quantity: item.quantity,
        unitPriceAmount: resolvedPriceAmount,
        unitPriceCurrency: item.unitPrice.currency || "IDR",
      }
    });
  }

  const updatedCart = await prisma.cart.findFirst({
    where: { id: cart.id },
    include: { items: { orderBy: { id: "asc" } } }
  });

  return {
    ok: true,
    items: updatedCart?.items.map(mapToCartItemDto) || [],
  };
}

export async function updateCartItemQuantityAction(itemId: string, quantity: number): Promise<{ ok: boolean; items?: CartItem[] }> {
  const user = await requireUser();

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: user.id }
    }
  });

  if (!cartItem) {
    return { ok: false };
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
  } else {
    let resolvedPriceAmount = cartItem.unitPriceAmount;
    if (cartItem.kind === "AMPAS_LISTING" && cartItem.ampasListingId) {
      const listing = await prisma.ampasListing.findUnique({
        where: { id: cartItem.ampasListingId }
      });
      if (listing && listing.wholesaleEnabled && listing.wholesaleMinQtyKg && listing.wholesalePricePerKgAmount) {
        if (quantity >= listing.wholesaleMinQtyKg) {
          resolvedPriceAmount = listing.wholesalePricePerKgAmount;
        } else {
          resolvedPriceAmount = listing.pricePerKgAmount;
        }
      }
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        unitPriceAmount: resolvedPriceAmount
      }
    });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { orderBy: { id: "asc" } } }
  });

  return {
    ok: true,
    items: cart?.items.map(mapToCartItemDto) || [],
  };
}

export async function removeFromCartAction(itemId: string): Promise<{ ok: boolean; items?: CartItem[] }> {
  const user = await requireUser();

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: user.id }
    }
  });

  if (!cartItem) {
    return { ok: false };
  }

  await prisma.cartItem.delete({
    where: { id: itemId }
  });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { orderBy: { id: "asc" } } }
  });

  return {
    ok: true,
    items: cart?.items.map(mapToCartItemDto) || [],
  };
}

export async function clearCartAction(): Promise<{ ok: boolean; items: CartItem[] }> {
  const user = await requireUser();

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id }
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }

  return {
    ok: true,
    items: [],
  };
}

// Checkout Server Action
export async function checkoutAction(payload: {
  subtotal: number;
  platformFee: number;
  shippingEstimate: number;
  grandTotal: number;
  shippingAddress: string;
  paymentMethod: string;
}): Promise<{ ok: boolean; orderId?: string; message?: string }> {
  const user = await requireUser();

  // Find user's cart
  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: true }
  });

  if (!cart || cart.items.length === 0) {
    return { ok: false, message: "Keranjang belanja Anda kosong." };
  }

  // Create Order and mock Payment in a transaction
  const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          id: orderId,
          userId: user.id,
          status: "PENDING_PAYMENT",
          subtotalAmount: payload.subtotal,
          platformFeeAmount: payload.platformFee,
          shippingEstimateAmount: payload.shippingEstimate,
          grandTotalAmount: payload.grandTotal,
          items: {
            create: cart.items.map((item) => ({
              kind: item.kind,
              productId: item.productId,
              ampasListingId: item.ampasListingId,
              quantity: item.quantity,
              unitPriceAmount: item.unitPriceAmount,
              unitPriceCurrency: item.unitPriceCurrency,
            }))
          }
        }
      });

      // 2. Create mock Payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: payload.paymentMethod,
          status: "PENDING",
          amount: payload.grandTotal,
          currency: "IDR",
          externalId: `PAY-${Date.now()}`,
          snapToken: `snap-token-mock-${crypto.randomUUID()}`
        }
      });

      // 3. Clear CartItems
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    });

    revalidatePath("/checkout");
    return { ok: true, orderId };
  } catch (error) {
    console.error("Checkout failed:", error);
    return { ok: false, message: "Terjadi kesalahan saat memproses pesanan." };
  }
}

export type OrderHistoryItem = {
  orderId: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    kind: string;
  }[];
  shippingAddress: {
    receiverName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
  };
  courier: string;
  paymentMethod: string;
  subtotal: number;
  platformFee: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
};

export async function fetchOrderHistoryAction(): Promise<OrderHistoryItem[]> {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
          ampasListing: true,
        }
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return orders.map((order) => ({
    orderId: order.id,
    date: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      name: item.kind === "PRODUCT" ? (item.product?.name || "Produk Nilam") : (item.ampasListing?.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Ampas Nilam B2B"),
      quantity: item.quantity,
      unitPrice: item.unitPriceAmount,
      kind: item.kind === "PRODUCT" ? "product" : "ampas-listing",
    })),
    shippingAddress: {
      receiverName: "Penerima",
      phone: "",
      address: "Alamat Pengiriman",
      city: "",
      province: "",
    },
    courier: "Kurir Pilihan",
    paymentMethod: order.payments[0]?.provider || "QRIS",
    subtotal: order.subtotalAmount,
    platformFee: order.platformFeeAmount,
    shippingFee: order.shippingEstimateAmount,
    discount: 0,
    grandTotal: order.grandTotalAmount,
  }));
}
