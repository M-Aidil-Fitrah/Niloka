"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Product, Bundle, Seller } from "@/lib/contracts";
import { PriceDisplay } from "@/components/ui/price-display";

type BundleShellProps = {
  products: Product[];
  bundles: Bundle[];
  sellers: Seller[];
};

export function BundleShell({ products, bundles, sellers }: BundleShellProps) {
  const { addItem } = useCart();

  // Active Builder States
  const [bundleType, setBundleType] = useState<"single-seller" | "cross-seller">("single-seller");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Helper: Get seller by ID
  const getSellerName = (sellerId: string) => {
    const s = sellers.find((item) => item.id === sellerId);
    return s ? s.displayName : "Toko Lokal";
  };

  // Find first selected product's seller to enforce "Single Seller"
  const activeSellerId = (() => {
    if (selectedProductIds.length === 0) return null;
    const firstProd = products.find((p) => p.id === selectedProductIds[0]);
    return firstProd ? firstProd.sellerId : null;
  })();

  // Filter products based on active seller if "single-seller" is selected
  const isProductSelectable = (product: Product) => {
    if (bundleType === "cross-seller") return true;
    if (!activeSellerId) return true;
    return product.sellerId === activeSellerId;
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Pre-configured bundle submission
  const handleAddPreconfiguredBundle = (bundle: Bundle) => {
    bundle.productIds.forEach((prodId) => {
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        // Pre-configured bundles are discount priced. Let's calculate proportional prices or add directly
        const bundlePriceFraction = bundle.price.amount / bundle.productIds.reduce((sum, id) => {
          const p = products.find((x) => x.id === id);
          return sum + (p ? p.price.amount : 0);
        }, 0);

        addItem({
          kind: "product",
          productId: prod.id,
          ampasListingId: null,
          quantity: 1,
          unitPrice: {
            amount: Math.round(prod.price.amount * bundlePriceFraction),
            currency: "IDR",
          },
        });
      }
    });

    setSuccessMessage(`Berhasil menambahkan paket "${bundle.title}" ke keranjang!`);
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  // Custom built bundle calculations
  const builderSelectedProducts = products.filter((p) => selectedProductIds.includes(p.id));
  const builderSubtotal = builderSelectedProducts.reduce((sum, p) => sum + p.price.amount, 0);
  const builderDiscount = Math.round(builderSubtotal * 0.15); // 15% discount for builder bundles
  const builderTotal = Math.max(0, builderSubtotal - builderDiscount);

  const handleAddCustomBundle = () => {
    if (selectedProductIds.length < 2) return;

    builderSelectedProducts.forEach((prod) => {
      addItem({
        kind: "product",
        productId: prod.id,
        ampasListingId: null,
        quantity: 1,
        unitPrice: {
          amount: Math.round(prod.price.amount * 0.85), // 15% discount applied per item
          currency: "IDR",
        },
      });
    });

    setSuccessMessage(`Paket Rakitan Anda berhasil dibuat dan dimasukkan ke keranjang dengan diskon 15%!`);
    setSelectedProductIds([]);
    setTimeout(() => setSuccessMessage(""), 3500);
  };

  // Switch builder type handler
  const handleTypeChange = (type: "single-seller" | "cross-seller") => {
    setBundleType(type);
    setSelectedProductIds([]); // Clear selection when switching modes
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      {/* Banner / Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-600 bg-gold-100/30 px-3 py-1 rounded-full border border-gold-200/50">
          Penawaran Spesial & Kustomisasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-950 font-serif-accent italic leading-tight">
          Bursa Paket Atsiri NILOKA
        </h1>
        <p className="text-sm text-ink-600 leading-relaxed">
          Temukan paket kurasi dari toko atsiri terpercaya atau rakit sendiri kombinasi minyak atsiri pilihan Anda untuk mendapatkan diskon langsung 15%!
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="max-w-xl mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-xs font-bold text-emerald-800 shadow-md animate-in slide-in-from-top-4 duration-300 flex items-center justify-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* SECTION 1: Pre-configured Bundles */}
      <div className="space-y-6">
        <div className="border-b border-line/60 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-950">Paket Rekomendasi NILOKA</h2>
            <p className="text-xs text-ink-600">Kurasi terbaik dari toko atsiri lokal dengan harga promo terjangkau</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const bundleProducts = products.filter((p) => bundle.productIds.includes(p.id));
            const originalSum = bundleProducts.reduce((sum, p) => sum + p.price.amount, 0);
            const savings = originalSum - bundle.price.amount;

            return (
              <div
                key={bundle.id}
                className="rounded-3xl border border-line bg-white-soft p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gold-600 bg-gold-100/40 px-2 py-0.5 rounded-lg border border-gold-200/40">
                        {bundle.type === "single-seller" ? "Satu Toko" : "Lintas Toko"}
                      </span>
                      <h3 className="text-base font-extrabold text-brand-950 mt-1">{bundle.title}</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] text-ink-600 line-through block">
                        <PriceDisplay amount={originalSum} showTooltip={false} />
                      </span>
                      <span className="text-sm font-extrabold text-brand-950 block">
                        <PriceDisplay amount={bundle.price.amount} />
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-600 leading-normal">{bundle.description}</p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-bold text-ink-600 uppercase tracking-widest block">Isi Paket:</span>
                    <div className="grid gap-2">
                      {bundleProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-line/40">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-line/30 bg-cream-50 shrink-0">
                            <Image src={p.image.src} alt={p.image.alt} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-brand-950 block truncate">{p.name}</span>
                            <span className="text-[9px] font-bold text-ink-600 block">{getSellerName(p.sellerId)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-line/60 mt-4 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/40 px-2 py-1 rounded-lg flex items-center gap-0.5">
                    Hemat <PriceDisplay amount={savings} showTooltip={false} className="border-none p-0 inline font-extrabold text-emerald-705" />
                  </span>
                  <button
                    onClick={() => handleAddPreconfiguredBundle(bundle)}
                    className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-850 text-white-soft text-xs font-bold transition-colors"
                  >
                    Beli Paket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Custom Interactive Bundle Builder */}
      <div className="rounded-[36px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line/60 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-brand-955">
              🛠️ NILOKA Atsiri Bundle Builder
            </h2>
            <p className="text-xs text-ink-600 mt-0.5">
              Pilih dan rakit sendiri minyak atsiri impian Anda, dapatkan diskon langsung sebesar 15%!
            </p>
          </div>

          {/* Builder Type Selector */}
          <div className="flex bg-cream-100 p-1.5 rounded-2xl border border-line">
            <button
              onClick={() => handleTypeChange("single-seller")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                bundleType === "single-seller"
                  ? "bg-brand-950 text-white-soft shadow-sm"
                  : "text-brand-950 hover:bg-cream-200/50"
              }`}
            >
              Satu Toko
            </button>
            <button
              onClick={() => handleTypeChange("cross-seller")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                bundleType === "cross-seller"
                  ? "bg-brand-950 text-white-soft shadow-sm"
                  : "text-brand-950 hover:bg-cream-200/50"
              }`}
            >
              Lintas Toko
            </button>
          </div>
        </div>

        {/* Builder Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          {/* Products List */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-ink-600 uppercase tracking-widest block">
              Pilih Produk untuk Dirakit (Minimal 2 Produk):
            </span>

            {bundleType === "single-seller" && activeSellerId && (
              <div className="bg-cream-50 border border-line/70 rounded-xl p-3 text-[11px] text-brand-950 font-bold flex items-center justify-between">
                <span>
                  📍 Membatasi produk hanya dari toko:{" "}
                  <span className="text-brand-850 underline">
                    {getSellerName(activeSellerId)}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="text-[10px] text-red-600 hover:text-red-500 font-extrabold uppercase ml-2"
                >
                  Reset
                </button>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                const isSelectable = isProductSelectable(product);

                return (
                  <button
                    key={product.id}
                    disabled={!isSelectable && !isSelected}
                    onClick={() => handleProductToggle(product.id)}
                    className={`text-left rounded-2xl border p-4 flex gap-4 transition-all relative overflow-hidden ${
                      isSelected
                        ? "border-brand-950 bg-cream-50 shadow-sm"
                        : isSelectable
                        ? "border-line bg-white hover:border-brand-600"
                        : "border-line/40 bg-cream-50/30 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {/* Checkbox circle indicator */}
                    <div className="absolute top-3 right-3 h-4.5 w-4.5 rounded-full border border-line/80 flex items-center justify-center bg-white">
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-brand-900" />
                      )}
                    </div>

                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-line/30 shrink-0 bg-cream-100">
                      <Image src={product.image.src} alt={product.image.alt} fill className="object-cover" sizes="64px" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-[9px] font-bold text-ink-600 uppercase tracking-wider block">
                        {getSellerName(product.sellerId)}
                      </span>
                      <h4 className="text-sm font-bold text-brand-955 mt-0.5 truncate">{product.name}</h4>
                      <span className="text-xs font-extrabold text-brand-900 block mt-1">
                        <PriceDisplay amount={product.price.amount} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Builder Sidebar calculation summary */}
          <aside className="rounded-[28px] border border-line bg-white p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-brand-950">Rakitan Paket Anda</h3>

            {builderSelectedProducts.length > 0 ? (
              <div className="space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-line/40">
                  {builderSelectedProducts.map((p) => (
                    <div key={p.id} className="pt-2 first:pt-0 flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-brand-950 truncate max-w-44">{p.name}</span>
                      <span className="font-bold text-brand-900 shrink-0 ml-2"><PriceDisplay amount={p.price.amount} showTooltip={false} /></span>
                    </div>
                  ))}
                </div>

                <hr className="border-line/60" />

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-ink-600">
                    <span>Subtotal Rakitan:</span>
                    <span className="font-semibold text-brand-950"><PriceDisplay amount={builderSubtotal} showTooltip={false} /></span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700 font-bold">
                    <span>Hemat Paket (15%):</span>
                    <span className="flex items-center">-<PriceDisplay amount={builderDiscount} showTooltip={false} /></span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-line/60">
                    <span className="font-bold text-brand-950">Harga Paket:</span>
                    <span className="text-sm font-extrabold text-brand-950"><PriceDisplay amount={builderTotal} /></span>
                  </div>
                </div>

                <Button
                  disabled={selectedProductIds.length < 2}
                  onClick={handleAddCustomBundle}
                  className={`w-full h-10 rounded-xl text-white-soft text-xs font-bold shadow-sm transition-colors mt-2 ${
                    selectedProductIds.length >= 2
                      ? "bg-brand-950 hover:bg-brand-900 cursor-pointer"
                      : "bg-ink-600/30 cursor-not-allowed text-ink-600/50"
                  }`}
                >
                  Masukkan Paket Rakitan
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center text-ink-600 space-y-1 bg-cream-50/20 rounded-2xl border border-dashed border-line/70">
                <p className="text-xs font-bold">Belum ada produk dirakit.</p>
                <p className="text-[10px] leading-normal px-4">
                  Pilih minimal 2 produk di sebelah kiri untuk melihat rincian harga paket diskon.
                </p>
              </div>
            )}

            {selectedProductIds.length === 1 && (
              <p className="text-[10px] text-gold-600 font-bold text-center leading-normal animate-pulse">
                * Tambah 1 produk lagi untuk mengaktifkan promo diskon paket rakitan 15%.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
