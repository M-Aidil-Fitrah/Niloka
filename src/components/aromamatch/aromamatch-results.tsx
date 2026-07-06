import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import type { Product, NilamPassport } from "@/lib/contracts";

type AromamatchResultsProps = {
  recommendations: {
    product: Product;
    passport: NilamPassport | null;
    score: number;
    reason: string;
  }[];
  formLabels: Record<string, string>;
  onReset: () => void;
};

export function AromamatchResults({
  recommendations,
  formLabels,
  onReset,
}: AromamatchResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600 mb-3">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-3xl font-bold text-brand-950 font-serif-accent italic">Aroma Cocok Anda Ditemukan</h3>
        <p className="mt-2 text-xs text-ink-600">
          Berikut adalah 3 produk terbaik hasil kurasi algoritma AromaMatch berdasarkan preferensi Anda.
        </p>
      </div>

      <div className="space-y-6">
        {recommendations.map(({ product, passport, score, reason }, idx) => (
          <div
            key={product.id}
            className={`relative overflow-hidden rounded-[32px] border p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:shadow-2xl ${
              idx === 0 ? "border-gold-500 bg-gold-500/5 shadow-md" : "border-line bg-white-soft"
            }`}
          >
            {/* Highlight ribbon for top match */}
            {idx === 0 && (
              <div className="absolute left-0 top-0 bg-gold-500 text-brand-950 text-[9px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-br-2xl">
                Rekomendasi Utama
              </div>
            )}

            {/* Match Score Circle */}
            <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-gold-500/40 bg-gold-100/50">
              <span className="text-2xl font-extrabold text-brand-950 leading-none">{score}%</span>
              <span className="text-[9px] font-bold text-ink-600 mt-1 uppercase tracking-wider">Cocok</span>
            </div>

            {/* Product Thumbnail & Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-wider text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md">
                  {formLabels[product.form] ?? product.form}
                </span>
                {passport?.validationStatus === "validated" && (
                  <Badge className="flex items-center gap-0.5 text-[9px] min-h-4 px-2 py-0.5 bg-brand-50 border-brand-200 text-brand-900 font-bold border rounded-full">
                    <ShieldCheck className="h-3 w-3 text-brand-900" />
                    Paspor Terverifikasi
                  </Badge>
                )}
              </div>
              <h4 className="mt-2 text-lg font-bold text-brand-950 line-clamp-1">{product.name}</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink-700">{reason}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-sm font-extrabold text-brand-950">
                  Rp {product.price.amount.toLocaleString("id-ID")}
                </span>
                {passport?.origin && (
                  <span className="text-[11px] text-ink-600">
                    • Asal: {passport.origin}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
              <Link href={`/products/${product.slug}`} className="block w-full">
                <Button className="w-full h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold transition-all cursor-pointer">
                  Detail Produk & Paspor
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onReset} variant="secondary" className="px-8 h-12 rounded-2xl border-line text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-cream-50 transition-all">
          <RefreshCw className="h-4 w-4" />
          Ulangi Konsultasi
        </Button>
      </div>
    </div>
  );
}
