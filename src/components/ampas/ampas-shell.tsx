"use client";

import { useState } from "react";
import { AmpasCard } from "./ampas-card";
import { AmpasFilters } from "./ampas-filters";
import { Search } from "lucide-react";
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

  // Filtering Logic
  const filteredListings = listings.filter((l) => {
    // Only display active listings
    if (l.status !== "active") {
      return false;
    }
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

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start animate-in fade-in duration-500">
      {/* LEFT SIDEBAR: filters */}
      <aside className="space-y-6 lg:sticky lg:top-28">
        <AmpasFilters
          usageFilters={usageFilters}
          selectedUsage={selectedUsage}
          onUsageChange={setSelectedUsage}
        />
      </aside>

      {/* RIGHT CONTENT AREA: Disclaimer + Toolbar + Listings */}
      <section className="space-y-6">
        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white-soft border border-line p-4 rounded-[24px]">
          {/* Search Location */}
          <div className="relative w-full sm:w-64">
            <label className="flex h-9 w-full items-center gap-2 rounded-xl bg-cream-50 px-3 text-xs text-ink-600 border border-line/40 focus-within:border-brand-700">
              <Search className="h-3.5 w-3.5 text-brand-700" />
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
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
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
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-brand-900 text-white-soft"
                    : "text-brand-950 hover:bg-cream-100"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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

        {/* Result grid/list container */}
        {filteredListings.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 animate-in fade-in duration-300" : "space-y-4 animate-in fade-in duration-300"}>
            {filteredListings.map((listing) => (
              <AmpasCard
                key={listing.id}
                listing={listing}
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
    </div>
  );
}
