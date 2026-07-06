"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SellerStats } from "./seller-stats";
import { ProductManagement } from "./product-management";
import { AmpasManagement } from "./ampas-management";
import { PassportManagement } from "./passport-management";
import {
  LayoutDashboard,
  ShoppingBag,
  Recycle,
  ShieldCheck,
  ChevronRight,
  Search,
  Bell,
  MessageSquare,
  Settings,
  ArrowUpRight,
  Download,
  Plus,
  RefreshCw,
  LogOut,
  MapPin,
  Beaker
} from "lucide-react";
import type { Product, AmpasListing } from "@/lib/contracts";

type SellerDashboardShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
};

type PassportDraft = {
  productId: string;
  patchouliAlcohol: string;
  origin: string;
  aromaProfile: string;
  safetyNotes: string;
  status: "draft" | "submitted" | "verified";
};

export function SellerDashboardShell({ products, ampasListings }: SellerDashboardShellProps) {
  const sellerId = "seller-aceh-aroma";

  // Active Menu Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "ampas" | "passport">("overview");

  // Local state for listings to simulate operations
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerAmpas, setSellerAmpas] = useState<AmpasListing[]>([]);

  // Passport Drafts state
  const [passportDrafts, setPassportDrafts] = useState<PassportDraft[]>([
    {
      productId: "product-essential-oil-aceh",
      patchouliAlcohol: "34.2%",
      origin: "Tapaktuan, Aceh Selatan",
      aromaProfile: "Woody, Earthy, Rich Balsamic",
      safetyNotes: "Jauhkan dari jangkauan anak-anak. Jangan dioleskan langsung ke kulit tanpa minyak pembawa.",
      status: "verified",
    },
    {
      productId: "product-roll-on-relief",
      patchouliAlcohol: "30.5%",
      origin: "Kluet Utara, Aceh Selatan",
      aromaProfile: "Menthol-wood, Herbaceous, Calming",
      safetyNotes: "Hanya untuk penggunaan luar. Hindari area mata dan selaput lendir.",
      status: "verified",
    },
    {
      productId: "product-sabun-nilam-artisan",
      patchouliAlcohol: "N/A (Turunan)",
      origin: "Tapaktuan, Aceh Selatan",
      aromaProfile: "Warm woody, Creamy coconut, Clean",
      safetyNotes: "Bilas hingga bersih jika terkena mata. Hentikan pemakaian jika terjadi iritasi.",
      status: "draft",
    },
  ]);

  // Seed local states on mount
  useEffect(() => {
    const filtered = products.filter((p) => p.sellerId === sellerId);
    const filteredAmpas = ampasListings.filter((a) => a.sellerId === sellerId);
    setSellerProducts(filtered);
    setSellerAmpas(filteredAmpas);
  }, [products, ampasListings]);

  // Add mock product handler
  const handleAddProduct = (prod: { name: string; price: number; stock: number; category: string }) => {
    const newProd: Product = {
      id: `product-mock-${Date.now()}`,
      slug: prod.name.toLowerCase().replace(/\s+/g, "-"),
      name: prod.name,
      price: { amount: prod.price, currency: "IDR" },
      stock: prod.stock,
      categoryId: prod.category,
      sellerId: sellerId,
      passportId: "",
      form: "essential-oil",
      functions: ["relaxation"],
      status: "published",
      image: {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        alt: prod.name,
      },
      gallery: [],
      featuredRank: 0,
      tags: ["new-arrival"],
      shortDescription: `Produk nilam baru beraroma alami khas Aceh Selatan.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSellerProducts((prev) => [newProd, ...prev]);

    // Also add empty passport draft for it
    const newDraft: PassportDraft = {
      productId: newProd.id,
      patchouliAlcohol: "N/A (Turunan)",
      origin: "Aceh Selatan",
      aromaProfile: "Warm Woody",
      safetyNotes: "Gunakan secukupnya.",
      status: "draft",
    };
    setPassportDrafts((prev) => [...prev, newDraft]);
  };

  // Add mock ampas handler
  const handleAddAmpas = (amp: { quantityKg: number; pricePerKg: number; condition: "dry" | "wet" }) => {
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

  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 grid lg:grid-cols-[250px_1fr] w-full font-sans max-w-[1920px] mx-auto">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="bg-white-soft border-r border-line/60 p-6 flex flex-col justify-between shrink-0 min-h-screen">
        <div className="space-y-8">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-950 flex items-center justify-center text-white-soft font-black text-xs">
              N
            </div>
            <span className="font-extrabold text-sm tracking-wider text-brand-950">NILOKA Seller</span>
          </div>

          {/* User profile card (Darrell Steward style) */}
          <div className="bg-cream-50/50 border border-line/40 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-950/20 bg-cream-100">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                alt="Aceh Aroma House"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="font-extrabold text-brand-950 mt-3 text-xs block">Aceh Aroma House</span>
            <span className="text-[10px] text-ink-600 block mt-0.5">UMKM Partner / Seller</span>
          </div>

          {/* Nav menu links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Ringkasan Toko
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Produk B2C ({sellerProducts.length})
            </button>
            <button
              onClick={() => setActiveTab("ampas")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "ampas" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <Recycle className="h-4 w-4" />
              Ampas B2B ({sellerAmpas.length})
            </button>
            <button
              onClick={() => setActiveTab("passport")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "passport" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Nilam Passport
            </button>
          </nav>
        </div>

        {/* Bottom Menu Items */}
        <div className="space-y-3 pt-6 border-t border-line/40">
          <div className="flex items-center justify-between px-3 text-[10px] font-bold text-ink-600">
            <span>Sistem Status</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 hover:text-red-800 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Kembali ke Pasar
          </Link>
        </div>
      </aside>

      {/* 2. MIDDLE CONTENT AREA & RIGHT SIDEBAR PANEL */}
      <div className="flex flex-col lg:flex-row flex-1 min-w-0">
        
        {/* MIDDLE PRIMARY CONTENT COLUMN */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-950 font-serif-accent italic">Aceh Aroma House</h2>
              <p className="text-xs text-ink-600 mt-0.5">Kelola produk retail atsiri, monitoring sensorik, dan draf paspor Anda.</p>
            </div>
            
            {/* Action Bar (Search & Icons) */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              </button>
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer">
                <MessageSquare className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner Card ("My Card" widget style) */}
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
                  Lihat Toko
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
          </div>
        </main>

        {/* RIGHT SIDEBAR PANEL */}
        <aside className="w-full lg:w-80 bg-white-soft border-l border-line/60 p-6 sm:p-8 space-y-8 shrink-0">
          
          {/* Partnership Profile (Replaces Credit Card) */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Profil Kemitraan Atsiri</h4>
            
            {/* Partnership Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 text-white-soft p-5 shadow-lg flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-bold text-brand-200 uppercase tracking-widest block">Distillation Partner</span>
                  <span className="text-sm font-serif-accent italic font-bold mt-0.5 block">Aceh Aroma House</span>
                </div>
                <div className="h-6 w-9 rounded bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-[9px] font-black text-gold-100">
                  PLATINUM
                </div>
              </div>

              {/* Partner Details */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="p-1 bg-white-soft/10 text-white rounded">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-brand-200 block uppercase tracking-wider">Lokasi Suling</span>
                    <span className="text-[10px] font-bold text-white block">Kec. Tapaktuan, Aceh Selatan</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[8px] font-bold text-brand-200 block uppercase tracking-wider">Kapasitas Tangki</span>
                    <span className="text-xs font-bold tracking-wider font-mono text-white block mt-0.5">500 Kg / Batch</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-brand-200 block uppercase tracking-wider">Sertifikat</span>
                    <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders / Inquiries list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Pesanan & Inquiry Terbaru</h4>
              <span className="text-[9px] font-bold text-brand-900 border border-line/60 px-2 py-0.5 rounded-full cursor-pointer hover:bg-cream-50">Semua</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Fitra Rahmad", detail: "Roll On Relief (Qty 1)", price: "Rp 75.000", date: "08 Sep, 2026", color: "text-emerald-700 bg-emerald-100" },
                { name: "CV Pupuk Atsiri", detail: "Inquiry: Ampas Kering (500kg)", price: "Negosiasi", date: "08 Sep, 2026", color: "text-sky-700 bg-sky-100" },
                { name: "Andi Saputra", detail: "Essential Oil Aceh (Qty 2)", price: "Rp 390.000", date: "07 Sep, 2026", color: "text-emerald-700 bg-emerald-100" },
                { name: "Siti Rahma", detail: "Sabun Nilam Artisan (Qty 5)", price: "Rp 175.000", date: "06 Sep, 2026", color: "text-emerald-700 bg-emerald-100" },
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
    </div>
  );
}
