import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem } from "@/lib/contracts";

type CartItemsListProps = {
  resolvedItems: (CartItem & { name: string; imageSrc: string; imageAlt: string })[];
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
          <div key={item.id} className="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-line/40 bg-cream-100 shrink-0">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                className="object-cover"
                fill
                sizes="64px"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-extrabold text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                {item.kind === "product" ? "B2C Produk" : "B2B Ampas"}
              </span>
              <h4 className="text-sm font-bold text-brand-950 mt-1 truncate">{item.name}</h4>
              <p className="text-xs font-extrabold text-brand-990 mt-1">
                Rp {item.unitPrice.amount.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border border-line rounded-lg overflow-hidden h-8 bg-cream-50 shrink-0">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-3 text-xs font-bold text-brand-950 min-w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Hapus item"
              className="p-2 text-ink-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
