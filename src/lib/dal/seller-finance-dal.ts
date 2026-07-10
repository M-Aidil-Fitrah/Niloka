import "server-only";

import { prisma } from "@/lib/db/prisma";
import { CartItemKind } from "@/generated/prisma/client";
import { OrderStatus as PrismaOrderStatus } from "@/generated/prisma/client";
import type { SellerFinanceSummary } from "@/lib/contracts";

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
