"use client";

import { useState } from "react";
import { LayoutDashboard, ClipboardCheck } from "lucide-react";
import { DashboardShell, DashboardSidebar, DashboardTopbar } from "../dashboard/dashboard-layout";
import { AdminStats } from "./admin-stats";
import { ValidationTable } from "./validation-table";
import { ReviewModal } from "./review-modal";
import type { AdminValidationItem, Seller } from "@/lib/contracts";

type AdminShellProps = {
  validationItems: AdminValidationItem[];
  sellers: Seller[];
};

export function AdminShell({ validationItems: initialItems, sellers }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [validationItems, setValidationItems] = useState<AdminValidationItem[]>(initialItems);

  // Review modal state
  const [selectedItem, setSelectedItem] = useState<AdminValidationItem | null>(null);

  // Filter queued item count for tab notifications
  const queuedCount = validationItems.filter((i) => i.status === "queued").length;

  // Sidebar navigation configuration
  const navigation = [
    { id: "overview", label: "Ringkasan Admin", icon: LayoutDashboard },
    { id: "moderation", label: "Antrean Moderasi", icon: ClipboardCheck, count: queuedCount },
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
        brandName="Admin Panel"
        logoChar="A"
        profileName="UPTD Atsiri Aceh"
        profileRole="Validator Resmi"
        profileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        backToUrl="/"
        backToLabel="Kembali ke Pasar"
      />

      {/* 2. Right Pane: Topbar & Scrollable Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <DashboardTopbar
          title={navigation.find((item) => item.id === activeTab)?.label || "Dashboard"}
          subtitle={getSubTitle()}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-5xl mx-auto pb-12">
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
