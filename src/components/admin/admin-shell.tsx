"use client";

import { useState } from "react";
import { LayoutDashboard, ClipboardCheck, FileText, CheckCircle2, XCircle } from "lucide-react";
import { DashboardShell, DashboardSidebar, DashboardTopbar } from "../dashboard/dashboard-layout";
import { AdminStats } from "./admin-stats";
import { ValidationTable } from "./validation-table";
import { ReviewModal } from "./review-modal";
import type { AdminValidationItem, Seller } from "@/lib/contracts";
import { useAuth } from "@/context/auth-context";

type AdminShellProps = {
  validationItems: AdminValidationItem[];
  sellers: Seller[];
};

export function AdminShell({ validationItems: initialItems, sellers }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [validationItems, setValidationItems] = useState<AdminValidationItem[]>(initialItems);
  const { user } = useAuth();

  // Review modal state
  const [selectedItem, setSelectedItem] = useState<AdminValidationItem | null>(null);

  // Filter queued item count for tab notifications
  const queuedCount = validationItems.filter((i) => i.status === "queued").length;

  // Sidebar navigation configuration
  const navigation = [
    { id: "overview", label: "Ringkasan Admin", icon: LayoutDashboard },
    { id: "moderation", label: "Antrean Moderasi", icon: ClipboardCheck, count: queuedCount },
    { id: "logs", label: "Log Audit", icon: FileText },
  ];

  // Map active tab to current panel component
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminStats
            queueCount={queuedCount}
            sellerCount={sellers.length}
            productCount={42}
          />
        );
      case "moderation":
        return (
          <ValidationTable
            items={validationItems}
            sellers={sellers}
            onReviewClick={setSelectedItem}
          />
        );
      case "logs":
        return (
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-brand-950">Log Audit Sistem</h3>
              <p className="text-xs text-ink-600 mt-1">Aktivitas verifikasi dan moderasi batch panen terakhir</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 items-start text-xs pb-3 border-b border-line/35">
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-brand-950">Menerbitkan Kode Batch NLK-LHG-981</p>
                  <p className="text-ink-600 text-[11px]">Validasi Nilam Passport &quot;Essential Oil Nilam Super&quot; oleh Admin UPTD</p>
                  <span className="text-[10px] font-bold text-ink-500 block pt-1">6 Juli 2026, 14:32</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs pb-3 border-b border-line/35">
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-brand-950">Verifikasi Mitra Baru &quot;Mulia Atsiri Aceh&quot;</p>
                  <p className="text-ink-600 text-[11px]">Pemeriksaan dokumen izin usaha mikro disetujui</p>
                  <span className="text-[10px] font-bold text-ink-500 block pt-1">5 Juli 2026, 09:15</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="p-2 bg-red-50 text-red-800 border border-red-200 rounded-xl shrink-0">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-brand-950">Penolakan Listing B2B Ampas Sulingan</p>
                  <p className="text-ink-600 text-[11px]">Penyuling Acehara terindikasi mengklaim khasiat medis berlebih di deskripsi</p>
                  <span className="text-[10px] font-bold text-ink-500 block pt-1">4 Juli 2026, 11:20</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-sm font-semibold text-ink-600">Halaman tidak ditemukan.</div>;
    }
  };

  const getSubTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Log audit sistem, statistik, serta pantauan keaslian ekosistem Niloka";
      case "moderation":
        return "Verifikasi dokumen pendaftaran seller dan transparansi Nilam Passport";
      case "logs":
        return "Jejak audit validasi rantai pasok dan persetujuan kemitraan";
      default:
        return "Portal Administrasi Niloka";
    }
  };

  const handleApprove = (id: string, notes: string) => {
    setValidationItems(
      validationItems.map((item) =>
        item.id === id ? { ...item, status: "approved", notes: notes || item.notes } : item
      )
    );
    setSelectedItem(null);
  };

  const handleReject = (id: string, notes: string) => {
    setValidationItems(
      validationItems.map((item) =>
        item.id === id ? { ...item, status: "rejected", notes: notes || item.notes } : item
      )
    );
    setSelectedItem(null);
  };

  return (
    <DashboardShell>
      {/* 1. Static/Drawer Sidebar */}
      <DashboardSidebar
        brandName="Niloka Admin"
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Right Pane: Topbar & Scrollable Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <DashboardTopbar
          title={navigation.find((item) => item.id === activeTab)?.label || "Dashboard"}
          subtitle={getSubTitle()}
          profileName={user?.name || "UPTD Atsiri Aceh"}
          profileRole={user?.role === "admin" ? "Validator Resmi" : "Admin Staff"}
          profileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
          onMenuClick={() => setIsSidebarOpen(true)}
          backToUrl="/"
          backToLabel="Kembali ke Pasar"
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-6xl mx-auto pb-12">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* 3. Review Action Drawer */}
      <ReviewModal
        item={selectedItem}
        sellers={sellers}
        onClose={() => setSelectedItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </DashboardShell>
  );
}
