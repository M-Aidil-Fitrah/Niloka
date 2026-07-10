"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, ClipboardCheck, FileText, CheckCircle2, XCircle } from "lucide-react";
import { DashboardShell, DashboardSidebar, DashboardTopbar } from "../dashboard/dashboard-layout";
import { AdminStats } from "./admin-stats";
import { ValidationTable } from "./validation-table";
import { ReviewModal } from "./review-modal";
import type { AdminValidationItem, Seller } from "@/lib/contracts";
import { useAuth } from "@/context/auth-context";
import { approveValidationAction, rejectValidationAction, getAuditLogsAction, getAdminDashboardStatsAction } from "@/lib/actions/admin-actions";

type AdminShellProps = {
  validationItems: AdminValidationItem[];
  sellers: Seller[];
  productCount?: number;
};

export function AdminShell({ validationItems: initialItems, sellers, productCount = 0 }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [validationItems, setValidationItems] = useState<AdminValidationItem[]>(initialItems);
  const [auditLogs, setAuditLogs] = useState<{ id: string; userId: string | null; action: string; target: string; targetId: string; metadata: string; createdAt: string }[]>([]);
  const [validationSummary, setValidationSummary] = useState<{ day: string; approved: number; rejected: number }[]>([]);
  const [distribution, setDistribution] = useState<{ type: string; count: number }[]>([]);
  const { user } = useAuth();

  // Sync initial items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValidationItems(initialItems);
  }, [initialItems]);

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

  // Fetch dashboard stats on mount
  useEffect(() => {
    getAdminDashboardStatsAction()
      .then((stats) => {
        setValidationSummary(stats.validationSummary);
        setDistribution(stats.distribution);
      })
      .catch((err) => console.error("Failed to load admin stats", err));
  }, []);

  // Fetch audit logs dynamically when tab changes to logs
  useEffect(() => {
    if (activeTab === "logs") {
      getAuditLogsAction()
        .then((logs) => {
          setAuditLogs(logs);
        })
        .catch((err) => {
          console.error("Failed to load audit logs", err);
        });
    }
  }, [activeTab]);

  // Map active tab to current panel component
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminStats
            queueCount={queuedCount}
            sellerCount={sellers.length}
            productCount={productCount}
            validationSummary={validationSummary}
            distribution={distribution}
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
              {auditLogs.length === 0 ? (
                <div className="text-xs text-ink-500 py-4 text-center">Belum ada aktivitas audit log yang tercatat.</div>
              ) : (
                auditLogs.map((log) => {
                  const isReject = log.action.includes("REJECT") || log.action.includes("DELETE");
                  return (
                    <div key={log.id} className="flex gap-4 items-start text-xs pb-3 border-b border-line/35">
                      <div className={`p-2 border rounded-xl shrink-0 ${
                        isReject 
                          ? "bg-red-50 text-red-800 border-red-200" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {isReject ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-brand-950 uppercase">{log.action.replace(/_/g, " ")}</p>
                        <p className="text-ink-600 text-[11px] leading-relaxed">
                          Target: <strong className="text-brand-950 font-bold">{log.target}</strong> (ID: {log.targetId})
                        </p>
                        {log.metadata && (
                          <pre className="text-[10px] text-ink-500 font-mono bg-cream-50/50 p-1.5 rounded-lg max-w-full overflow-x-auto mt-1 whitespace-pre-wrap leading-tight">
                            {log.metadata}
                          </pre>
                        )}
                        <span className="text-[10px] font-bold text-ink-500 block pt-1">
                          {new Date(log.createdAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
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
    approveValidationAction(id, notes).then((res) => {
      if (res.ok) {
        setValidationItems(
          validationItems.map((item) =>
            item.id === id ? { ...item, status: "approved", notes: notes || item.notes } : item
          )
        );
      }
    }).catch((err) => {
      console.error(err);
    });
    setSelectedItem(null);
  };

  const handleReject = (id: string, notes: string) => {
    rejectValidationAction(id, notes).then((res) => {
      if (res.ok) {
        setValidationItems(
          validationItems.map((item) =>
            item.id === id ? { ...item, status: "rejected", notes: notes || item.notes } : item
          )
        );
      }
    }).catch((err) => {
      console.error(err);
    });
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
