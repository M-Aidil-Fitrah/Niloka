import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, CheckCircle2, Beaker, MapPin } from "lucide-react";
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
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro section */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-1.5">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Penyusunan Nilam Passport
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Kelola transparansi asal bahan baku dan profil senyawa aromatik atsiri Anda. Seluruh draf diajukan langsung ke verifikator internal NILOKA.
        </p>
      </div>

      {/* Passport Draft list */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Draf Transparansi Paspor Aktif</h4>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {passportDrafts.map((draft) => {
            const prod = sellerProducts.find((p) => p.id === draft.productId);
            if (!prod) return null;
            return (
              <div key={draft.productId} className="rounded-2xl border border-zinc-800 p-5 bg-zinc-900/40 space-y-4 hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-sm font-bold text-zinc-100 block line-clamp-1">{prod.name}</span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        Asal: {draft.origin}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${
                        draft.status === "verified"
                          ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400"
                          : draft.status === "submitted"
                          ? "bg-sky-950/40 border-sky-900/40 text-sky-400"
                          : "bg-zinc-800/40 border-zinc-700 text-zinc-400"
                      }`}
                    >
                      {draft.status === "verified" ? "Terverifikasi" : draft.status === "submitted" ? "Diajukan" : "Draf"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/60 text-[10px]">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 block uppercase tracking-wider font-semibold">Kadar PA:</span>
                      <span className="font-bold text-zinc-200 flex items-center gap-1">
                        <Beaker className="h-3 w-3 text-emerald-400" />
                        {draft.patchouliAlcohol}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 block uppercase tracking-wider font-semibold">Profil Aroma:</span>
                      <span className="font-bold text-zinc-200 truncate block">{draft.aromaProfile}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {draft.status === "verified" ? (
                    <div className="w-full h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Laporan Autentikasi Publik Aktif
                    </div>
                  ) : (
                    <Button
                      onClick={() =>
                        onSavePassportDraft(
                          draft.productId,
                          draft.patchouliAlcohol === "N/A (Turunan)" ? "31.2%" : draft.patchouliAlcohol,
                          draft.origin,
                          draft.aromaProfile,
                          draft.safetyNotes
                        )
                      }
                      className="w-full h-9 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {draft.status === "submitted" ? "Perbarui Pengajuan" : "Ajukan Verifikasi Paspor"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
