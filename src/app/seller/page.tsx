"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import {
  getActiveAmpasListings,
  getPromosForSeller,
  getPublishedProducts,
} from "@/lib/mock-queries";
import { SellerDashboardSkeleton } from "@/components/ui/skeletons";

const SellerDashboardShell = dynamic(
  () => import("@/components/seller/seller-dashboard-shell").then((m) => m.SellerDashboardShell),
  {
    loading: () => <SellerDashboardSkeleton />,
    ssr: false,
  }
);

export default function SellerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login?role=seller");
      } else if (user.role !== "seller") {
        router.replace("/");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized || !user) {
    return <SellerDashboardSkeleton />;
  }

  // Filter products, promos, and ampas listings dynamically for the logged-in seller
  const sellerId = user.sellerId || "seller-aceh-aroma";
  const allProducts = getPublishedProducts();
  const allAmpasListings = getActiveAmpasListings();

  const products = allProducts.filter((p) => p.sellerId === sellerId);
  const ampasListings = allAmpasListings.filter((a) => a.sellerId === sellerId);
  const promos = getPromosForSeller(sellerId);

  return (
    <SellerDashboardShell
      products={products}
      ampasListings={ampasListings}
      promos={promos}
    />
  );
}
