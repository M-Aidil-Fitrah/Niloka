"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AdminValidationItem, AdminValidationStatus, Seller } from "@/lib/contracts";
import { AdminStats } from "./admin-stats";
import { ValidationTable } from "./validation-table";
import { ReviewModal } from "./review-modal";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShieldCheck,
  Search,
  Bell,
  MessageSquare,
  Settings,
  ArrowUpRight,
  Download,
  LogOut
} from "lucide-react";

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
  queued: { label: "Menunggu", classes: "bg-gold-100 border-gold-500/20 text-gold-600" },
  approved: { label: "Disetujui", classes: "bg-brand-100 border-brand-200 text-brand-900" },
  rejected: { label: "Ditolak", classes: "bg-red-50 border-red-200 text-red-800" },
};

export function AdminShell({ validationItems, sellers }: AdminShellProps) {
  const [items, setItems] = useState<AdminValidationItem[]>(validationItems);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedItem, setSelectedItem] = useState<AdminValidationItem | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items by tab and search query
  const filteredItems = items
    .filter((item) => activeTab === "all" || item.target === activeTab)
    .filter((item) => {
      if (!searchQuery) return true;
      return (
        item.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

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

  return (
    <div className="h-screen w-full overflow-hidden flex bg-cream-50 text-ink-900 font-sans max-w-[1920px] mx-auto">
      
      {/* 1. LEFT SIDEBAR - Fixed height, scrollable menu if overflow */}
      <aside className="w-[250px] h-full bg-white-soft border-r border-line/60 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-8">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-950 flex items-center justify-center text-white-soft font-black text-xs">
              N
            </div>
            <span className="font-extrabold text-sm tracking-wider text-brand-950">NILOKA Admin</span>
          </div>

          {/* User profile card */}
          <div className="bg-cream-50/50 border border-line/40 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-950/20 bg-cream-100">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                alt="Darrell Steward"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="font-extrabold text-brand-950 mt-3 text-xs block">Darrell Steward</span>
            <span className="text-[10px] text-ink-600 block mt-0.5">UIUX Lead / Admin</span>
          </div>

          {/* Nav menu links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview (Semua)
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "seller" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <Users className="h-4 w-4" />
              Validasi Seller
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "product" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Validasi Produk
            </button>
            <button
              onClick={() => setActiveTab("nilam-passport")}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "nilam-passport" ? "bg-brand-950 text-white-soft shadow-sm" : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Nilam Passport
            </button>
          </nav>
        </div>

        {/* Bottom Menu Items */}
        <div className="space-y-3 pt-6 border-t border-line/40">
          <div className="flex items-center justify-between px-3 text-[10px] font-bold text-ink-600">
            <span>Sistem Status</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-750 hover:bg-red-50 hover:text-red-800 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Kembali ke Pasar
          </Link>
        </div>
      </aside>

      {/* 2. MAIN SCROLLABLE AREA + RIGHT SIDEBAR flex/grid container */}
      <div className="flex-1 h-full flex overflow-hidden">
        
        {/* MIDDLE PRIMARY CONTENT COLUMN - Scrollable */}
        <main className="flex-1 h-full overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-950 font-serif-accent italic">Hello Darrell Steward 👋</h2>
              <p className="text-xs text-ink-600 mt-0.5">Kelola pengajuan antrean validasi hari ini.</p>
            </div>
            
            {/* Action Bar (Search & Icons) */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-600/50" />
                <input
                  type="text"
                  placeholder="Cari pengajuan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 rounded-full bg-white-soft border border-line/60 pl-9 pr-4 text-xs font-semibold text-brand-950 focus:border-brand-900 outline-none transition-all shadow-sm"
                />
              </div>
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer relative">
                <Bell className="h-4 w-4" />
                {queuedCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
              </button>
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer">
                <MessageSquare className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-white-soft border border-line/60 flex items-center justify-center text-ink-600 hover:text-brand-950 hover:bg-cream-100/50 transition-colors shadow-sm cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner Card */}
          <div className="relative overflow-hidden rounded-[28px] bg-brand-950 text-white-soft p-6 shadow-xl flex flex-col justify-between min-h-[160px]">
            <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
              <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-brand-200 uppercase tracking-widest block">Dashboard Validasi Kontrol</span>
                <span className="text-2xl font-black font-serif-accent italic mt-1 block">Active Queue Monitor</span>
              </div>
              <div className="flex items-center gap-1.5 bg-brand-900 border border-brand-800 rounded-full px-3 py-1 text-[9px] font-bold text-brand-100 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-6">
              <div>
                <span className="text-[10px] font-bold text-brand-200 block uppercase tracking-wider">Antrean Saat Ini</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{queuedCount} Permintaan</span>
              </div>

              <div className="flex gap-2">
                <button className="h-9 px-4 rounded-xl bg-white-soft text-brand-950 hover:bg-cream-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Proses Cepat
                </button>
                <button className="h-9 px-4 rounded-xl bg-brand-900 border border-brand-800 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  Unduh Laporan
                </button>
              </div>
            </div>
          </div>

          {/* Stats Records Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Catatan Aktivitas Moderasi</h3>
              <span className="text-[10px] font-bold text-brand-900 bg-white-soft border border-line/60 px-2 py-0.5 rounded-full">Bulan Ini</span>
            </div>
            <AdminStats
              items={items}
              queuedCount={queuedCount}
              approvedCount={approvedCount}
              rejectedCount={rejectedCount}
            />
          </div>

          {/* Active Queue Validation Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Daftar Antrean Permintaan</h3>
              <span className="text-[10px] font-bold text-brand-900 bg-white-soft border border-line/60 px-2 py-0.5 rounded-full">
                Filter: {activeTab === "all" ? "Semua" : targetLabels[activeTab]}
              </span>
            </div>
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
          </div>
        </main>

        {/* 3. RIGHT SIDEBAR PANEL - Fixed height, scrollable internally */}
        <aside className="w-80 h-full bg-white-soft border-l border-line/60 p-6 sm:p-8 space-y-6 shrink-0 overflow-y-auto hidden xl:block">
          {/* Recent Activity list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink-600">Log Aktivitas Terbaru</h4>
              <span className="text-[9px] font-bold text-brand-900 border border-line/60 px-2 py-0.5 rounded-full cursor-pointer hover:bg-cream-50">Semua</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Jane Cooper", detail: "Menyetujui Seller Baru", price: "+1 Seller", date: "08 Sep, 2026", color: "text-brand-900 bg-brand-100" },
                { name: "Leslie Alexander", detail: "Menolak Produk Baru", price: "-1 Produk", date: "08 Sep, 2026", color: "text-red-800 bg-red-100" },
                { name: "Darrell Steward", detail: "Memproses Nilam Passport", price: "+1 Passport", date: "08 Sep, 2026", color: "text-brand-900 bg-brand-100" },
                { name: "Robert Fox", detail: "Menyetujui Batch Ampas B2B", price: "+1 Ampas", date: "08 Sep, 2026", color: "text-brand-900 bg-brand-100" },
                { name: "Jacob Jones", detail: "Menyetujui Registrasi", price: "+1 Seller", date: "07 Sep, 2026", color: "text-brand-900 bg-brand-100" },
              ].map((act, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3 p-3 bg-cream-50/40 hover:bg-cream-50/70 border border-line/30 rounded-2xl transition-all">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-brand-950 block">{act.name}</span>
                    <span className="text-[9px] text-ink-600 block">{act.detail}</span>
                    <span className="text-[8px] text-ink-600/60 block">{act.date}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${act.color}`}>
                    {act.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

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
