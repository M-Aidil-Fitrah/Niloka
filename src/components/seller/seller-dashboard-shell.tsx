"use client";

import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Leaf, ShieldCheck, Tag, FileText } from "lucide-react";
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
    { id: "ampas", label: "Ampas Nilam", icon: Leaf, count: ampasListings.length },
    { id: "passport", label: "Nilam Passport", icon: ShieldCheck },
    { id: "promos", label: "Voucher Promosi", icon: Tag, count: promos.length },
    { id: "logs", label: "Log Aktivitas", icon: FileText },
  ];

  // Map active tab to current panel component
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <SellerStats
            products={products}
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
        return <PromoManagement promos={promos} products={products} />;
      case "logs":
        return (
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-brand-950">Log Aktivitas Toko</h3>
              <p className="text-xs text-ink-600 mt-1">Lacak jejak perubahan data, stok, dan pengajuan verifikasi toko Anda</p>
            </div>
            <div className="space-y-4">
              {[
                { date: "6 Juli 2026, 15:10", action: "Mengubah harga produk 'Roll-on Nilam Relief'", status: "Sukses" },
                { date: "6 Juli 2026, 12:45", action: "Mengajukan draft 'Nilam Passport' baru untuk verifikasi UPTD", status: "Menunggu Review" },
                { date: "5 Juli 2026, 17:30", action: "Membuat Voucher Promosi baru 'NILOKASUMMER'", status: "Sukses" },
                { date: "4 Juli 2026, 09:12", action: "Menambahkan Listing Ampas Nilam Kering 500 Kg", status: "Sukses" },
              ].map((log, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-line/35 last:border-b-0 last:pb-0 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-brand-950 block">{log.action}</span>
                    <span className="text-[10px] text-ink-500 font-semibold">{log.date}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                    log.status === "Sukses" ? "text-emerald-800 bg-emerald-50" : "text-blue-800 bg-blue-50"
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
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
      case "logs":
        return "Lacak histori modifikasi katalog produk dan draf passport";
      default:
        return "Portal Mitra Penjual Niloka";
    }
  };

  return (
    <DashboardShell>
      {/* 1. Static/Drawer Sidebar */}
      <DashboardSidebar
        brandName="Niloka Seller"
        logoChar="S"
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Right Pane: Topbar & Scrollable Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <DashboardTopbar
          title={navigation.find((item) => item.id === activeTab)?.label || "Dashboard"}
          subtitle={getSubTitle()}
          profileName="Aceh Aroma Co."
          profileRole="Penyuling Mitra"
          profileImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
          onMenuClick={() => setIsSidebarOpen(true)}
          backToUrl="/"
          backToLabel="Kembali ke Pasar"
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-6xl mx-auto pb-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}
