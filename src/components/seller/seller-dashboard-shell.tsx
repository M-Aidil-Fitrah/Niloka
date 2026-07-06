"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatRupiah } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
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

  // Local state for listings to simulate Add operations
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerAmpas, setSellerAmpas] = useState<AmpasListing[]>([]);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAmpasModalOpen, setIsAmpasModalOpen] = useState(false);

  // New Product Form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState(75000);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdCategory, setNewProdCategory] = useState("essential-oils");

  // New Ampas Form state
  const [newAmpasQty, setNewAmpasQty] = useState(300);
  const [newAmpasPrice, setNewAmpasPrice] = useState(1500);
  const [newAmpasCondition, setNewAmpasCondition] = useState<"dry" | "wet">("dry");

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

  // AI Generator state
  const [aiPaLevel, setAiPaLevel] = useState("32.5%");
  const [aiOrigin, setAiOrigin] = useState("Kecamatan Meukek, Aceh Selatan");
  const [aiAroma, setAiAroma] = useState("Woody, manis balsamic lembut, dan tahan lama");
  const [aiForm, setAiForm] = useState("Minyak Atsiri Nilam Murni (Essential Oil)");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiOutputText, setAiOutputText] = useState("");
  const [displayedAiOutput, setDisplayedAiOutput] = useState("");

  // Seed local states on mount
  useEffect(() => {
    const filtered = products.filter((p) => p.sellerId === sellerId);
    const filteredAmpas = ampasListings.filter((a) => a.sellerId === sellerId);
    setTimeout(() => {
      setSellerProducts(filtered);
      setSellerAmpas(filteredAmpas);
    }, 0);
  }, [products, ampasListings]);

  // AI Description Generator typing simulation
  const handleGenerateAiDescription = () => {
    setIsAiGenerating(true);
    setAiOutputText("");
    setDisplayedAiOutput("");

    const templates = [
      `Minyak Nilam Murni premium asal ${aiOrigin}. Diproduksi dengan metode penyulingan uap tradisional berkualitas tinggi, menghasilkan aroma ${aiAroma} yang pekat dan berkarakter. Memiliki kadar Patchouli Alcohol (PA) tinggi mencapai ${aiPaLevel}, menjadikannya zat pengikat wewangian (fixative) yang sangat baik untuk parfum Anda. Produk ini telah lolos uji transparansi Nilam Passport, menjamin keaslian 100% tanpa campuran minyak sintetis.`,
      `Nikmati esensi relaksasi dari ${aiForm} khas ${aiOrigin}. Diformulasikan dengan minyak atsiri nilam Aceh berkualitas terbaik (kadar PA ${aiPaLevel}), menghasilkan profil aroma ${aiAroma} yang memikat dan menenangkan sistem saraf. Sangat cocok sebagai aromaterapi ruangan, minyak pijat, maupun pengikat parfum alami. Diproses secara berkelanjutan dengan prinsip sirkular ekonomi terpadu.`,
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setAiOutputText(randomTemplate);

    setTimeout(() => {
      setIsAiGenerating(false);
      // Simulasikan efek mengetik
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < randomTemplate.length) {
          setDisplayedAiOutput((prev) => prev + randomTemplate.charAt(currentIdx));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 8);
    }, 1200);
  };

  // Add mock product handler
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd: Product = {
      id: `product-mock-${Date.now()}`,
      slug: newProdName.toLowerCase().replace(/\s+/g, "-"),
      name: newProdName,
      price: { amount: newProdPrice, currency: "IDR" },
      stock: newProdStock,
      categoryId: newProdCategory,
      sellerId: sellerId,
      passportId: "",
      form: "essential-oil",
      functions: ["relaxation"],
      status: "published",
      image: {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        alt: newProdName,
      },
      gallery: [],
      featuredRank: 0,
      tags: ["new-arrival"],
      shortDescription: `Produk nilam baru beraroma alami khas Aceh Selatan.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSellerProducts((prev) => [newProd, ...prev]);
    setIsProductModalOpen(false);
    // Reset form
    setNewProdName("");
    setNewProdPrice(75000);
    setNewProdStock(50);
  };

  // Add mock ampas handler
  const handleAddAmpasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmpasQty) return;

    const newAmp: AmpasListing = {
      id: `ampas-mock-${Date.now()}`,
      slug: `ampas-tapaktuan-${newAmpasCondition}-${Date.now()}`,
      sellerId: sellerId,
      condition: newAmpasCondition,
      quantityKg: newAmpasQty,
      pricePerKg: { amount: newAmpasPrice, currency: "IDR" },
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
    setIsAmpasModalOpen(false);
    // Reset form
    setNewAmpasQty(300);
    setNewAmpasPrice(1500);
  };

  // Submit Nilam Passport Draft
  const handleSavePassportDraft = (productId: string, patchouliAlcohol: string, origin: string, aromaProfile: string, safetyNotes: string) => {
    setPassportDrafts((prev) =>
      prev.map((d) =>
        d.productId === productId
          ? { ...d, patchouliAlcohol, origin, aromaProfile, safetyNotes, status: "submitted" }
          : d
      )
    );
    alert("Draf paspor berhasil disimpan dan diajukan ke admin untuk verifikasi!");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr] items-start">
      
      {/* SIDEBAR TABS NAV */}
      <nav className="flex flex-row lg:flex-col gap-1 border-b lg:border-b-0 border-line pb-2 lg:pb-0 overflow-x-auto lg:overflow-visible shrink-0 bg-white-soft lg:bg-transparent p-1.5 lg:p-0 rounded-2xl border lg:border-0 border-line/60">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-brand-900 text-white-soft shadow-sm"
              : "text-brand-950 hover:bg-cream-100"
          }`}
        >
          📊 Ringkasan Toko
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "products"
              ? "bg-brand-900 text-white-soft shadow-sm"
              : "text-brand-950 hover:bg-cream-100"
          }`}
        >
          🛍️ Produk B2C ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("ampas")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "ampas"
              ? "bg-brand-900 text-white-soft shadow-sm"
              : "text-brand-950 hover:bg-cream-100"
          }`}
        >
          ♻️ Ampas B2B ({sellerAmpas.length})
        </button>
        <button
          onClick={() => setActiveTab("passport")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "passport"
              ? "bg-brand-900 text-white-soft shadow-sm"
              : "text-brand-950 hover:bg-cream-100"
          }`}
        >
          📜 Nilam Passport
        </button>
      </nav>

      {/* TABS CONTAINER CONTENT */}
      <section className="bg-white-soft border border-line rounded-[32px] p-6 shadow-sm min-h-[500px]">
        
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Greeting Header */}
            <div>
              <h3 className="text-lg font-bold text-brand-950">Selamat Datang, Aceh Aroma House</h3>
              <p className="text-xs text-ink-600 mt-1">
                Berikut adalah ringkasan penjualan, transaksi, dan tingkat validasi komoditas Atsiri Anda hari ini.
              </p>
            </div>

            {/* Metrik Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-line bg-cream-50/50 p-4.5 space-y-1">
                <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">Total Pendapatan</span>
                <span className="text-lg font-extrabold text-brand-950 block">Rp 12.450.000</span>
                <span className="text-[9px] text-emerald-700 font-bold block">↑ +14.2% minggu ini</span>
              </div>
              <div className="rounded-2xl border border-line bg-cream-50/50 p-4.5 space-y-1">
                <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">Rating Toko</span>
                <span className="text-lg font-extrabold text-brand-950 block">4.9 / 5.0</span>
                <span className="text-[9px] text-ink-600 block">Dari 128 review pembeli</span>
              </div>
              <div className="rounded-2xl border border-line bg-cream-50/50 p-4.5 space-y-1">
                <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">Validasi Passport</span>
                <span className="text-lg font-extrabold text-brand-950 block">2 Terverifikasi</span>
                <span className="text-[9px] text-amber-700 font-bold block">1 draf membutuhkan aksi</span>
              </div>
              <div className="rounded-2xl border border-line bg-cream-50/50 p-4.5 space-y-1">
                <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">Stok Ampas Terjual</span>
                <span className="text-lg font-extrabold text-brand-950 block">850 Kg</span>
                <span className="text-[9px] text-brand-900 font-bold block">Dari circular sirkular</span>
              </div>
            </div>

            {/* Sales Chart Mockup */}
            <div className="rounded-2xl border border-line p-5 space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-brand-950">Statistik Penjualan Produk</h4>
                <p className="text-[10px] text-ink-600 mt-0.5">Pendapatan bulanan (dalam jutaan rupiah) semester pertama 2026.</p>
              </div>

              {/* Grid chart */}
              <div className="flex h-36 items-end justify-between gap-3 pt-4 border-b border-line/60">
                {[
                  { label: "Jan", val: "h-[30%]", valLabel: "3.2M" },
                  { label: "Feb", val: "h-[45%]", valLabel: "4.5M" },
                  { label: "Mar", val: "h-[65%]", valLabel: "6.5M" },
                  { label: "Apr", val: "h-[50%]", valLabel: "5.0M" },
                  { label: "Mei", val: "h-[85%]", valLabel: "8.5M" },
                  { label: "Jun", val: "h-[95%]", valLabel: "12.4M" },
                ].map((item) => (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <span className="text-[9px] font-bold text-brand-950 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.valLabel}
                    </span>
                    <div className={`w-full ${item.val} rounded-t-lg bg-brand-900 group-hover:bg-brand-700 transition-all duration-300`} />
                    <span className="text-[10px] font-bold text-ink-600 mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-brand-950">Aktivitas & Pesanan Terbaru</h4>
              <div className="divide-y divide-line/60 border border-line rounded-2xl overflow-hidden bg-cream-50/20">
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-brand-950">Roll On Aromatherapy Relief (Qty 1)</span>
                    <p className="text-[10px] text-ink-600">Oleh Fitra Rahmad - Banda Aceh</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded-full">
                    Selesai
                  </span>
                </div>
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-brand-950">Inquiry B2B: Ampas Nilam Kering (500 Kg)</span>
                    <p className="text-[10px] text-ink-600">Pengajuan WhatsApp oleh CV Pupuk Hijau</p>
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100/50 px-2 py-0.5 rounded-full">
                    Negosiasi
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS B2C TAB ================= */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h3 className="text-base font-extrabold text-brand-950">Katalog Produk B2C Anda</h3>
                <p className="text-xs text-ink-600 mt-0.5">Daftar produk retail yang terbit di katalog publik NILOKA.</p>
              </div>
              <Button
                onClick={() => setIsProductModalOpen(true)}
                className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold"
              >
                + Tambah Produk (Mock)
              </Button>
            </div>

            {/* Products Table */}
            <div className="border border-line rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-50 border-b border-line text-ink-600 font-bold">
                    <th className="p-3">Info Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Stok</th>
                    <th className="p-3">Passport Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {sellerProducts.map((prod) => {
                    const passport = passportDrafts.find((p) => p.productId === prod.id);
                    return (
                      <tr key={prod.id} className="hover:bg-cream-50/20">
                        <td className="p-3 flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-cream-100 border border-line/45 shrink-0">
                            <Image src={prod.image.src} alt={prod.image.alt} className="object-cover" fill sizes="40px" />
                          </div>
                          <div>
                            <span className="font-bold text-brand-950 block">{prod.name}</span>
                            <span className="text-[10px] text-ink-600 block truncate max-w-xs">{prod.shortDescription}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-brand-950 uppercase text-[10px]">{prod.categoryId}</td>
                        <td className="p-3 font-bold text-brand-950">{formatRupiah(prod.price.amount)}</td>
                        <td className="p-3 font-semibold text-ink-700">{prod.stock} unit</td>
                        <td className="p-3">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              passport?.status === "verified"
                                ? "bg-emerald-100 text-emerald-800"
                                : passport?.status === "submitted"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-ink-100 text-ink-700"
                            }`}
                          >
                            {passport?.status || "Belum Ada"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ADD PRODUCT MODAL MOCK */}
            {isProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-2xl relative text-ink-900">
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="absolute right-5 top-5 text-lg font-bold text-ink-600 hover:text-brand-950"
                  >
                    ×
                  </button>
                  <h4 className="text-base font-extrabold text-brand-950 font-serif-accent italic mb-4">
                    Tambah Produk B2C Baru (Mock)
                  </h4>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Nama Produk *</label>
                      <input
                        type="text"
                        required
                        className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                        placeholder="Contoh: Sabun Mandi Herbal Nilam"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Harga (Rp) *</label>
                        <input
                          type="number"
                          required
                          className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Stok Awal *</label>
                        <input
                          type="number"
                          required
                          className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kategori Produk</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                      >
                        <option value="essential-oils">Minyak Atsiri (Essential Oils)</option>
                        <option value="body-care">Perawatan Tubuh (Body Care)</option>
                        <option value="home-fragrance">Pengharum Ruangan</option>
                      </select>
                    </div>

                    <div className="flex gap-2.5 justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="h-10 px-4 rounded-xl border border-line hover:bg-cream-50 text-brand-950 font-bold"
                      >
                        Batal
                      </button>
                      <Button
                        type="submit"
                        className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-850 text-white-soft font-bold"
                      >
                        Simpan Produk
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. AMPAS B2B TAB ================= */}
        {activeTab === "ampas" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h3 className="text-base font-extrabold text-brand-950">Bursa Listing Ampas Nilam B2B</h3>
                <p className="text-xs text-ink-600 mt-0.5">Kelola penawaran sisa penyulingan ampas nilam untuk pemanfaatan sirkular industri.</p>
              </div>
              <Button
                onClick={() => setIsAmpasModalOpen(true)}
                className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold"
              >
                + Tambah Batch Ampas (Mock)
              </Button>
            </div>

            {/* Ampas List */}
            <div className="border border-line rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-50 border-b border-line text-ink-600 font-bold">
                    <th className="p-3">Deskripsi Batch</th>
                    <th className="p-3">Kondisi</th>
                    <th className="p-3">Stok Tersedia</th>
                    <th className="p-3">Harga per Kg</th>
                    <th className="p-3">Lokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {sellerAmpas.map((amp) => (
                    <tr key={amp.id} className="hover:bg-cream-50/20">
                      <td className="p-3">
                        <span className="font-bold text-brand-950 block capitalize">
                          {amp.slug.split("-").slice(0, 3).join(" ")}
                        </span>
                        <span className="text-[10px] text-ink-600 block max-w-sm truncate">
                          {amp.distillationProcess}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            amp.condition === "dry" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-850"
                          }`}
                        >
                          {amp.condition === "dry" ? "Kering" : "Basah"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-brand-950">{amp.quantityKg.toLocaleString("id-ID")} Kg</td>
                      <td className="p-3 font-bold text-brand-950">Rp {amp.pricePerKg.amount.toLocaleString("id-ID")} / Kg</td>
                      <td className="p-3 font-semibold text-ink-700">{amp.location.district}, {amp.location.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD AMPAS MODAL MOCK */}
            {isAmpasModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-2xl relative text-ink-900">
                  <button
                    onClick={() => setIsAmpasModalOpen(false)}
                    className="absolute right-5 top-5 text-lg font-bold text-ink-600 hover:text-brand-950"
                  >
                    ×
                  </button>
                  <h4 className="text-base font-extrabold text-brand-950 font-serif-accent italic mb-4">
                    Tambah Batch Ampas B2B Baru (Mock)
                  </h4>

                  <form onSubmit={handleAddAmpasSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kuantitas Stok (Kg) *</label>
                        <input
                          type="number"
                          required
                          className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                          value={newAmpasQty}
                          onChange={(e) => setNewAmpasQty(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Harga / Kg (Rp) *</label>
                        <input
                          type="number"
                          required
                          className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                          value={newAmpasPrice}
                          onChange={(e) => setNewAmpasPrice(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kondisi Ampas</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewAmpasCondition("dry")}
                          className={`flex-1 h-10 rounded-xl border text-xs font-bold transition-all ${
                            newAmpasCondition === "dry"
                              ? "bg-brand-900 border-brand-900 text-white-soft"
                              : "border-line bg-cream-50 text-brand-950"
                          }`}
                        >
                          Kering
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewAmpasCondition("wet")}
                          className={`flex-1 h-10 rounded-xl border text-xs font-bold transition-all ${
                            newAmpasCondition === "wet"
                              ? "bg-brand-900 border-brand-900 text-white-soft"
                              : "border-line bg-cream-50 text-brand-950"
                          }`}
                        >
                          Basah
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2.5 justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAmpasModalOpen(false)}
                        className="h-10 px-4 rounded-xl border border-line hover:bg-cream-50 text-brand-950 font-bold"
                      >
                        Batal
                      </button>
                      <Button
                        type="submit"
                        className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-850 text-white-soft font-bold"
                      >
                        Simpan Batch
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. NILAM PASSPORT & AI TAB ================= */}
        {activeTab === "passport" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Intro */}
            <div>
              <h3 className="text-base font-extrabold text-brand-950">Penyusunan Nilam Passport</h3>
              <p className="text-xs text-ink-600 mt-0.5">
                Kelola transparansi asal bahan baku dan profil kimia atsiri Anda. Terapkan sistem mock AI untuk menyusun teks deskripsi produk Anda.
              </p>
            </div>

            {/* Passport Draft list */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Draf Transparansi Paspor Aktif</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {passportDrafts.map((draft) => {
                  const prod = sellerProducts.find((p) => p.id === draft.productId);
                  if (!prod) return null;
                  return (
                    <div key={draft.productId} className="rounded-2xl border border-line p-4 bg-cream-50/20 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-sm font-bold text-brand-950 block">{prod.name}</span>
                          <span className="text-[10px] text-ink-600">Asal: {draft.origin}</span>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            draft.status === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {draft.status === "verified" ? "Terverifikasi" : "Draf / Pending"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-white-soft p-2.5 rounded-xl border border-line/40">
                        <div>
                          <span className="text-ink-600 block">Kadar PA:</span>
                          <span className="font-bold text-brand-950">{draft.patchouliAlcohol}</span>
                        </div>
                        <div>
                          <span className="text-ink-600 block">Aroma Profile:</span>
                          <span className="font-bold text-brand-950 truncate block">{draft.aromaProfile}</span>
                        </div>
                      </div>

                      {draft.status !== "verified" && (
                        <Button
                          onClick={() =>
                            handleSavePassportDraft(
                              draft.productId,
                              draft.patchouliAlcohol === "N/A (Turunan)" ? "31.2%" : draft.patchouliAlcohol,
                              draft.origin,
                              draft.aromaProfile,
                              draft.safetyNotes
                            )
                          }
                          className="w-full h-8 rounded-lg bg-brand-900 hover:bg-brand-850 text-white-soft text-[10px] font-bold"
                        >
                          Ajukan Verifikasi Paspor
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="border-line/60" />

            {/* AI Product Description Generator Panel */}
            <div className="rounded-2xl border border-brand-900/10 bg-brand-900/5 p-5 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-brand-900 uppercase tracking-wider block">Fitur Asisten AI Mock</span>
                <h4 className="text-sm font-extrabold text-brand-950 mt-1">AI Product Description Generator</h4>
                <p className="text-[10px] text-ink-600 mt-0.5">
                  Tulis deskripsi produk berorientasi pemasaran berkualitas tinggi berbasis data sensorik dan Nilam Passport.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                {/* Inputs Left */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Tipe / Form Produk</label>
                    <input
                      type="text"
                      className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-brand-950 outline-none focus:border-brand-700"
                      value={aiForm}
                      onChange={(e) => setAiForm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kadar Patchouli Alcohol (PA)</label>
                    <input
                      type="text"
                      className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-brand-950 outline-none focus:border-brand-700"
                      value={aiPaLevel}
                      onChange={(e) => setAiPaLevel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Lokasi Panen & Asal Bahan Baku</label>
                    <input
                      type="text"
                      className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-brand-950 outline-none focus:border-brand-700"
                      value={aiOrigin}
                      onChange={(e) => setAiOrigin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Profil Sensori Aroma</label>
                    <input
                      type="text"
                      className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-brand-950 outline-none focus:border-brand-700"
                      value={aiAroma}
                      onChange={(e) => setAiAroma(e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="w-full h-10 rounded-xl bg-brand-950 hover:bg-brand-900 text-white-soft text-xs font-bold pt-1 shrink-0"
                  >
                    {isAiGenerating ? "Menyusun Deskripsi..." : "✨ Generate Deskripsi AI"}
                  </Button>
                </div>

                {/* Simulated AI Output Right */}
                <div className="border border-line/60 rounded-2xl bg-white p-4.5 flex flex-col justify-between min-h-[220px]">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-ink-600 block">
                      AI Generated Output (Mock)
                    </span>
                    {isAiGenerating ? (
                      <div className="space-y-2 pt-2 animate-pulse">
                        <div className="h-3 w-full rounded bg-cream-100" />
                        <div className="h-3 w-5/6 rounded bg-cream-100" />
                        <div className="h-3 w-2/3 rounded bg-cream-100" />
                      </div>
                    ) : displayedAiOutput ? (
                      <p className="text-xs text-brand-950 leading-relaxed font-semibold">
                        {displayedAiOutput}
                        <span className="inline-block w-1.5 h-3 bg-brand-900 ml-0.5 animate-pulse shrink-0" />
                      </p>
                    ) : (
                      <p className="text-xs text-ink-600 italic leading-relaxed pt-4 text-center">
                        Isi parameter sensorik di sebelah kiri dan klik generate untuk memicu kecerdasan buatan.
                      </p>
                    )}
                  </div>

                  {displayedAiOutput && !isAiGenerating && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiOutputText);
                        alert("Deskripsi berhasil disalin ke clipboard!");
                      }}
                      className="self-end mt-4 text-[10px] font-bold text-brand-900 hover:text-brand-750 transition-colors uppercase tracking-wider border-b border-brand-900 pb-0.5"
                    >
                      📄 Salin Deskripsi
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </section>
    </div>
  );
}
