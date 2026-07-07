"use client";

import Image from "next/image";
import { Plus, Edit3, Trash2, Grid, List } from "lucide-react";
import type { Product } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

type ProductTableProps = {
  products: Product[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  onOpenAdd: () => void;
  onOpenEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export function ProductTable({
  products,
  viewMode,
  setViewMode,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Katalog Produk</h3>
          <p className="text-xs text-ink-600 mt-1 font-semibold">Kelola listing, stok, harga coret, serta deskripsi pintar produk Anda</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Toggle View Mode */}
          <div className="flex border border-line rounded-xl overflow-hidden bg-white-soft p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-brand-900 text-white-soft"
                  : "text-ink-600 hover:bg-cream-50"
              }`}
              title="Tampilan Grid"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-brand-900 text-white-soft"
                  : "text-ink-600 hover:bg-cream-50"
              }`}
              title="Tampilan List"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenAdd}
            className="flex-1 sm:flex-initial bg-brand-900 hover:bg-brand-850 text-white-soft font-bold text-xs rounded-xl px-5 py-2.5 flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* 2. Grid or List View */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-[28px] border border-line bg-white-soft overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Cover Image */}
                <div className="relative h-48 w-full bg-cream-50">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`absolute top-4 right-4 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                      product.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {product.status === "published" ? "Aktif" : "Draf"}
                  </span>
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ink-600 bg-cream-100/70 border border-line/50 px-2.5 py-0.5 rounded-full uppercase">
                      {product.form.replace("-", " ")}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-brand-950 text-sm leading-snug line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Price tag with comparison */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-extrabold text-brand-950 text-base">
                      {formatRupiah(product.price.amount)}
                    </span>
                    {product.originalPrice && product.originalPrice.amount > product.price.amount && (
                      <span className="text-xs font-semibold text-ink-600/70 line-through">
                        {formatRupiah(product.originalPrice.amount)}
                      </span>
                    )}
                  </div>

                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-ink-655">
                    <span>Stok: <strong className="text-brand-950 font-bold">{product.stock} pcs</strong></span>
                    <span className="text-[9px] font-extrabold text-gold-600 uppercase tracking-wider bg-gold-100/40 px-2 py-0.5 rounded">
                      Passport Validated
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 border-t border-line/30 flex gap-2.5 mt-auto">
                <button
                  onClick={() => onOpenEdit(product)}
                  className="flex-1 py-2 bg-cream-100 hover:bg-cream-200 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                  aria-label="Hapus produk"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-[24px] border border-line bg-white-soft p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                {/* Image */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-cream-50 shrink-0">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <span
                    className={`absolute top-1.5 right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase border ${
                      product.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200/50"
                        : "bg-amber-50 text-amber-800 border-amber-200/50"
                    }`}
                  >
                    {product.status === "published" ? "Aktif" : "Draf"}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-ink-650 bg-cream-100/70 border border-line/45 px-2 py-0.5 rounded-md uppercase">
                      {product.form.replace("-", " ")}
                    </span>
                    <span className="text-[8px] font-extrabold text-gold-600 uppercase tracking-wider bg-gold-100/40 px-1.5 py-0.5 rounded">
                      Passport Validated
                    </span>
                  </div>
                  <h4 className="font-extrabold text-brand-950 text-sm leading-snug truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-ink-600 line-clamp-1 leading-relaxed">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                    <span className="font-black text-brand-950 text-sm">
                      {formatRupiah(product.price.amount)}
                    </span>
                    {product.originalPrice && product.originalPrice.amount > product.price.amount && (
                      <span className="text-[10px] font-semibold text-ink-600/70 line-through">
                        {formatRupiah(product.originalPrice.amount)}
                      </span>
                    )}
                    <span className="text-[10px] text-ink-600 font-semibold ml-2">
                      Stok: <strong className="text-brand-950 font-bold">{product.stock} pcs</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 sm:border-l sm:border-line/45 sm:pl-4">
                <button
                  onClick={() => onOpenEdit(product)}
                  className="flex-1 sm:flex-initial py-2 px-4 bg-cream-100 hover:bg-cream-200 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                  aria-label="Hapus produk"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-line/40">
          <span className="text-xs font-semibold text-ink-600">
            Menampilkan <strong className="text-brand-950">{startIndex + 1}</strong> - <strong className="text-brand-950">{Math.min(startIndex + itemsPerPage, products.length)}</strong> dari <strong className="text-brand-950">{products.length}</strong> produk
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="py-1.5 px-4 bg-white-soft border border-line rounded-xl text-xs font-bold text-brand-950 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-white-soft transition-all cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-brand-900 text-white-soft shadow-xs"
                    : "bg-white-soft border border-line text-ink-700 hover:bg-cream-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="py-1.5 px-4 bg-white-soft border border-line rounded-xl text-xs font-bold text-brand-950 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-white-soft transition-all cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
