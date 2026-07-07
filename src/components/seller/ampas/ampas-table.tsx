"use client";

import Image from "next/image";
import { Scale, Compass, Calendar, Truck, Edit3, Trash2 } from "lucide-react";
import type { AmpasListing } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

type AmpasTableProps = {
  listings: AmpasListing[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalCount: number;
  onOpenEdit: (listing: AmpasListing) => void;
  onDelete: (id: string) => void;
};

export function AmpasTable({
  listings,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalCount,
  onOpenEdit,
  onDelete,
}: AmpasTableProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-6 md:grid-cols-2">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-[28px] border border-line bg-white-soft overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row"
          >
            {/* Image side */}
            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-cream-50">
              <Image
                src={listing.image.src}
                alt={listing.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>

            {/* Info side */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                    listing.condition === "dry"
                      ? "bg-amber-50 text-amber-800 border-amber-250"
                      : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}>
                    {listing.condition === "dry" ? "Kering" : "Basah"}
                  </span>
                  <span className="text-[11px] font-bold text-ink-600 flex items-center gap-1">
                    <Scale className="h-3 w-3" />
                    {listing.quantityKg} Kg
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-ink-700">
                  <Compass className="h-3.5 w-3.5 text-ink-500" />
                  <span>{listing.location.city}, {listing.location.province}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-ink-700 py-1.5 border-y border-line/35 my-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-900 shrink-0" />
                    <span>Distilasi: {listing.distillationDate || "2026-07-01"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-brand-900 shrink-0" />
                    <span className="capitalize">
                      {listing.shippingOption === "self-pickup" ? "Ambil Sendiri" : listing.shippingOption === "cargo" ? "Kargo" : "Kargo & Mandiri"}
                    </span>
                  </div>
                </div>

                {/* Usage Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {listing.usageTags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-ink-600 bg-cream-100 border border-line/50 px-2 py-0.5 rounded">
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-line/30">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-ink-600 uppercase">Harga Per Kg</span>
                  <span className="font-extrabold text-brand-950 text-sm block">
                    {formatRupiah(listing.pricePerKg.amount)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenEdit(listing)}
                    className="p-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 rounded-xl transition-colors cursor-pointer"
                    aria-label="Edit listing"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                    aria-label="Hapus listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-line/40">
          <span className="text-xs font-semibold text-ink-600">
            Menampilkan <strong className="text-brand-950">{startIndex + 1}</strong> - <strong className="text-brand-950">{Math.min(startIndex + itemsPerPage, totalCount)}</strong> dari <strong className="text-brand-950">{totalCount}</strong> listing
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="py-1.5 px-4 bg-white-soft border border-line rounded-xl text-xs font-bold text-brand-950 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-white-soft transition-all cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-brand-900 text-white-soft shadow-xs"
                    : "bg-white-soft border border-line text-ink-700 hover:bg-cream-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="py-1.5 px-4 bg-white-soft border border-line rounded-xl text-xs font-bold text-brand-950 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-white-soft transition-all cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
