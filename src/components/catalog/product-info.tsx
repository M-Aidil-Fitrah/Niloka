"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Ticket, Copy, Check } from "lucide-react";
import { formatRupiah } from "@/lib/formatters";
import { MapPinIcon, StarIcon } from "@/components/ui/icons";
import type { Product, Seller, Promo } from "@/lib/contracts";
import { useCart } from "@/context/cart-context";

type ProductInfoProps = {
  product: Product;
  seller: Seller;
  promos?: Promo[];
};

const tagLabels: Record<string, string> = {
  "best-seller": "Best Seller",
  "new-arrival": "Baru",
  "nilam-passport": "Passport Terverifikasi",
  "aroma-calm": "Aroma Calm",
  "limited-batch": "Limited Batch",
};

export function ProductInfo({ product, seller, promos = [] }: ProductInfoProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleAddToCart = () => {
    addItem({
      kind: "product",
      productId: product.id,
      ampasListingId: null,
      quantity: 1,
      unitPrice: product.price,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Badges */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} tone={tag === "best-seller" ? "gold" : "brand"}>
              {tagLabels[tag] ?? tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-3 text-2xl font-bold text-brand-900">
        {formatRupiah(product.price.amount)}
      </p>

      <hr className="my-6 border-line" />

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-600">
          Deskripsi Produk
        </h2>
        <p className="text-base leading-relaxed text-ink-800">
          {product.shortDescription}
        </p>
        <p className="text-sm leading-relaxed text-ink-600">
          Setiap tetes minyak atsiri dan produk turunan nilam kami melalui proses seleksi ketat untuk menjamin keaslian wewangian khas nilam Aceh yang kaya, tahan lama, dan menenangkan. Cocok sebagai bagian dari ritual kebersihan, perawatan diri, maupun sebagai pengharum ruangan.
        </p>
      </div>

      <hr className="my-6 border-line" />

      {/* Seller Panel */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-brand-950">Penjual</h3>
            <p className="mt-1 text-base font-bold text-brand-900">
              {seller.displayName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-3.5 w-3.5 text-brand-700" />
                {seller.location.city}, {seller.location.province}
              </span>
              <span className="capitalize">Tipe: {seller.type}</span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="flex items-center gap-1 text-sm font-bold text-brand-950">
              <StarIcon className="h-4 w-4 text-gold-500" />
              {seller.ratingAverage.toFixed(1)}
            </span>
            <span className="mt-1 text-[11px] text-ink-600">
              {seller.totalReviews} Ulasan
            </span>
          </div>
        </div>
      </div>

      {/* Vouchers section */}
      {promos.length > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-cream-50/50 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-brand-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-950">
              Voucher Toko Tersedia
            </h3>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="flex items-center justify-between bg-white-soft border border-line/60 rounded-xl p-3 shadow-sm"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-extrabold text-brand-900 bg-brand-100/50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {promo.code}
                  </span>
                  <span className="text-[10px] text-ink-700 block pt-1 font-bold">
                    {promo.type === "percentage"
                      ? `Diskon ${promo.value}%`
                      : promo.type === "fixed-amount"
                      ? `Potongan ${formatRupiah(promo.value)}`
                      : "Gratis Ongkir"}
                  </span>
                  <span className="text-[8.5px] text-ink-600 block leading-tight">
                    Min. Belanja {formatRupiah(promo.minSubtotal.amount)}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="flex items-center justify-center h-8 px-2.5 rounded-lg border border-line text-xs font-bold text-ink-700 hover:bg-cream-50 hover:text-brand-950 transition-all cursor-pointer shrink-0"
                >
                  {copiedCode === promo.code ? (
                    <span className="flex items-center gap-1 text-[10px] text-brand-900 font-bold">
                      <Check className="h-3 w-3" />
                      Tersalin
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold">
                      <Copy className="h-3 w-3" />
                      Salin
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row relative">
        <Button
          className={`flex-1 transition-all duration-300 ${
            isAdded ? "bg-emerald-700 hover:bg-emerald-600" : ""
          }`}
          size="md"
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              Berhasil Ditambahkan!
            </span>
          ) : (
            "Masukkan Keranjang"
          )}
        </Button>
        <a
          href={`https://wa.me/6281234567890?text=Halo%20${encodeURIComponent(
            seller.displayName
          )},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
            product.name
          )}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" className="w-full" size="md">
            Hubungi Penjual
          </Button>
        </a>
      </div>
    </div>
  );
}
