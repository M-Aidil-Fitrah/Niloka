"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid, List } from "lucide-react";
import type {
  Product,
  ProductCategory,
  ProductForm,
  ProductFunction,
  Promo,
} from "@/lib/contracts";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { ProductCard } from "@/components/catalog/product-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, FilterIcon } from "@/components/ui/icons";
import { formatRupiah } from "@/lib/formatters";
import { cn } from "@/lib/styles";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

type CatalogShellProps = {
  products: Product[];
  categories: ProductCategory[];
  promos: Promo[];
};

const PRODUCTS_PER_PAGE = 8;

const sortLabels: Record<SortOption, string> = {
  featured: "Terlaris",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
  newest: "Terbaru",
};

export function CatalogShell({ products, categories, promos }: CatalogShellProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<ProductForm[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<ProductFunction[]>([]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  function handleResetFilters() {
    setSelectedCategories([]);
    setSelectedForms([]);
    setSelectedFunctions([]);
    setCurrentPage(1);
  }

  const promosBySeller = useMemo(() => {
    const map = new Map<string, Promo[]>();
    for (const promo of promos) {
      if (promo.status !== "active") continue;
      const existing = map.get(promo.sellerId);
      if (existing) {
        existing.push(promo);
      } else {
        map.set(promo.sellerId, [promo]);
      }
    }
    return map;
  }, [promos]);

  const promosByProduct = useMemo(() => {
    const map = new Map<string, Promo[]>();
    for (const product of products) {
      const sellerPromos = promosBySeller.get(product.sellerId);
      if (!sellerPromos) {
        map.set(product.id, []);
        continue;
      }

      map.set(
        product.id,
        sellerPromos.filter(
          (promo) => promo.productIds.length === 0 || promo.productIds.includes(product.id),
        ),
      );
    }
    return map;
  }, [products, promosBySeller]);

  const filtered = useMemo(() => products.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
      return false;
    }
    if (selectedForms.length > 0 && !selectedForms.includes(product.form)) {
      return false;
    }
    if (selectedFunctions.length > 0 && !product.functions.some((f) => selectedFunctions.includes(f))) {
      return false;
    }
    return true;
  }), [products, selectedCategories, selectedForms, selectedFunctions]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
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
  }), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = sorted.slice(
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    safeCurrentPage * PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedForms.length > 0 ||
    selectedFunctions.length > 0;

  function getPromosForProduct(productId: string) {
    return promosByProduct.get(productId) ?? [];
  }

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <CatalogSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoriesChange={(v: string[]) => { setSelectedCategories(v); setCurrentPage(1); }}
          selectedForms={selectedForms}
          onFormsChange={(v: ProductForm[]) => { setSelectedForms(v); setCurrentPage(1); }}
          selectedFunctions={selectedFunctions}
          onFunctionsChange={(v: ProductFunction[]) => { setSelectedFunctions(v); setCurrentPage(1); }}
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
              selectedCategories={selectedCategories}
              onCategoriesChange={(v: string[]) => { setSelectedCategories(v); setCurrentPage(1); }}
              selectedForms={selectedForms}
              onFormsChange={(v: ProductForm[]) => { setSelectedForms(v); setCurrentPage(1); }}
              selectedFunctions={selectedFunctions}
              onFunctionsChange={(v: ProductFunction[]) => { setSelectedFunctions(v); setCurrentPage(1); }}
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
                  {selectedCategories.length + selectedForms.length + selectedFunctions.length}
                </span>
              )}
            </button>
            <p className="text-sm text-ink-600">
              {sorted.length} produk
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Grid / List toggle */}
            <div className="flex border border-line rounded-full overflow-hidden bg-white-soft p-0.5 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-full transition-colors cursor-pointer",
                  viewMode === "grid"
                    ? "bg-brand-900 text-white-soft"
                    : "text-ink-600 hover:bg-cream-50"
                )}
                title="Tampilan Grid"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-full transition-colors cursor-pointer",
                  viewMode === "list"
                    ? "bg-brand-900 text-white-soft"
                    : "text-ink-600 hover:bg-cream-50"
                )}
                title="Tampilan List"
              >
                <List className="h-4 w-4" />
              </button>
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
        </div>

        {/* Product grid / list */}
        {paginatedProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  promos={getPromosForProduct(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {paginatedProducts.map((product) => {
                const productPromos = getPromosForProduct(product.id);
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col sm:flex-row gap-4.5 rounded-[24px] border border-line bg-white-soft p-4 hover:border-brand-700/40 hover:ring-2 hover:ring-gold-500/20 hover:shadow-md transition-all duration-200"
                  >
                    {/* Image side */}
                    <div className="relative aspect-[4/5] sm:aspect-square w-full sm:w-28 h-48 sm:h-auto rounded-[18px] overflow-hidden bg-cream-50 shrink-0">
                      <Image
                        src={product.image.src}
                        alt={product.image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 112px"
                      />
                      {product.tags.length > 0 && (
                        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
                          {product.tags.map((tag) => (
                            <Badge
                              key={tag}
                              tone={tag === "best-seller" ? "gold" : "brand"}
                              className="text-[9px] min-h-4.5 px-1.5 shadow-sm"
                            >
                              {tag === "best-seller" ? "Best Seller" : tag === "new-arrival" ? "Baru" : tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content side */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-bold text-ink-650 bg-cream-100/70 border border-line/45 px-2 py-0.5 rounded uppercase">
                            {product.form.replace("-", " ")}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-brand-950 text-sm leading-snug truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-brand-900">
                            {formatRupiah(product.price.amount)}
                          </span>
                          {product.originalPrice && product.originalPrice.amount > product.price.amount && (
                            <span className="text-xs text-ink-600/50 line-through font-semibold">
                              {formatRupiah(product.originalPrice.amount)}
                            </span>
                          )}
                        </div>

                        {productPromos.length > 0 && (
                          <span className="rounded-full bg-emerald-800 px-2 py-0.5 text-[9px] font-extrabold text-white-soft shadow-sm border border-emerald-700/50">
                            {productPromos[0].code}: {productPromos[0].type === "percentage" ? `${productPromos[0].value}%` : "Diskon"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
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
