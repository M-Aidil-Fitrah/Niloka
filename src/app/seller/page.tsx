import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPublishedProducts, getActiveAmpasListings } from "@/lib/mock-queries";
import { SellerDashboardSkeleton } from "@/components/ui/skeletons";

const SellerDashboardShell = dynamic(
  () => import("@/components/seller/seller-dashboard-shell").then((m) => m.SellerDashboardShell),
  {
    loading: () => <SellerDashboardSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Seller Portal - NILOKA",
  description: "Kelola katalog produk, listing ampas B2B, pantau transparansi Nilam Passport, dan buat deskripsi produk dengan bantuan AI.",
};

export default function SellerPage() {
  const products = getPublishedProducts();
  const ampasListings = getActiveAmpasListings();

  return (
    <SellerDashboardShell products={products} ampasListings={ampasListings} />
  );
}
