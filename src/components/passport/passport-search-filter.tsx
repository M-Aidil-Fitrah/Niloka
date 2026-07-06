import { Search } from "lucide-react";
import type { ProductForm } from "@/lib/contracts";

type PassportSearchFilterProps = {
  search: string;
  setSearch: (val: string) => void;
  selectedOrigin: string;
  setSelectedOrigin: (val: string) => void;
  selectedForm: "Semua" | ProductForm;
  setSelectedForm: (val: "Semua" | ProductForm) => void;
  origins: string[];
  forms: ("Semua" | ProductForm)[];
  formLabels: Record<string, string>;
};

export function PassportSearchFilter({
  search,
  setSearch,
  selectedOrigin,
  setSelectedOrigin,
  selectedForm,
  setSelectedForm,
  origins,
  forms,
  formLabels,
}: PassportSearchFilterProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm">
      {/* Search */}
      <div className="relative">
        <label className="flex h-11 w-full items-center gap-2.5 rounded-2xl bg-cream-50 px-4 text-sm text-ink-600 border border-line/30 focus-within:border-brand-700">
          <Search className="h-4 w-4 text-brand-700 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink-600/70 text-brand-950"
            placeholder="Cari produk atau asal daerah (contoh: Aceh Jaya)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Region Filter */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600 block mb-2.5">
          Asal Daerah
        </span>
        <div className="flex flex-wrap gap-2">
          {origins.map((origin) => (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                selectedOrigin === origin
                  ? "bg-brand-900 border-brand-900 text-white-soft"
                  : "border-line bg-cream-50 text-brand-950 hover:border-brand-700 hover:bg-cream-100"
              }`}
            >
              {origin}
            </button>
          ))}
        </div>
      </div>

      {/* Product Kind Filter */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600 block mb-2.5">
          Jenis Produk
        </span>
        <div className="flex flex-wrap gap-2">
          {forms.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedForm(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                selectedForm === f
                  ? "bg-brand-900 border-brand-900 text-white-soft"
                  : "border-line bg-cream-50 text-brand-950 hover:border-brand-700 hover:bg-cream-100"
              }`}
            >
              {f === "Semua" ? "Semua" : formLabels[f] ?? f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
