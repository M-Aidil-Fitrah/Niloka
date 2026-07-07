"use client";

import { ShieldAlert, CheckCircle2 } from "lucide-react";
import type { NilamPassport, Product, ProductFunction } from "@/lib/contracts";

type PassportDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  activePassport: NilamPassport | null;
  setActivePassport: (passport: NilamPassport | null) => void;
  onSave: () => void;
  products: Product[];
  onToggleAroma: (aroma: string) => void;
  onToggleFunction: (func: ProductFunction) => void;
  aromaOptions: string[];
  functionOptions: { value: ProductFunction; label: string }[];
};

export function PassportDrawer({
  isOpen,
  onClose,
  activePassport,
  setActivePassport,
  onSave,
  products,
  onToggleAroma,
  onToggleFunction,
  aromaOptions,
  functionOptions,
}: PassportDrawerProps) {
  if (!isOpen || !activePassport) return null;

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produk Nilam Premium";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
        {/* Header */}
        <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
          <div>
            <h4 className="font-extrabold text-brand-950 text-base">
              Rantai Transparansi (Nilam Passport)
            </h4>
            <p className="text-xs text-ink-600 mt-0.5 font-semibold">
              Lengkapi deklarasi kejujuran untuk produk: <strong className="text-brand-950 font-bold">{getProductName(activePassport.productId)}</strong>
            </p>
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
          {/* Origin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-700">Asal Panen / Distrik Penyulingan</label>
            <input
              type="text"
              className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
              value={activePassport.origin}
              onChange={(e) => setActivePassport({ ...activePassport, origin: e.target.value })}
              placeholder="Contoh: Desa Lhong, Kabupaten Aceh Besar"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink-700">Nomor Batch / Kode Panen</label>
              <input
                type="text"
                className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePassport.batchCode || ""}
                onChange={(e) => setActivePassport({ ...activePassport, batchCode: e.target.value })}
                placeholder="B-LH-2601"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink-700">Kelompok Tani / Mitra</label>
              <input
                type="text"
                className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePassport.farmerGroup || ""}
                onChange={(e) => setActivePassport({ ...activePassport, farmerGroup: e.target.value })}
                placeholder="Kelompok Tani..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink-700">GPS Lahan (Koordinat)</label>
              <input
                type="text"
                className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                value={activePassport.gpsCoordinates || ""}
                onChange={(e) => setActivePassport({ ...activePassport, gpsCoordinates: e.target.value })}
                placeholder="5.2144° N, 95.3129° E"
              />
            </div>
          </div>

          {/* Aroma Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-700 block">Karakter Aroma Utama</label>
            <div className="flex flex-wrap gap-2">
              {aromaOptions.map((aroma) => {
                const isSelected = activePassport.aromaProfile?.includes(aroma);
                return (
                  <button
                    key={aroma}
                    type="button"
                    onClick={() => onToggleAroma(aroma)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-900 text-white-soft border-brand-950"
                        : "bg-cream-55 border-line text-ink-705 hover:bg-cream-100"
                    }`}
                  >
                    {aroma}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Function Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-700 block">Fungsi Terkait</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {functionOptions.map((opt) => {
                const isSelected = activePassport.functions?.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onToggleFunction(opt.value)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                        : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-brand-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usage Instruction */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-700">Cara Penggunaan Aman</label>
            <textarea
              rows={3}
              className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed text-ink-900"
              value={activePassport.usage}
              onChange={(e) => setActivePassport({ ...activePassport, usage: e.target.value })}
              placeholder="Instruksi takaran penggunaan atau saran pengenceran..."
            />
          </div>

          {/* Safety Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-750 flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
              Catatan Keamanan & Kontraindikasi
            </label>
            <textarea
              rows={3}
              className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed text-ink-900"
              value={activePassport.safetyNotes}
              onChange={(e) => setActivePassport({ ...activePassport, safetyNotes: e.target.value })}
              placeholder="Informasi kerentanan alergi kulit, saran tidak ditelan, atau anak-anak..."
            />
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
            Simpan & Ajukan Review
          </button>
        </div>
      </div>
    </div>
  );
}
