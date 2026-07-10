"use client";

import { TrendingUp, ShoppingBag, Award, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { DashboardStatsCard } from "../dashboard/dashboard-layout";
import { showToast } from "@/lib/toast";
import { formatRupiah } from "@/lib/formatters";
import type { Product } from "@/lib/contracts";

type SellerStatsProps = {
  products?: Product[];
  totalSales: number;
  totalProducts: number;
  pendingPassports: number;
  ratingAverage: number;
  totalReviews: number;
  dailySales: { day: string; amount: number }[];
  recentTransactions: { id: string; productName: string; buyerName: string; amount: number; date: string; status: "success" | "pending" | "failed" }[];
};

export function SellerStats({ products = [], totalSales, totalProducts, pendingPassports, ratingAverage, totalReviews, dailySales, recentTransactions }: SellerStatsProps) {
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4.5 flex gap-3 items-start animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-amber-900 text-xs">Peringatan: Stok Produk Menipis</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
              Produk berikut memiliki stok kurang dari atau sama dengan 3 unit:{" "}
              {lowStockProducts.map((p) => `${p.name} (${p.stock} pcs)`).join(", ")}. 
              Segera lakukan restock untuk menjaga kontinuitas penjualan Anda.
            </p>
          </div>
        </div>
      )}
      {/* 1. Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Total Penjualan"
          value={formatRupiah(totalSales)}
          icon={TrendingUp}
          trend={{ type: "up", label: "+12.4% vs bln lalu" }}
          sparkline="M0,25 Q15,10 30,20 T60,5 T90,15"
          theme="brand"
        />
        <DashboardStatsCard
          title="Produk Aktif"
          value={`${totalProducts} Produk`}
          icon={ShoppingBag}
          trend={{ type: "up", label: "2 Baru ditambahkan" }}
          sparkline="M0,15 Q20,10 40,25 T80,10 T100,5"
          theme="cream"
        />
        <DashboardStatsCard
          title="Rating Kepuasan"
          value={totalReviews > 0 ? `${(ratingAverage * 20).toFixed(1)}%` : "—"}
          icon={Award}
          trend={{ type: totalReviews > 0 ? "up" : "down", label: totalReviews > 0 ? `Dari ${totalReviews} ulasan` : "Belum ada ulasan" }}
          sparkline="M0,5 Q25,25 50,5 T75,20 T100,10"
          theme="gold"
        />
        <DashboardStatsCard
          title="Paspor Pending"
          value={`${pendingPassports} Draf`}
          icon={Clock}
          trend={{ type: "down", label: "Butuh aksi verifikasi" }}
          theme="cream"
        />
      </div>

      {/* 2. Visual Chart & Transactions split */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Performance Summary */}
        <div className="lg:col-span-2 rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-line/45 w-full">
            <div>
              <h3 className="text-base font-extrabold text-brand-950">Kinerja Toko</h3>
              <p className="text-xs text-ink-600 mt-1">Ikhtisar penjualan harian minyak nilam dan produk turunan</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast("Laporan penjualan berhasil diekspor ke format CSV!", "success")}
                className="text-xs font-bold text-brand-900 bg-cream-100 hover:bg-cream-200 border border-line px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
              >
                Ekspor Laporan
              </button>
              <span className="text-xs font-bold text-brand-900 bg-brand-100/50 px-3 py-1 rounded-full border border-brand-200/50">
                Bulan Ini
              </span>
            </div>
          </div>

          {/* Data-driven Sales Chart */}
          <div className="h-56 w-full mt-6 flex items-end gap-1.5">
            {dailySales.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-xs text-ink-500">Belum ada data penjualan.</p>
              </div>
            ) : (
              (() => {
                const maxAmount = Math.max(1, ...dailySales.map((d) => d.amount));
                return dailySales.map((d, i) => {
                  const heightPct = (d.amount / maxAmount) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                      <div className="absolute bottom-full mb-1 bg-brand-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Rp{d.amount.toLocaleString("id-ID")}
                      </div>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[32px] rounded-t bg-brand-900/80 hover:bg-brand-900 transition-colors cursor-pointer"
                      />
                      <span className="text-[7px] font-bold text-ink-600 truncate w-full text-center">{d.day}</span>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>

        {/* Recent Transactions Panel */}
        <div className="rounded-[28px] border border-line bg-white-soft p-6 flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-line/45">
            <h3 className="text-base font-extrabold text-brand-950">Transaksi Terakhir</h3>
            <p className="text-xs text-ink-600">Pesanan masuk yang berhasil diselesaikan</p>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-ink-500 py-8 text-center">Belum ada transaksi.</p>
            ) : (
              recentTransactions.map((trx) => (
                <div key={trx.id} className="flex justify-between items-center gap-3 text-xs pb-3.5 border-b border-line/30 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-extrabold text-brand-950 block truncate">{trx.productName}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-ink-600">
                      <span className="font-bold">{trx.id.slice(0, 12)}</span>
                      <span>•</span>
                      <span>{trx.buyerName}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-brand-950 block">{formatRupiah(trx.amount)}</span>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-md block mt-1 text-center">
                      {trx.status === "success" ? "Sukses" : trx.status === "pending" ? "Menunggu" : "Gagal"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-6 py-2.5 bg-cream-100 hover:bg-cream-200 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            Lihat Semua Penjualan
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
