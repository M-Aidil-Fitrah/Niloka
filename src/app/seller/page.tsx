"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { getSellerAmpasListingsAction } from "@/lib/actions/ampas-actions";
import { getSellerProductsAction } from "@/lib/actions/product-actions";
import { getSellerPromosAction } from "@/lib/actions/promo-actions";
import type { AmpasListing, Product, Promo } from "@/lib/contracts";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);

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
      // Fetch ampas listings
      getSellerAmpasListingsAction()
        .then((data) => {
          setAmpasListings(data);
        })
        .catch((err) => {
          console.error("Failed to load seller ampas listings", err);
        });

      // Fetch products
      getSellerProductsAction()
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => {
          console.error("Failed to load seller products", err);
        });

      // Fetch promos
      getSellerPromosAction()
        .then((data) => {
          setPromos(data);
        })
        .catch((err) => {
          console.error("Failed to load seller promos", err);
        });
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
    />
  );
}

