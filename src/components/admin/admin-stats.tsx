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

      {/* 2. Admin Quick Instructions Card */}
      <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8">
        <h3 className="text-base font-extrabold text-brand-950">Selamat Datang di Portal Validator</h3>
        <p className="text-xs text-ink-600 mt-1 leading-relaxed">
          Sebagai administrator/validator resmi, Anda bertugas meninjau pengajuan kemitraan dari UMKM penyuling nilam lokal, menyaring copywriting deskripsi produk agar bebas dari klaim medis berlebih, serta memvalidasi dokumen penelusuran Nilam Passport. Gunakan menu **Antrean Moderasi** di sebelah kiri untuk mulai bekerja.
        </p>
      </div>
    </div>
  );
}
