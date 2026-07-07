"use client";

import { Trash2, Percent, Tag, Truck } from "lucide-react";
import type { Promo, PromoType, PromoStatus } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

type PromoTableProps = {
  promos: Promo[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalCount: number;
  onOpenEdit: (promo: Promo) => void;
  onDelete: (id: string) => void;
};

export function PromoTable({
  promos,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalCount,
  onOpenEdit,
  onDelete,
}: PromoTableProps) {
  const getStatusBadge = (status: PromoStatus) => {
    const map: Record<PromoStatus, { text: string; cls: string }> = {
      active: { text: "Aktif", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
      scheduled: { text: "Terjadwal", cls: "bg-blue-50 text-blue-800 border-blue-200" },
      expired: { text: "Kedaluwarsa", cls: "bg-red-50 text-red-800 border-red-200" },
      disabled: { text: "Dinonaktifkan", cls: "bg-cream-100 text-ink-600 border-line" },
    };
    const found = map[status] || map.disabled;
    return (
      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${found.cls}`}>
        {found.text}
      </span>
    );
  };

  const getTypeIcon = (type: PromoType) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4.5 w-4.5 text-brand-900" />;
      case "fixed-amount":
        return <Tag className="h-4.5 w-4.5 text-brand-900" />;
      case "free-shipping":
        return <Truck className="h-4.5 w-4.5 text-brand-900" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Promo Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="rounded-[28px] border border-line bg-white-soft p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-3">
              {/* Type icon + Badge */}
              <div className="flex justify-between items-center">
                <div className="p-2.5 bg-cream-100/80 border border-line/50 rounded-xl shrink-0">
                  {getTypeIcon(promo.type)}
                </div>
                {getStatusBadge(promo.status)}
              </div>

              {/* Title & Code */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-950 text-sm leading-snug line-clamp-1">
                  {promo.title}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-ink-600 uppercase">KODE KUPON:</span>
                  <code className="text-xs font-mono font-bold text-brand-950 bg-cream-50 border border-line/55 px-2 py-0.5 rounded">
                    {promo.code}
                  </code>
                </div>
              </div>

              {/* Discount details */}
              <div className="pt-1.5 space-y-1 border-t border-line/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-600 font-medium">Potongan</span>
                  <strong className="font-extrabold text-brand-950">
                    {promo.type === "percentage"
                      ? `${promo.value}%`
                      : promo.type === "fixed-amount"
                      ? formatRupiah(promo.value)
                      : "Gratis Ongkir"}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-650 font-medium">Minimal Belanja</span>
                  <strong className="font-bold text-brand-950">
                    {formatRupiah(promo.minSubtotal.amount)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-650 font-medium">Klaim Terpakai</span>
                  <strong className="font-bold text-brand-950">
                    {promo.usedCount} / {promo.usageLimit} kali
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-line/30 flex gap-2.5">
              <button
                onClick={() => onOpenEdit(promo)}
                className="flex-1 py-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(promo.id)}
                className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                aria-label="Hapus promo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-line/40">
          <span className="text-xs font-semibold text-ink-600">
            Menampilkan <strong className="text-brand-950">{startIndex + 1}</strong> - <strong className="text-brand-950">{Math.min(startIndex + itemsPerPage, totalCount)}</strong> dari <strong className="text-brand-950">{totalCount}</strong> voucher
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
