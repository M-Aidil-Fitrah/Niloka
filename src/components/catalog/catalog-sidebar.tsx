import type { ProductCategory, ProductForm, ProductFunction, Seller } from "@/lib/contracts";

type CatalogSidebarProps = {
  categories: ProductCategory[];
  sellers: Seller[];
  selectedCategories: string[];
  onCategoriesChange: (ids: string[]) => void;
  selectedForms: ProductForm[];
  onFormsChange: (forms: ProductForm[]) => void;
  selectedFunctions: ProductFunction[];
  onFunctionsChange: (fns: ProductFunction[]) => void;
  selectedSellers: string[];
  onSellersChange: (ids: string[]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
};

const formLabels: Record<ProductForm, string> = {
  "essential-oil": "Essential Oil",
  "roll-on": "Roll-on",
  soap: "Sabun",
  diffuser: "Diffuser",
  perfume: "Parfum",
  "body-oil": "Body Oil / Losion",
  bundle: "Bundle",
};

const functionLabels: Record<ProductFunction, string> = {
  relaxation: "Relaksasi",
  focus: "Fokus",
  "sleep-support": "Tidur",
  "skin-care": "Perawatan Kulit",
  "home-fragrance": "Aroma Ruangan",
  gift: "Hadiah",
};

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((v) => v !== item) : [...list, item];
}

export function CatalogSidebar({
  categories,
  sellers,
  selectedCategories,
  onCategoriesChange,
  selectedForms,
  onFormsChange,
  selectedFunctions,
  onFunctionsChange,
  selectedSellers,
  onSellersChange,
  onReset,
  hasActiveFilters,
}: CatalogSidebarProps) {
  return (
    <nav className="flex flex-col gap-7" aria-label="Filter produk">
      {/* Kategori */}
      <FilterGroup title="Kategori">
        {categories.map((cat) => (
          <Checkbox
            key={cat.id}
            label={cat.name}
            checked={selectedCategories.includes(cat.id)}
            onChange={() => onCategoriesChange(toggleItem(selectedCategories, cat.id))}
          />
        ))}
      </FilterGroup>

      {/* Bentuk Produk */}
      <FilterGroup title="Bentuk Produk">
        {(Object.entries(formLabels) as [ProductForm, string][]).map(([form, label]) => (
          <Checkbox
            key={form}
            label={label}
            checked={selectedForms.includes(form)}
            onChange={() => onFormsChange(toggleItem(selectedForms, form))}
          />
        ))}
      </FilterGroup>

      {/* Fungsi */}
      <FilterGroup title="Fungsi">
        {(Object.entries(functionLabels) as [ProductFunction, string][]).map(([fn, label]) => (
          <Checkbox
            key={fn}
            label={label}
            checked={selectedFunctions.includes(fn)}
            onChange={() => onFunctionsChange(toggleItem(selectedFunctions, fn))}
          />
        ))}
      </FilterGroup>

      {/* Seller */}
      <FilterGroup title="Seller">
        {sellers.map((seller) => (
          <Checkbox
            key={seller.id}
            label={seller.displayName}
            checked={selectedSellers.includes(seller.id)}
            onChange={() => onSellersChange(toggleItem(selectedSellers, seller.id))}
          />
        ))}
      </FilterGroup>

      {hasActiveFilters && (
        <button
          className="text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          onClick={onReset}
        >
          Reset semua filter
        </button>
      )}
    </nav>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-brand-950">{title}</legend>
      <div className="flex flex-col gap-2.5">{children}</div>
    </fieldset>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700 transition-colors hover:text-brand-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-line text-brand-700 accent-brand-700 focus:ring-brand-700"
      />
      {label}
    </label>
  );
}
