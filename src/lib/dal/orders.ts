import "server-only";

import {
  CartItemKind,
  OrderFulfillmentStatus as PrismaOrderFulfillmentStatus,
  OrderStatus as PrismaOrderStatus,
  PaymentMethod as PrismaPaymentMethod,
  PaymentStatus as PrismaPaymentStatus,
  Prisma,
} from "@/generated/prisma/client";
import type {
  OrderFulfillmentStatus,
  OrderLineItem,
  OrderPayment,
  OrderStatus,
  OrderTracking,
  PaymentMethod,
  PaymentStatus,
  SellerFinanceSummary,
} from "@/lib/contracts";
import { prisma } from "@/lib/db/prisma";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            name: true;
            sellerId: true;
          };
        };
        ampasListing: {
          select: {
            slug: true;
            sellerId: true;
          };
        };
      };
    };
    payments: {
      orderBy: {
        createdAt: "desc";
      };
    };
    fulfillments: {
      include: {
        seller: {
          select: {
            displayName: true;
          };
        };
      };
      orderBy: {
        updatedAt: "desc";
      };
    };
  };
}>;

type SellerFinanceOrder = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function toOptionalIsoString(date: Date | null): string {
  return date ? date.toISOString() : "";
}

function toContractOrderStatus(value: PrismaOrderStatus): OrderStatus {
  switch (value) {
    case PrismaOrderStatus.DRAFT:
      return "draft";
    case PrismaOrderStatus.PENDING_PAYMENT:
      return "pending-payment";
    case PrismaOrderStatus.PAID:
      return "paid";
    case PrismaOrderStatus.FULFILLED:
      return "fulfilled";
  }
}

function toContractPaymentStatus(value: PrismaPaymentStatus): PaymentStatus {
  switch (value) {
    case PrismaPaymentStatus.PENDING:
      return "pending";
    case PrismaPaymentStatus.PAID:
      return "paid";
    case PrismaPaymentStatus.FAILED:
      return "failed";
    case PrismaPaymentStatus.EXPIRED:
      return "expired";
  }
}

function toContractPaymentMethod(
  value: PrismaPaymentMethod | null,
): PaymentMethod {
  switch (value) {
    case PrismaPaymentMethod.VIRTUAL_ACCOUNT:
      return "virtual-account";
    case PrismaPaymentMethod.EWALLET:
      return "ewallet";
    case PrismaPaymentMethod.MANUAL_TRANSFER:
      return "manual-transfer";
    case PrismaPaymentMethod.QRIS:
    case null:
      return "qris";
  }
}

function toContractFulfillmentStatus(
  value: PrismaOrderFulfillmentStatus,
): OrderFulfillmentStatus {
  switch (value) {
    case PrismaOrderFulfillmentStatus.PENDING_PAYMENT:
      return "pending-payment";
    case PrismaOrderFulfillmentStatus.READY_TO_PROCESS:
      return "ready-to-process";
    case PrismaOrderFulfillmentStatus.PROCESSING:
      return "processing";
    case PrismaOrderFulfillmentStatus.SHIPPED:
      return "shipped";
    case PrismaOrderFulfillmentStatus.DELIVERED:
      return "delivered";
    case PrismaOrderFulfillmentStatus.CANCELLED:
      return "cancelled";
  }
}

