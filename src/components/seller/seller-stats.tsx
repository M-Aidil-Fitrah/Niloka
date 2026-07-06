"use client";

import { TrendingUp, ShoppingBag, Award, Clock, ArrowRight } from "lucide-react";
import { DashboardStatsCard } from "../dashboard/dashboard-layout";
import { formatRupiah } from "@/lib/formatters";

type Transaction = {
  id: string;
  productName: string;
  buyerName: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
};

const recentTransactions: Transaction[] = [
  {
    id: "TRX-0982",
    productName: "Essential Oil Nilam Super",
    buyerName: "Aroma Therapy Lab",
    amount: 1450000,
    date: "6 Juli 2026",
    status: "success",
  },
  {
    id: "TRX-0981",
    productName: "Lilin Aromaterapi Nilam & Lavender",
    buyerName: "Cut Nyak Meutia",
    amount: 320000,
    date: "5 Juli 2026",
    status: "success",
  },
  {
    id: "TRX-0980",
    productName: "Ampas Nilam Kering B2B",
    buyerName: "Pupuk Organik Makmur",
    amount: 2500000,
    date: "4 Juli 2026",
    status: "success",
  },
  {
    id: "TRX-0979",
    productName: "Parfum Nilam Aceh Premium",
    buyerName: "Tengku Iskandar",
    amount: 850000,
    date: "2 Juli 2026",
    status: "success",
  },
];

type SellerStatsProps = {
  totalSales: number;
  totalProducts: number;
  pendingPassports: number;
};

export function SellerStats({ totalSales, totalProducts, pendingPassports }: SellerStatsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
          value="98.4%"
          icon={Award}
          trend={{ type: "up", label: "Dari 84 ulasan" }}
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
          <div className="flex justify-between items-center pb-4 border-b border-line/45">
            <div>
              <h3 className="text-base font-extrabold text-brand-950">Kinerja Toko</h3>
              <p className="text-xs text-ink-600 mt-1">Ikhtisar penjualan harian minyak nilam dan produk turunan</p>
            </div>
            <span className="text-xs font-bold text-brand-900 bg-brand-100/50 px-3 py-1 rounded-full border border-brand-200/50">
              Bulan Ini
            </span>
          </div>

          {/* Simple Vector Mock Chart */}
          <div className="h-56 w-full mt-6 relative flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-ink-900 w-full" />
              <div className="border-b border-ink-900 w-full" />
              <div className="border-b border-ink-900 w-full" />
              <div className="border-b border-ink-900 w-full" />
            </div>

            {/* SVG Plot */}
            <svg className="w-full h-full absolute inset-0 text-brand-900" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-900)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--brand-900)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,180 C50,150 100,160 150,110 C200,60 250,90 300,50 C350,10 400,60 450,30 L500,45 L500,200 L0,200 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M0,180 C50,150 100,160 150,110 C200,60 250,90 300,50 C350,10 400,60 450,30 L500,45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Highlight Nodes */}
              <circle cx="150" cy="110" r="5" className="fill-gold-500 stroke-2 stroke-white-soft" />
              <circle cx="300" cy="50" r="5" className="fill-gold-500 stroke-2 stroke-white-soft" />
              <circle cx="450" cy="30" r="5" className="fill-gold-500 stroke-2 stroke-white-soft" />
            </svg>

            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-[9px] font-bold text-ink-600">Minggu 1</div>
            <div className="absolute bottom-2 left-1/3 text-[9px] font-bold text-ink-600">Minggu 2</div>
            <div className="absolute bottom-2 left-2/3 text-[9px] font-bold text-ink-600">Minggu 3</div>
            <div className="absolute bottom-2 right-2 text-[9px] font-bold text-ink-600">Hari Ini</div>
          </div>
        </div>

        {/* Recent Transactions Panel */}
        <div className="rounded-[28px] border border-line bg-white-soft p-6 flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-line/45">
            <h3 className="text-base font-extrabold text-brand-950">Transaksi Terakhir</h3>
            <p className="text-xs text-ink-600">Pesanan masuk yang berhasil diselesaikan</p>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            {recentTransactions.map((trx) => (
              <div key={trx.id} className="flex justify-between items-center gap-3 text-xs pb-3.5 border-b border-line/30 last:border-b-0 last:pb-0">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-extrabold text-brand-950 block truncate">{trx.productName}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-ink-600">
                    <span className="font-bold">{trx.id}</span>
                    <span>•</span>
                    <span>{trx.buyerName}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-brand-950 block">{formatRupiah(trx.amount)}</span>
                  <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-md block mt-1 text-center">
                    Sukses
                  </span>
                </div>
              </div>
            ))}
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
