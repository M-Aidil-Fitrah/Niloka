import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPublishedProducts, getActiveAmpasListings } from "@/lib/mock-queries";
import { SellerDashboardSkeleton } from "@/components/ui/skeletons";

// Lazy load SellerDashboardShell
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
  // Load products and B2B listings to pass down
  const products = getPublishedProducts();
  const ampasListings = getActiveAmpasListings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700">Mitra Niloka</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-950 font-serif-accent italic">
          Dashboard Penjual
        </h1>
      </div>
      
      <SellerDashboardShell products={products} ampasListings={ampasListings} />
    </div>
  );
}
