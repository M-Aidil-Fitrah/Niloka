"use client";

import { ClipboardCheck, Users, ShieldAlert, Award, FileText, CheckCircle2, XCircle } from "lucide-react";
import { DashboardStatsCard } from "../dashboard/dashboard-layout";

type AdminStatsProps = {
  queueCount: number;
  sellerCount: number;
  productCount: number;
};

export function AdminStats({ queueCount, sellerCount, productCount }: AdminStatsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Antrean Validasi"
          value={`${queueCount} Pengajuan`}
          icon={ClipboardCheck}
          trend={{ type: "up", label: "3 Perlu review hari ini" }}
          sparkline="M0,10 Q25,25 50,5 T75,20 T100,10"
          theme="gold"
        />
        <DashboardStatsCard
          title="Mitra Penjual"
          value={`${sellerCount} UMKM`}
          icon={Users}
          trend={{ type: "up", label: "+1 Bergabung minggu ini" }}
          sparkline="M0,25 Q15,10 30,20 T60,5 T90,15"
          theme="brand"
        />
        <DashboardStatsCard
          title="Produk Terdaftar"
          value={`${productCount} Item`}
          icon={Award}
          trend={{ type: "up", label: "40+ Paspor tervalidasi" }}
          sparkline="M0,15 Q20,10 40,25 T80,10 T100,5"
          theme="cream"
        />
        <DashboardStatsCard
          title="Aktivitas Sistem"
          value="Online"
          icon={ShieldAlert}
          trend={{ type: "up", label: "Semua service aman" }}
          theme="cream"
        />
      </div>

      {/* 2. Audit Trail & Log */}
      <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-5">
        <div className="pb-4 border-b border-line/45">
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
              <span className="text-[10px] font-bold text-ink-505 block pt-1">6 Juli 2026, 14:32</span>
            </div>
          </div>

          <div className="flex gap-4 items-start text-xs pb-3 border-b border-line/35">
            <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-extrabold text-brand-950">Verifikasi Mitra Baru &quot;Mulia Atsiri Aceh&quot;</p>
              <p className="text-ink-600 text-[11px]">Pemeriksaan dokumen izin usaha mikro disetujui</p>
              <span className="text-[10px] font-bold text-ink-505 block pt-1">5 Juli 2026, 09:15</span>
            </div>
          </div>

          <div className="flex gap-4 items-start text-xs">
            <div className="p-2 bg-red-50 text-red-800 border border-red-200 rounded-xl shrink-0">
              <XCircle className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-extrabold text-brand-950">Penolakan Listing B2B Ampas Sulingan</p>
              <p className="text-ink-600 text-[11px]">Penyuling Acehara terindikasi mengklaim khasiat medis berlebih di deskripsi</p>
              <span className="text-[10px] font-bold text-ink-505 block pt-1">4 Juli 2026, 11:20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
