"use client";

import Image from "next/image";
import type { Product, ProductForm } from "@/lib/contracts";
import { showToast } from "@/components/dashboard/dashboard-layout";
import { AIDescriptionGenerator } from "./ai-description-generator";

type ProductDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  activeProduct: Partial<Product> | null;
  setActiveProduct: React.Dispatch<React.SetStateAction<Partial<Product> | null>>;
  onSave: () => void;
  products: Product[];
};

export function ProductDrawer({
  isOpen,
  onClose,
  activeProduct,
  setActiveProduct,
  onSave,
  products,
}: ProductDrawerProps) {
  if (!isOpen || !activeProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
        {/* Header */}
        <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
          <div>
            <h4 className="font-extrabold text-brand-950 text-base">
              {activeProduct.id && products.some((p) => p.id === activeProduct.id)
                ? "Edit Detail Produk"
                : "Tambah Produk Baru"}
            </h4>
            <p className="text-xs text-ink-600 mt-0.5 font-semibold">Isi seluruh informasi detail spesifikasi produk di bawah</p>
          </div>
          <button
            onClick={onClose}
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

          {/* Galeri & Media Produk */}
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-brand-950 uppercase tracking-wider pb-1 border-b border-line/45">Galeri & Media Produk</h5>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-ink-700 block">Cover Utama & Foto Tambahan</label>
              <div className="grid grid-cols-4 gap-3">
                {/* Cover slot */}
                <div className="relative aspect-square border-2 border-dashed border-brand-900/30 rounded-xl overflow-hidden bg-cream-50/50 flex flex-col items-center justify-center p-1">
                  <Image
                    src={activeProduct.image?.src || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop"}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 left-1 right-1 bg-brand-900/80 text-[8px] font-extrabold text-white-soft text-center py-0.5 rounded uppercase">
                    Cover
                  </span>
                </div>

                {/* Additional Gallery slots (Mocked) */}
                {[1, 2, 3].map((num) => {
                  const hasImage = activeProduct.gallery && activeProduct.gallery[num - 1];
                  return (
                    <div
                      key={num}
                      onClick={() => {
                        const currentGallery = [...(activeProduct.gallery || [])];
                        if (currentGallery[num - 1]) {
                          currentGallery.splice(num - 1, 1);
                        } else {
                          currentGallery.push({
                            src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop",
                            alt: `Gallery ${num}`
                          });
                        }
                        setActiveProduct({ ...activeProduct, gallery: currentGallery });
                        showToast(`Mock: Foto tambahan ${num} diperbarui!`, "success");
                      }}
                      className="relative aspect-square border-2 border-dashed border-line hover:border-brand-900/40 rounded-xl overflow-hidden bg-cream-50/20 flex flex-col items-center justify-center p-1 cursor-pointer transition-all"
                    >
                      {hasImage ? (
                        <>
                          <Image
                            src={activeProduct.gallery![num - 1].src}
                            alt={activeProduct.gallery![num - 1].alt}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute top-1 right-1 bg-red-650 text-white-soft rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] font-black hover:bg-red-700">
                            ×
                          </span>
                        </>
                      ) : (
                        <div className="text-center p-2 text-[10px] font-bold text-ink-600">
                          <span className="text-sm block font-normal text-ink-500">+</span>
                          Foto {num}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Writer Assistant Widget */}
          <AIDescriptionGenerator
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />

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
            onClick={onClose}
            className="py-2.5 px-6 border border-line text-ink-700 font-bold rounded-xl text-xs hover:bg-cream-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="py-2.5 px-6 bg-brand-900 hover:bg-brand-850 text-white-soft font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
