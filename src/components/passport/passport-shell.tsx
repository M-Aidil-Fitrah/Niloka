"use client";

import { useState } from "react";
import { PassportCard } from "@/components/passport/passport-card";
import { SearchIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
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
  "body-oil": "Body Oil",
  bundle: "Bundle",
};

const origins = ["Semua", "Aceh Jaya", "Aceh Selatan", "Gayo Lues"];
const forms: ("Semua" | ProductForm)[] = ["Semua", "essential-oil", "roll-on", "soap", "diffuser", "perfume", "body-oil"];

export function PassportShell({ products, passports }: PassportShellProps) {
  const [search, setSearch] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("Semua");
  const [selectedForm, setSelectedForm] = useState<"Semua" | ProductForm>("Semua");

  // Filter products that have valid passports
  const filteredItems = products
    .map((product) => {
      const passport = passports.find((p) => p.productId === product.id);
      return { product, passport };
    })
    .filter(
      (item): item is { product: Product; passport: NilamPassport } =>
        item.passport !== undefined
    )
    .filter(({ product, passport }) => {
      // Search matches product name or origin region
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        passport.origin.toLowerCase().includes(search.toLowerCase());

      const matchesOrigin =
        selectedOrigin === "Semua" || passport.origin === selectedOrigin;

      const matchesForm =
        selectedForm === "Semua" || passport.productKind === selectedForm;

      return matchesSearch && matchesOrigin && matchesForm;
    });

  return (
    <div className="space-y-8">
      {/* Disclaimer Banner */}
      <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5">
        <div className="flex gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-brand-950">Inisiatif Transparansi Rantai Pasok</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-700">
              Nilam Passport adalah sistem transparansi asal dan kualitas bahan baku yang diisi oleh produsen terverifikasi dan dikurasi oleh tim internal NILOKA. Sistem ini bertujuan memberikan keterbukaan informasi penuh kepada konsumen mengenai perjalanan produk nilam dari penyulingan hingga ke tangan Anda, dan **bukan merupakan sertifikasi resmi dari lembaga pemerintah**.
            </p>
          </div>
        </div>
      </div>

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
  );
}
