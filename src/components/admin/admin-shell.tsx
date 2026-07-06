"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminValidationItem, AdminValidationStatus, Seller } from "@/lib/contracts";

type AdminShellProps = {
  validationItems: AdminValidationItem[];
  sellers: Seller[];
};

type TabKey = "all" | "seller" | "product" | "nilam-passport";

const targetLabels: Record<string, string> = {
  seller: "Validasi Seller",
  product: "Validasi Produk",
  "nilam-passport": "Nilam Passport",
};

const statusConfig: Record<AdminValidationStatus, { label: string; classes: string }> = {
  queued: { label: "Menunggu", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  approved: { label: "Disetujui", classes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  rejected: { label: "Ditolak", classes: "bg-red-500/20 text-red-300 border-red-500/30" },
};

export function AdminShell({ validationItems, sellers }: AdminShellProps) {
  const [items, setItems] = useState<AdminValidationItem[]>(validationItems);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedItem, setSelectedItem] = useState<AdminValidationItem | null>(null);
  const [moderationNote, setModerationNote] = useState("");

  // Filter items by tab
  const filteredItems = activeTab === "all"
    ? items
    : items.filter((item) => item.target === activeTab);

  // Counts
  const queuedCount = items.filter((i) => i.status === "queued").length;
  const approvedCount = items.filter((i) => i.status === "approved").length;
  const rejectedCount = items.filter((i) => i.status === "rejected").length;

  // Resolve seller display name
  const resolveSellerName = (sellerId: string) => {
    const seller = sellers.find((s) => s.id === sellerId);
    return seller?.displayName || sellerId;
  };

  // Format date
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  // Handle moderation action
  const handleModerate = (itemId: string, newStatus: AdminValidationStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: newStatus,
              notes: moderationNote || item.notes,
            }
          : item
      )
    );
    setSelectedItem(null);
    setModerationNote("");
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: items.length },
    { key: "seller", label: "Seller", count: items.filter((i) => i.target === "seller").length },
    { key: "product", label: "Produk", count: items.filter((i) => i.target === "product").length },
    { key: "nilam-passport", label: "Passport", count: items.filter((i) => i.target === "nilam-passport").length },
  ];

  return (
    <div className="space-y-6">

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Antrian</span>
          <span className="text-2xl font-extrabold text-white block">{items.length}</span>
          <span className="text-[9px] text-white/40 block">Item validasi terdaftar</span>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-5 space-y-1">
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block">Menunggu Review</span>
          <span className="text-2xl font-extrabold text-amber-300 block">{queuedCount}</span>
          <span className="text-[9px] text-white/40 block">Perlu tindakan admin</span>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-5 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block">Disetujui</span>
          <span className="text-2xl font-extrabold text-emerald-300 block">{approvedCount}</span>
          <span className="text-[9px] text-white/40 block">Terverifikasi oleh admin</span>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-5 space-y-1">
          <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider block">Ditolak</span>
          <span className="text-2xl font-extrabold text-red-300 block">{rejectedCount}</span>
          <span className="text-[9px] text-white/40 block">Memerlukan revisi seller</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap rounded-t-lg ${
              activeTab === tab.key
                ? "bg-white/10 text-white border-b-2 border-red-500"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Validation Items Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 font-bold">
              <th className="p-3.5">Tipe & Target</th>
              <th className="p-3.5">Diajukan Oleh</th>
              <th className="p-3.5">Tanggal</th>
              <th className="p-3.5">Catatan</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/40 block">
                    {targetLabels[item.target]}
                  </span>
                  <span className="font-bold text-white/90 block mt-0.5 font-mono text-[11px]">
                    {item.targetId}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-white/80 block">
                    {resolveSellerName(item.submittedBy)}
                  </span>
                </td>
                <td className="p-3.5 text-white/60 font-semibold">
                  {formatDate(item.submittedAt)}
                </td>
                <td className="p-3.5 max-w-xs">
                  <p className="text-white/60 truncate leading-relaxed text-[11px]">
                    {item.notes}
                  </p>
                </td>
                <td className="p-3.5">
                  <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${statusConfig[item.status].classes}`}>
                    {statusConfig[item.status].label}
                  </span>
                </td>
                <td className="p-3.5">
                  {item.status === "queued" ? (
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setModerationNote(item.notes);
                      }}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider border border-red-500/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-[10px] text-white/30">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/30 text-xs">
                  Tidak ada item validasi untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Moderation Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-brand-950 p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-5 top-5 text-lg font-bold text-white/40 hover:text-white"
            >
              ×
            </button>

            <div className="space-y-5">
              {/* Header */}
              <div>
                <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-wider block">
                  Review Moderasi
                </span>
                <h4 className="text-base font-extrabold text-white mt-1 font-serif-accent italic">
                  {targetLabels[selectedItem.target]}
                </h4>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-white/10 rounded-2xl p-4 bg-white/5">
                <div>
                  <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Target ID</span>
                  <span className="font-mono font-bold text-white/90 mt-0.5 block text-[11px]">{selectedItem.targetId}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Diajukan Oleh</span>
                  <span className="font-bold text-white/90 mt-0.5 block">{resolveSellerName(selectedItem.submittedBy)}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Tanggal Pengajuan</span>
                  <span className="font-semibold text-white/80 mt-0.5 block">{formatDate(selectedItem.submittedAt)}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Status Saat Ini</span>
                  <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border mt-1 ${statusConfig[selectedItem.status].classes}`}>
                    {statusConfig[selectedItem.status].label}
                  </span>
                </div>
              </div>

              {/* Moderation Note */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                  Catatan Moderasi
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-semibold text-white placeholder:text-white/30 focus:border-red-500/50 outline-none resize-none"
                  placeholder="Tambahkan catatan alasan keputusan moderasi..."
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="h-10 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-white/70 text-xs font-bold transition-all"
                >
                  Batal
                </button>
                <Button
                  onClick={() => handleModerate(selectedItem.id, "rejected")}
                  className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  ✗ Tolak
                </Button>
                <Button
                  onClick={() => handleModerate(selectedItem.id, "approved")}
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  ✓ Setujui
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
