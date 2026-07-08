"use server";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  CartItemKind,
  OrderFulfillmentStatus,
  PromoStatus,
} from "@/generated/prisma/client";
import type { CartItem, PaymentInstruction } from "@/lib/contracts";
import { revalidatePath } from "next/cache";
import {
  createCorePayment,
  resolvePaymentChannel,
} from "@/lib/services/payment-service";

interface CartItemQueryResult {
  id: string;
  kind: CartItemKind;
  productId: string | null;
  ampasListingId: string | null;
  quantity: number;
  unitPriceAmount: number;
  unitPriceCurrency: string;
}

type CheckoutInput = {
  receiverName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  courierCode: string;
  paymentMethod: string;
  promoCode: string;
};

type CheckoutResult = {
  ok: boolean;
  orderId?: string;
  message?: string;
  payment?: PaymentInstruction;
};

const courierRates: Record<string, { name: string; amount: number }> = {
  jne: { name: "JNE Regular", amount: 15000 },
  jnt: { name: "J&T Express", amount: 18000 },
  sicepat: { name: "SiCepat Halu", amount: 12000 },
  gosend: { name: "GoSend Instant", amount: 25000 },
};

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

function getCartItemSellerId(item: {
  product?: { sellerId: string } | null;
  ampasListing?: { sellerId: string } | null;
}): string {
  return item.product?.sellerId ?? item.ampasListing?.sellerId ?? "";
}

async function calculateDiscount(input: {
  promoCode: string;
  subtotal: number;
  shippingEstimate: number;
  productIds: string[];
}): Promise<{ amount: number; code: string }> {
  const code = input.promoCode.trim().toUpperCase();

  if (!code) {
    return { amount: 0, code: "" };
  }

  const promo = await prisma.promo.findFirst({
    where: {
      code,
      status: PromoStatus.ACTIVE,
    },
    include: {
      products: {
        select: {
          productId: true,
        },
      },
    },
  });

  if (!promo || input.subtotal < promo.minSubtotalAmount) {
    return { amount: 0, code: "" };
  }

  const eligibleProductIds = promo.products.map((item) => item.productId);
  const hasEligibleProduct =
    eligibleProductIds.length === 0 ||
    input.productIds.some((productId) => eligibleProductIds.includes(productId));

  if (!hasEligibleProduct) {
    return { amount: 0, code: "" };
  }

  switch (promo.type) {
    case "PERCENTAGE":
      return {
        amount: Math.floor((input.subtotal * promo.value) / 100),
        code,
      };
    case "FIXED_AMOUNT":
      return {
        amount: Math.min(input.subtotal, promo.value),
        code,
      };
    case "FREE_SHIPPING":
      return {
        amount: input.shippingEstimate,
        code,
      };
  }
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
export async function checkoutAction(payload: CheckoutInput): Promise<CheckoutResult> {
  const user = await requireUser();
  const courier = courierRates[payload.courierCode] ?? courierRates.jne;
  const paymentChannel = resolvePaymentChannel(payload.paymentMethod);

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              sellerId: true,
              priceAmount: true,
              priceCurrency: true,
            },
          },
          ampasListing: {
            select: {
              sellerId: true,
              pricePerKgAmount: true,
              pricePerKgCurrency: true,
              wholesaleEnabled: true,
              wholesaleMinQtyKg: true,
              wholesalePricePerKgAmount: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { ok: false, message: "Keranjang belanja Anda kosong." };
  }

  const resolvedItems = cart.items.map((item) => {
    if (item.kind === CartItemKind.PRODUCT && item.product) {
      return {
        ...item,
        sellerId: item.product.sellerId,
        unitPriceAmount: item.product.priceAmount,
        unitPriceCurrency: item.product.priceCurrency,
      };
    }

    if (item.kind === CartItemKind.AMPAS_LISTING && item.ampasListing) {
      const wholesalePrice =
        item.ampasListing.wholesaleEnabled &&
        item.ampasListing.wholesaleMinQtyKg &&
        item.ampasListing.wholesalePricePerKgAmount &&
        item.quantity >= item.ampasListing.wholesaleMinQtyKg
          ? item.ampasListing.wholesalePricePerKgAmount
          : item.ampasListing.pricePerKgAmount;

      return {
        ...item,
        sellerId: item.ampasListing.sellerId,
        unitPriceAmount: wholesalePrice,
        unitPriceCurrency: item.ampasListing.pricePerKgCurrency,
      };
    }

    return {
      ...item,
      sellerId: getCartItemSellerId(item),
    };
  });

  const subtotal = resolvedItems.reduce(
    (total, item) => total + item.unitPriceAmount * item.quantity,
    0,
  );
  const platformFee = subtotal > 0 ? 2000 : 0;
  const shippingEstimate = subtotal > 0 ? courier.amount : 0;
  const discount = await calculateDiscount({
    promoCode: payload.promoCode,
    subtotal,
    shippingEstimate,
    productIds: resolvedItems
      .map((item) => item.productId)
      .filter((productId): productId is string => Boolean(productId)),
  });
  const grandTotal = Math.max(
    0,
    subtotal + platformFee + shippingEstimate - discount.amount,
  );
  const paymentExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    let paymentInstruction: PaymentInstruction | undefined;

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: orderId,
          userId: user.id,
          status: "PENDING_PAYMENT",
          subtotalAmount: subtotal,
          platformFeeAmount: platformFee,
          shippingEstimateAmount: shippingEstimate,
          discountAmount: discount.amount,
          promoCode: discount.code || undefined,
          grandTotalAmount: grandTotal,
          receiverName: payload.receiverName,
          receiverPhone: payload.phone,
          shippingAddress: payload.address,
          shippingCity: payload.city,
          shippingProvince: payload.province,
          courierCode: payload.courierCode,
          courierName: courier.name,
          paymentExpiresAt,
          items: {
            create: resolvedItems.map((item) => ({
              kind: item.kind,
              productId: item.productId,
              ampasListingId: item.ampasListingId,
              sellerId: item.sellerId || undefined,
              quantity: item.quantity,
              unitPriceAmount: item.unitPriceAmount,
              unitPriceCurrency: item.unitPriceCurrency,
            }))
          },
          fulfillments: {
            create: Array.from(
              new Set(
                resolvedItems
                  .map((item) => item.sellerId)
                  .filter((sellerId): sellerId is string => Boolean(sellerId)),
              ),
            ).map((sellerId) => ({
              sellerId,
              status: OrderFulfillmentStatus.PENDING_PAYMENT,
            })),
          },
        }
      });

      paymentInstruction = await createCorePayment(tx, {
        orderId: order.id,
        amount: grandTotal,
        currency: "IDR",
        channel: paymentChannel,
        expiresAt: paymentExpiresAt,
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    });

    revalidatePath("/checkout");
    revalidatePath("/orders");

    return { ok: true, orderId, payment: paymentInstruction };
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
      receiverName: order.receiverName || "Penerima",
      phone: order.receiverPhone || "",
      address: order.shippingAddress || "",
      city: order.shippingCity || "",
      province: order.shippingProvince || "",
    },
    courier: order.courierName || order.courierCode || "Kurir Pilihan",
    paymentMethod: order.payments[0]?.paymentMethod || "QRIS",
    subtotal: order.subtotalAmount,
    platformFee: order.platformFeeAmount,
    shippingFee: order.shippingEstimateAmount,
    discount: order.discountAmount,
    grandTotal: order.grandTotalAmount,
  }));
}
