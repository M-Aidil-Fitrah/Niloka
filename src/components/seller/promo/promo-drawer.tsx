"use client";

import type { Promo, PromoType, PromoStatus, Product } from "@/lib/contracts";

type PromoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  activePromo: Partial<Promo> | null;
  setActivePromo: (promo: Partial<Promo> | null) => void;
  onSave: () => void;
  products: Product[];
  onGenerateCode: () => void;
  promos: Promo[];
};

export function PromoDrawer({
  isOpen,
  onClose,
  activePromo,
  setActivePromo,
  onSave,
  products,
  onGenerateCode,
  promos,
}: PromoDrawerProps) {
  if (!isOpen || !activePromo) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
        {/* Header */}
        <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
          <div>
            <h4 className="font-extrabold text-brand-950 text-base">
              {promos.some((p) => p.id === activePromo.id) ? "Edit Parameter Voucher" : "Buat Voucher Baru"}
            </h4>
            <p className="text-xs text-ink-600 mt-0.5 font-semibold">Atur skema diskon, kupon kode, serta batas penggunaan</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-ink-600 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Batal
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 flex-1 space-y-6">
          {/* Type and Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Jenis Promosi</label>
              <select
                className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.type || "percentage"}
                onChange={(e) => setActivePromo({ ...activePromo, type: e.target.value as PromoType })}
              >
                <option value="percentage">Persentase Diskon (%)</option>
                <option value="fixed-amount">Potongan Tetap Rupiah (Rp)</option>
                <option value="free-shipping">Subsidi Gratis Ongkir</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Nama Promosi</label>
              <input
                type="text"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.title || ""}
                onChange={(e) => setActivePromo({ ...activePromo, title: e.target.value })}
                placeholder="Contoh: Diskon Harbolnas 10%"
              />
            </div>
          </div>

          {/* Coupon code with random generator */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-700 block">Kode Kupon Unik</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 text-xs font-mono font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 uppercase"
                value={activePromo.code || ""}
                onChange={(e) => setActivePromo({ ...activePromo, code: e.target.value })}
                placeholder="Contoh: MERDEKANILAM"
              />
              <button
                type="button"
                onClick={onGenerateCode}
                className="bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold text-xs rounded-xl px-4 cursor-pointer transition-all"
              >
                Acak Kode
              </button>
            </div>
          </div>

          {/* Value and limits */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">
                {activePromo.type === "percentage" ? "Nilai Persen (%)" : "Jumlah Potongan (Rp)"}
              </label>
              <input
                type="number"
                disabled={activePromo.type === "free-shipping"}
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 disabled:bg-cream-50/55"
                value={activePromo.type === "free-shipping" ? "" : activePromo.value || ""}
                onChange={(e) => setActivePromo({ ...activePromo, value: Number(e.target.value) })}
                placeholder={activePromo.type === "percentage" ? "10" : "15000"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Min. Belanja (Rp)</label>
              <input
                type="number"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.minSubtotal?.amount || ""}
                onChange={(e) => setActivePromo({
                  ...activePromo,
                  minSubtotal: { amount: Number(e.target.value), currency: "IDR" }
                })}
                placeholder="50000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Limit Pakai (Kali)</label>
              <input
                type="number"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.usageLimit || ""}
                onChange={(e) => setActivePromo({ ...activePromo, usageLimit: Number(e.target.value) })}
                placeholder="100"
              />
            </div>
          </div>

          {/* Masa Berlaku Voucher */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Tanggal Mulai Berlaku</label>
              <input
                type="datetime-local"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.startsAt || ""}
                onChange={(e) => setActivePromo({ ...activePromo, startsAt: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Tanggal Kedaluwarsa</label>
              <input
                type="datetime-local"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePromo.endsAt || ""}
                onChange={(e) => setActivePromo({ ...activePromo, endsAt: e.target.value })}
              />
            </div>
          </div>

          {/* Target Cakupan Produk */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-ink-700 block">Cakupan Voucher</label>
            <select
              className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
              value={activePromo.productIds && activePromo.productIds.length > 0 ? "specific" : "all"}
              onChange={(e) => {
                if (e.target.value === "all") {
                  setActivePromo({ ...activePromo, productIds: [] });
                } else {
                  setActivePromo({ ...activePromo, productIds: [products[0]?.id || ""] });
                }
              }}
            >
              <option value="all">Semua Produk (Seluruh Toko)</option>
              <option value="specific">Hanya Produk Tertentu</option>
            </select>

            {activePromo.productIds && activePromo.productIds.length > 0 && (
              <div className="border border-line rounded-xl p-3 bg-cream-50/20 max-h-40 overflow-y-auto space-y-2">
                <span className="text-[10px] font-extrabold text-ink-600 block uppercase">Pilih Produk Yang Memenuhi Syarat:</span>
                {products.map((prod) => {
                  const isSelected = activePromo.productIds?.includes(prod.id);
                  return (
                    <label key={prod.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-800">
                      <input
                        type="checkbox"
                        className="accent-brand-900"
                        checked={isSelected}
                        onChange={() => {
                          const currentIds = [...(activePromo.productIds || [])];
                          if (isSelected) {
                            setActivePromo({
                              ...activePromo,
                              productIds: currentIds.filter((id) => id !== prod.id),
                            });
                          } else {
                            setActivePromo({
                              ...activePromo,
                              productIds: [...currentIds, prod.id],
                            });
                          }
                        }}
                      />
                      <span>{prod.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-ink-750 block border-b border-line/30 pb-1 uppercase tracking-wider">Status Voucher</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {["active", "scheduled", "disabled"].map((st) => (
                <label
                  key={st}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    activePromo.status === st
                      ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                      : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="promoStatus"
                    value={st}
                    checked={activePromo.status === st}
                    onChange={() => setActivePromo({ ...activePromo, status: st as PromoStatus })}
                    className="accent-brand-900"
                  />
                  <span className="capitalize">{st === "active" ? "Aktif" : st === "scheduled" ? "Terjadwal" : "Dinonaktifkan"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-line flex justify-end gap-3 bg-cream-50/50">
          <button
            onClick={onClose}
            className="py-2.5 px-6 border border-line text-ink-700 font-bold rounded-xl text-xs hover:bg-cream-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="py-2.5 px-6 bg-brand-900 hover:bg-brand-850 text-white-soft font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
