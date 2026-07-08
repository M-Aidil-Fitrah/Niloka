"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import {
  getPromosForSeller,
  getPublishedProducts,
} from "@/lib/mock-queries";
import { getSellerAmpasListingsAction } from "@/lib/actions/ampas-actions";
import type { AmpasListing } from "@/lib/contracts";
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
  const [ampasListings, setAmpasListings] = useState<AmpasListing[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login?role=seller");
      } else if (user.role !== "seller") {
        router.replace("/");
      } else {
        setTimeout(() => {
          setIsAuthorized(true);
        }, 0);
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isAuthorized && user?.sellerId) {
      getSellerAmpasListingsAction()
        .then((data) => {
          setAmpasListings(data);
        })
        .catch((err) => {
          console.error("Failed to load seller ampas listings", err);
        });
    }
  }, [isAuthorized, user]);

  if (isLoading || !isAuthorized || !user) {
    return <SellerDashboardSkeleton />;
  }

  // Filter products, promos dynamically for the logged-in seller
  const sellerId = user.sellerId || "seller-aceh-aroma";
  const allProducts = getPublishedProducts();

  const products = allProducts.filter((p) => p.sellerId === sellerId);
  const promos = getPromosForSeller(sellerId);

  return (
    <SellerDashboardShell
      products={products}
      ampasListings={ampasListings}
      promos={promos}
    />
  );
}

