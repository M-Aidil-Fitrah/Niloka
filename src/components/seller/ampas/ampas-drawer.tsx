"use client";

import { ShieldCheck } from "lucide-react";
import type { AmpasListing, AmpasCondition, AmpasUsageTag } from "@/lib/contracts";

type AmpasDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  activeListing: Partial<AmpasListing> | null;
  setActiveListing: (listing: Partial<AmpasListing> | null) => void;
  onSave: () => void;
  onToggleTag: (tag: AmpasUsageTag) => void;
  listings: AmpasListing[];
  usageTagOptions: { value: AmpasUsageTag; label: string }[];
};

export function AmpasDrawer({
  isOpen,
  onClose,
  activeListing,
  setActiveListing,
  onSave,
  onToggleTag,
  listings,
  usageTagOptions,
}: AmpasDrawerProps) {
  if (!isOpen || !activeListing) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
        {/* Header */}
        <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
          <div>
            <h4 className="font-extrabold text-brand-950 text-base">
              {listings.some((l) => l.id === activeListing.id) ? "Edit Listing Ampas" : "Tambah Listing Ampas"}
            </h4>
            <p className="text-xs text-ink-600 mt-0.5 font-semibold">Lengkapi spesifikasi residu nilam untuk pencarian industri</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-ink-600 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Batal
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex-1 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Kondisi Ampas</label>
              <select
                className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.condition || "dry"}
                onChange={(e) => setActiveListing({ ...activeListing, condition: e.target.value as AmpasCondition })}
              >
                <option value="dry">Kering (Kadar Air Rendah)</option>
                <option value="wet">Basah (Segar Setelah Suling)</option>
                <option value="mixed">Campuran / Semi-Kering</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Kuantitas Total / Stok (Kg)</label>
              <input
                type="number"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.quantityKg || ""}
                onChange={(e) => setActiveListing({ ...activeListing, quantityKg: Number(e.target.value) })}
                placeholder="Contoh: 500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Harga per Kg (Rp)</label>
              <input
                type="number"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.pricePerKg?.amount || ""}
                onChange={(e) => setActiveListing({
                  ...activeListing,
                  pricePerKg: { amount: Number(e.target.value), currency: "IDR" }
                })}
                placeholder="Contoh: 4500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Kota Lokasi Suling</label>
              <input
                type="text"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.location?.city || ""}
                onChange={(e) => setActiveListing({
                  ...activeListing,
                  location: {
                    province: "Aceh",
                    city: e.target.value,
                    district: activeListing.location?.district || ""
                  }
                })}
                placeholder="Contoh: Takengon"
              />
            </div>
          </div>

          {/* Wholesale Pricing Option */}
          <div className="space-y-4 rounded-2xl border border-line bg-cream-50/30 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-brand-950">Aktifkan Harga Grosir</label>
                <p className="text-[10px] text-ink-600 font-medium">Berikan potongan harga untuk pembelian jumlah besar</p>
              </div>
              <input
                type="checkbox"
                checked={activeListing.wholesaleEnabled || false}
                onChange={(e) => setActiveListing({ ...activeListing, wholesaleEnabled: e.target.checked })}
                className="h-4.5 w-9 rounded-full appearance-none bg-ink-600/20 checked:bg-brand-900 transition-colors relative cursor-pointer before:content-[''] before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-white-soft before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-transform"
              />
            </div>

            {activeListing.wholesaleEnabled && (
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-line/45 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Minimal Pembelian (kg)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.wholesaleMinQtyKg || ""}
                    onChange={(e) => setActiveListing({ ...activeListing, wholesaleMinQtyKg: Number(e.target.value) })}
                    placeholder="Contoh: 25"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Harga Grosir per kg (Rp)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.wholesalePricePerKg?.amount || ""}
                    onChange={(e) => setActiveListing({
                      ...activeListing,
                      wholesalePricePerKg: { amount: Number(e.target.value), currency: "IDR" }
                    })}
                    placeholder="Contoh: 1500"
                  />
                </div>
              </div>
            )}

            {/* Simple Preview Section */}
            {activeListing.wholesaleEnabled && activeListing.wholesaleMinQtyKg && activeListing.wholesalePricePerKg?.amount ? (
              <div className="mt-3 p-3 bg-white-soft rounded-xl border border-line/60 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-brand-900 block uppercase tracking-wider">Preview Tampilan Pembeli</span>
                <div className="grid grid-cols-3 gap-2 text-center text-ink-700 font-semibold border-t border-line/40 pt-2">
                  <div>
                    <span className="text-[9px] text-ink-500 block">Harga Normal</span>
                    <span className="text-[11px] font-bold text-brand-950">Rp {(activeListing.pricePerKg?.amount || 0).toLocaleString("id-ID")}/kg</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-500 block">Harga Grosir</span>
                    <span className="text-[11px] font-bold text-brand-950">Rp {activeListing.wholesalePricePerKg.amount.toLocaleString("id-ID")}/kg</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-500 block">Minimal Pembelian</span>
                    <span className="text-[11px] font-bold text-brand-950">{activeListing.wholesaleMinQtyKg} kg</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Tanggal Selesai Distilasi</label>
              <input
                type="date"
                className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.distillationDate || ""}
                onChange={(e) => setActiveListing({ ...activeListing, distillationDate: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-700">Opsi Pengiriman</label>
              <select
                className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activeListing.shippingOption || "both"}
                onChange={(e) => setActiveListing({ ...activeListing, shippingOption: e.target.value as "self-pickup" | "cargo" | "both" })}
              >
                <option value="self-pickup">Ambil Mandiri (Self-Pickup)</option>
                <option value="cargo">Kargo Logistik</option>
                <option value="both">Kargo & Ambil Mandiri</option>
              </select>
            </div>
          </div>

          {/* Usage Potentials Checkbox Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-700 block">Potensi Pemanfaatan Terkait</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {usageTagOptions.map((opt) => {
                const isChecked = activeListing.usageTags?.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onToggleTag(opt.value)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      isChecked
                        ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                        : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isChecked && <ShieldCheck className="h-4 w-4 text-brand-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distillation Process */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-700">Proses Penyulingan & Catatan Seller</label>
            <textarea
              rows={4}
              className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed text-ink-900"
              value={activeListing.distillationProcess || ""}
              onChange={(e) => setActiveListing({ ...activeListing, distillationProcess: e.target.value })}
              placeholder="Deskripsikan proses suling, jenis ketel (stainless/tembaga), serta kondisi kebersihan residu."
            />
          </div>

          {/* Status */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-ink-750 block border-b border-line/30 pb-1 uppercase tracking-wider">Status Listing</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-850">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={activeListing.status === "active"}
                  onChange={() => setActiveListing({ ...activeListing, status: "active" })}
                  className="accent-brand-900"
                />
                Aktif / Terlihat di Katalog
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-850">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={activeListing.status === "draft"}
                  onChange={() => setActiveListing({ ...activeListing, status: "draft" })}
                  className="accent-brand-900"
                />
                Draf internal
              </label>
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
