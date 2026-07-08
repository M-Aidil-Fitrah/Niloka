"use client";

import { ClipboardCheck, Users, ShieldAlert, Award, TrendingUp } from "lucide-react";
import { DashboardStatsCard } from "../dashboard/dashboard-layout";

type AdminStatsProps = {
  queueCount: number;
  sellerCount: number;
  productCount: number;
};

export function AdminStats({ queueCount, sellerCount, productCount }: AdminStatsProps) {
  // Mock weekly validation stats
  const validationSummary = [
    { day: "Senin", total: 4, approved: 3, rejected: 1 },
    { day: "Selasa", total: 6, approved: 5, rejected: 1 },
    { day: "Rabu", total: 3, approved: 3, rejected: 0 },
    { day: "Kamis", total: 8, approved: 6, rejected: 2 },
    { day: "Jumat", total: 5, approved: 4, rejected: 1 },
    { day: "Sabtu", total: 2, approved: 2, rejected: 0 },
    { day: "Minggu", total: 1, approved: 1, rejected: 0 },
  ];

  const distribution = [
    { type: "Sertifikasi Mitra Baru", count: 12, percent: 40, color: "bg-brand-900" },
    { type: "Listing Produk B2C", count: 18, percent: 50, color: "bg-emerald-600" },
    { type: "Transparansi Nilam Passport", count: 8, percent: 10, color: "bg-amber-600" },
  ];

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Bar Chart (CSS-based) */}
        <div className="lg:col-span-2 rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-extrabold text-brand-950">Aktivitas Validasi Mingguan</h4>
              <p className="text-xs text-ink-500 mt-0.5">Jumlah berkas diproses (Disetujui vs Ditolak)</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-brand-900">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-900 block" /> Disetujui
              </span>
              <span className="flex items-center gap-1.5 text-red-650">
                <span className="w-2.5 h-2.5 rounded-full bg-red-650 block" /> Ditolak
              </span>
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className="flex items-end justify-between gap-2.5 pt-8 h-48 border-b border-line pb-2">
            {validationSummary.map((item) => {
              const maxTotal = 8;
              const approveHeight = (item.approved / maxTotal) * 100;
              const rejectHeight = (item.rejected / maxTotal) * 100;

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-brand-950 text-white-soft text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 text-center shadow-md">
                    <div>{item.day}</div>
                    <div className="text-emerald-400 font-extrabold">{item.approved} Disetujui</div>
                    {item.rejected > 0 && <div className="text-red-400 font-extrabold">{item.rejected} Ditolak</div>}
                  </div>

                  <div className="w-full flex items-end gap-1.5 max-w-[40px] h-full justify-center">
                    <div
                      style={{ height: `${approveHeight}%` }}
                      className="w-3 bg-brand-900 rounded-t-md transition-all duration-500 hover:opacity-85"
                    />
                    {item.rejected > 0 && (
                      <div
                        style={{ height: `${rejectHeight}%` }}
                        className="w-3 bg-red-650 rounded-t-md transition-all duration-500 hover:opacity-85"
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold text-ink-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-brand-950">Distribusi Pekerjaan</h4>
            <p className="text-xs text-ink-500 mt-0.5">Kategori pengajuan validasi aktif</p>
          </div>

          <div className="space-y-4">
            {distribution.map((dist) => (
              <div key={dist.type} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-ink-700">{dist.type}</span>
                  <span className="font-extrabold text-brand-950">{dist.count} Berkas</span>
                </div>
                <div className="w-full bg-cream-100 rounded-full h-2">
                  <div
                    style={{ width: `${dist.percent}%` }}
                    className={`${dist.color} h-2 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cream-50/50 border border-line rounded-2xl flex gap-2 items-center text-[10px] text-ink-650 font-bold">
            <TrendingUp className="h-4 w-4 text-brand-900 shrink-0" />
            <span>Kinerja validasi meningkat +12% dibanding minggu lalu.</span>
          </div>
        </div>
      </div>

      {/* 3. Welcome & Instructions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-3">
          <h3 className="text-sm font-extrabold text-brand-950">Standar Operasional Prosedur (SOP)</h3>
          <p className="text-xs text-ink-600 leading-relaxed font-semibold">
            1. Periksa legalitas surat keterangan tani / izin usaha atsiri (harus memiliki status aktif & terdaftar).<br />
            2. Lakukan audit copywriting deskripsi produk: tidak boleh mengandung klaim medis spesifik (contoh: menyembuhkan kanker, meredakan asma akut).<br />
            3. Verifikasi transparansi Nilam Passport, mencakup asal panen distrik yang logis dan kelengkapan uji aroma.
          </p>
        </div>

        <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-3">
          <h3 className="text-sm font-extrabold text-brand-950">Pemberitahuan Sistem</h3>
          <div className="space-y-2">
            <div className="flex gap-2.5 items-start text-xs font-semibold text-ink-650">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 animate-pulse" />
              <span>Ada 2 pengajuan validasi Nilam Passport dari Kabupaten Aceh Jaya yang tertunda lebih dari 48 jam.</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs font-semibold text-ink-650">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <span>Sistem deteksi otomatis AI untuk monitoring klaim medis aktif di background.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
