import { Sliders } from "lucide-react";

type UsageFilterOption = {
  id: string;
  label: string;
};

type AmpasFiltersProps = {
  usageFilters: UsageFilterOption[];
  selectedUsage: string;
  onUsageChange: (id: string) => void;
};

export function AmpasFilters({ usageFilters, selectedUsage, onUsageChange }: AmpasFiltersProps) {
  return (
    <div className="rounded-[32px] border border-line bg-white-soft p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-brand-50 text-brand-900 shrink-0">
          <Sliders className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-extrabold text-brand-950">Filter Potensi Penggunaan</h4>
      </div>
      
      <div className="flex flex-col gap-1.5">
        {usageFilters.map((u) => (
          <button
            key={u.id}
            onClick={() => onUsageChange(u.id)}
            className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all duration-200 ${
              selectedUsage === u.id
                ? "bg-brand-900 border-brand-900 text-white-soft shadow-sm"
                : "border-line bg-cream-50/50 text-ink-700 hover:border-brand-300"
            }`}
          >
            {u.label}
          </button>
        ))}
      </div>
    </div>
  );
}
