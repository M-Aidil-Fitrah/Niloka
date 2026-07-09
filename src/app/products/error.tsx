"use client";

import { useEffect } from "react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">Gagal Memuat Produk</h2>
          <p className="mt-2 text-ink-600">
            Tidak dapat memuat daftar produk. Silakan coba lagi.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-brand-900 text-white-soft font-bold rounded-xl text-sm hover:bg-brand-850 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
