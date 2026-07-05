"use client";

import { useState } from "react";
import type { Product, ProductCategory, Seller, ProductForm, ProductFunction } from "@/lib/contracts";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { ProductCard } from "@/components/catalog/product-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, FilterIcon } from "@/components/ui/icons";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

type CatalogShellProps = {
  products: Product[];
  categories: ProductCategory[];
  sellers: Seller[];
};

const PRODUCTS_PER_PAGE = 8;

const sortLabels: Record<SortOption, string> = {
  featured: "Terlaris",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
  newest: "Terbaru",
};

export function CatalogShell({ products, categories, sellers }: CatalogShellProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<ProductForm[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<ProductFunction[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  function handleResetFilters() {
    setSelectedCategories([]);
    setSelectedForms([]);
    setSelectedFunctions([]);
    setSelectedSellers([]);
    setCurrentPage(1);
  }

  const filtered = products.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
      return false;
    }
    if (selectedForms.length > 0 && !selectedForms.includes(product.form)) {
      return false;
    }
    if (selectedFunctions.length > 0 && !product.functions.some((f) => selectedFunctions.includes(f))) {
      return false;
    }
    if (selectedSellers.length > 0 && !selectedSellers.includes(product.sellerId)) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price.amount - b.price.amount;
      case "price-desc":
        return b.price.amount - a.price.amount;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "featured":
      default:
        return a.featuredRank - b.featuredRank;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = sorted.slice(
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    safeCurrentPage * PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedForms.length > 0 ||
    selectedFunctions.length > 0 ||
    selectedSellers.length > 0;

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <CatalogSidebar
          categories={categories}
          sellers={sellers}
          selectedCategories={selectedCategories}
          onCategoriesChange={(v: string[]) => { setSelectedCategories(v); setCurrentPage(1); }}
          selectedForms={selectedForms}
          onFormsChange={(v: ProductForm[]) => { setSelectedForms(v); setCurrentPage(1); }}
          selectedFunctions={selectedFunctions}
          onFunctionsChange={(v: ProductFunction[]) => { setSelectedFunctions(v); setCurrentPage(1); }}
          selectedSellers={selectedSellers}
          onSellersChange={(v: string[]) => { setSelectedSellers(v); setCurrentPage(1); }}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </aside>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilter(false)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}
            aria-label="Tutup filter"
          />
          <aside className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white-soft p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-950">Filter</h3>
              <button
                className="text-sm font-semibold text-brand-700"
                onClick={() => setShowMobileFilter(false)}
              >
                Tutup
              </button>
            </div>
            <CatalogSidebar
              categories={categories}
              sellers={sellers}
              selectedCategories={selectedCategories}
              onCategoriesChange={(v: string[]) => { setSelectedCategories(v); setCurrentPage(1); }}
              selectedForms={selectedForms}
              onFormsChange={(v: ProductForm[]) => { setSelectedForms(v); setCurrentPage(1); }}
              selectedFunctions={selectedFunctions}
              onFunctionsChange={(v: ProductFunction[]) => { setSelectedFunctions(v); setCurrentPage(1); }}
              selectedSellers={selectedSellers}
              onSellersChange={(v: string[]) => { setSelectedSellers(v); setCurrentPage(1); }}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white-soft px-4 py-2 text-sm font-semibold text-brand-900 transition-all duration-200 hover:border-brand-700 lg:hidden"
              onClick={() => setShowMobileFilter(true)}
            >
              <FilterIcon />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[10px] text-white-soft">
                  {selectedCategories.length + selectedForms.length + selectedFunctions.length + selectedSellers.length}
                </span>
              )}
            </button>
            <p className="text-sm text-ink-600">
              {sorted.length} produk
            </p>
          </div>

          <div className="relative">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white-soft px-4 py-2 text-sm font-semibold text-brand-900 transition-all duration-200 hover:border-brand-700"
              onClick={() => setShowSort(!showSort)}
            >
              {sortLabels[sort]}
              <ChevronDownIcon />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-line bg-white-soft py-1 shadow-xl">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      sort === key ? "bg-brand-100 text-brand-900" : "text-ink-700 hover:bg-cream-100"
                    }`}
                    onClick={() => {
                      setSort(key);
                      setShowSort(false);
                      setCurrentPage(1);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-line bg-white-soft py-20 text-center">
            <p className="text-lg font-semibold text-brand-950">Tidak ada produk ditemukan</p>
            <p className="mt-2 text-sm text-ink-600">Coba ubah filter untuk menemukan produk yang Anda cari.</p>
            {hasActiveFilters && (
              <Button className="mt-5" variant="secondary" onClick={handleResetFilters}>
                Reset Filter
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
