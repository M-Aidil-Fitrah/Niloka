import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-[clamp(6rem,20vw,10rem)] font-black leading-[0.8] text-brand-900">404</p>
        <h1 className="mt-6 text-2xl font-bold text-ink-900">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-ink-600 leading-relaxed">
          Halaman yang Anda cari mungkin sudah dipindah, dihapus, atau tidak pernah ada.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-900 text-white-soft hover:bg-brand-700 h-11 px-6 text-sm font-semibold transition-all duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
