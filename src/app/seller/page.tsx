"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { getSellerAmpasListingsAction } from "@/lib/actions/ampas-actions";
import { getSellerProductsAction } from "@/lib/actions/product-actions";
import { getSellerPromosAction } from "@/lib/actions/promo-actions";
import { getSellerFinanceSummaryAction } from "@/lib/actions/seller-finance-actions";
import { getSellerOrdersAction } from "@/lib/actions/seller-order-actions";
import type { AmpasListing, Product, Promo, OrderTracking } from "@/lib/contracts";
import { SellerDashboardSkeleton } from "@/components/ui/skeletons";

const SellerDashboardShell = dynamic(
  () => import("@/components/seller/seller-dashboard-shell").then((m) => m.SellerDashboardShell),
  {
    loading: () => <SellerDashboardSkeleton />,
    ssr: false,
  }
);

type SellerFinanceData = {
  grossRevenue: number;
  productCount: number;
  pendingPassports: number;
  ratingAverage: number;
  totalReviews: number;
  dailySales: { day: string; amount: number }[];
  recentTransactions: { id: string; productName: string; buyerName: string; amount: number; date: string; status: "success" | "pending" | "failed" }[];
  activityLog: { action: string; date: string; status: string }[];
};

export default function SellerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [ampasListings, setAmpasListings] = useState<AmpasListing[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [orders, setOrders] = useState<OrderTracking[]>([]);
  const [finance, setFinance] = useState<SellerFinanceData | null>(null);

  const refreshOrders = useCallback(async () => {
    try {
      const data = await getSellerOrdersAction();
      setOrders(data);
    } catch (err) {
      console.error("Failed to refresh orders", err);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login?role=seller");
      } else if (user.role !== "seller") {
        router.replace("/");
      } else {
        setTimeout(() => setIsAuthorized(true), 0);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isAuthorized && user?.sellerId) {
      getSellerAmpasListingsAction()
        .then(setAmpasListings)
        .catch((err) => console.error("Failed to load seller ampas listings", err));

      getSellerProductsAction()
        .then(setProducts)
        .catch((err) => console.error("Failed to load seller products", err));

      getSellerPromosAction()
        .then(setPromos)
        .catch((err) => console.error("Failed to load seller promos", err));

      getSellerFinanceSummaryAction()
        .then(setFinance)
        .catch((err) => console.error("Failed to load seller finance", err));

      getSellerOrdersAction()
        .then(setOrders)
        .catch((err) => console.error("Failed to load seller orders", err));
    }
  }, [isAuthorized, user]);

  if (isLoading || !isAuthorized || !user) {
    return <SellerDashboardSkeleton />;
  }

  return (
    <SellerDashboardShell
      products={products}
      ampasListings={ampasListings}
      promos={promos}
      orders={orders}
      onRefreshOrders={refreshOrders}
      finance={finance ?? { grossRevenue: 0, productCount: products.length, pendingPassports: 0, ratingAverage: 0, totalReviews: 0, dailySales: [], recentTransactions: [], activityLog: [] }}
    />
  );
}

