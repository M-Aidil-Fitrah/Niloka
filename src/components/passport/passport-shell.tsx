"use client";

import { useState } from "react";
import Link from "next/link";
import { PassportSearchFilter } from "./passport-search-filter";
import { PassportRegistryList } from "./passport-registry-list";
import { ShieldCheck, Award, Info, FileText } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Disclaimer Banner */}
      <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5 shadow-sm">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-brand-950">Inisiatif Transparansi Rantai Pasok</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-700">
              Nilam Passport merupakan fitur transparansi produk pada platform NILOKA. Informasi produk diisi oleh penjual saat membuat atau melengkapi data produk, dan ditinjau oleh administrator sebelum dipublikasikan. Fitur ini bertujuan membantu konsumen memahami asal-usul serta karakteristik produk guna meningkatkan transparansi dan kepercayaan.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-line overflow-x-auto">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeTab === "browse"
              ? "border-brand-900 text-brand-900"
              : "border-transparent text-ink-600 hover:text-brand-950"
          }`}
        >
          Jelajahi Registry Paspor
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
          <PassportSearchFilter
            search={search}
            setSearch={setSearch}
            selectedOrigin={selectedOrigin}
            setSelectedOrigin={setSelectedOrigin}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            origins={origins}
            forms={forms}
            formLabels={formLabels}
          />

          <PassportRegistryList
            filteredItems={filteredItems}
            search={search}
            selectedOrigin={selectedOrigin}
            selectedForm={selectedForm}
            onResetFilters={() => {
              setSearch("");
              setSelectedOrigin("Semua");
              setSelectedForm("Semua");
            }}
          />
        </div>
      )}

      {/* VERIFY BATCH CODE TAB CONTENT */}
      {activeTab === "verify" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-brand-950 flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-900" />
              Masukkan Kode Transparansi
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              Setiap produk yang dilengkapi Nilam Passport memiliki kode batch unik pada kemasan fisiknya. Masukkan kode tersebut di bawah untuk mengakses laporan transparansi.
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
              <Button type="submit" className="h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold cursor-pointer transition-all">
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
                    className="text-[10px] font-mono font-semibold px-2.5 py-1 bg-cream-100 hover:bg-cream-200 border border-line/60 rounded text-brand-950 cursor-pointer transition-colors"
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
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                          Laporan Transparansi
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
                          <Badge key={aroma} className="text-xs bg-brand-50 border-brand-200 text-brand-900 font-semibold px-2.5 py-0.5 rounded-full border">
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
                      <Button className="rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs py-2 px-4 h-9 font-bold transition-all cursor-pointer">
                        Lihat Produk
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-line bg-white-soft p-8 text-center text-ink-600 max-w-2xl mx-auto shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-650 mb-3">
                    <Info className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-brand-950">Kode batch tidak ditemukan</p>
                  <p className="mt-1 text-xs text-ink-600">Pastikan kode yang dimasukkan tepat (perhatikan ejaan dan tanda minus).</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

