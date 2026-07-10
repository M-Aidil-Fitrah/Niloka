"use client";

import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Leaf, ShieldCheck, Tag, FileText, Package } from "lucide-react";
import { DashboardShell, DashboardSidebar, DashboardTopbar } from "../dashboard/dashboard-layout";
import { SellerStats } from "./seller-stats";
import { ProductManagement } from "./product-management";
import { AmpasManagement } from "./ampas-management";
import { PassportManagement } from "./passport-management";
import { PromoManagement } from "./promo-management";
import { OrderManagement } from "./order-management";
import type { Product, AmpasListing, Promo, OrderTracking } from "@/lib/contracts";
import { useAuth } from "@/context/auth-context";

type SellerDashboardShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
  promos: Promo[];
  orders: OrderTracking[];
  onRefreshOrders?: () => Promise<void>;
  finance: {
    grossRevenue: number;
    productCount: number;
    pendingPassports: number;
    ratingAverage: number;
    totalReviews: number;
    dailySales: { day: string; amount: number }[];
    recentTransactions: { id: string; productName: string; buyerName: string; amount: number; date: string; status: "success" | "pending" | "failed" }[];
    activityLog: { action: string; date: string; status: string }[];
  };
};

export function SellerDashboardShell({
  products,
  ampasListings,
  promos,
  orders,
  onRefreshOrders,
  finance,
}: SellerDashboardShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const navigation = [
    { id: "overview", label: "Ringkasan Toko", icon: LayoutDashboard },
    { id: "orders", label: "Pesanan", icon: Package, count: orders.filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "pending").length },
    { id: "products", label: "Katalog Produk", icon: ShoppingBag, count: products.length },
    { id: "ampas", label: "Ampas Nilam", icon: Leaf, count: ampasListings.length },
    { id: "passport", label: "Nilam Passport", icon: ShieldCheck },
    { id: "promos", label: "Voucher Promosi", icon: Tag, count: promos.length },
    { id: "logs", label: "Log Aktivitas", icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <SellerStats
            products={products}
            totalSales={finance.grossRevenue}
            totalProducts={products.length}
            pendingPassports={finance.pendingPassports}
            ratingAverage={finance.ratingAverage}
            totalReviews={finance.totalReviews}
            dailySales={finance.dailySales}
            recentTransactions={finance.recentTransactions}
          />
        );
      case "orders":
        return <OrderManagement orders={orders} onRefresh={onRefreshOrders} />;
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
              {finance.activityLog.length === 0 ? (
                <p className="text-xs text-ink-500 py-4 text-center">Belum ada aktivitas yang tercatat.</p>
              ) : (
                finance.activityLog.map((log, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-line/35 last:border-b-0 last:pb-0 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-brand-950 block">{log.action}</span>
                      <span className="text-[10px] text-ink-500 font-semibold">{log.date}</span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      log.status === "Sukses" ? "text-emerald-800 bg-emerald-50" : "text-red-600 bg-red-50"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))
              )}
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
      case "orders":
        return "Pantau dan proses pesanan dari pembeli";
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
      <DashboardSidebar
        brandName="Niloka Seller"
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <DashboardTopbar
          title={navigation.find((item) => item.id === activeTab)?.label || "Dashboard"}
          subtitle={getSubTitle()}
          profileName={user?.name || "Aceh Aroma Co."}
          profileRole={user?.sellerType ? `Mitra ${user.sellerType.toUpperCase()}` : "Penyuling Mitra"}
          profileImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
          onMenuClick={() => setIsSidebarOpen(true)}
          chatHref="/chat?mode=seller"
          backToUrl="/"
          backToLabel="Kembali ke Pasar"
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-6xl mx-auto pb-12">{renderContent()}</div>
        </main>
      </div>
    </DashboardShell>
  );
}
