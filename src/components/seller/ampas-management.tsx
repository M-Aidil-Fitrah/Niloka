import { useState } from "react";
import { formatRupiah } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Plus, X, Recycle, Leaf, Trash2 } from "lucide-react";
import type { AmpasListing } from "@/lib/contracts";

type AmpasManagementProps = {
  sellerAmpas: AmpasListing[];
  onAddAmpas: (amp: { quantityKg: number; pricePerKg: number; condition: "dry" | "wet" }) => void;
};

export function AmpasManagement({ sellerAmpas, onAddAmpas }: AmpasManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(1500);
  const [condition, setCondition] = useState<"dry" | "wet">("dry");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAmpas({ quantityKg: quantity, pricePerKg: price, condition });
    setIsModalOpen(false);
    setQuantity(100);
    setPrice(1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap pb-4 border-b border-line/60">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Bursa Listing Ampas Nilam</h3>
          <p className="text-xs text-ink-600 mt-0.5">Jual limbah sisa suling nilam Anda ke industri pengolah pupuk/briket B2B.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow"
        >
          <Plus className="h-4 w-4" />
          Pasang Listing
        </Button>
      </div>

      {/* Grid of Ampas cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sellerAmpas.map((amp) => (
          <div
            key={amp.id}
            className="rounded-2xl border border-line bg-white-soft p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                      amp.condition === "dry"
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-teal-50 border-teal-200 text-teal-800"
                    }`}
                  >
                    <Leaf className="h-3 w-3" />
                    {amp.condition === "dry" ? "Ampas Kering" : "Ampas Basah"}
                  </span>
                  <h4 className="text-base font-extrabold text-brand-950 mt-2">
                    {amp.quantityKg} Kg Terdaftar
                  </h4>
                </div>
                <div className="p-2 bg-cream-50 text-brand-950 rounded-xl border border-line">
                  <Recycle className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-ink-700">
                <div className="flex justify-between">
                  <span className="text-ink-600">Harga / Kg:</span>
                  <span className="font-extrabold text-brand-950">{formatRupiah(amp.pricePerKg.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Lokasi:</span>
                  <span className="font-bold text-brand-950">{amp.location.district}, {amp.location.city}</span>
                </div>
                <div className="pt-2 border-t border-line/40 text-[10px] leading-relaxed italic text-ink-600">
                  {amp.distillationProcess.substring(0, 75)}...
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-between items-center pt-2">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                Listing Aktif
              </span>
              <button className="p-1.5 hover:bg-red-50 text-red-750 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-line bg-white p-6 shadow-2xl relative text-brand-950">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-ink-600 hover:text-brand-950 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-base font-extrabold font-serif-accent italic mb-5 text-brand-950">
              Buat Listing Ampas Baru
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kondisi Ampas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCondition("dry")}
                    className={`h-10 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      condition === "dry"
                        ? "bg-brand-950 text-white-soft border-brand-950"
                        : "border-line bg-cream-50 text-ink-700 hover:bg-cream-100"
                    }`}
                  >
                    <Leaf className="h-3.5 w-3.5" />
                    Kering
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("wet")}
                    className={`h-10 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      condition === "wet"
                        ? "bg-brand-950 text-white-soft border-brand-950"
                        : "border-line bg-cream-50 text-ink-700 hover:bg-cream-100"
                    }`}
                  >
                    <Recycle className="h-3.5 w-3.5" />
                    Basah
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Jumlah (Kg)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Harga / Kg (Rp)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-line hover:bg-cream-50 text-ink-900 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft font-bold cursor-pointer transition-all"
                >
                  Terbitkan Listing
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
