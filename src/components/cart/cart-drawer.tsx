"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Plus, Minus, Trash2, ShoppingBag, X, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCartItemsDetailAction } from "@/lib/actions/checkout-actions";

type CartItemDetail = {
  id: string;
  kind: "product" | "ampas-listing";
  name: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  unitPriceAmount: number;
  unitPriceCurrency: string;
  sellerName: string;
};

type GroupedItems = {
  sellerName: string;
  items: { cartItem: CartItemRaw; detail: CartItemDetail | undefined }[];
};

type CartItemRaw = {
  id: string;
  kind: "product" | "ampas-listing";
  unitPrice: { amount: number; currency: string };
  quantity: number;
};

export function CartDrawer() {
  const {
    items,
    totalCount,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    refreshCart,
  } = useCart();

  const [details, setDetails] = useState<CartItemDetail[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCartDrawerOpen || items.length === 0) return;
    let cancelled = false;
    refreshCart();
    getCartItemsDetailAction(items.map((i) => i.id))
      .then((d) => { if (!cancelled) setDetails(d); })
      .catch(() => { if (!cancelled) setDetails([]); });
    return () => { cancelled = true; };
  }, [isCartDrawerOpen, items, refreshCart]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCartDrawer();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  const detailMap = useMemo(() => {
    const map = new Map<string, CartItemDetail>();
    for (const d of details) map.set(d.id, d);
    return map;
  }, [details]);

  const groups = useMemo<GroupedItems[]>(() => {
    const groupsMap = new Map<string, { cartItem: CartItemRaw; detail: CartItemDetail | undefined }[]>();
    for (const item of items) {
      const d = detailMap.get(item.id);
      const seller = d?.sellerName || "Penjual";
      if (!groupsMap.has(seller)) groupsMap.set(seller, []);
      groupsMap.get(seller)!.push({ cartItem: item, detail: d });
    }
    return Array.from(groupsMap.entries()).map(([sellerName, sellerItems]) => ({ sellerName, items: sellerItems }));
  }, [items, detailMap]);

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  function sellerAllSelected(seller: string) {
    const sellerItemIds = groups.find((g) => g.sellerName === seller)?.items.map((i) => i.cartItem.id) || [];
    return sellerItemIds.length > 0 && sellerItemIds.every((id) => selectedIds.has(id));
  }

  const toggleSeller = useCallback((seller: string) => {
    const sellerItems = groups.find((g) => g.sellerName === seller)?.items || [];
    const allSel = sellerItems.every((i) => selectedIds.has(i.cartItem.id));
    for (const item of sellerItems) {
      if (allSel && selectedIds.has(item.cartItem.id)) toggleSelect(item.cartItem.id);
      else if (!allSel && !selectedIds.has(item.cartItem.id)) toggleSelect(item.cartItem.id);
    }
  }, [groups, selectedIds, toggleSelect]);

  const selectedSubtotal = items
    .filter((item) => selectedIds.has(item.id))
    .reduce((acc, item) => acc + item.unitPrice.amount * item.quantity, 0);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-brand-950/40 backdrop-blur-sm" onClick={closeCartDrawer} />
      <div ref={panelRef} className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-900" />
            <h2 className="text-base font-extrabold text-brand-950">Keranjang ({totalCount})</h2>
          </div>
          <button onClick={closeCartDrawer} aria-label="Tutup keranjang" className="rounded-full p-1.5 text-ink-600 hover:bg-cream-100 transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <ShoppingBag className="h-12 w-12 text-ink-600/30 mb-4" />
              <p className="text-sm font-bold text-ink-600">Keranjang belanja kosong</p>
              <p className="mt-1 text-xs text-ink-500">Tambahkan produk dari halaman produk atau bursa ampas.</p>
              <Link href="/products" onClick={closeCartDrawer} className="mt-6 h-10 rounded-xl bg-brand-900 px-5 text-xs font-bold text-white flex items-center justify-center hover:bg-brand-800 transition-colors">Mulai Belanja</Link>
            </div>
          ) : (
            <div className="divide-y divide-line/60">
              <div className="sticky top-0 z-10 bg-white px-5 py-2.5 border-b border-line/40">
                <label className="flex items-center gap-2 text-xs font-bold text-ink-600 cursor-pointer">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="h-4 w-4 rounded border-line accent-brand-900 focus:ring-gold-500" />
                  Pilih Semua
                </label>
              </div>
              {groups.map((group) => (
                <div key={group.sellerName} className="border-b border-line/60 last:border-b-0">
                  <div className="sticky top-[41px] z-10 bg-cream-50/95 backdrop-blur-sm px-5 py-2 border-b border-line/40">
                    <label className="flex items-center gap-2 text-xs font-bold text-brand-950 cursor-pointer">
                      <input type="checkbox" checked={sellerAllSelected(group.sellerName)} onChange={() => toggleSeller(group.sellerName)} className="h-4 w-4 rounded border-line accent-brand-900 focus:ring-gold-500" />
                      <Store className="h-3.5 w-3.5 text-ink-600" /> {group.sellerName}
                    </label>
                  </div>
                  {group.items.map(({ cartItem: item, detail }) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <div key={item.id} className={`flex gap-3 px-5 py-4 transition-colors ${isSelected ? "bg-brand-100/20" : ""}`}>
                        <div className="flex items-center">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="h-4 w-4 rounded border-line accent-brand-900 focus:ring-gold-500" />
                        </div>
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line/40 bg-cream-100">
                          {detail?.imageSrc ? <Image src={detail.imageSrc} alt={detail.imageAlt || "Produk"} className="object-cover" fill sizes="64px" /> : <div className="h-full w-full bg-cream-100" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-extrabold text-gold-600 uppercase tracking-wider">{item.kind === "product" ? "Produk Nilam" : "Ampas Nilam"}</span>
                          <p className="text-sm font-bold text-brand-950 truncate">{detail?.name || "Produk Nilam"}</p>
                          <p className="text-xs font-extrabold text-brand-950 mt-0.5">Rp {item.unitPrice.amount.toLocaleString("id-ID")}{item.kind === "ampas-listing" && <span className="text-[10px] text-ink-600">/kg</span>}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <div className="flex items-center border border-line rounded-lg overflow-hidden h-7 bg-cream-50">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"><Minus className="h-2.5 w-2.5" /></button>
                              <span className="px-2 text-xs font-bold text-brand-950 min-w-5 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 hover:bg-cream-100 text-xs font-bold text-brand-950 h-full flex items-center justify-center cursor-pointer"><Plus className="h-2.5 w-2.5" /></button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="p-1.5 text-ink-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" aria-label="Hapus item"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line bg-cream-50 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink-600">{selectedSubtotal > 0 ? `${selectedIds.size} barang dipilih` : "Belum ada barang dipilih"}</span>
              <span className="font-extrabold text-brand-950">Rp {selectedSubtotal.toLocaleString("id-ID")}</span>
            </div>
            <Link href={selectedIds.size > 0 ? `/checkout?selected=${Array.from(selectedIds).join(",")}` : "#"} onClick={(e) => { if (selectedIds.size === 0) e.preventDefault(); else closeCartDrawer(); }}>
              <Button className={`w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 ${selectedIds.size > 0 ? "bg-brand-950 hover:bg-brand-900 text-white cursor-pointer" : "bg-ink-600/20 text-ink-600/50 cursor-not-allowed"}`} disabled={selectedIds.size === 0}>
                Checkout ({selectedIds.size})<ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}