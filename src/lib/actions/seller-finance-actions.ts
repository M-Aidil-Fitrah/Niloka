"use server";

import { requireSeller } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PassportValidationStatus } from "@/generated/prisma/client";
import { getSellerFinanceSummaryDto } from "@/lib/dal/seller-finance-dal";

export async function getSellerFinanceSummaryAction(): Promise<{
  grossRevenue: number;
  productCount: number;
  pendingPassports: number;
  ratingAverage: number;
  totalReviews: number;
  recentTransactions: { id: string; productName: string; buyerName: string; amount: number; date: string; status: "success" | "pending" | "failed" }[];
  activityLog: { action: string; date: string; status: string }[];
  dailySales: { day: string; amount: number }[];
}> {
  const seller = await requireSeller();
  if (!seller.sellerId) throw new Error("Not a seller");

  const [finance, products, passports, orders, auditLogs, sellerProfile, sellerOrders] = await Promise.all([
    getSellerFinanceSummaryDto(seller.sellerId),
    prisma.product.findMany({
      where: { sellerId: seller.sellerId },
      select: { id: true },
    }),
    prisma.nilamPassport.count({
      where: {
        product: { sellerId: seller.sellerId },
        validationStatus: PassportValidationStatus.DRAFT,
      },
    }),
    prisma.order.findMany({
      where: {
        items: { some: { sellerId: seller.sellerId } },
        status: { in: ["PAID", "FULFILLED"] },
      },
      include: {
        items: {
          where: { sellerId: seller.sellerId },
          include: {
            product: { select: { name: true } },
            ampasListing: { select: { slug: true } },
          },
        },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.auditLog.findMany({
      where: { userId: seller.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.seller.findUnique({
      where: { id: seller.sellerId },
      select: { ratingAverage: true, totalReviews: true },
    }),
    prisma.order.findMany({
      where: {
        items: { some: { sellerId: seller.sellerId } },
        status: { in: ["PAID", "FULFILLED"] },
      },
      select: {
        grandTotalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ] as const);

  return {
    grossRevenue: finance.grossRevenue.amount,
    productCount: products.length,
    pendingPassports: passports,
    ratingAverage: sellerProfile?.ratingAverage ?? 0,
    totalReviews: sellerProfile?.totalReviews ?? 0,
    recentTransactions: orders.map((o) => ({
      id: o.id,
      productName: o.items[0]?.product?.name
        ?? o.items[0]?.ampasListing?.slug?.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        ?? "Produk Nilam",
      buyerName: o.user?.name ?? "Pembeli",
      amount: o.grandTotalAmount,
      date: o.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: o.status === "PAID" || o.status === "FULFILLED" ? "success" as const : "pending" as const,
    })),
    dailySales: (() => {
      const dayTotals = new Map<string, number>();
      for (const o of sellerOrders) {
        const key = o.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        dayTotals.set(key, (dayTotals.get(key) ?? 0) + o.grandTotalAmount);
      }
      return Array.from(dayTotals.entries()).slice(-14).map(([day, amount]) => ({ day, amount }));
    })(),
    activityLog: auditLogs.map((log) => ({
      action: log.action.replace(/_/g, " "),
      date: log.createdAt.toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      status: log.action.includes("DELETE") || log.action.includes("REJECT") ? "Gagal" : "Sukses",
    })),
  };
}
