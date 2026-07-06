"use client";

import { useState, useEffect } from "react";
import { SellerStats } from "./seller-stats";
import { ProductManagement } from "./product-management";
import { AmpasManagement } from "./ampas-management";
import { PassportManagement } from "./passport-management";
import { PromoManagement } from "./promo-management";
import {
  LayoutDashboard,
  ShoppingBag,
  Recycle,
  ShieldCheck,
  Ticket,
  ArrowUpRight,
  Download
} from "lucide-react";
import type { Product, AmpasListing, Promo } from "@/lib/contracts";
import {
  DashboardShell,
  DashboardSidebar,
  DashboardTopbar,
  type SidebarNavItem
} from "@/components/dashboard/dashboard-layout";

type SellerDashboardShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
  promos?: Promo[];
};

type PassportDraft = {
  productId: string;
  patchouliAlcohol: string;
  origin: string;
  aromaProfile: string;
  safetyNotes: string;
  status: "draft" | "submitted" | "verified";
};

export function SellerDashboardShell({ products, ampasListings, promos = [] }: SellerDashboardShellProps) {
  const sellerId = "seller-aceh-aroma";

  // Active Menu Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "ampas" | "passport" | "promos">("overview");

  // Local state for listings to simulate operations
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerAmpas, setSellerAmpas] = useState<AmpasListing[]>([]);

  // Passport Drafts state
  const [passportDrafts, setPassportDrafts] = useState<PassportDraft[]>([
    {
      productId: "prod-essential-oil-1",
      patchouliAlcohol: "32%",
      origin: "Tapaktuan, Aceh Selatan",
      aromaProfile: "Woody, Earthy, Sweet Balsamic",
      safetyNotes: "Hindari kontak langsung dengan mata. Jauhkan dari jangkauan anak-anak.",
      status: "verified",
    },
    {
      productId: "prod-roll-on-2",
      patchouliAlcohol: "30%",
      origin: "Lhonga, Aceh Besar",
      aromaProfile: "Fresh Herbaceous, Woody-warm",
      safetyNotes: "Hanya untuk pemakaian luar. Hentikan jika terjadi iritasi kulit.",
      status: "draft",
    },
  ]);

  // Load seller's items on mount
  useEffect(() => {
    setSellerProducts(products.filter((p) => p.sellerId === sellerId));
    setSellerAmpas(ampasListings.filter((a) => a.sellerId === sellerId));
  }, [products, ampasListings]);

  // Add Product handler
  const handleAddProduct = (prod: { name: string; price: number; stock: number; category: string }) => {
    const newProd: Product = {
      id: `prod-local-${Date.now()}`,
      slug: `prod-${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      sellerId: sellerId,
      categoryId: prod.category,
      passportId: `passport-local-${Date.now()}`,
      name: prod.name,
      shortDescription: "Minyak atsiri berkualitas premium yang diproduksi secara higienis.",
      form: "essential-oil",
      functions: ["relaxation"],
      tags: ["new-arrival"],
      price: { amount: prod.price, currency: "IDR" },
      stock: prod.stock,
      status: "published",
      image: {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        alt: prod.name,
      },
      gallery: [],
      featuredRank: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSellerProducts((prev) => [newProd, ...prev]);

    // Automatically create a passport draft for this product
    setPassportDrafts((prev) => [
      {
        productId: newProd.id,
        patchouliAlcohol: "30%",
        origin: "Aceh",
        aromaProfile: "Woody, Earthy",
        safetyNotes: "Simpan di tempat sejuk.",
        status: "draft",
      },
      ...prev,
    ]);
  };

  // Add Ampas handler
  const handleAddAmpas = (amp: { condition: any; quantityKg: number; pricePerKg: number }) => {
    const newAmp: AmpasListing = {
      id: `ampas-mock-${Date.now()}`,
      slug: `ampas-tapaktuan-${amp.condition}-${Date.now()}`,
      sellerId: sellerId,
      condition: amp.condition,
      quantityKg: amp.quantityKg,
      pricePerKg: { amount: amp.pricePerKg, currency: "IDR" },
      location: {
        province: "Aceh",
        city: "Aceh Selatan",
        district: "Tapaktuan",
      },
      distillationProcess: "Penyulingan menggunakan tungku uap kayu bakar dengan pendingin air bersuhu konstan.",
      usageTags: ["compost", "briquette"],
      status: "active",
      image: {
        src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
        alt: "Ampas Nilam Suling",
      },
      disclaimer: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSellerAmpas((prev) => [newAmp, ...prev]);
  };

  // Submit Nilam Passport Draft
  const handleSavePassportDraft = (
    productId: string,
    patchouliAlcohol: string,
    origin: string,
    aromaProfile: string,
    safetyNotes: string
  ) => {
    setPassportDrafts((prev) =>
      prev.map((d) =>
        d.productId === productId
          ? { ...d, patchouliAlcohol, origin, aromaProfile, safetyNotes, status: "submitted" }
          : d
      )
    );
  };

  // Map Sidebar Nav Items to shared components format
  const sidebarNav: SidebarNavItem[] = [
    { id: "overview", label: "Ringkasan Toko", icon: LayoutDashboard },
    { id: "products", label: "Produk B2C", icon: ShoppingBag, count: sellerProducts.length },
    { id: "ampas", label: "Ampas B2B", icon: Recycle, count: sellerAmpas.length },
    { id: "passport", label: "Nilam Passport", icon: ShieldCheck },
    { id: "promos", label: "Promo Toko", icon: Ticket },
  ];

  return (
    <DashboardShell>
      {/* 1. LEFT SIDEBAR */}
      <DashboardSidebar
        brandName="NILOKA Seller"
        logoChar="N"
        profileName="Aceh Aroma House"
        profileRole="UMKM Partner / Seller"
        profileImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        navigation={sidebarNav}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 h-full flex overflow-hidden">
        
        {/* MIDDLE PRIMARY CONTENT COLUMN */}
        <main className="flex-1 h-full overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <DashboardTopbar
              title="Aceh Aroma House 👋"
              subtitle="Kelola produk retail atsiri, monitoring sensorik, dan draf paspor Anda."
            />
          </div>

          {/* Banner Card */}
          <div className="relative overflow-hidden rounded-[28px] bg-brand-950 text-white-soft p-6 shadow-xl flex flex-col justify-between min-h-[160px]">
            <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
              <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-brand-200 uppercase tracking-widest block">Mitra Rantai Pasok Terintegrasi</span>
                <span className="text-2xl font-black font-serif-accent italic mt-1 block">Aceh Aroma House Portal</span>
              </div>
              <div className="flex items-center gap-1.5 bg-brand-900 border border-brand-800 rounded-full px-3 py-1 text-[9px] font-bold text-brand-100 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-6">
              <div>
                <span className="text-[10px] font-bold text-brand-200 block uppercase tracking-wider">Total Pendapatan</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">Rp 12.450.000</span>
              </div>

              <div className="flex gap-2">
                <button className="h-9 px-4 rounded-xl bg-white-soft text-brand-950 hover:bg-cream-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Lihat Invoice
                </button>
                <button className="h-9 px-4 rounded-xl bg-brand-900 border border-brand-800 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  Unduh Laporan
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE TAB CONTENT */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <SellerStats
                sellerProductsCount={sellerProducts.length}
                sellerAmpasCount={sellerAmpas.length}
                passportDraftsCount={passportDrafts.length}
              />
            )}

            {activeTab === "products" && (
              <ProductManagement
                sellerProducts={sellerProducts}
                passportDrafts={passportDrafts}
                onAddProduct={handleAddProduct}
              />
            )}

            {activeTab === "ampas" && (
              <AmpasManagement
                sellerAmpas={sellerAmpas}
                onAddAmpas={handleAddAmpas}
              />
            )}

            {activeTab === "passport" && (
              <PassportManagement
                passportDrafts={passportDrafts}
                sellerProducts={sellerProducts}
                onSavePassportDraft={handleSavePassportDraft}
              />
            )}

            {activeTab === "promos" && (
              <PromoManagement
                sellerProducts={sellerProducts}
                initialPromos={promos}
              />
            )}
          </div>
        </main>

        {/* 3. RIGHT SIDEBAR PANEL */}
        <aside className="w-80 h-full bg-white-soft border-l border-line/60 p-6 sm:p-8 space-y-6 shrink-0 overflow-y-auto hidden xl:block">
          {/* Recent Orders / Inquiries list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Pesanan & Inquiry Terbaru</h4>
              <span className="text-[9px] font-bold text-brand-900 border border-line/60 px-2 py-0.5 rounded-full cursor-pointer hover:bg-cream-50">Semua</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Fitra Rahmad", detail: "Roll On Relief (Qty 1)", price: "Rp 75.000", date: "08 Sep, 2026", color: "text-brand-900 bg-brand-100" },
                { name: "CV Pupuk Atsiri", detail: "Inquiry: Ampas Kering (500kg)", price: "Negosiasi", date: "08 Sep, 2026", color: "text-brand-900 bg-brand-100/50 border border-brand-200" },
                { name: "Andi Saputra", detail: "Essential Oil Aceh (Qty 2)", price: "Rp 390.000", date: "07 Sep, 2026", color: "text-brand-900 bg-brand-100" },
                { name: "Siti Rahma", detail: "Sabun Nilam Artisan (Qty 5)", price: "Rp 175.000", date: "06 Sep, 2026", color: "text-brand-900 bg-brand-100" },
              ].map((act, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3 p-3 bg-cream-50/40 hover:bg-cream-50/70 border border-line/30 rounded-2xl transition-all">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-brand-950 block">{act.name}</span>
                    <span className="text-[9px] text-ink-600 block">{act.detail}</span>
                    <span className="text-[8px] text-ink-600/60 block">{act.date}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${act.color}`}>
                    {act.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </DashboardShell>
  );
}
