"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Tag, Percent, Truck, AlertCircle } from "lucide-react";
import type { Promo, PromoType, PromoStatus, Product } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";
import { showToast } from "../dashboard/dashboard-layout";

type PromoManagementProps = {
  promos: Promo[];
  products?: Product[];
};

export function PromoManagement({ promos: initialPromos, products = [] }: PromoManagementProps) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [isEditing, setIsEditing] = useState(false);
  const [activePromo, setActivePromo] = useState<Partial<Promo> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(promos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromos = promos.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsEditing(false);
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, []);

  const handleOpenAdd = () => {
    setActivePromo({
      id: `promo-${Date.now()}`,
      sellerId: "seller-aceh-aroma",
      title: "",
      code: "",
      status: "scheduled",
      type: "percentage",
      value: 10,
      startsAt: new Date().toISOString().slice(0, 16),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      minSubtotal: { amount: 100000, currency: "IDR" },
      usageLimit: 50,
      usedCount: 0,
      productIds: [],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (promo: Promo) => {
    setActivePromo({
      ...promo,
      startsAt: new Date(promo.startsAt).toISOString().slice(0, 16),
      endsAt: new Date(promo.endsAt).toISOString().slice(0, 16),
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const filtered = promos.filter((p) => p.id !== id);
    setPromos(filtered);
    const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    showToast("Voucher promo berhasil dinonaktifkan.", "success");
  };

  const handleGenerateCode = () => {
    if (!activePromo) return;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setActivePromo({
      ...activePromo,
      code: `NILOKA${randomSuffix}`,
    });
  };

  const handleSave = () => {
    if (!activePromo?.title || !activePromo?.code || !activePromo?.value) {
      showToast("Judul promo, kode kupon, dan nilai potongan wajib diisi.", "warning");
      return;
    }

    const now = new Date();
    const start = new Date(activePromo.startsAt || "");
    const end = new Date(activePromo.endsAt || "");
    let calculatedStatus: PromoStatus = "active";
    if (now < start) {
      calculatedStatus = "scheduled";
    } else if (now > end) {
      calculatedStatus = "expired";
    }

    const updated = {
      ...activePromo,
      status: calculatedStatus,
    } as Promo;

    if (promos.some((p) => p.id === updated.id)) {
      setPromos(promos.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      setPromos([updated, ...promos]);
      setCurrentPage(1);
    }
    setIsEditing(false);
    setActivePromo(null);
    showToast("Voucher promo berhasil disimpan!", "success");
  };

  const getStatusBadge = (status: PromoStatus) => {
    const map: Record<PromoStatus, { text: string; cls: string }> = {
      active: { text: "Aktif", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
      scheduled: { text: "Terjadwal", cls: "bg-blue-50 text-blue-800 border-blue-200" },
      expired: { text: "Kedaluwarsa", cls: "bg-red-50 text-red-800 border-red-200" },
      disabled: { text: "Dinonaktifkan", cls: "bg-cream-100 text-ink-600 border-line" },
    };
    const found = map[status] || map.disabled;
    return (
      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${found.cls}`}>
        {found.text}
      </span>
    );
  };

  const getTypeIcon = (type: PromoType) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4.5 w-4.5 text-brand-900" />;
      case "fixed-amount":
        return <Tag className="h-4.5 w-4.5 text-brand-900" />;
      case "free-shipping":
        return <Truck className="h-4.5 w-4.5 text-brand-900" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Voucher & Promosi</h3>
          <p className="text-xs text-ink-600 mt-1">Kelola diskon belanja, kupon promo toko, dan subsidi gratis ongkir</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-900 hover:bg-brand-850 text-white-soft font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Buat Voucher Promo
        </button>
      </div>

      {/* 2. Promo Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPromos.map((promo) => (
          <div
            key={promo.id}
            className="rounded-[28px] border border-line bg-white-soft p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-3">
              {/* Type icon + Badge */}
              <div className="flex justify-between items-center">
                <div className="p-2.5 bg-cream-100/80 border border-line/50 rounded-xl shrink-0">
                  {getTypeIcon(promo.type)}
                </div>
                {getStatusBadge(promo.status)}
              </div>

              {/* Title & Code */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-950 text-sm leading-snug line-clamp-1">
                  {promo.title}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-ink-600 uppercase">KODE KUPON:</span>
                  <code className="text-xs font-mono font-bold text-brand-950 bg-cream-50 border border-line/55 px-2 py-0.5 rounded">
                    {promo.code}
                  </code>
                </div>
              </div>

              {/* Discount details */}
              <div className="pt-1.5 space-y-1 border-t border-line/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-600 font-medium">Potongan</span>
                  <strong className="font-extrabold text-brand-950">
                    {promo.type === "percentage"
                      ? `${promo.value}%`
                      : promo.type === "fixed-amount"
                      ? formatRupiah(promo.value)
                      : "Gratis Ongkir"}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-650 font-medium">Minimal Belanja</span>
                  <strong className="font-bold text-brand-950">
                    {formatRupiah(promo.minSubtotal.amount)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-650 font-medium">Klaim Terpakai</span>
                  <strong className="font-bold text-brand-950">
                    {promo.usedCount} / {promo.usageLimit} kali
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-line/30 flex gap-2.5">
              <button
                onClick={() => handleOpenEdit(promo)}
                className="flex-1 py-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                aria-label="Hapus promo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-line/40">
          <span className="text-xs font-semibold text-ink-600">
            Menampilkan <strong className="text-brand-950">{startIndex + 1}</strong> - <strong className="text-brand-950">{Math.min(startIndex + itemsPerPage, promos.length)}</strong> dari <strong className="text-brand-950">{promos.length}</strong> voucher
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

      {/* 3. Modal Drawer */}
      {isEditing && activePromo && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditing(false)}
          />

          <div className="relative w-full max-w-xl bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
            {/* Header */}
            <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
              <div>
                <h4 className="font-extrabold text-brand-950 text-base">
                  {promos.some((p) => p.id === activePromo.id) ? "Edit Parameter Voucher" : "Buat Voucher Baru"}
                </h4>
                <p className="text-xs text-ink-600 mt-0.5">Atur skema diskon, kupon kode, serta batas penggunaan</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-ink-600 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Batal
              </button>
            </div>

            {/* Form Container */}
            <div className="p-6 flex-1 space-y-6">
              {/* Type and Name */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Jenis Promosi</label>
                  <select
                    className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.type || "percentage"}
                    onChange={(e) => setActivePromo({ ...activePromo, type: e.target.value as PromoType })}
                  >
                    <option value="percentage">Persentase Diskon (%)</option>
                    <option value="fixed-amount">Potongan Tetap Rupiah (Rp)</option>
                    <option value="free-shipping">Subsidi Gratis Ongkir</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Nama Promosi</label>
                  <input
                    type="text"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.title || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, title: e.target.value })}
                    placeholder="Contoh: Diskon Harbolnas 10%"
                  />
                </div>
              </div>

              {/* Coupon code with random generator */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-700 block">Kode Kupon Unik</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 text-xs font-mono font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 uppercase"
                    value={activePromo.code || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, code: e.target.value })}
                    placeholder="Contoh: MERDEKANILAM"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold text-xs rounded-xl px-4 cursor-pointer transition-all"
                  >
                    Acak Kode
                  </button>
                </div>
              </div>

              {/* Value and limits */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">
                    {activePromo.type === "percentage" ? "Nilai Persen (%)" : "Jumlah Potongan (Rp)"}
                  </label>
                  <input
                    type="number"
                    disabled={activePromo.type === "free-shipping"}
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 disabled:bg-cream-50/50"
                    value={activePromo.type === "free-shipping" ? "" : activePromo.value || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, value: Number(e.target.value) })}
                    placeholder={activePromo.type === "percentage" ? "10" : "15000"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.minSubtotal?.amount || ""}
                    onChange={(e) => setActivePromo({
                      ...activePromo,
                      minSubtotal: { amount: Number(e.target.value), currency: "IDR" }
                    })}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Limit Pakai (Kali)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.usageLimit || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, usageLimit: Number(e.target.value) })}
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Masa Berlaku Voucher */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Tanggal Mulai Berlaku</label>
                  <input
                    type="datetime-local"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.startsAt || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, startsAt: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Tanggal Kedaluwarsa</label>
                  <input
                    type="datetime-local"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePromo.endsAt || ""}
                    onChange={(e) => setActivePromo({ ...activePromo, endsAt: e.target.value })}
                  />
                </div>
              </div>

              {/* Target Cakupan Produk */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-ink-700 block">Cakupan Voucher</label>
                <select
                  className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                  value={activePromo.productIds && activePromo.productIds.length > 0 ? "specific" : "all"}
                  onChange={(e) => {
                    if (e.target.value === "all") {
                      setActivePromo({ ...activePromo, productIds: [] });
                    } else {
                      setActivePromo({ ...activePromo, productIds: [products[0]?.id || ""] });
                    }
                  }}
                >
                  <option value="all">Semua Produk (Seluruh Toko)</option>
                  <option value="specific">Hanya Produk Tertentu</option>
                </select>

                {activePromo.productIds && activePromo.productIds.length > 0 && (
                  <div className="border border-line rounded-xl p-3 bg-cream-50/20 max-h-40 overflow-y-auto space-y-2">
                    <span className="text-[10px] font-extrabold text-ink-600 block uppercase">Pilih Produk Yang Memenuhi Syarat:</span>
                    {products.map((prod) => {
                      const isSelected = activePromo.productIds?.includes(prod.id);
                      return (
                        <label key={prod.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-800">
                          <input
                            type="checkbox"
                            className="accent-brand-900"
                            checked={isSelected}
                            onChange={() => {
                              const currentIds = [...(activePromo.productIds || [])];
                              if (isSelected) {
                                setActivePromo({
                                  ...activePromo,
                                  productIds: currentIds.filter((id) => id !== prod.id),
                                });
                              } else {
                                setActivePromo({
                                  ...activePromo,
                                  productIds: [...currentIds, prod.id],
                                });
                              }
                            }}
                          />
                          <span>{prod.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-ink-750 block border-b border-line/30 pb-1 uppercase tracking-wider">Status Voucher</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["active", "scheduled", "disabled"].map((st) => (
                    <label
                      key={st}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        activePromo.status === st
                          ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                          : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="promoStatus"
                        value={st}
                        checked={activePromo.status === st}
                        onChange={() => setActivePromo({ ...activePromo, status: st as PromoStatus })}
                        className="accent-brand-900"
                      />
                      <span className="capitalize">{st === "active" ? "Aktif" : st === "scheduled" ? "Terjadwal" : "Dinonaktifkan"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
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
