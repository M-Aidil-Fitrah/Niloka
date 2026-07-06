"use client";

import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Leaf, ShieldCheck, Tag } from "lucide-react";
import { DashboardShell, DashboardSidebar, DashboardTopbar } from "../dashboard/dashboard-layout";
import { SellerStats } from "./seller-stats";
import { ProductManagement } from "./product-management";
import { AmpasManagement } from "./ampas-management";
import { PassportManagement } from "./passport-management";
import { PromoManagement } from "./promo-management";
import type { Product, AmpasListing, Promo } from "@/lib/contracts";

type SellerDashboardShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
  promos: Promo[];
};

export function SellerDashboardShell({
  products,
  ampasListings,
  promos,
}: SellerDashboardShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar navigation configuration
  const navigation = [
    { id: "overview", label: "Ringkasan Toko", icon: LayoutDashboard },
    { id: "products", label: "Katalog Produk", icon: ShoppingBag, count: products.length },
    { id: "ampas", label: "Ampas Nilam B2B", icon: Leaf, count: ampasListings.length },
    { id: "passport", label: "Nilam Passport", icon: ShieldCheck },
    { id: "promos", label: "Voucher Promosi", icon: Tag, count: promos.length },
  ];

  // Map active tab to current panel component
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <SellerStats
            totalSales={16350000}
            totalProducts={products.length}
            pendingPassports={1}
          />
        );
      case "products":
        return <ProductManagement products={products} />;
      case "ampas":
        return <AmpasManagement ampasListings={ampasListings} />;
      case "passport":
        return <PassportManagement products={products} />;
      case "promos":
        return <PromoManagement promos={promos} />;
      default:
        return <div className="text-sm font-semibold text-ink-600">Halaman tidak ditemukan.</div>;
    }
  };

  const getSubTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Ikhtisar lengkap penjualan dan aktivitas tokomu";
      case "products":
        return "Atur informasi deskripsi, stok, serta harga coret produk retail";
      case "ampas":
        return "Kelola penawaran residu sulingan nilam untuk pasar sirkular";
      case "passport":
        return "Isi dokumen penelusuran asal-usul panen produk";
      case "promos":
        return "Klaim kupon promo diskon potongan belanja pembeli";
      default:
        return "Portal Mitra Penjual Niloka";
    }
  };

  return (
    <DashboardShell>
      {/* 1. Static/Drawer Sidebar */}
      <DashboardSidebar
        brandName="Seller Hub"
        logoChar="S"
        profileName="Aceh Aroma Co."
        profileRole="Penyuling Mitra"
        profileImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        backToUrl="/"
        backToLabel="Kembali ke Pasar"
      />

      {/* 2. Right Pane: Topbar & Scrollable Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <DashboardTopbar
          title={navigation.find((item) => item.id === activeTab)?.label || "Dashboard"}
          subtitle={getSubTitle()}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-5xl mx-auto pb-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}
