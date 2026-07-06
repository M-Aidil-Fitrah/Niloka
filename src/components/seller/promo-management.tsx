"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, Ticket, Trash2, Tag, Copy, Check } from "lucide-react";
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

function getStatusBadgeClass(status: PromoStatus): string {
  switch (status) {
    case "active":
      return "bg-brand-100 border-brand-200 text-brand-900";
    case "scheduled":
      return "bg-gold-100 border-gold-500/20 text-gold-600";
    case "expired":
      return "bg-red-50 border-red-200 text-red-800";
    case "disabled":
      return "bg-cream-100 border-line text-ink-600";
  }
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
      return `${promo.value}% OFF`;
    case "fixed-amount":
      return `${formatRupiah(promo.value)} OFF`;
    case "free-shipping":
      return "Gratis Ongkir";
  }
}

const initialDraft: PromoDraft = {
  title: "Promo Atsiri Spesial",
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
    [sellerProducts]
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Promo Toko</h3>
          <p className="mt-0.5 text-xs text-ink-600">
            Kelola kupon diskon dan voucher sirkular khusus untuk produk Anda.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px] items-start">
        {/* Left Side: Promos List */}
        <div className="rounded-[24px] border border-line/60 bg-white-soft shadow-sm overflow-hidden">
          <div className="border-b border-line/60 px-5 py-4.5 bg-cream-50/20">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
              Daftar Promo Aktif
            </h4>
          </div>
          <div className="divide-y divide-line/30">
            {promos.length === 0 ? (
              <div className="p-8 text-center text-ink-600 text-xs flex flex-col items-center gap-2">
                <Tag className="h-6 w-6 text-ink-600/40" />
                <span>Belum ada promo yang aktif. Buat promo baru menggunakan panel di sebelah kanan.</span>
              </div>
            ) : (
              promos.map((promo) => {
                const status = getPromoStatus(promo);

                return (
                  <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center hover:bg-cream-50/10 transition-colors" key={promo.id}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-brand-950 px-2.5 py-0.5 text-[10px] font-extrabold font-mono text-white-soft tracking-wider">
                          {promo.code}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${getStatusBadgeClass(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                      <h5 className="mt-2.5 text-xs font-extrabold text-brand-950">
                        {promo.title}
                      </h5>
                      <p className="mt-1 text-[10px] text-ink-600">
                        {promo.productIds.length} produk terpilih · Minimal belanja {formatRupiah(promo.minSubtotal.amount)}
                      </p>
                    </div>
                    <div className="text-xs font-extrabold text-brand-950 bg-cream-50 border border-line px-3 py-1.5 rounded-xl font-mono shrink-0">
                      {getPromoValueLabel(promo)}
                    </div>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      onClick={() => setPromos((current) => current.filter((item) => item.id !== promo.id))}
                      type="button"
                      aria-label={`Hapus promo ${promo.code}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Create Promo Box */}
        <aside className="rounded-[24px] border border-line bg-white-soft p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-cream-100 p-2 text-brand-950">
              <Ticket className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
              Buat Voucher Baru
            </h4>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Judul Promo</label>
              <input
                className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700"
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="Contoh: Diskon Atsiri Spesial"
                value={draft.title}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kode Voucher</label>
              <input
                className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-mono font-semibold uppercase text-brand-950 outline-none focus:border-brand-700 tracking-wider"
                onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))}
                placeholder="Contoh: ATSIRI10"
                value={draft.code}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Tipe Diskon</label>
                <select
                  className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700 cursor-pointer"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      type: event.target.value === "fixed-amount" ? "fixed-amount" : event.target.value === "free-shipping" ? "free-shipping" : "percentage",
                    }))
                  }
                  value={draft.type}
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed-amount">Nominal Rupiah</option>
                  <option value="free-shipping">Gratis Ongkir</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Nilai Potongan</label>
                <input
                  className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700"
                  min={0}
                  onChange={(event) => setDraft((current) => ({ ...current, value: Number(event.target.value) }))}
                  type="number"
                  value={draft.value}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Minimal Belanja (Rp)</label>
              <input
                className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700"
                min={0}
                onChange={(event) => setDraft((current) => ({ ...current, minSubtotal: Number(event.target.value) }))}
                placeholder="Minimal subtotal"
                type="number"
                value={draft.minSubtotal}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Cakupan Produk</label>
              <select
                className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700 cursor-pointer"
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
            </div>

            {draft.scope === "selected-products" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Pilih Produk Eligible</label>
                <select
                  className="h-10 w-full rounded-xl border border-line bg-cream-50 px-3 font-semibold text-brand-950 outline-none focus:border-brand-700 cursor-pointer"
                  onChange={(event) => setDraft((current) => ({ ...current, productId: event.target.value }))}
                  value={draft.productId}
                >
                  <option value="">Pilih produk...</option>
                  {sellerProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Impact Preview */}
            <div className="rounded-xl border border-line/60 bg-cream-50/50 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-ink-600">
                <CalendarDays className="h-3.5 w-3.5" />
                Estimasi Dampak Diskon
              </div>
              <p className="text-base font-black text-brand-950">
                -{formatRupiah(previewDiscount)}
              </p>
              <p className="text-[10px] leading-relaxed text-ink-600">
                Simulasi potongan belanja pada keranjang retail senilai {formatRupiah(previewSubtotal)}.
              </p>
            </div>

            <Button
              className="w-full h-10 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
              onClick={handleCreatePromo}
            >
              <Plus className="h-4 w-4" />
              Aktifkan Voucher
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
