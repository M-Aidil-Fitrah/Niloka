import { TrendingUp, Star, ShieldCheck, Recycle, Activity, ArrowUpRight, Clock } from "lucide-react";

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
          <h3 className="text-xl font-bold text-zinc-100 font-serif-accent italic">Aceh Aroma House</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Dashboard Penjual Premium • Ringkasan penjualan, analitik transaksi, dan data sensorik rantai pasok.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Koneksi Sinkron
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Pendapatan</span>
            <div className="p-1.5 bg-emerald-950/40 text-emerald-400 rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-zinc-100 block">Rp 12.450.000</span>
            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +14.2% minggu ini
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rating Reputasi</span>
            <div className="p-1.5 bg-gold-950/40 text-gold-500 rounded-lg">
              <Star className="h-4 w-4 fill-gold-500" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-zinc-100 block">4.9 / 5.0</span>
            <span className="text-[9px] text-zinc-400 mt-1 block">Dari 128 review pembeli</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Validasi Paspor</span>
            <div className="p-1.5 bg-violet-950/40 text-violet-400 rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-zinc-100 block">2 Valid</span>
            <span className="text-[9px] text-amber-400 font-bold mt-1 block">1 draf menunggu diajukan</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ampas B2B Terjual</span>
            <div className="p-1.5 bg-teal-950/40 text-teal-400 rounded-lg">
              <Recycle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-zinc-100 block">850 Kg</span>
            <span className="text-[9px] text-teal-400 font-bold mt-1 block">Integrasi Nol Sampah</span>
          </div>
        </div>
      </div>

      {/* Grid of Chart & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart Mockup */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Statistik Pendapatan Bulanan</h4>
              <p className="text-[9px] text-zinc-500 mt-0.5">Penjualan retail (dalam jutaan rupiah) semester pertama 2026.</p>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">B2C & B2B</span>
          </div>

          <div className="flex h-40 items-end justify-between gap-3 pt-6 border-b border-zinc-800/60">
            {[
              { label: "Jan", val: "h-[30%]", valLabel: "3.2M", color: "bg-emerald-500" },
              { label: "Feb", val: "h-[45%]", valLabel: "4.5M", color: "bg-emerald-500" },
              { label: "Mar", val: "h-[65%]", valLabel: "6.5M", color: "bg-emerald-500" },
              { label: "Apr", val: "h-[50%]", valLabel: "5.0M", color: "bg-emerald-500" },
              { label: "Mei", val: "h-[85%]", valLabel: "8.5M", color: "bg-emerald-500" },
              { label: "Jun", val: "h-[95%]", valLabel: "12.4M", color: "bg-gradient-to-t from-emerald-500 to-teal-400" },
            ].map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="text-[9px] font-bold text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.valLabel}
                </span>
                <div className={`w-full ${item.val} rounded-t-md ${item.color} group-hover:brightness-110 transition-all duration-300`} />
                <span className="text-[9px] font-bold text-zinc-500 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Aktivitas & Log Pesanan</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Transaksi & negosiasi real-time masuk.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-zinc-200 block line-clamp-1">Roll On Relief (Qty 1)</span>
                <span className="text-[9px] text-zinc-500 block">Fitra Rahmad - Banda Aceh</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/40 rounded-full shrink-0">
                Selesai
              </span>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-zinc-200 block line-clamp-1">Inquiry: Ampas Kering (500kg)</span>
                <span className="text-[9px] text-zinc-500 block">Chat WA - CV Pupuk Atsiri</span>
              </div>
              <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 border border-sky-900/40 rounded-full shrink-0">
                Negosiasi
              </span>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex justify-between items-center gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-zinc-200 block line-clamp-1">Registrasi Paspor</span>
                <span className="text-[9px] text-zinc-500 block">Essential Oil Patchouli</span>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 bg-zinc-900/60 px-2 py-0.5 border border-zinc-800 rounded-full shrink-0 flex items-center gap-1">
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
