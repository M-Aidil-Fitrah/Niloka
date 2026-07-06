import type { AmpasListing } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Calculator, Send } from "lucide-react";

type AmpasCalculatorProps = {
  listings: AmpasListing[];
  calcListingId: string;
  onListingChange: (id: string) => void;
  calcWeight: number;
  onWeightChange: (weight: number) => void;
  selectedListing: AmpasListing | undefined;
  estimatedCost: number;
  buildWhatsAppUrl: (listing: AmpasListing, qty: number) => string;
};

export function AmpasCalculator({
  listings,
  calcListingId,
  onListingChange,
  calcWeight,
  onWeightChange,
  selectedListing,
  estimatedCost,
  buildWhatsAppUrl,
}: AmpasCalculatorProps) {
  return (
    <div className="rounded-[32px] border border-line bg-white-soft p-5 shadow-sm space-y-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-50 text-brand-900 shrink-0">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-brand-950">Kalkulator Grosir (B2B)</h4>
          <p className="text-[10px] text-ink-600 leading-relaxed mt-1">
            Hitung perkiraan biaya dan kirim formulir kesepakatan logistik langsung ke penyuling.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {/* Listing selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
            Pilih Batch Listing
          </label>
          <select
            value={calcListingId}
            onChange={(e) => onListingChange(e.target.value)}
            className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
          >
            {listings.map((l) => {
              const title = l.slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              return (
                <option key={l.id} value={l.id}>
                  {title} ({l.condition === "dry" ? "Kering" : "Basah"})
                </option>
              );
            })}
          </select>
        </div>

        {/* Input weight */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
            Kuantitas Pembelian (Kg)
          </label>
          <div className="relative">
            <input
              type="number"
              min="50"
              step="50"
              value={calcWeight}
              onChange={(e) => onWeightChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-10 rounded-xl border border-line bg-cream-50 pl-3 pr-10 text-xs font-bold text-brand-950 focus:border-brand-700 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-ink-600">
              Kg
            </span>
          </div>
        </div>

        <hr className="border-line/60" />

        {/* Price Output display */}
        {selectedListing && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-ink-600">
              <span>Harga per Kg:</span>
              <span className="font-semibold text-brand-950">
                Rp {selectedListing.pricePerKg.amount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Total Kuantitas:</span>
              <span className="font-semibold text-brand-950">
                {calcWeight.toLocaleString("id-ID")} Kg
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-line/40">
              <span className="font-bold text-brand-950">Estimasi Total:</span>
              <span className="text-base font-extrabold text-brand-950">
                Rp {estimatedCost.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-[9px] leading-relaxed text-ink-600 bg-cream-50 p-2.5 rounded-xl border border-line/40 mt-1">
              * Biaya di atas belum termasuk logistik/truk pengiriman. Ketentuan angkutan disepakati secara langsung antara Anda dan pihak penyuling.
            </p>
          </div>
        )}

        <a
          href={selectedListing ? buildWhatsAppUrl(selectedListing, calcWeight) : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full h-10 rounded-xl bg-brand-950 hover:bg-brand-900 text-white-soft text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
            <Send className="h-3.5 w-3.5" />
            Ajukan Penawaran Grosir
          </Button>
        </a>
      </div>
    </div>
  );
}
