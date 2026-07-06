import { Button } from "@/components/ui/button";
import { PassportCard } from "@/components/passport/passport-card";
import { Info } from "lucide-react";
import type { Product, NilamPassport } from "@/lib/contracts";

type PassportRegistryListProps = {
  filteredItems: { product: Product; passport: NilamPassport; batchCode: string }[];
  search: string;
  selectedOrigin: string;
  selectedForm: string;
  onResetFilters: () => void;
};

export function PassportRegistryList({
  filteredItems,
  search,
  selectedOrigin,
  selectedForm,
  onResetFilters,
}: PassportRegistryListProps) {
  return (
    <div className="space-y-6">
      {filteredItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map(({ product, passport }) => (
            <PassportCard key={product.id} product={product} passport={passport} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-line bg-white-soft py-20 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-brand-900 mb-4">
            <Info className="h-5 w-5" />
          </div>
          <p className="text-base font-bold text-brand-950">Tidak ada paspor ditemukan</p>
          <p className="mt-2 text-xs text-ink-600 px-6 max-w-sm">Coba ubah filter atau kata kunci pencarian Anda untuk menemukan data registry.</p>
          {(search !== "" || selectedOrigin !== "Semua" || selectedForm !== "Semua") && (
            <Button
              className="mt-5 rounded-xl text-xs font-bold bg-brand-900 hover:bg-brand-800 text-white-soft"
              onClick={onResetFilters}
            >
              Reset Filter
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
