"use client";

import { useState } from "react";
import type { AmpasListing, Money } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Calculator, Send, ShoppingCart, CheckCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { PriceDisplay } from "@/components/ui/price-display";

type AmpasCalculatorProps = {
  listings: AmpasListing[];
  calcListingId: string;
  onListingChange: (id: string) => void;
  calcWeight: number;
  onWeightChange: (weight: number) => void;
  selectedListing: AmpasListing | undefined;
  estimatedCost: number;
  buildWhatsAppUrl: (listing: AmpasListing, qty: number) => string;
  wholesaleAppliedInCalc: boolean;
  currentUnitPrice: Money;
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
  wholesaleAppliedInCalc,
  currentUnitPrice,
}: AmpasCalculatorProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedListing) return;
    addItem({
      kind: "ampas-listing",
      productId: null,
      ampasListingId: selectedListing.id,
      quantity: calcWeight,
      unitPrice: currentUnitPrice,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };



  return (
    <div className="rounded-[32px] border border-line bg-white-soft p-5 shadow-sm space-y-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-50 text-brand-900 shrink-0">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-brand-955">Kalkulator Grosir & Eceran</h4>
          <p className="text-[10px] text-ink-600 leading-relaxed mt-1">
            Hitung perkiraan biaya ampas nilam secara instan dan tambahkan ke keranjang belanja Anda.
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
              min="1"
              value={calcWeight}
              onChange={(e) => onWeightChange(Math.max(1, parseInt(e.target.value) || 1))}
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
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-ink-600">
              <span>Harga per Kg:</span>
              <div className="text-right">
                {wholesaleAppliedInCalc && selectedListing.wholesalePricePerKg ? (
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-[10px] text-ink-600/50 line-through font-semibold">
                      <PriceDisplay amount={selectedListing.pricePerKg.amount} showTooltip={false} />
                    </span>
                    <span className="font-extrabold text-brand-950">
                      <PriceDisplay amount={selectedListing.wholesalePricePerKg.amount} showTooltip={false} />
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-brand-950">
                    <PriceDisplay amount={selectedListing.pricePerKg.amount} showTooltip={false} />
                  </span>
                )}
              </div>
            </div>

            {wholesaleAppliedInCalc && (
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Harga Grosir Diterapkan
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5">
                  Hemat <PriceDisplay amount={(selectedListing.pricePerKg.amount - (selectedListing.wholesalePricePerKg?.amount || 0)) * calcWeight} showTooltip={false} className="border-none p-0 inline font-extrabold animate-in fade-in" />
                </span>
              </div>
            )}



            <div className="flex justify-between items-center text-ink-600">
              <span>Total Kuantitas:</span>
              <span className="font-semibold text-brand-950">
                {calcWeight.toLocaleString("id-ID")} Kg
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-line/40">
              <span className="font-bold text-brand-950">Estimasi Total:</span>
              <span className="text-base font-extrabold text-brand-950">
                <PriceDisplay amount={estimatedCost} />
              </span>
            </div>
            
            <p className="text-[9px] leading-relaxed text-ink-600 bg-cream-50 p-2.5 rounded-xl border border-line/40 mt-1">
              * Ketentuan logistik/angkutan pengiriman disepakati secara langsung antara Anda dan pihak penyuling saat checkout atau via kontak penjual.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleAddToCart}
            className={`w-full h-10 rounded-xl text-white-soft text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isAdded ? "bg-emerald-700 hover:bg-emerald-600" : "bg-brand-950 hover:bg-brand-900"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Berhasil Ditambahkan!
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Masukkan Keranjang
              </>
            )}
          </Button>

          <a
            href={selectedListing ? buildWhatsAppUrl(selectedListing, calcWeight) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="secondary"
              className="w-full h-10 rounded-xl border-line text-brand-950 hover:bg-cream-50 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Hubungi Penyuling
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
