import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import nilokaLogo from "@/public/assets/logo/logo.png";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-950 flex flex-col font-sans">
      {/* Admin Top Bar — dark, authoritative */}
      <header className="border-b border-white/10 bg-brand-950 sticky top-0 z-40 px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link aria-label="NILOKA home" href="/">
              <Image
                alt="NILOKA"
                className="h-auto w-24 sm:w-28 brightness-0 invert"
                priority
                src={nilokaLogo}
              />
            </Link>
            <span className="h-5 w-px bg-white/20 shrink-0" />
            <span className="bg-red-600 text-white-soft text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white/90">Super Admin</span>
            </div>
            <Link
              href="/"
              className="font-bold text-white/70 hover:text-white transition-colors border border-white/20 rounded-xl px-3 py-1.5 hover:bg-white/5"
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

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-[10px] text-white/40">
        <div className="max-w-7xl mx-auto px-6">
          © 2026 NILOKA Admin Panel. Hanya untuk penggunaan internal tim moderasi.
        </div>
      </footer>
    </div>
  );
}
