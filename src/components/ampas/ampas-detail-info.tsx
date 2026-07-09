"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Calendar, Truck, ShoppingCart, Send, Scale } from "lucide-react";
import { formatRupiah } from "@/lib/formatters";
import type { AmpasListing, Seller } from "@/lib/contracts";
import { useCart } from "@/context/cart-context";

type AmpasDetailInfoProps = {
  listing: AmpasListing;
  seller: Seller;
};

const usageLabels: Record<string, string> = {
  compost: "Kompos Organik",
  briquette: "Bahan Briket",
  mulch: "Mulsa Pertanian",
  "industrial-cellulose": "Selulosa Industri",
  "mushroom-media": "Media Jamur",
  "animal-feed": "Pakan Ternak",
};

export function AmpasDetailInfo({ listing, seller }: AmpasDetailInfoProps) {
  const { addItem } = useCart();
  const localListing = listing;
  const localSeller = seller;
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(
    listing.wholesaleEnabled && listing.wholesaleMinQtyKg ? listing.wholesaleMinQtyKg : 10
  );

  // Recalculate price per Kg dynamically based on quantity
  const isWholesaleApplied = !!(
    localListing.wholesaleEnabled &&
    localListing.wholesaleMinQtyKg &&
    localListing.wholesalePricePerKg &&
    quantity >= localListing.wholesaleMinQtyKg
  );

  const activeUnitPrice = isWholesaleApplied && localListing.wholesalePricePerKg
    ? localListing.wholesalePricePerKg
    : localListing.pricePerKg;

  const totalCost = activeUnitPrice.amount * quantity;

  const handleAddToCart = () => {
    addItem({
      kind: "ampas-listing",
      productId: null,
      ampasListingId: localListing.id,
      quantity,
      unitPrice: activeUnitPrice,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleQtyChange = (val: number) => {
    // Validation: must be >= 1, must not exceed stock
    const sanitizedVal = Math.max(1, Math.min(localListing.quantityKg, val));
    setQuantity(sanitizedVal);
  };

  const title = localListing.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const hasWholesale = localListing.wholesaleEnabled && localListing.wholesaleMinQtyKg && localListing.wholesalePricePerKg;


  return (
    <div className="flex flex-col space-y-6">
      {/* Badges & Meta */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
          localListing.condition === "dry"
            ? "bg-amber-50 text-amber-800 border-amber-250"
            : "bg-blue-50 text-blue-800 border-blue-200"
        }`}>
          {localListing.condition === "dry" ? "Kering (Dry Biomass)" : "Basah (Wet Compost)"}
        </span>
        <span className="text-xs text-ink-600 font-semibold flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-brand-700" />
          {localListing.location.city}, {localListing.location.province}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold leading-tight text-brand-950 font-serif-accent italic">
        {title}
      </h1>

      {/* Dynamic Price Display */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {isWholesaleApplied && localListing.wholesalePricePerKg ? (
          <>
            <span className="text-3xl font-extrabold text-brand-900">
              {formatRupiah(localListing.wholesalePricePerKg.amount)}
            </span>
            <span className="text-xs font-semibold text-ink-500 line-through">
              {formatRupiah(localListing.pricePerKg.amount)}
            </span>
            <span className="text-xs font-bold text-ink-600">/ kg</span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Harga Grosir Diterapkan
            </span>
          </>
        ) : (
          <>
            <span className="text-3xl font-extrabold text-brand-900">
              {formatRupiah(localListing.pricePerKg.amount)}
            </span>
            <span className="text-xs font-bold text-ink-600">/ kg</span>
          </>
        )}
      </div>

      {/* Wholesale Info Card */}
      {hasWholesale && localListing.wholesalePricePerKg && (
        <div className="rounded-2xl border border-amber-250 bg-amber-50/50 p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-amber-950 uppercase bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              Harga Grosir Tersedia
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-ink-800">
            <div>
              <span className="text-[9px] text-ink-600 block">Harga Normal</span>
              <span className="text-sm font-extrabold text-brand-950">
                {formatRupiah(localListing.pricePerKg.amount)}/kg
              </span>
            </div>
            <div>
              <span className="text-[9px] text-ink-600 block">Harga Grosir</span>
              <span className="text-sm font-extrabold text-amber-950">
                {formatRupiah(localListing.wholesalePricePerKg.amount)}/kg
              </span>
            </div>
            <div>
              <span className="text-[9px] text-ink-600 block">Minimal Pembelian</span>
              <span className="text-sm font-extrabold text-brand-950">
                {localListing.wholesaleMinQtyKg} kg
              </span>
            </div>
          </div>
        </div>
      )}

      <hr className="border-line" />

      {/* Detailed Specifications */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-600">Spesifikasi Batch</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-xs font-medium text-ink-750">
          <div className="flex items-center gap-2 bg-cream-50/50 p-2.5 rounded-xl border border-line/45">
            <Scale className="h-4 w-4 text-brand-900 shrink-0" />
            <span>Stok Total: <strong>{localListing.quantityKg.toLocaleString("id-ID")} kg</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-cream-50/50 p-2.5 rounded-xl border border-line/45">
            <Calendar className="h-4 w-4 text-brand-900 shrink-0" />
            <span>Distilasi: <strong>{localListing.distillationDate || "2026-07-01"}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-cream-50/50 p-2.5 rounded-xl border border-line/45">
            <Truck className="h-4 w-4 text-brand-900 shrink-0" />
            <span className="capitalize">
              Kirim: <strong>{localListing.shippingOption === "self-pickup" ? "Ambil Sendiri" : localListing.shippingOption === "cargo" ? "Kargo" : "Kargo & Mandiri"}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-1 pt-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Metode Distilasi & Catatan</span>
          <p className="text-xs text-ink-700 leading-relaxed font-semibold bg-white-soft border border-line/60 p-3.5 rounded-2xl italic">
            &ldquo;{localListing.distillationProcess}&rdquo;
          </p>
        </div>

        <div className="space-y-1.5 pt-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Potensi Pemanfaatan Ampas</span>
          <div className="flex flex-wrap gap-1.5">
            {localListing.usageTags.map((tag) => (
              <Badge key={tag} tone="brand" className="text-[10px] font-bold px-2 py-0.5">
                {usageLabels[tag] ?? tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {/* Seller Panel */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 flex justify-between items-center text-xs">
        <div>
          <span className="text-[9px] text-ink-500 block uppercase font-bold">Penjual</span>
          <span className="font-extrabold text-brand-950 text-sm block mt-0.5">{localSeller.displayName}</span>
          <span className="text-ink-600 font-semibold">{localSeller.location.city}, {localSeller.location.province}</span>
        </div>
        <span className="bg-brand-50 border border-brand-100 text-brand-950 font-bold px-2.5 py-1 rounded-lg uppercase text-[9px] tracking-wider shrink-0">
          Mitra Terverifikasi
        </span>
      </div>

      {/* Interactive Quantity Selector & Price Calculations */}
      <div className="rounded-[28px] border border-line bg-cream-50/50 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <label className="text-xs font-bold text-brand-950 block">Pilih Jumlah Pembelian (kg)</label>
          <div className="flex items-center border border-line rounded-xl overflow-hidden h-10 bg-white shadow-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => handleQtyChange(quantity - 5)}
              className="px-3 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer border-r border-line"
            >
              -5
            </button>
            <input
              type="number"
              className="w-20 text-center text-xs font-extrabold text-brand-950 outline-none h-full bg-transparent"
              value={quantity}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
            />
            <button
              onClick={() => handleQtyChange(quantity + 5)}
              className="px-3 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer border-l border-line"
            >
              +5
            </button>
          </div>
        </div>

        {/* Wholesale Alert Info */}
        {hasWholesale && isWholesaleApplied && (
          <div className="animate-in fade-in duration-200">
            <p className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 p-2.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>✓ Harga grosir diterapkan! Hemat <strong>{formatRupiah((localListing.pricePerKg.amount - (localListing.wholesalePricePerKg?.amount || 0)) * quantity)}</strong></span>
            </p>
          </div>
        )}

        {/* Calculations Display */}
        <div className="border-t border-line/45 pt-3 space-y-1.5 text-xs text-ink-700 font-semibold">
          <div className="flex justify-between items-center">
            <span>Harga Unit:</span>
            <div className="text-right">
              {isWholesaleApplied && localListing.wholesalePricePerKg ? (
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-[10px] text-ink-500 line-through font-semibold">
                    {formatRupiah(localListing.pricePerKg.amount)}
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    {formatRupiah(localListing.wholesalePricePerKg.amount)}/kg
                  </span>
                </div>
              ) : (
                <span>{formatRupiah(localListing.pricePerKg.amount)}/kg</span>
              )}
            </div>
          </div>
          {isWholesaleApplied && localListing.wholesalePricePerKg && (
            <div className="flex justify-between text-[10px] text-emerald-800 bg-emerald-50/50 border border-emerald-100 p-2 rounded-xl">
              <span>Rincian Grosir:</span>
              <span className="font-bold">Hemat {formatRupiah(localListing.pricePerKg.amount - localListing.wholesalePricePerKg.amount)}/kg</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Jumlah Pembelian:</span>
            <span>{quantity.toLocaleString("id-ID")} kg</span>
          </div>
          <div className="flex justify-between font-extrabold text-brand-950 text-sm border-t border-line/40 pt-2">
            <span>Total Harga:</span>
            <span className="text-base text-brand-900">{formatRupiah(totalCost)}</span>
          </div>
        </div>

        {/* Actions buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAddToCart}
            className={`flex-1 h-11 rounded-xl text-white-soft text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isAdded ? "bg-emerald-700 hover:bg-emerald-600" : "bg-brand-900 hover:bg-brand-850"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                Berhasil Ditambahkan!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Masukkan Keranjang
              </>
            )}
          </Button>

          <Link
            href={`/chat?sellerId=${localSeller.id}&listingId=${localListing.id}`}
            className="touch-action:manipulation flex-1 h-11 rounded-xl border border-line bg-white-soft text-brand-950 hover:bg-cream-100 text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <Send className="h-4 w-4" />
            Hubungi Penjual
          </Link>
        </div>
      </div>
    </div>
  );
}
