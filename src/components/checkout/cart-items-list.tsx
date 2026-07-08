import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem, Money } from "@/lib/contracts";

type CartItemsListProps = {
  resolvedItems: (CartItem & {
    name: string;
    imageSrc: string;
    imageAlt: string;
    wholesaleEnabled?: boolean;
    wholesaleMinQtyKg?: number;
    wholesalePricePerKg?: Money | null;
    normalPricePerKg?: Money | null;
  })[];
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
};

export function CartItemsList({ resolvedItems, updateQuantity, removeItem }: CartItemsListProps) {
  return (
    <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-line/60 pb-3">
        <ShoppingBag className="h-5 w-5 text-brand-900" />
        <h3 className="text-base font-extrabold text-brand-950">
          Keranjang Belanja
        </h3>
      </div>

      <div className="divide-y divide-line/60">
        {resolvedItems.map((item) => (
          <div key={item.id} className="py-4 flex gap-3 sm:gap-4 items-start first:pt-0 last:pb-0">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-line/40 bg-cream-100 shrink-0 mt-1">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                className="object-cover"
                fill
                sizes="64px"
              />
            </div>

            {/* Details + Controls Container */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Details */}
                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.kind === "product" ? "Produk Nilam" : "Ampas Nilam"}
                  </span>
                  <h4 className="text-sm font-bold text-brand-950 mt-1 truncate">{item.name}</h4>
                  <p className="text-xs font-extrabold text-brand-950 mt-1">
                    Rp {item.unitPrice.amount.toLocaleString("id-ID")}
                    {item.kind === "ampas-listing" && <span className="text-[10px] text-ink-600 font-semibold">/kg</span>}
                  </p>
                </div>

                {/* Controls (Qty + Remove) */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-line rounded-lg overflow-hidden h-8 bg-cream-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-brand-950 min-w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Hapus item"
                    className="p-2 text-ink-600 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Wholesale Active Banner */}
              {item.wholesaleEnabled &&
                item.wholesaleMinQtyKg &&
                item.wholesalePricePerKg &&
                item.quantity >= item.wholesaleMinQtyKg && (
                  <div className="rounded-2xl border border-emerald-250 bg-emerald-50/50 p-3 text-[11px] font-medium text-emerald-850 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Harga Grosir Diterapkan</span>
                    </div>
                    <div className="space-y-0.5 pl-3">
                      <p>
                        Menggunakan harga grosir:{" "}
                        <strong className="text-brand-950">
                          Rp {item.unitPrice.amount.toLocaleString("id-ID")}/kg
                        </strong>{" "}
                        (Harga Normal: Rp {(item.normalPricePerKg?.amount || 0).toLocaleString("id-ID")}/kg)
                      </p>
                      <p className="text-emerald-700 font-bold">
                        Total Penghematan: Rp {(((item.normalPricePerKg?.amount || 0) - item.unitPrice.amount) * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

