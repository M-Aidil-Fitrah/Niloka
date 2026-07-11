import "server-only";

import { prisma } from "@/lib/db/prisma";
import { CartItemKind } from "@/generated/prisma/client";
import { OrderStatus as PrismaOrderStatus } from "@/generated/prisma/client";
import type { SellerFinanceSummary } from "@/lib/contracts";

export async function getSellerFinanceSummaryDto(
  sellerId: string,
): Promise<SellerFinanceSummary> {
  const [paidItems, paidCount, pendingCount, fulfilledCount] = await Promise.all([
    prisma.orderItem.findMany({
      where: {
        sellerId,
        order: {
          status: {
            in: [PrismaOrderStatus.PAID, PrismaOrderStatus.FULFILLED],
          },
        },
      },
      select: {
        kind: true,
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

  const productRevenue = paidItems
    .filter((item) => item.kind === CartItemKind.PRODUCT)
    .reduce((total, item) => total + item.unitPriceAmount * item.quantity, 0);
  const ampasRevenue = paidItems
    .filter((item) => item.kind === CartItemKind.AMPAS_LISTING)
    .reduce((total, item) => total + item.unitPriceAmount * item.quantity, 0);
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
