import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">404</p>
      <h1 className="mt-2 font-serif-accent text-4xl font-bold tracking-tight text-brand-950 sm:text-5xl">
        Produk Tidak Ditemukan
      </h1>
      <p className="mt-4 text-base text-ink-600">
        Maaf, produk nilam yang Anda cari tidak dapat kami temukan atau sedang tidak aktif di marketplace.
      </p>
      <div className="mt-8">
        <Link href="/products">
          <Button variant="secondary" size="md">
            Kembali ke Katalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
