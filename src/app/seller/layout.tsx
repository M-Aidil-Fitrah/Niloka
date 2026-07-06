import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import nilokaLogo from "@/public/assets/logo/logo.png";

type SellerLayoutProps = {
  children: ReactNode;
};

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans">
      {/* Work-Focused Minimalist Top Nav */}
      <header className="border-b border-line bg-white-soft sticky top-0 z-40 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand/Logo & Portal Identifier */}
          <div className="flex items-center gap-4">
            <Link aria-label="NILOKA home" href="/">
              <Image
                alt="NILOKA"
                className="h-auto w-24 sm:w-28"
                priority
                src={nilokaLogo}
              />
            </Link>
            <span className="h-5 w-px bg-line shrink-0" />
            <span className="bg-brand-900 text-white-soft text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Seller Portal
            </span>
          </div>

          {/* Shop Profile & Exit Link */}
          <div className="flex items-center gap-5 text-xs">
            {/* Store Meta info */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-brand-950">Aceh Aroma House</span>
              <span className="text-[9px] font-bold text-ink-600 bg-cream-100 border border-line/40 px-1.5 py-0.5 rounded">
                UMKM Partner
              </span>
            </div>
            
            <Link
              href="/"
              className="font-bold text-brand-900 hover:text-brand-700 transition-colors border border-brand-900/20 rounded-xl px-3 py-1.5 hover:bg-brand-900/5"
            >
              Kembali ke Pasar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Utilitarian Footer */}
      <footer className="border-t border-line/60 bg-white-soft/60 py-6 text-center text-[10px] text-ink-600">
        <div className="max-w-7xl mx-auto px-6">
          © 2026 NILOKA Seller Portal. Sistem Transparansi Atsiri Terintegrasi.
        </div>
      </footer>
    </div>
  );
}
