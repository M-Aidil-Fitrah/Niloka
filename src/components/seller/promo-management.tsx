"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, Ticket, Trash2 } from "lucide-react";
import type { Product, Promo, PromoStatus, PromoType } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/formatters";

type PromoManagementProps = {
  sellerProducts: Product[];
  initialPromos: Promo[];
};

type PromoDraft = {
  title: string;
  code: string;
  type: PromoType;
  value: number;
  minSubtotal: number;
  scope: "all-products" | "selected-products";
  productId: string;
};

function getPromoStatus(promo: Promo): PromoStatus {
  const now = new Date();

  if (promo.status === "disabled") {
    return "disabled";
  }
  if (now < new Date(promo.startsAt)) {
    return "scheduled";
  }
  if (now > new Date(promo.endsAt)) {
    return "expired";
  }

  return "active";
}

function getStatusLabel(status: PromoStatus): string {
  switch (status) {
    case "active":
      return "Aktif";
    case "scheduled":
      return "Terjadwal";
    case "expired":
      return "Berakhir";
    case "disabled":
      return "Nonaktif";
  }
}

function getPromoValueLabel(promo: Promo): string {
  switch (promo.type) {
    case "percentage":
      return `${promo.value}%`;
    case "fixed-amount":
      return formatRupiah(promo.value);
    case "free-shipping":
      return "Gratis ongkir";
  }
}

const initialDraft: PromoDraft = {
  title: "Promo Produk Nilam",
  code: "NILOKA20",
  type: "percentage",
  value: 10,
  minSubtotal: 75000,
  scope: "all-products",
  productId: "",
};

export function PromoManagement({ sellerProducts, initialPromos }: PromoManagementProps) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [draft, setDraft] = useState<PromoDraft>(initialDraft);

  const previewSubtotal = useMemo(
    () => sellerProducts.slice(0, 2).reduce((total, product) => total + product.price.amount, 0),
    [sellerProducts],
  );
  const previewDiscount = useMemo(() => {
    if (draft.type === "percentage") {
      return Math.round(previewSubtotal * (draft.value / 100));
    }
    if (draft.type === "fixed-amount") {
      return Math.min(draft.value, previewSubtotal);
    }
    return 15000;
  }, [draft.type, draft.value, previewSubtotal]);

  function handleCreatePromo() {
    const selectedProducts =
      draft.scope === "all-products"
        ? sellerProducts.map((product) => product.id)
        : [draft.productId].filter((productId) => productId.length > 0);

    if (!draft.title.trim() || !draft.code.trim() || selectedProducts.length === 0) {
      return;
    }

    const newPromo: Promo = {
      id: `promo-local-${Date.now()}`,
      sellerId: sellerProducts[0]?.sellerId ?? "seller-aceh-aroma",
      title: draft.title,
      code: draft.code.trim().toUpperCase(),
      status: "active",
      type: draft.type,
      value: draft.value,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      minSubtotal: {
        amount: draft.minSubtotal,
        currency: "IDR",
      },
      usageLimit: 100,
      usedCount: 0,
      productIds: selectedProducts,
    };

    setPromos((current) => [newPromo, ...current]);
    setDraft(initialDraft);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Promo Toko</h3>
          <p className="mt-0.5 text-xs text-ink-600">
            Kelola voucher seller untuk produk NILOKA yang eligible.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-white-soft shadow-sm">
          <div className="border-b border-line/60 px-5 py-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
              Daftar Promo
            </h4>
          </div>
          <div className="divide-y divide-line/50">
            {promos.map((promo) => {
              const status = getPromoStatus(promo);

              return (
                <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center" key={promo.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-950 px-2.5 py-1 text-[10px] font-extrabold text-white-soft">
                        {promo.code}
                      </span>
                      <span className="rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[10px] font-bold text-ink-700">
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h5 className="mt-3 text-sm font-extrabold text-brand-950">
                      {promo.title}
                    </h5>
                    <p className="mt-1 text-xs text-ink-600">
                      {promo.productIds.length} produk eligible · minimal{" "}
                      {formatRupiah(promo.minSubtotal.amount)}
                    </p>
                  </div>
                  <div className="text-sm font-extrabold text-brand-950">
                    {getPromoValueLabel(promo)}
                  </div>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setPromos((current) => current.filter((item) => item.id !== promo.id))}
                    type="button"
                    aria-label={`Hapus promo ${promo.code}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-line bg-white-soft p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-xl bg-cream-100 p-2 text-brand-950">
              <Ticket className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
              Buat Promo Mock
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <input
              className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Judul promo"
              value={draft.title}
            />
            <input
              className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-mono font-semibold uppercase outline-none focus:border-brand-700"
              onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))}
              placeholder="Kode promo"
              value={draft.code}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-10 rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    type: event.target.value === "fixed-amount" ? "fixed-amount" : event.target.value === "free-shipping" ? "free-shipping" : "percentage",
                  }))
                }
                value={draft.type}
              >
                <option value="percentage">Persen</option>
                <option value="fixed-amount">Nominal</option>
                <option value="free-shipping">Ongkir</option>
              </select>
              <input
                className="h-10 rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
                min={0}
                onChange={(event) => setDraft((current) => ({ ...current, value: Number(event.target.value) }))}
                type="number"
                value={draft.value}
              />
            </div>
            <input
              className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
              min={0}
              onChange={(event) => setDraft((current) => ({ ...current, minSubtotal: Number(event.target.value) }))}
              placeholder="Minimal subtotal"
              type="number"
              value={draft.minSubtotal}
            />
            <select
              className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  scope: event.target.value === "selected-products" ? "selected-products" : "all-products",
                }))
              }
              value={draft.scope}
            >
              <option value="all-products">Semua produk seller</option>
              <option value="selected-products">Produk tertentu</option>
            </select>
            {draft.scope === "selected-products" && (
              <select
                className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold outline-none focus:border-brand-700"
                onChange={(event) => setDraft((current) => ({ ...current, productId: event.target.value }))}
                value={draft.productId}
              >
                <option value="">Pilih produk</option>
                {sellerProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            )}

            <div className="rounded-xl border border-line bg-cream-50 p-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-600">
                <CalendarDays className="h-3.5 w-3.5" />
                Preview dampak
              </div>
              <p className="mt-2 text-sm font-extrabold text-brand-950">
                -{formatRupiah(previewDiscount)}
              </p>
              <p className="mt-1 text-[11px] leading-5 text-ink-600">
                Berdasarkan contoh subtotal {formatRupiah(previewSubtotal)} dari produk seller.
              </p>
            </div>

            <Button className="w-full rounded-xl" onClick={handleCreatePromo}>
              <Plus className="h-4 w-4" />
              Simpan Promo Mock
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
