"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit3, Trash2, AlertTriangle, ShieldCheck, Scale, Compass } from "lucide-react";
import type { AmpasListing, AmpasCondition, AmpasUsageTag, AmpasListingStatus } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";

type AmpasManagementProps = {
  ampasListings: AmpasListing[];
};

export function AmpasManagement({ ampasListings: initialListings }: AmpasManagementProps) {
  const [listings, setListings] = useState<AmpasListing[]>(initialListings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeListing, setActiveListing] = useState<Partial<AmpasListing> | null>(null);

  const usageTagOptions: { value: AmpasUsageTag; label: string }[] = [
    { value: "compost", label: "Kompos Organik" },
    { value: "briquette", label: "Briket Energi" },
    { value: "mushroom-media", label: "Media Jamur" },
    { value: "mulch", label: "Mulsa Pertanian" },
    { value: "animal-feed", label: "Pakan Ternak" },
    { value: "industrial-cellulose", label: "Selulosa Industri" },
  ];

  const handleOpenAdd = () => {
    setActiveListing({
      id: `ampas-${Date.now()}`,
      slug: "",
      sellerId: "seller-aceh-aroma",
      condition: "dry",
      quantityKg: 100,
      pricePerKg: { amount: 5000, currency: "IDR" },
      location: { province: "Aceh", city: "Aceh Besar", district: "Lhoong" },
      distillationProcess: "Penyulingan uap stainless steel suhu 110 derajat selama 8 jam.",
      usageTags: ["compost", "briquette"],
      status: "draft",
      image: { src: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=400&auto=format&fit=crop", alt: "Ampas Nilam" },
      disclaimer: "Platform NILOKA tidak memverifikasi kandungan kimia residue.",
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (listing: AmpasListing) => {
    setActiveListing({ ...listing });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus listing B2B ampas nilam ini?")) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  const handleToggleTag = (tag: AmpasUsageTag) => {
    if (!activeListing) return;
    const currentTags = activeListing.usageTags || [];
    if (currentTags.includes(tag)) {
      setActiveListing({
        ...activeListing,
        usageTags: currentTags.filter((t) => t !== tag),
      });
    } else {
      setActiveListing({
        ...activeListing,
        usageTags: [...currentTags, tag],
      });
    }
  };

  const handleSave = () => {
    if (!activeListing?.quantityKg || !activeListing?.pricePerKg?.amount) {
      alert("Kuantitas dan harga per kg wajib diisi.");
      return;
    }

    const updated = activeListing as AmpasListing;
    if (listings.some((l) => l.id === updated.id)) {
      setListings(listings.map((l) => (l.id === updated.id ? updated : l)));
    } else {
      setListings([updated, ...listings]);
    }
    setIsEditing(false);
    setActiveListing(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Platform Disclaimer Card */}
      <div className="rounded-2xl border border-amber-250 bg-amber-50/50 p-5 flex items-start gap-3 text-xs">
        <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-extrabold text-amber-950">Catatan Regulasi B2B Residue (Ampas Nilam)</strong>
          <p className="text-amber-900/90 leading-relaxed font-medium">
            Residu/ampas nilam dikategorikan sebagai bahan daur ulang (circular economy). Penjual wajib menyertakan deskripsi proses penyulingan secara jujur. Platform tidak memverifikasi kandungan kimia residue secara langsung; pembeli disarankan melakukan uji laboratorium mandiri jika diperlukan.
          </p>
        </div>
      </div>

      {/* 2. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Kelola Ampas Nilam (B2B)</h3>
          <p className="text-xs text-ink-600 mt-1">Publikasikan limbah sulingan nilam untuk industri pupuk, kompos, atau energi briket</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-900 hover:bg-brand-850 text-white-soft font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Listing Ampas
        </button>
      </div>

      {/* 3. Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-[28px] border border-line bg-white-soft overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row"
          >
            {/* Image side */}
            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-cream-50">
              <Image
                src={listing.image.src}
                alt={listing.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>

            {/* Info side */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                    listing.condition === "dry"
                      ? "bg-amber-50 text-amber-800 border-amber-250"
                      : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}>
                    Ampas {listing.condition === "dry" ? "Kering" : "Basah"}
                  </span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    listing.status === "active" ? "text-emerald-800 bg-emerald-50" : "text-ink-600 bg-cream-100"
                  }`}>
                    {listing.status === "active" ? "Aktif" : "Draf"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-brand-950 font-bold">
                    <Scale className="h-4 w-4 text-ink-600" />
                    <span>{listing.quantityKg} Kg</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-950 font-bold">
                    <Compass className="h-4 w-4 text-ink-600" />
                    <span>{listing.location.city}</span>
                  </div>
                </div>

                <p className="text-xs text-ink-650 line-clamp-2 leading-relaxed">
                  {listing.distillationProcess}
                </p>

                {/* Usage Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {listing.usageTags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-ink-600 bg-cream-100 border border-line/50 px-2 py-0.5 rounded">
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-line/30">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-ink-600 uppercase">Harga Per Kg</span>
                  <span className="font-extrabold text-brand-950 text-sm block">
                    {formatRupiah(listing.pricePerKg.amount)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(listing)}
                    className="p-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 rounded-xl transition-colors cursor-pointer"
                    aria-label="Edit listing"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 rounded-xl transition-colors cursor-pointer"
                    aria-label="Hapus listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Drawer modal */}
      {isEditing && activeListing && (
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
                  {listings.some((l) => l.id === activeListing.id) ? "Edit Listing Ampas" : "Tambah Listing Ampas B2B"}
                </h4>
                <p className="text-xs text-ink-600 mt-0.5">Lengkapi spesifikasi residu nilam untuk pencarian industri</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-ink-600 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Batal
              </button>
            </div>

            {/* Form */}
            <div className="p-6 flex-1 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Kondisi Ampas</label>
                  <select
                    className="w-full text-xs font-bold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.condition || "dry"}
                    onChange={(e) => setActiveListing({ ...activeListing, condition: e.target.value as AmpasCondition })}
                  >
                    <option value="dry">Kering (Kadar Air Rendah)</option>
                    <option value="wet">Basah (Segar Setelah Suling)</option>
                    <option value="mixed">Campuran / Semi-Kering</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Kuantitas Total (Kg)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.quantityKg || ""}
                    onChange={(e) => setActiveListing({ ...activeListing, quantityKg: Number(e.target.value) })}
                    placeholder="Contoh: 500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Harga per Kg (Rp)</label>
                  <input
                    type="number"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.pricePerKg?.amount || ""}
                    onChange={(e) => setActiveListing({
                      ...activeListing,
                      pricePerKg: { amount: Number(e.target.value), currency: "IDR" }
                    })}
                    placeholder="Contoh: 4500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-700">Kota Lokasi Suling</label>
                  <input
                    type="text"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activeListing.location?.city || ""}
                    onChange={(e) => setActiveListing({
                      ...activeListing,
                      location: {
                        province: "Aceh",
                        city: e.target.value,
                        district: activeListing.location?.district || ""
                      }
                    })}
                    placeholder="Contoh: Takengon"
                  />
                </div>
              </div>

              {/* Usage Potentials Checkbox Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-700 block">Potensi Pemanfaatan Terkait</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {usageTagOptions.map((opt) => {
                    const isChecked = activeListing.usageTags?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleToggleTag(opt.value)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          isChecked
                            ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                            : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isChecked && <ShieldCheck className="h-4 w-4 text-brand-900" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distillation Process */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-700">Proses Penyulingan & Catatan Seller</label>
                <textarea
                  rows={4}
                  className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed"
                  value={activeListing.distillationProcess || ""}
                  onChange={(e) => setActiveListing({ ...activeListing, distillationProcess: e.target.value })}
                  placeholder="Deskripsikan proses suling, jenis ketel (stainless/tembaga), serta kondisi kebersihan residu."
                />
              </div>

              {/* Status */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-ink-750 block border-b border-line/30 pb-1 uppercase tracking-wider">Status Listing</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-850">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={activeListing.status === "active"}
                      onChange={() => setActiveListing({ ...activeListing, status: "active" })}
                      className="accent-brand-900"
                    />
                    Aktif / Terlihat di Katalog B2B
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-ink-850">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={activeListing.status === "draft"}
                      onChange={() => setActiveListing({ ...activeListing, status: "draft" })}
                      className="accent-brand-900"
                    />
                    Draf internal
                  </label>
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
