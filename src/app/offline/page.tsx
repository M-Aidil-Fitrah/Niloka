import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Tidak Ada Koneksi",
  description: "Perangkat Anda sedang offline. Pastikan koneksi internet tersedia lalu muat ulang halaman.",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-brand-100 border border-line flex items-center justify-center">
            <WifiOff className="h-9 w-9 text-brand-700" aria-hidden />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-brand-950">
            Tidak Ada Koneksi Internet
          </h1>
          <p className="text-sm font-medium text-ink-600 leading-relaxed">
            Halaman ini membutuhkan koneksi internet untuk dimuat.
            Periksa jaringan Wi-Fi atau data seluler Anda, lalu muat ulang halaman.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-sm font-bold transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Muat Ulang
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-line bg-white hover:bg-cream-100 text-brand-950 text-sm font-bold transition-colors"
          >
            Lihat Katalog
          </Link>
        </div>

        {/* Brand footer */}
        <p className="text-[11px] font-semibold text-ink-600/60 uppercase tracking-wider">
          NILOKA · Nilam Aceh
        </p>
      </div>
    </main>
  );
}
