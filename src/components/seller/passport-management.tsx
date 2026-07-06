import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Edit, X } from "lucide-react";
import type { Product } from "@/lib/contracts";

type PassportDraft = {
  productId: string;
  patchouliAlcohol: string;
  origin: string;
  aromaProfile: string;
  safetyNotes: string;
  status: "draft" | "submitted" | "verified";
};

type PassportManagementProps = {
  passportDrafts: PassportDraft[];
  sellerProducts: Product[];
  onSavePassportDraft: (
    productId: string,
    patchouliAlcohol: string,
    origin: string,
    aromaProfile: string,
    safetyNotes: string
  ) => void;
};

export function PassportManagement({
  passportDrafts,
  sellerProducts,
  onSavePassportDraft,
}: PassportManagementProps) {
  const [editingDraft, setEditingDraft] = useState<PassportDraft | null>(null);
  const [pa, setPa] = useState("");
  const [origin, setOrigin] = useState("");
  const [aroma, setAroma] = useState("");
  const [safety, setSafety] = useState("");

  const handleEditClick = (draft: PassportDraft) => {
    setEditingDraft(draft);
    setPa(draft.patchouliAlcohol);
    setOrigin(draft.origin);
    setAroma(draft.aromaProfile);
    setSafety(draft.safetyNotes);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDraft) return;
    onSavePassportDraft(editingDraft.productId, pa, origin, aroma, safety);
    setEditingDraft(null);
  };

  const resolveProductName = (id: string) => {
    return sellerProducts.find((p) => p.id === id)?.name || id;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-line/60">
        <h3 className="text-base font-extrabold text-brand-950">Nilam Passport Registri</h3>
        <p className="text-xs text-ink-600 mt-0.5">
          Kelola transparansi ketertelusuran rantai pasok nilam dari hulu (petani/penyuling) ke hilir.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid gap-5 md:grid-cols-2">
        {passportDrafts.map((draft) => (
          <div
            key={draft.productId}
            className="rounded-2xl border border-line bg-white-soft p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] font-extrabold text-gold-600 uppercase tracking-wider block">
                    Transparansi Nilam Passport
                  </span>
                  <h4 className="text-sm font-extrabold text-brand-950 mt-1">
                    {resolveProductName(draft.productId)}
                  </h4>
                </div>
                <div className="p-2 bg-cream-50 text-brand-950 rounded-xl border border-line shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              {/* Specs info */}
              <div className="grid grid-cols-2 gap-3 text-[11px] bg-cream-50/50 p-3.5 rounded-xl border border-line/40">
                <div>
                  <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Kadar Alkohol (PA)</span>
                  <span className="font-extrabold text-brand-950 mt-0.5 block">{draft.patchouliAlcohol}</span>
                </div>
                <div>
                  <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Asal Wilayah</span>
                  <span className="font-bold text-brand-950 mt-0.5 block line-clamp-1">{draft.origin}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-line/30">
                  <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Aroma Sensori</span>
                  <span className="font-semibold text-brand-950 mt-0.5 block line-clamp-1">{draft.aromaProfile}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span
                className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  draft.status === "verified"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : draft.status === "submitted"
                    ? "bg-sky-50 border-sky-200 text-sky-800"
                    : "bg-cream-100 border-line text-ink-600"
                }`}
              >
                {draft.status === "verified" ? "Terverifikasi" : draft.status === "submitted" ? "Menunggu Validasi" : "Draf"}
              </span>

              {draft.status !== "verified" ? (
                <button
                  onClick={() => handleEditClick(draft)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-900 hover:text-brand-850 uppercase tracking-wider bg-cream-50 border border-line px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Detail
                </button>
              ) : (
                <span className="text-[10px] text-ink-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Kunci Blockchain
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Editing Modal */}
      {editingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-line bg-white p-6 shadow-2xl relative text-brand-950">
            <button
              onClick={() => setEditingDraft(null)}
              className="absolute right-5 top-5 text-ink-600 hover:text-brand-950 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-base font-extrabold font-serif-accent italic mb-2 text-brand-950">
              Lengkapi Paspor Nilam
            </h4>
            <p className="text-[10px] text-ink-600 mb-5">
              Masukkan parameter sensorik dan ketertelusuran produk {resolveProductName(editingDraft.productId)}.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kadar PA (%)</label>
                  <input
                    type="text"
                    required
                    className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                    placeholder="Contoh: 33.8%"
                    value={pa}
                    onChange={(e) => setPa(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Asal Wilayah</label>
                  <input
                    type="text"
                    required
                    className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                    placeholder="Contoh: Tapaktuan, Aceh Selatan"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Profil Sensori Aroma</label>
                <input
                  type="text"
                  required
                  className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                  placeholder="Contoh: Woody, Earthy, Rich Balsamic"
                  value={aroma}
                  onChange={(e) => setAroma(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Petunjuk Keamanan & Pakai</label>
                <textarea
                  rows={2}
                  required
                  className="w-full rounded-xl border border-line bg-cream-50 p-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none resize-none"
                  placeholder="Contoh: Hanya untuk pemakaian luar..."
                  value={safety}
                  onChange={(e) => setSafety(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingDraft(null)}
                  className="h-10 px-4 rounded-xl border border-line hover:bg-cream-50 text-ink-900 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft font-bold cursor-pointer transition-all"
                >
                  Ajukan Verifikasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