function getAmpasName(slug: string | undefined): string {
  if (!slug) {
    return "Ampas Nilam B2B";
  }

  return slug
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getPaymentStatus(payments: OrderWithRelations["payments"]): PaymentStatus {
  if (payments.some((payment) => payment.status === PrismaPaymentStatus.PAID)) {
    return "paid";
  }
  if (payments.some((payment) => payment.status === PrismaPaymentStatus.FAILED)) {
    return "failed";
  }
  if (payments.some((payment) => payment.status === PrismaPaymentStatus.EXPIRED)) {
    return "expired";
  }

  return "pending";
}

function mapOrderItem(item: OrderWithRelations["items"][number]): OrderLineItem {
  const sellerId =
    item.sellerId ?? item.product?.sellerId ?? item.ampasListing?.sellerId ?? "";
  const name =
    item.kind === CartItemKind.PRODUCT
      ? item.product?.name ?? "Produk Nilam"
      : getAmpasName(item.ampasListing?.slug);
  const subtotalAmount = item.unitPriceAmount * item.quantity;

  return {
    id: item.id,
    kind: item.kind === CartItemKind.PRODUCT ? "product" : "ampas-listing",
    productId: item.productId,
    ampasListingId: item.ampasListingId,
    sellerId,
    name,
    quantity: item.quantity,
    unitPrice: {
      amount: item.unitPriceAmount,
      currency: "IDR",
    },
    subtotal: {
      amount: subtotalAmount,
      currency: "IDR",
    },
  };
}

function mapPayment(payment: OrderWithRelations["payments"][number]): OrderPayment {
  return {
    id: payment.id,
    provider: payment.provider,
    method: toContractPaymentMethod(payment.paymentMethod),
    status: toContractPaymentStatus(payment.status),
    amount: {
      amount: payment.amount,
      currency: "IDR",
    },
    externalId: payment.externalId ?? "",
    transactionId: payment.transactionId ?? "",
    transactionStatus: payment.transactionStatus ?? "",
    fraudStatus: payment.fraudStatus ?? "",
    vaNumber: payment.vaNumber ?? "",
    qrString: payment.qrString ?? "",
    qrUrl: payment.qrUrl ?? "",
    deeplinkUrl: payment.deeplinkUrl ?? "",
    paidAt: toOptionalIsoString(payment.paidAt),
    expiredAt: toOptionalIsoString(payment.expiredAt),
    lastStatusSyncedAt: toOptionalIsoString(payment.lastStatusSyncedAt),
    createdAt: toIsoString(payment.createdAt),
    updatedAt: toIsoString(payment.updatedAt),
  };
}

function mapOrder(row: OrderWithRelations): OrderTracking {
  return {
    id: row.id,
    status: toContractOrderStatus(row.status),
    paymentStatus: getPaymentStatus(row.payments),
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
    paymentExpiresAt: toOptionalIsoString(row.paymentExpiresAt),
    subtotal: {
      amount: row.subtotalAmount,
      currency: "IDR",
    },
    platformFee: {
      amount: row.platformFeeAmount,
      currency: "IDR",
    },
    shippingEstimate: {
      amount: row.shippingEstimateAmount,
      currency: "IDR",
    },
    discount: {
      amount: row.discountAmount,
      currency: "IDR",
    },
    promoCode: row.promoCode ?? "",
    grandTotal: {
      amount: row.grandTotalAmount,
      currency: "IDR",
    },
    shipping: {
      receiverName: row.receiverName ?? "",
      receiverPhone: row.receiverPhone ?? "",
      address: row.shippingAddress ?? "",
      city: row.shippingCity ?? "",
      province: row.shippingProvince ?? "",
      courierCode: row.courierCode ?? "",
      courierName: row.courierName ?? "",
    },
    items: row.items.map(mapOrderItem),
    payments: row.payments.map(mapPayment),
    fulfillments: row.fulfillments.map((fulfillment) => ({
      id: fulfillment.id,
      sellerId: fulfillment.sellerId,
      sellerName: fulfillment.seller.displayName,
      status: toContractFulfillmentStatus(fulfillment.status),
      trackingNumber: fulfillment.trackingNumber ?? "",
      shippingNote: fulfillment.shippingNote ?? "",
      shippedAt: toOptionalIsoString(fulfillment.shippedAt),
      deliveredAt: toOptionalIsoString(fulfillment.deliveredAt),
      updatedAt: toIsoString(fulfillment.updatedAt),
    })),
  };
}

function getSellerCommissionRate(kind: CartItemKind): number {
  switch (kind) {
    case CartItemKind.PRODUCT:
      return 0.05;
    case CartItemKind.AMPAS_LISTING:
      return 0.03;
  }
}

function isPaidRevenueOrder(order: SellerFinanceOrder): boolean {
  return (
    order.status === PrismaOrderStatus.PAID ||
    order.status === PrismaOrderStatus.FULFILLED
  );
}

export async function getBuyerOrdersDto(userId: string): Promise<OrderTracking[]> {
  const rows = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              sellerId: true,
            },
          },
          ampasListing: {
            select: {
              slug: true,
              sellerId: true,
            },
          },
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      fulfillments: {
        include: {
          seller: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map(mapOrder);
}

export async function getBuyerOrderDto(
  userId: string,
  orderId: string,
): Promise<OrderTracking | null> {
  const row = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              sellerId: true,
            },
          },
          ampasListing: {
            select: {
              slug: true,
              sellerId: true,
            },
          },
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      fulfillments: {
        include: {
          seller: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  return row ? mapOrder(row) : null;
}

export async function getSellerOrdersDto(
  sellerId: string,
): Promise<OrderTracking[]> {
  const rows = await prisma.order.findMany({
    where: {
      items: {
        some: {
          sellerId,
        },
      },
    },
    include: {
      items: {
        where: {
          sellerId,
        },
        include: {
          product: {
            select: {
              name: true,
              sellerId: true,
            },
          },
          ampasListing: {
            select: {
              slug: true,
              sellerId: true,
            },
          },
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      fulfillments: {
        where: {
          sellerId,
        },
        include: {
          seller: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rows.map(mapOrder);
}

export async function getSellerFinanceSummaryDto(
  sellerId: string,
): Promise<SellerFinanceSummary> {
  const [productAgg, ampasAgg, paidCount, pendingCount, fulfilledCount] = await Promise.all([
    prisma.orderItem.aggregate({
      where: {
        sellerId,
        kind: CartItemKind.PRODUCT,
        order: {
          status: {
            in: [PrismaOrderStatus.PAID, PrismaOrderStatus.FULFILLED],
          },
        },
      },
      _sum: {
        unitPriceAmount: true,
        quantity: true,
      },
    }),
    prisma.orderItem.aggregate({
      where: {
        sellerId,
        kind: CartItemKind.AMPAS_LISTING,
        order: {
          status: {
            in: [PrismaOrderStatus.PAID, PrismaOrderStatus.FULFILLED],
          },
        },
      },
      _sum: {
        unitPriceAmount: true,
        quantity: true,
      },
    }),
    prisma.order.count({
      where: {
        items: { some: { sellerId } },
        status: { in: [PrismaOrderStatus.PAID, PrismaOrderStatus.FULFILLED] },
      },
    }),
    prisma.order.count({
      where: {
        items: { some: { sellerId } },
        status: PrismaOrderStatus.PENDING_PAYMENT,
      },
    }),
    prisma.order.count({
      where: {
        items: { some: { sellerId } },
        status: PrismaOrderStatus.FULFILLED,
      },
    }),
  ]);

  const productRevenue = (productAgg._sum.unitPriceAmount ?? 0) * (productAgg._sum.quantity ?? 0);
  const ampasRevenue = (ampasAgg._sum.unitPriceAmount ?? 0) * (ampasAgg._sum.quantity ?? 0);
  const grossRevenue = productRevenue + ampasRevenue;
  const productCommission = Math.round(productRevenue * 0.05);
  const ampasCommission = Math.round(ampasRevenue * 0.03);
  const platformCommission = productCommission + ampasCommission;

  return {
    sellerId,
    grossRevenue: {
      amount: grossRevenue,
      currency: "IDR",
    },
    platformCommission: {
      amount: platformCommission,
      currency: "IDR",
    },
    netRevenue: {
      amount: grossRevenue - platformCommission,
      currency: "IDR",
    },
    paidOrderCount: paidCount,
    pendingOrderCount: pendingCount,
    fulfilledOrderCount: fulfilledCount,
  };
}
