"use client";

import { useState, useEffect } from "react";
import { SellerStats } from "./seller-stats";
import { ProductManagement } from "./product-management";
import { AmpasManagement } from "./ampas-management";
import { PassportManagement } from "./passport-management";
import { LayoutDashboard, ShoppingBag, Recycle, ShieldCheck, ChevronRight } from "lucide-react";
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
    <div className="rounded-[36px] bg-zinc-950 text-zinc-100 p-6 sm:p-8 shadow-2xl border border-zinc-900/60 grid gap-6 lg:grid-cols-[260px_1fr] items-start">
      
      {/* SIDEBAR TABS NAV */}
      <nav className="flex flex-row lg:flex-col gap-1.5 border-b lg:border-b-0 border-zinc-900 pb-3 lg:pb-0 overflow-x-auto lg:overflow-visible shrink-0 p-1 bg-zinc-900/40 lg:bg-transparent rounded-2xl">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full ${
            activeTab === "overview"
              ? "bg-brand-900 text-white-soft shadow-lg font-extrabold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <LayoutDashboard className="h-4.5 w-4.5" />
            Ringkasan Toko
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 lg:group-hover:opacity-100 lg:opacity-40" />
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full ${
            activeTab === "products"
              ? "bg-brand-900 text-white-soft shadow-lg font-extrabold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <ShoppingBag className="h-4.5 w-4.5" />
            Produk B2C ({sellerProducts.length})
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 lg:group-hover:opacity-100 lg:opacity-40" />
        </button>
        <button
          onClick={() => setActiveTab("ampas")}
          className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full ${
            activeTab === "ampas"
              ? "bg-brand-900 text-white-soft shadow-lg font-extrabold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Recycle className="h-4.5 w-4.5" />
            Ampas B2B ({sellerAmpas.length})
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 lg:group-hover:opacity-100 lg:opacity-40" />
        </button>
        <button
          onClick={() => setActiveTab("passport")}
          className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer w-full ${
            activeTab === "passport"
              ? "bg-brand-900 text-white-soft shadow-lg font-extrabold"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5" />
            Nilam Passport
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-0 lg:group-hover:opacity-100 lg:opacity-40" />
        </button>
      </nav>

      {/* TABS CONTAINER CONTENT */}
      <section className="bg-zinc-900/30 border border-zinc-900/80 rounded-[28px] p-5 sm:p-6 shadow-inner min-h-[500px]">
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
      </section>
    </div>
  );
}
