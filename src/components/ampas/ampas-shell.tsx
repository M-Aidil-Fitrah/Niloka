"use client";

import { useState } from "react";
import { AmpasCard } from "./ampas-card";
import { SearchIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { AmpasListing, AmpasUsageTag } from "@/lib/contracts";

type AmpasShellProps = {
  listings: AmpasListing[];
};

const usageFilters = [
  { id: "Semua", label: "Semua Penggunaan" },
  { id: "compost", label: "Kompos Organik" },
  { id: "briquette", label: "Bahan Briket" },
  { id: "mulch", label: "Mulsa" },
  { id: "industrial-cellulose", label: "Selulosa Industri" },
  { id: "mushroom-media", label: "Media Jamur" },
  { id: "animal-feed", label: "Pakan Ternak" },
];

export function AmpasShell({ listings }: AmpasShellProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<"Semua" | "dry" | "wet">("Semua");
  const [selectedUsage, setSelectedUsage] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Calculator State
  const [calcListingId, setCalcListingId] = useState<string>(listings[0]?.id || "");
  const [calcWeight, setCalcWeight] = useState<number>(500);

  // Active Inquiry Modal State
  const [activeInquiryListing, setActiveInquiryListing] = useState<AmpasListing | null>(null);

  // Selected Listing for Calculator
  const selectedCalcListing = listings.find((l) => l.id === calcListingId) || listings[0];

  // Filtering Logic
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCondition =
      selectedCondition === "Semua" || l.condition === selectedCondition;

    const matchesUsage =
      selectedUsage === "Semua" || l.usageTags.includes(selectedUsage as AmpasUsageTag);

    return matchesSearch && matchesCondition && matchesUsage;
  });

  // Calculate estimated total price
  const estimatedCost = selectedCalcListing
    ? selectedCalcListing.pricePerKg.amount * calcWeight
    : 0;

  // Build WhatsApp template text
  function buildWhatsAppUrl(listing: AmpasListing, qtyKg: number = 0) {
    const listingName = listing.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const text = `Halo, saya tertarik dengan penawaran Ampas Nilam B2B di NILOKA:
- Produk: ${listingName}
- Kondisi: ${listing.condition === "dry" ? "Kering" : "Basah"}
- Lokasi: ${listing.location.district}, ${listing.location.city}
${qtyKg > 0 ? `- Kuantitas Rencana: ${qtyKg.toLocaleString("id-ID")} Kg\n- Estimasi Nilai: Rp ${(listing.pricePerKg.amount * qtyKg).toLocaleString("id-ID")}` : ""}

Mohon informasi mengenai ketersediaan pengiriman dan prosedur logistik B2B lebih lanjut. Terima kasih.`;

    return `https://wa.me/628123456789?text=${encodeURIComponent(text)}`;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr] items-start">
      {/* LEFT SIDEBAR: filters + calculator */}
      <aside className="space-y-6">
        {/* B2B Calculator Card */}
        <div className="rounded-[32px] border border-line bg-white-soft p-5 shadow-sm space-y-5">
          <div>
            <h4 className="text-sm font-extrabold text-brand-950">Kalkulator Grosir (B2B)</h4>
            <p className="text-[10px] text-ink-600 leading-relaxed mt-1">
              Hitung perkiraan biaya dan kirim formulir kesepakatan logistik langsung ke penyuling.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Listing selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Pilih Batch Listing
              </label>
              <select
                value={calcListingId}
                onChange={(e) => setCalcListingId(e.target.value)}
                className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
              >
                {listings.map((l) => {
                  const title = l.slug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ");
                  return (
                    <option key={l.id} value={l.id}>
                      {title} ({l.condition === "dry" ? "Kering" : "Basah"})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Input weight */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Kuantitas Pembelian (Kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full h-10 rounded-xl border border-line bg-cream-50 pl-3 pr-10 text-xs font-bold text-brand-950 focus:border-brand-700 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-600">
                  Kg
                </span>
              </div>
            </div>

            <hr className="border-line/60" />

            {/* Price Output display */}
            {selectedCalcListing && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-ink-600">
                  <span>Harga per Kg:</span>
                  <span className="font-semibold text-brand-950">
                    Rp {selectedCalcListing.pricePerKg.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-ink-600">
                  <span>Total Kuantitas:</span>
                  <span className="font-semibold text-brand-950">
                    {calcWeight.toLocaleString("id-ID")} Kg
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-line/40">
                  <span className="font-bold text-brand-950">Estimasi Total:</span>
                  <span className="text-base font-extrabold text-brand-950">
                    Rp {estimatedCost.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-[9px] leading-relaxed text-ink-600 bg-cream-50 p-2.5 rounded-xl border border-line/40 mt-1">
                  * Biaya di atas belum termasuk logistik/truk pengiriman. Ketentuan angkutan disepakati secara langsung antara Anda dan pihak penyuling.
                </p>
              </div>
            )}

            <a
              href={selectedCalcListing ? buildWhatsAppUrl(selectedCalcListing, calcWeight) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full h-10 rounded-xl bg-brand-950 hover:bg-brand-900 text-white-soft text-xs font-bold shadow-sm">
                Ajukan Penawaran Grosir
              </Button>
            </a>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA: Disclaimer + Toolbar + Listings */}
      <section className="space-y-6">
        {/* Utilitarian Disclaimer Banner */}
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5 flex gap-3.5">
          <ShieldCheckIcon className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-brand-950">Ketentuan Potensi Penggunaan Ampas</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-700">
              Daftar potensi penggunaan dan deskripsi penyulingan merupakan <strong>klaim yang diberikan secara mandiri oleh pihak produsen/penyuling</strong>. NILOKA tidak melakukan pengujian kimia laboratorium terhadap ampas nilam ini dan tidak bertanggung jawab atas ketidaksesuaian hasil fermentasi, pembakaran briket, atau pakan ternak.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white-soft border border-line p-4 rounded-[24px]">
          {/* Search Location */}
          <div className="relative w-full sm:w-64">
            <label className="flex h-9 w-full items-center gap-2 rounded-xl bg-cream-50 px-3 text-xs text-ink-600 border border-line/40 focus-within:border-brand-700">
              <SearchIcon className="h-3.5 w-3.5 text-brand-700" />
              <input
                type="text"
                className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-ink-600/70 text-brand-950"
                placeholder="Cari kecamatan atau kabupaten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          {/* Condition selector tags & ViewMode switcher */}
          <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex gap-1">
              {(["Semua", "dry", "wet"] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                    selectedCondition === cond
                      ? "bg-brand-900 border-brand-900 text-white-soft"
                      : "border-line bg-cream-50 text-brand-950 hover:border-brand-700"
                  }`}
                >
                  {cond === "Semua" ? "Semua" : cond === "dry" ? "Kering" : "Basah"}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-line rounded-lg overflow-hidden bg-cream-50">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-brand-900 text-white-soft"
                    : "text-brand-950 hover:bg-cream-100"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-brand-900 text-white-soft"
                    : "text-brand-950 hover:bg-cream-100"
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Usage Filters horizontal list */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {usageFilters.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUsage(u.id)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold border transition-all duration-200 ${
                selectedUsage === u.id
                  ? "bg-brand-100 border-brand-300 text-brand-900"
                  : "border-line/70 bg-white-soft text-ink-700 hover:border-brand-300"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        {/* Result grid/list container */}
        {filteredListings.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
            {filteredListings.map((listing) => (
              <AmpasCard
                key={listing.id}
                listing={listing}
                onContact={(l) => setActiveInquiryListing(l)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-line bg-white-soft py-20 text-center text-ink-600">
            <p className="font-semibold text-brand-950">Tidak ada listing ampas ditemukan</p>
            <p className="mt-1 text-xs">Sesuaikan kriteria penyaringan atau kecamatan pencarian Anda.</p>
          </div>
        )}
      </section>

      {/* B2B INQUIRY CONTACT MODAL */}
      {activeInquiryListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[32px] border border-line bg-white-soft p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveInquiryListing(null)}
              className="absolute right-6 top-6 text-xl text-ink-600 hover:text-brand-950 font-bold"
            >
              ×
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md">
                Hubungi Penyuling B2B
              </span>
              <h3 className="text-xl font-bold text-brand-950 font-serif-accent italic mt-2">
                Negosiasi Pembelian Ampas
              </h3>
              <p className="text-xs text-ink-600 leading-relaxed mt-1">
                Kirim pesan langsung ke WhatsApp produsen untuk membuat janji pengiriman, sampel ampas, dan negosiasi harga.
              </p>
            </div>

            {/* Listing summary inside modal */}
            <div className="rounded-2xl border border-line/60 bg-cream-50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-600">Listing:</span>
                <span className="font-bold text-brand-950">
                  {activeInquiryListing.slug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Asal Lokasi:</span>
                <span className="font-bold text-brand-950">
                  {activeInquiryListing.location.district}, {activeInquiryListing.location.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Stok Tersedia:</span>
                <span className="font-bold text-brand-950">
                  {activeInquiryListing.quantityKg.toLocaleString("id-ID")} Kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Harga Per Kg:</span>
                <span className="font-extrabold text-brand-950">
                  Rp {activeInquiryListing.pricePerKg.amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* WhatsApp template text preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Preview Pesan WhatsApp
              </span>
              <div className="bg-cream-50/50 border border-line/40 rounded-xl p-3.5 text-[11px] font-mono text-ink-700 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                {buildWhatsAppUrl(activeInquiryListing).split("text=")[1] ? decodeURIComponent(buildWhatsAppUrl(activeInquiryListing).split("text=")[1]) : ""}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="secondary"
                onClick={() => setActiveInquiryListing(null)}
                className="rounded-xl h-10 px-5 text-xs text-brand-950 border-line"
              >
                Batal
              </Button>
              <a
                href={buildWhatsAppUrl(activeInquiryListing)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveInquiryListing(null)}
              >
                <Button className="rounded-xl h-10 px-6 text-xs bg-brand-900 hover:bg-brand-800 text-white-soft font-bold">
                  Buka WhatsApp & Kirim
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
