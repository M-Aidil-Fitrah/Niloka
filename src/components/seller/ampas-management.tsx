import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Recycle, Info } from "lucide-react";
import type { AmpasListing } from "@/lib/contracts";

type AmpasManagementProps = {
  sellerAmpas: AmpasListing[];
  onAddAmpas: (amp: { quantityKg: number; pricePerKg: number; condition: "dry" | "wet" }) => void;
};

export function AmpasManagement({ sellerAmpas, onAddAmpas }: AmpasManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qty, setQty] = useState(300);
  const [price, setPrice] = useState(1500);
  const [condition, setCondition] = useState<"dry" | "wet">("dry");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qty) return;
    onAddAmpas({ quantityKg: qty, pricePerKg: price, condition });
    setIsModalOpen(false);
    setQty(300);
    setPrice(1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center gap-4 flex-wrap pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-1.5">
            <Recycle className="h-5 w-5 text-emerald-400" />
            Bursa Listing Ampas Nilam B2B
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Kelola penawaran sisa penyulingan ampas nilam untuk industri circular ekonomi.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Batch Ampas (Mock)
        </Button>
      </div>

      <div className="border border-zinc-800 bg-zinc-900/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-bold">
                <th className="p-4">Deskripsi Batch</th>
                <th className="p-4">Kondisi</th>
                <th className="p-4">Stok Tersedia</th>
                <th className="p-4">Harga per Kg</th>
                <th className="p-4">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sellerAmpas.map((amp) => (
                <tr key={amp.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-zinc-100 block capitalize">
                      {amp.slug.split("-").slice(0, 3).join(" ")}
                    </span>
                    <span className="text-[10px] text-zinc-400 block max-w-sm truncate mt-0.5">
                      {amp.distillationProcess}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        amp.condition === "dry"
                          ? "bg-amber-950/40 border-amber-900/40 text-amber-400"
                          : "bg-sky-950/40 border-sky-900/40 text-sky-400"
                      }`}
                    >
                      {amp.condition === "dry" ? "Kering" : "Basah"}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-zinc-100">{amp.quantityKg.toLocaleString("id-ID")} Kg</td>
                  <td className="p-4 font-bold text-zinc-100">Rp {amp.pricePerKg.amount.toLocaleString("id-ID")} / Kg</td>
                  <td className="p-4 font-semibold text-zinc-400">{amp.location.district}, {amp.location.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 flex gap-3 text-xs text-zinc-400 leading-relaxed shadow-sm">
        <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Ampas nilam suling yang didaftarkan di bursa B2B akan otomatis ditampilkan di peta rantai pasok pupuk dan briket organik NILOKA untuk dibeli oleh pabrik kompos terverifikasi.
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-zinc-800 bg-zinc-900 p-6 shadow-2xl relative text-zinc-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-base font-bold font-serif-accent italic mb-5 text-zinc-100">
              Tambah Batch Ampas B2B Baru
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Kuantitas (Kg)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Harga / Kg (Rp)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-100 focus:border-zinc-700 outline-none"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Kondisi Ampas</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCondition("dry")}
                    className={`flex-1 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      condition === "dry"
                        ? "bg-brand-900 border-brand-900 text-white-soft"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    Kering (Siap Kompos / Briket)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("wet")}
                    className={`flex-1 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      condition === "wet"
                        ? "bg-brand-900 border-brand-900 text-white-soft"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    Basah (Baru Selesai Suling)
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-850 text-zinc-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft font-bold cursor-pointer transition-all"
                >
                  Simpan Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
