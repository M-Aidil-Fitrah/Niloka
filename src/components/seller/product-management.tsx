"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit3, Trash2, Wand2, Sparkles, AlertCircle, Check, Grid, List } from "lucide-react";
import type { Product, ProductForm, ProductFunction, ProductTag } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

type ProductManagementProps = {
  products: Product[];
};

export function ProductManagement({ products: initialProducts }: ProductManagementProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Partial<Product> | null>(null);

  // AI Assistant form state
  const [aiAroma, setAiAroma] = useState("");
  const [aiOrigin, setAiOrigin] = useState("Gayo Lues, Aceh");
  const [aiSafety, setAiSafety] = useState("Hindari kontak langsung dengan mata. Jauhkan dari jangkauan anak-anak.");
  const [aiAudience, setAiAudience] = useState("Pencinta aroma terapi alami & relaksasi");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setActiveProduct({
      id: `prod-${Date.now()}`,
      slug: "",
      name: "",
      shortDescription: "",
      price: { amount: 0, currency: "IDR" },
      originalPrice: { amount: 0, currency: "IDR" },
      stock: 10,
      status: "draft",
      form: "essential-oil",
      functions: ["relaxation"],
      tags: ["new-arrival"],
      image: { src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop", alt: "Product Cover" },
      gallery: [],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (product: Product) => {
    setActiveProduct({ ...product });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?")) {
      const filtered = products.filter((p) => p.id !== id);
      setProducts(filtered);
      // Adjust current page if current page becomes empty
      const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleGenerateDescription = async () => {
    if (!activeProduct?.name) {
      alert("Masukkan nama produk terlebih dahulu di form utama sebelum menggunakan AI.");
      return;
    }

    setIsGenerating(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: activeProduct.name,
          origin: aiOrigin,
          aromaProfile: aiAroma || "Woody, Earthy, Sweet",
          functions: activeProduct.functions || ["relaxation"],
          safetyNotes: aiSafety,
          targetAudience: aiAudience,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal memanggil asisten AI.");
      }

      const data = await res.json();
      if (data.shortDescription) {
        setActiveProduct((prev) => prev ? { ...prev, shortDescription: data.shortDescription } : null);
        setAiFeedback("Deskripsi berhasil digenerate dan dimasukkan ke form!");
      }
    } catch (err: unknown) {
      console.error(err);
      setAiFeedback("Gagal membuat deskripsi. Silakan isi form asisten dengan lengkap.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!activeProduct?.name || !activeProduct?.price?.amount) {
      alert("Nama produk dan harga wajib diisi.");
      return;
    }

    const updated = activeProduct as Product;
    if (products.some((p) => p.id === updated.id)) {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      setProducts([updated, ...products]);
      setCurrentPage(1); // Go back to first page to see the new product
    }
    setIsEditing(false);
    setActiveProduct(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Katalog Produk</h3>
          <p className="text-xs text-ink-600 mt-1">Kelola listing, stok, harga coret, serta deskripsi pintar produk Anda</p>
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
            onClick={handleOpenAdd}
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
          {paginatedProducts.map((product) => (
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

                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-ink-650">
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
                  onClick={() => handleOpenEdit(product)}
                  className="flex-1 py-2 bg-cream-100 hover:bg-cream-200 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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
          {paginatedProducts.map((product) => (
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
                  onClick={() => handleOpenEdit(product)}
                  className="flex-1 sm:flex-initial py-2 px-4 bg-cream-100 hover:bg-cream-200 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="py-1.5 px-4 bg-white-soft border border-line rounded-xl text-xs font-bold text-brand-950 hover:bg-cream-100 disabled:opacity-50 disabled:hover:bg-white-soft transition-all cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* 3. Slide Drawer Modal for Edit/Add */}
      {isEditing && activeProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditing(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-2xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
            {/* Header */}
            <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
              <div>
                <h4 className="font-extrabold text-brand-950 text-base">
                  {activeProduct.id && products.some((p) => p.id === activeProduct.id) ? "Edit Detail Produk" : "Tambah Produk Baru"}
                </h4>
                <p className="text-xs text-ink-600 mt-0.5">Isi seluruh informasi detail spesifikasi produk di bawah</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-ink-600 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Batal
              </button>
            </div>

            {/* Form Scroll Container */}
            <div className="p-6 flex-1 space-y-6">
              {/* Product Info Block */}
              <div className="space-y-4">
                <h5 className="text-xs font-extrabold text-brand-950 uppercase tracking-wider pb-1 border-b border-line/45">Info Utama</h5>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700">Nama Produk</label>
                    <input
                      type="text"
                      className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                      value={activeProduct.name || ""}
                      onChange={(e) => setActiveProduct({ ...activeProduct, name: e.target.value })}
                      placeholder="Contoh: Lilin Aromaterapi Lavender Nilam"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700">Tipe Produk</label>
                    <select
                      className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                      value={activeProduct.form || "essential-oil"}
                      onChange={(e) => setActiveProduct({ ...activeProduct, form: e.target.value as ProductForm })}
                    >
                      <option value="essential-oil">Minyak Atsiri (Essential Oil)</option>
                      <option value="roll-on">Minyak Roll-On</option>
                      <option value="soap">Sabun Mandi Alami</option>
                      <option value="diffuser">Reed Diffuser</option>
                      <option value="perfume">Parfum / Cologne</option>
                      <option value="body-oil">Minyak Pijat / Body Oil</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700">Harga Jual (Rp)</label>
                    <input
                      type="number"
                      className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                      value={activeProduct.price?.amount || ""}
                      onChange={(e) => setActiveProduct({
                        ...activeProduct,
                        price: { amount: Number(e.target.value), currency: "IDR" }
                      })}
                      placeholder="Contoh: 145000"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700">Harga Coret (Rp) <span className="text-[10px] text-ink-600/70 font-semibold">(Opsional)</span></label>
                    <input
                      type="number"
                      className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                      value={activeProduct.originalPrice?.amount || ""}
                      onChange={(e) => setActiveProduct({
                        ...activeProduct,
                        originalPrice: { amount: Number(e.target.value), currency: "IDR" }
                      })}
                      placeholder="Contoh: 180000"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-700">Stok (pcs)</label>
                    <input
                      type="number"
                      className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                      value={activeProduct.stock || ""}
                      onChange={(e) => setActiveProduct({ ...activeProduct, stock: Number(e.target.value) })}
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* AI Writer Assistant Widget */}
              <div className="border border-brand-900/15 bg-brand-100/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-brand-950">
                  <Sparkles className="h-4.5 w-4.5 text-brand-900" />
                  <h6 className="text-xs font-extrabold uppercase tracking-wider">Asisten AI Copywriter</h6>
                </div>
                <p className="text-[11px] text-ink-600 leading-normal">
                  Generate deskripsi produk otomatis yang ramah promosi namun mematuhi aturan platform (tidak overclaim/medis).
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-ink-600 uppercase">Profil Aroma</label>
                    <input
                      type="text"
                      className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft"
                      value={aiAroma}
                      onChange={(e) => setAiAroma(e.target.value)}
                      placeholder="Contoh: Woody, Lembut, Patchouli"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-ink-600 uppercase">Asal Bahan Baku</label>
                    <input
                      type="text"
                      className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft"
                      value={aiOrigin}
                      onChange={(e) => setAiOrigin(e.target.value)}
                      placeholder="Gayo Lues, Aceh"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-600 uppercase">Target Audience</label>
                  <input
                    type="text"
                    className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft"
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value)}
                    placeholder="Contoh: Pekerja kantoran yang stres, butuh relaksasi malam hari"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="bg-brand-950 hover:bg-brand-900 disabled:bg-ink-600 text-white-soft font-extrabold text-[10px] uppercase tracking-wider rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    {isGenerating ? "Menyusun Deskripsi..." : "Generate Deskripsi"}
                  </button>
                  {aiFeedback && (
                    <span className="text-[11px] font-bold text-brand-900 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 shrink-0" />
                      {aiFeedback}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-700">Deskripsi Ringkas Produk</label>
                <textarea
                  rows={4}
                  className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed"
                  value={activeProduct.shortDescription || ""}
                  onChange={(e) => setActiveProduct({ ...activeProduct, shortDescription: e.target.value })}
                  placeholder="Ketik deskripsi produk di sini atau gunakan asisten AI..."
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h5 className="text-xs font-extrabold text-brand-950 uppercase tracking-wider pb-1 border-b border-line/45">Status & Publikasi</h5>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-800">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={activeProduct.status === "published"}
                      onChange={() => setActiveProduct({ ...activeProduct, status: "published" })}
                      className="accent-brand-900"
                    />
                    Publikasikan Langsung
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-800">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={activeProduct.status === "draft"}
                      onChange={() => setActiveProduct({ ...activeProduct, status: "draft" })}
                      className="accent-brand-900"
                    />
                    Simpan Sebagai Draf
                  </label>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-line flex justify-end gap-3 bg-cream-50/50">
              <button
                onClick={() => setIsEditing(false)}
                className="py-2.5 px-6 border border-line text-ink-700 font-bold rounded-xl text-xs hover:bg-cream-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="py-2.5 px-6 bg-brand-900 hover:bg-brand-850 text-white-soft font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
