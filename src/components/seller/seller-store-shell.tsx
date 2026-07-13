"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Store,
  MapPin,
  Star,
  MessageSquare,
  Calendar,
  ChevronDown,
  Check,
  Copy,
  Ticket,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { Product, Seller, Promo, ProductCategory } from "@/lib/contracts";
import { ProductCard } from "@/components/catalog/product-card";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/formatters";
import { cn } from "@/lib/styles";
import { ChevronLeftIcon } from "@/components/ui/icons";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  featured: "Terlaris",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
  newest: "Terbaru",
};

type SellerStoreShellProps = {
  seller: Seller;
  products: Product[];
  promos: Promo[];
  categories: ProductCategory[];
};

const PRODUCTS_PER_PAGE = 8;

export function SellerStoreShell({
  seller,
  products,
  promos = [],
  categories = [],
}: SellerStoreShellProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Extract categories that are present in the seller's products
  const sellerCategories = useMemo(() => {
    const categoryIds = new Set(products.map((p) => p.categoryId));
    return categories.filter((cat) => categoryIds.has(cat.id));
  }, [products, categories]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSort("featured");
    setCurrentPage(1);
  };

  // Filter and sort products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === "featured") {
      result.sort((a, b) => a.featuredRank - b.featuredRank);
    } else if (sort === "price-asc") {
      result.sort((a, b) => a.price.amount - b.price.amount);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price.amount - a.price.amount);
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery, sort]);

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const joinedDateFormatted = useMemo(() => {
    const date = new Date(seller.joinedAt);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
    });
  }, [seller.joinedAt]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 py-6" id="store-products-grid">
      <div>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
              return;
            }

            router.push("/");
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900 transition-colors hover:text-brand-700 hover:cursor-pointer"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Kembali
        </button>
      </div>

      {/* Premium Hero Shop Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 p-6 sm:p-8 md:p-10 shadow-xl text-white-soft">
        {/* Background Decorative Circles */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 h-80 w-80 rounded-full bg-brand-700/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-10">
          {/* Shop Branding / Info Left Side */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full">
            {/* Store Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className="font-accent text-5xl font-black text-gold-500 select-none">
                {seller.displayName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info details */}
            <div className="space-y-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {seller.displayName}
                </h1>
                {seller.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 self-center rounded-full bg-emerald-500/25 border border-emerald-400/40 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                    <Sparkles className="h-3 w-3 text-gold-500 animate-pulse" />
                    Verified Partner
                  </span>
                )}
              </div>

              {/* Location, Member since, Seller Type */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-brand-100">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                  {seller.location.city}, {seller.location.province}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-200/50 hidden sm:inline" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold-500 shrink-0" />
                  Bergabung {joinedDateFormatted}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-200/50 hidden sm:inline" />
                <span className="capitalize bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-xs font-semibold">
                  Tipe: {seller.type}
                </span>
              </div>

              {/* Rating Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Star className="h-4 w-4 fill-gold-500 text-gold-500 animate-in spin-in-12 duration-500" />
                  <span className="text-sm font-extrabold">
                    {seller.ratingAverage.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-brand-200 border-l border-white/10 pl-1.5 ml-1">
                    {seller.totalReviews} Ulasan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Right Side */}
          <div className="shrink-0 flex items-center justify-center w-full md:w-auto pt-2 md:pt-0">
            <Link
              href={`/chat?sellerId=${seller.id}`}
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              Chat Penjual
            </Link>
          </div>
        </div>
      </div>

      {/* Vouchers Section */}
      {promos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-brand-900" />
            <h2 className="text-lg font-bold text-brand-950 uppercase tracking-wider">
              Voucher Toko Spesial
            </h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="relative flex items-center justify-between bg-white border border-line rounded-2xl p-4 shadow-sm hover:border-emerald-600/35 hover:shadow-md transition-all duration-300 group overflow-hidden"
              >
                {/* Coupon border details */}
                <div className="absolute -left-2 top-1/2 -mt-2 h-4 w-4 rounded-full border-r border-line bg-background" />
                <div className="absolute -right-2 top-1/2 -mt-2 h-4 w-4 rounded-full border-l border-line bg-background" />

                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                      {promo.code}
                    </span>
                    {promo.type === "free-shipping" && (
                      <span className="text-[9px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                        Bebas Ongkir
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-brand-950 block leading-tight">
                    {promo.type === "percentage"
                      ? `Diskon ${promo.value}%`
                      : promo.type === "fixed-amount"
                      ? `Potongan Rp ${promo.value.toLocaleString("id-ID")}`
                      : "Bebas Ongkos Kirim"}
                  </span>
                  <span className="text-[10px] text-ink-600 block leading-snug">
                    Min. Belanja {formatRupiah(promo.minSubtotal.amount)}
                  </span>
                </div>
                
                <div className="border-l border-dashed border-line/80 pl-4 h-16 flex items-center shrink-0">
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="flex items-center justify-center h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-[11px] font-bold text-white-soft transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03]"
                  >
                    {copiedCode === promo.code ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Tersalin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="h-3.5 w-3.5" />
                        Klaim
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Search & Filtering */}
      <div className="space-y-6">
        <div className="border-b border-line pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-brand-950">
            Katalog Produk Toko
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-600/70" />
              <input
                type="text"
                placeholder="Cari produk di toko ini..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-line bg-white-soft py-2.5 pl-10 pr-4 text-sm text-brand-950 placeholder-ink-600/50 outline-none ring-offset-background transition-all hover:border-brand-700/60 focus:border-brand-900 focus:ring-2 focus:ring-gold-500/20"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex w-full sm:w-48 items-center justify-between rounded-2xl border border-line bg-white-soft px-4 py-2.5 text-sm font-semibold text-brand-950 hover:border-brand-700/60 transition-all cursor-pointer shadow-sm"
              >
                <span className="truncate">
                  Urutkan: {sortLabels[sort]}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-ink-600 ml-2" />
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 z-20 w-48 rounded-2xl border border-line bg-white-soft p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSort(option);
                          setShowSortDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer",
                          sort === option
                            ? "bg-brand-900 text-white-soft"
                            : "text-ink-800 hover:bg-cream-50 hover:text-brand-900"
                        )}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        {sellerCategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer shrink-0 shadow-sm",
                selectedCategory === null
                  ? "bg-brand-900 border-brand-900 text-white-soft"
                  : "bg-white-soft border-line text-ink-700 hover:border-brand-700/60 hover:text-brand-900"
              )}
            >
              Semua Kategori
            </button>
            {sellerCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer shrink-0 shadow-sm",
                  selectedCategory === cat.id
                    ? "bg-brand-900 border-brand-900 text-white-soft"
                    : "bg-white-soft border-line text-ink-700 hover:border-brand-700/60 hover:text-brand-900"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-300">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  promos={[]}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-line/30 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    // Scroll to products listing grid nicely
                    window.scrollTo({
                      top: document.getElementById("store-products-grid")?.offsetTop || 500,
                      behavior: "smooth",
                    });
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[28px] border border-line bg-white-soft p-12 text-center max-w-md mx-auto space-y-4">
            <AlertCircle className="h-10 w-10 text-ink-600/70 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-brand-950">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Tidak ada produk di toko ini yang cocok dengan kriteria pencarian atau filter kategori Anda.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-brand-900 px-4 text-xs font-bold text-white-soft hover:bg-brand-800 transition-colors shadow-sm cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
