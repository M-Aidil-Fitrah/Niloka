import { TrendingUp, Star, ShieldCheck, Recycle, Clock } from "lucide-react";
import { DashboardStatsCard } from "@/components/dashboard/dashboard-layout";

type SellerStatsProps = {
  sellerProductsCount: number;
  sellerAmpasCount: number;
  passportDraftsCount: number;
};

export function SellerStats({
  sellerProductsCount,
  sellerAmpasCount,
  passportDraftsCount,
}: SellerStatsProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Statistik Penjualan</h3>
          <p className="text-xs text-ink-600 mt-0.5">
            Ringkasan penjualan ({sellerProductsCount} produk terdaftar), analitik transaksi, dan data sensorik rantai pasok.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white-soft border border-line/60 rounded-full text-[10px] font-bold text-ink-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-900 animate-pulse" />
          Koneksi Sinkron
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 - Total Pendapatan */}
        <DashboardStatsCard
          title="Total Pendapatan"
          value="Rp 12.450.000"
          icon={TrendingUp}
          trend={{ type: "up", label: "+14.2% minggu ini" }}
          theme="brand"
        />

        {/* Metric 2 - Rating Reputasi */}
        <DashboardStatsCard
          title="Rating Reputasi"
          value="4.9 / 5.0"
          icon={Star}
          trend={{ type: "up", label: "128 Ulasan" }}
          theme="gold"
        />

        {/* Metric 3 - Validasi Paspor */}
        <DashboardStatsCard
          title="Validasi Paspor"
          value={`${passportDraftsCount} Valid`}
          icon={ShieldCheck}
          trend={{ type: "up", label: "Aktif Autentikasi" }}
          theme="brand"
        />

        {/* Metric 4 - Ampas B2B Terjual */}
        <DashboardStatsCard
          title="Ampas B2B Terjual"
          value={`${sellerAmpasCount * 500 || 850} Kg`}
          icon={Recycle}
          trend={{ type: "up", label: "Pemanfaatan Sirkular" }}
          theme="cream"
        />
      </div>

      {/* Grid of Chart & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart Mockup */}
        <div className="lg:col-span-2 rounded-2xl border border-line/60 bg-white-soft p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-950">Statistik Pendapatan Bulanan</h4>
              <p className="text-[9px] text-ink-600 mt-0.5">Penjualan retail (dalam jutaan rupiah) semester pertama 2026.</p>
            </div>
            <span className="text-[9px] font-bold text-brand-900 bg-cream-50 border border-line/60 px-2 py-0.5 rounded">B2C & B2B</span>
          </div>

          <div className="flex h-40 items-end justify-between gap-3 pt-6 border-b border-line/60">
            {[
              { label: "Jan", val: "h-[30%]", valLabel: "3.2M", color: "bg-brand-700" },
              { label: "Feb", val: "h-[45%]", valLabel: "4.5M", color: "bg-brand-700" },
              { label: "Mar", val: "h-[65%]", valLabel: "6.5M", color: "bg-brand-700" },
              { label: "Apr", val: "h-[50%]", valLabel: "5.0M", color: "bg-brand-700" },
              { label: "Mei", val: "h-[85%]", valLabel: "8.5M", color: "bg-brand-700" },
              { label: "Jun", val: "h-[95%]", valLabel: "12.4M", color: "bg-brand-900" },
            ].map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="text-[9px] font-bold text-brand-950 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.valLabel}
                </span>
                <div className={`w-full ${item.val} rounded-t-md ${item.color} group-hover:brightness-110 transition-all duration-300`} />
                <span className="text-[9px] font-bold text-ink-600 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="rounded-2xl border border-line/60 bg-white-soft p-5 space-y-4 shadow-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-950">Aktivitas & Log Pesanan</h4>
            <p className="text-[9px] text-ink-600 mt-0.5">Transaksi & negosiasi real-time masuk.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-line/40 bg-cream-50/50 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-brand-950 block line-clamp-1">Roll On Relief (Qty 1)</span>
                <span className="text-[9px] text-ink-600 block">Fitra Rahmad - Banda Aceh</span>
              </div>
              <span className="text-[9px] font-bold text-brand-900 bg-brand-100 px-2 py-0.5 border border-brand-200 rounded-full shrink-0">
                Selesai
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line/40 bg-cream-50/50 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-brand-950 block line-clamp-1">Inquiry: Ampas Kering (500kg)</span>
                <span className="text-[9px] text-ink-600 block">CV Pupuk Atsiri</span>
              </div>
              <span className="text-[9px] font-bold text-gold-600 bg-gold-100 px-2 py-0.5 border border-gold-500/20 rounded-full shrink-0">
                Negosiasi
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line/40 bg-cream-50/50 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-brand-950 block line-clamp-1">Registrasi Paspor</span>
                <span className="text-[9px] text-ink-600 block">Essential Oil Patchouli</span>
              </div>
              <span className="text-[9px] font-bold text-ink-600 bg-cream-100 px-2 py-0.5 border border-line/60 rounded-full shrink-0 flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                Draft
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
