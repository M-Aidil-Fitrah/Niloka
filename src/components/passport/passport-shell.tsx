"use client";

import { useState } from "react";
import Link from "next/link";
import { PassportCard } from "@/components/passport/passport-card";
import { SearchIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product, NilamPassport, ProductForm } from "@/lib/contracts";

type PassportShellProps = {
  products: Product[];
  passports: NilamPassport[];
};

const formLabels: Record<string, string> = {
  "essential-oil": "Essential Oil",
  "roll-on": "Roll-on",
  soap: "Sabun",
  diffuser: "Diffuser",
  perfume: "Parfum",
  "body-oil": "Body Oil / Losion",
  bundle: "Bundle",
};

const origins = ["Semua", "Aceh Jaya", "Aceh Selatan", "Gayo Lues"];
const forms: ("Semua" | ProductForm)[] = ["Semua", "essential-oil", "roll-on", "soap", "diffuser", "perfume", "body-oil"];

export function PassportShell({ products, passports }: PassportShellProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "verify">("browse");
  const [search, setSearch] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("Semua");
  const [selectedForm, setSelectedForm] = useState<"Semua" | ProductForm>("Semua");

  // Batch Code verification state
  const [batchCodeInput, setBatchCodeInput] = useState("");
  const [verifiedResult, setVerifiedResult] = useState<{
    product: Product;
    passport: NilamPassport;
    batchCode: string;
  } | null>(null);
  const [hasSearchedBatch, setHasSearchedBatch] = useState(false);

  // List of all items with generated batch codes for verification mapping
  const itemsWithBatch = products
    .map((product) => {
      const passport = passports.find((p) => p.productId === product.id);
      if (!passport) return null;
      const originCode = passport.origin.split(" ")[0].toUpperCase();
      const productCode = product.id.split("-").pop()?.slice(0, 4).toUpperCase() || "001";
      const batchCode = `NLK-${originCode}-${productCode}`;
      return { product, passport, batchCode };
    })
    .filter((item): item is { product: Product; passport: NilamPassport; batchCode: string } => item !== null);

  // Filter products for Browse registry tab
  const filteredItems = itemsWithBatch.filter(({ product, passport }) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      passport.origin.toLowerCase().includes(search.toLowerCase());

    const matchesOrigin =
      selectedOrigin === "Semua" || passport.origin === selectedOrigin;

    const matchesForm =
      selectedForm === "Semua" || passport.productKind === selectedForm;

    return matchesSearch && matchesOrigin && matchesForm;
  });

  // Verify batch code handler
  function handleVerifyBatch(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const match = itemsWithBatch.find((item) => item.batchCode === cleanCode);
    setVerifiedResult(match || null);
    setHasSearchedBatch(true);
  }

  return (
    <div className="space-y-8">
      {/* Disclaimer Banner */}
      <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5">
        <div className="flex gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-brand-950">Inisiatif Transparansi Rantai Pasok</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-700">
              Nilam Passport adalah sistem transparansi asal dan kualitas bahan baku yang diisi oleh produsen terverifikasi dan dikurasi oleh tim internal NILOKA. Sistem ini bertujuan memberikan keterbukaan informasi penuh kepada konsumen mengenai perjalanan produk nilam dari penyulingan hingga ke tangan Anda, dan <strong>bukan merupakan sertifikasi resmi dari lembaga pemerintah</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-line">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === "browse"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-ink-600 hover:text-brand-950"
          }`}
        >
          Jelajahi Registry Paspor
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === "verify"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-ink-600 hover:text-brand-950"
          }`}
        >
          Verifikasi Kode Batch
        </button>
      </div>

      {/* BROWSE REGISTRY TAB CONTENT */}
      {activeTab === "browse" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Filters Toolbar */}
          <div className="flex flex-col gap-5 rounded-[28px] border border-line bg-white-soft p-5 sm:p-6">
            {/* Search */}
            <div className="relative">
              <label className="flex h-11 w-full items-center gap-2.5 rounded-2xl bg-cream-50 px-4 text-sm text-ink-600 border border-line/30 focus-within:border-brand-700">
                <SearchIcon className="h-4 w-4 text-brand-700" />
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink-600/70 text-brand-950"
                  placeholder="Cari produk atau asal daerah (contoh: Aceh Jaya)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            {/* Region Filter */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600 block mb-2.5">
                Asal Daerah
              </span>
              <div className="flex flex-wrap gap-2">
                {origins.map((origin) => (
                  <button
                    key={origin}
                    onClick={() => setSelectedOrigin(origin)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                      selectedOrigin === origin
                        ? "bg-brand-900 border-brand-900 text-white-soft"
                        : "border-line bg-cream-50 text-brand-950 hover:border-brand-700 hover:bg-cream-100"
                    }`}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Kind Filter */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600 block mb-2.5">
                Jenis Produk
              </span>
              <div className="flex flex-wrap gap-2">
                {forms.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedForm(f)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                      selectedForm === f
                        ? "bg-brand-900 border-brand-900 text-white-soft"
                        : "border-line bg-cream-50 text-brand-950 hover:border-brand-700 hover:bg-cream-100"
                    }`}
                  >
                    {f === "Semua" ? "Semua" : formLabels[f] ?? f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of Results */}
          {filteredItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map(({ product, passport }) => (
                <PassportCard key={product.id} product={product} passport={passport} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-line bg-white-soft py-20 text-center">
              <p className="text-lg font-semibold text-brand-950">Tidak ada paspor ditemukan</p>
              <p className="mt-2 text-sm text-ink-600">Coba ubah filter atau kata kunci pencarian Anda.</p>
              {(search !== "" || selectedOrigin !== "Semua" || selectedForm !== "Semua") && (
                <Button
                  className="mt-5"
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setSelectedOrigin("Semua");
                    setSelectedForm("Semua");
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* VERIFY BATCH CODE TAB CONTENT */}
      {activeTab === "verify" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-brand-950">Masukkan Kode Transparansi</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              Setiap produk bersertifikasi Nilam Passport memiliki kode batch unik pada kemasan fisiknya. Masukkan kode tersebut di bawah untuk memeriksa laporan autentisitas penuh.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyBatch(batchCodeInput);
              }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <label className="flex-1 flex h-11 items-center gap-2 rounded-2xl bg-cream-50 px-4 text-sm text-ink-600 border border-line/30 focus-within:border-brand-700">
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-semibold uppercase tracking-wider outline-none placeholder:text-ink-600/70 text-brand-950"
                  placeholder="Contoh: NLK-GAYO-E001"
                  value={batchCodeInput}
                  onChange={(e) => setBatchCodeInput(e.target.value)}
                />
              </label>
              <Button type="submit" className="h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft">
                Verifikasi Batch
              </Button>
            </form>

            {/* List of active batches to try */}
            <div className="mt-5 pt-4 border-t border-line/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block mb-2">
                Daftar Kode Batch Tersedia (Untuk Demo):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {itemsWithBatch.slice(0, 5).map((item) => (
                  <button
                    key={item.batchCode}
                    onClick={() => {
                      setBatchCodeInput(item.batchCode);
                      handleVerifyBatch(item.batchCode);
                    }}
                    className="text-[10px] font-mono font-semibold px-2.5 py-1 bg-cream-100 hover:bg-cream-200 border border-line/60 rounded text-brand-950"
                  >
                    {item.batchCode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* VERIFICATION REPORT PANEL */}
          {hasSearchedBatch && (
            <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
              {verifiedResult ? (
                <div className="rounded-[32px] border-2 border-gold-500 bg-white-soft p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  {/* Decorative stamp element */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-4 border-gold-500/10 flex items-center justify-center rotate-12">
                    <span className="text-[10px] font-bold text-gold-500/20 font-mono tracking-widest text-center">
                      NILOKA<br />VERIFIED
                    </span>
                  </div>

                  {/* Certificate Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-line/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                        <ShieldCheckIcon className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                          Autentisitas Terverifikasi
                        </span>
                        <h4 className="text-lg font-bold text-brand-950 font-serif-accent italic">
                          Laporan Nilam Passport
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-gold-100 text-gold-600 px-3 py-1 rounded-full border border-gold-500/20">
                      BATCH: {verifiedResult.batchCode}
                    </span>
                  </div>

                  {/* Certificate Body details */}
                  <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                          Nama Produk
                        </span>
                        <span className="text-sm font-semibold text-brand-950 block">
                          {verifiedResult.product.name}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                          Jenis Produk
                        </span>
                        <span className="text-sm font-semibold text-brand-950 block">
                          {formLabels[verifiedResult.passport.productKind] ?? verifiedResult.passport.productKind}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                          Asal Bahan Baku
                        </span>
                        <span className="text-sm font-semibold text-brand-950 block">
                          {verifiedResult.passport.origin}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                          Tanggal Cek Validitas
                        </span>
                        <span className="text-sm font-semibold text-brand-950 block">
                          {new Date(verifiedResult.passport.validatedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                        Profil Senyawa / Aroma
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {verifiedResult.passport.aromaProfile.map((aroma) => (
                          <Badge key={aroma} tone="brand" className="text-xs bg-brand-50 border-brand-200 text-brand-900">
                            {aroma}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
                        Catatan Penggunaan
                      </span>
                      <p className="text-xs leading-relaxed text-ink-800 mt-0.5">
                        {verifiedResult.passport.usage}
                      </p>
                    </div>

                    <div className="rounded-xl bg-cream-50 p-4 border border-line/50">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-900">
                        Catatan Keamanan Curation
                      </span>
                      <p className="text-xs leading-relaxed text-ink-700 mt-1">
                        {verifiedResult.passport.safetyNotes}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Footer Signature */}
                  <div className="mt-6 pt-5 border-t border-line/80 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
                        Validator Penilai
                      </span>
                      <span className="text-xs font-bold text-brand-950">
                        {verifiedResult.passport.validatedBy}
                      </span>
                    </div>
                    <Link href={`/products/${verifiedResult.product.slug}`}>
                      <Button className="rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs py-2 px-4 h-9">
                        Lihat Produk
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-line bg-white-soft p-8 text-center text-ink-600 max-w-2xl mx-auto">
                  <p className="font-semibold text-brand-950">Kode batch tidak ditemukan</p>
                  <p className="mt-1 text-xs">Pastikan kode yang dimasukkan tepat (perhatikan ejaan dan tanda minus).</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
