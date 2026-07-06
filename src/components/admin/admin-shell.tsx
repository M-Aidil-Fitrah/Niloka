"use client";

import { useState } from "react";
import type { AdminValidationItem, AdminValidationStatus, Seller } from "@/lib/contracts";
import { AdminStats } from "./admin-stats";
import { ValidationTable } from "./validation-table";
import { ReviewModal } from "./review-modal";

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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Overview */}
      <AdminStats
        items={items}
        queuedCount={queuedCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

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

      {/* Validation Table */}
      <ValidationTable
        items={filteredItems}
        sellers={sellers}
        targetLabels={targetLabels}
        statusConfig={statusConfig}
        resolveSellerName={resolveSellerName}
        formatDate={formatDate}
        onReviewClick={(item) => {
          setSelectedItem(item);
          setModerationNote(item.notes);
        }}
      />

      {/* Moderation Detail Modal */}
      {selectedItem && (
        <ReviewModal
          item={selectedItem}
          targetLabels={targetLabels}
          statusConfig={statusConfig}
          resolveSellerName={resolveSellerName}
          formatDate={formatDate}
          moderationNote={moderationNote}
          onNoteChange={setModerationNote}
          onClose={() => setSelectedItem(null)}
          onModerate={handleModerate}
        />
      )}
    </div>
  );
}
