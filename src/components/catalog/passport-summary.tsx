import { ShieldCheckIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import type { NilamPassport } from "@/lib/contracts";

type PassportSummaryProps = {
  passport: NilamPassport;
};

const formLabels: Record<string, string> = {
  "essential-oil": "Essential Oil",
  "roll-on": "Roll-on",
  soap: "Sabun",
  diffuser: "Diffuser",
  perfume: "Parfum",
  "body-oil": "Body Oil / Losion",
  bundle: "Bundle",
};

const functionLabels: Record<string, string> = {
  relaxation: "Relaksasi",
  focus: "Fokus",
  "sleep-support": "Tidur",
  "skin-care": "Perawatan Kulit",
  "home-fragrance": "Aroma Ruangan",
  gift: "Hadiah",
};

export function PassportSummary({ passport }: PassportSummaryProps) {
  return (
    <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-900">
            <span className="font-serif-accent text-lg italic font-bold">N</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-950">Nilam Passport</h3>
            <p className="text-xs text-ink-600">Sistem Transparansi Asal & Kualitas Bahan Baku</p>
          </div>
        </div>

        {passport.validationStatus === "validated" && (
          <Badge tone="gold" className="flex items-center gap-1 text-xs">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Terkurasi
          </Badge>
        )}
      </div>

      {/* Grid Content */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Asal Bahan Baku</h4>
            <p className="mt-1 text-sm font-semibold text-brand-950">{passport.origin}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Jenis Produk</h4>
            <p className="mt-1 text-sm font-semibold text-brand-950">
              {formLabels[passport.productKind] ?? passport.productKind}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Profil Aroma</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {passport.aromaProfile.map((aroma) => (
                <Badge key={aroma} tone="brand" className="text-[10px] min-h-5 px-2 bg-brand-50 text-brand-900 border-brand-200">
                  {aroma}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Fungsi Terkait</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {passport.functions.map((fn) => (
                <Badge key={fn} tone="brand" className="text-[10px] min-h-5 px-2">
                  {functionLabels[fn] ?? fn}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">Cara Penggunaan</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-800">{passport.usage}</p>
          </div>
        </div>
      </div>

      {/* Safety & Validation Footnotes */}
      <div className="mt-6 border-t border-line pt-5">
        <div className="rounded-xl bg-cream-50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">Catatan Keamanan</h4>
          <p className="mt-1 text-xs leading-relaxed text-ink-700">{passport.safetyNotes}</p>
        </div>
        <p className="mt-4 text-[10px] leading-relaxed text-ink-600">
          * Nilam Passport merupakan inisiatif transparansi rantai pasok NILOKA yang memuat data asal bahan dan profil produk sebagaimana diisi oleh produsen dan dikurasi tim kurator internal. Dokumen ini bertujuan untuk transparansi konsumen dan bukan merupakan sertifikasi resmi dari lembaga pemerintah.
        </p>
      </div>
    </div>
  );
}
