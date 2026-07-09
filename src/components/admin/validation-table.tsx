"use client";

import { useState } from "react";
import { Eye, BadgeCheck, XOctagon, RefreshCw } from "lucide-react";
import type { AdminValidationItem, AdminValidationTarget, Seller } from "@/lib/contracts";

type ValidationTableProps = {
  items: AdminValidationItem[];
  sellers: Seller[];
  onReviewClick: (item: AdminValidationItem) => void;
};

export function ValidationTable({ items, sellers, onReviewClick }: ValidationTableProps) {
  const [filter, setFilter] = useState<"all" | "seller" | "product" | "nilam-passport">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFilterChange = (newFilter: "all" | "seller" | "product" | "nilam-passport") => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset page on filter change
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.target === filter;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const getSellerName = (sellerId: string) => {
    return sellers.find((s) => s.id === sellerId)?.displayName || "Mitra Penyuling";
  };

  const getTargetBadge = (target: AdminValidationTarget) => {
    switch (target) {
      case "seller":
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Seller</span>;
      case "product":
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Produk</span>;
      case "nilam-passport":
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-250 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Passport</span>;
      case "ampas-listing":
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">Ampas</span>;
    }
  };

  const getStatusBadge = (status: "queued" | "approved" | "rejected") => {
    switch (status) {
      case "queued":
        return (
          <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit animate-pulse">
            <RefreshCw className="h-2.5 w-2.5" />
            Dalam Antrean
          </span>
        );
      case "approved":
        return (
          <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
            <BadgeCheck className="h-2.5 w-2.5" />
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="text-[9px] font-extrabold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
            <XOctagon className="h-2.5 w-2.5" />
            Ditolak
          </span>
        );
    }
  };

  return (
    <div className="rounded-[28px] border border-line bg-white-soft overflow-hidden space-y-6">
      {/* Table Filter Tabs */}
      <div className="p-6 border-b border-line bg-cream-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-extrabold text-brand-950 text-sm">Antrean Moderasi Platform</h4>
          <p className="text-xs text-ink-600 mt-1">Review detail keaslian berkas seller, kecocokan produk, dan penelusuran Nilam Passport</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-cream-100/70 border border-line/50 p-1 rounded-xl shrink-0">
          {(["all", "seller", "product", "nilam-passport"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? "bg-brand-900 text-white-soft shadow-xs"
                  : "text-ink-650 hover:text-brand-950"
              }`}
            >
              {tab === "all" ? "Semua" : tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      {/* Mobile Card View */}
      <div className="block md:hidden p-4 space-y-4">
        {paginatedItems.length === 0 ? (
          <div className="text-center p-6 text-xs text-ink-600 font-bold">
            Tidak ada pengajuan verifikasi dalam antrean ini.
          </div>
        ) : (
          paginatedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-line/60 bg-white-soft p-4.5 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-center gap-2">
                {getTargetBadge(item.target)}
                {getStatusBadge(item.status)}
              </div>

              <div className="space-y-1.5 text-xs pt-2.5 border-t border-line/30">
                <div className="flex justify-between items-center">
                  <span className="text-ink-500 font-semibold">Diajukan Oleh</span>
                  <strong className="text-brand-950 font-extrabold">{getSellerName(item.submittedBy)}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-500 font-semibold">Tanggal Kirim</span>
                  <span className="text-ink-700 font-bold">{item.submittedAt}</span>
                </div>
                {item.notes && (
                  <div className="pt-1.5">
                    <span className="text-ink-500 font-semibold block mb-0.5">Catatan Pengaju:</span>
                    <p className="text-ink-750 bg-cream-50/40 border border-line/45 rounded-lg p-2 text-[11px] leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => onReviewClick(item)}
                className="w-full mt-2 py-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-[11px] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                Review Pengajuan
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-line/60 bg-cream-50/10 text-ink-700 font-bold uppercase tracking-wider">
              <th className="p-4 sm:p-5 font-bold">Jenis Sasaran</th>
              <th className="p-4 sm:p-5 font-bold">Diajukan Oleh</th>
              <th className="p-4 sm:p-5 font-bold">Tanggal Kirim</th>
              <th className="p-4 sm:p-5 font-bold">Status Verifikasi</th>
              <th className="p-4 sm:p-5 font-bold">Catatan Pengaju</th>
              <th className="p-4 sm:p-5 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/35 font-medium text-brand-950">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-600 font-bold">
                  Tidak ada pengajuan verifikasi dalam antrean ini.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50/20 transition-colors">
                  <td className="p-4 sm:p-5">
                    {getTargetBadge(item.target)}
                  </td>
                  <td className="p-4 sm:p-5 font-extrabold">
                    {getSellerName(item.submittedBy)}
                  </td>
                  <td className="p-4 sm:p-5 text-ink-600">
                    {item.submittedAt}
                  </td>
                  <td className="p-4 sm:p-5">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4 sm:p-5 text-ink-650 max-w-xs truncate">
                    {item.notes}
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <button
                      onClick={() => onReviewClick(item)}
                      className="py-1.5 px-4 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 pt-2 border-t border-line/40">
          <span className="text-xs font-semibold text-ink-600">
            Menampilkan <strong className="text-brand-950">{startIndex + 1}</strong> - <strong className="text-brand-950">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</strong> dari <strong className="text-brand-950">{filteredItems.length}</strong> pengajuan
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
