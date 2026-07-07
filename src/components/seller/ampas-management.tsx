"use client";

import { useState, useEffect } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import type { AmpasListing, AmpasCondition, AmpasUsageTag } from "@/lib/contracts";
import { showToast } from "../dashboard/dashboard-layout";
import { AmpasTable } from "./ampas/ampas-table";
import { AmpasDrawer } from "./ampas/ampas-drawer";

type AmpasManagementProps = {
  ampasListings: AmpasListing[];
};

export function AmpasManagement({ ampasListings: initialListings }: AmpasManagementProps) {
  const [listings, setListings] = useState<AmpasListing[]>(initialListings);
  const [isEditing, setIsEditing] = useState(false);
  const [activeListing, setActiveListing] = useState<Partial<AmpasListing> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = listings.slice(startIndex, startIndex + itemsPerPage);

  const usageTagOptions: { value: AmpasUsageTag; label: string }[] = [
    { value: "compost", label: "Kompos Organik" },
    { value: "briquette", label: "Briket Energi" },
    { value: "mushroom-media", label: "Media Jamur" },
    { value: "mulch", label: "Mulsa Pertanian" },
    { value: "animal-feed", label: "Pakan Ternak" },
    { value: "industrial-cellulose", label: "Selulosa Industri" },
  ];

  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsEditing(false);
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, []);

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
      distillationDate: new Date().toISOString().split("T")[0],
      shippingOption: "both",
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (listing: AmpasListing) => {
    setActiveListing({
      distillationDate: new Date().toISOString().split("T")[0],
      shippingOption: "both",
      ...listing,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const filtered = listings.filter((l) => l.id !== id);
    setListings(filtered);
    const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    showToast("Listing ampas nilam berhasil dihapus.", "success");
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
      showToast("Kuantitas dan harga per kg wajib diisi.", "warning");
      return;
    }

    const updated = activeListing as AmpasListing;
    if (listings.some((l) => l.id === updated.id)) {
      setListings(listings.map((l) => (l.id === updated.id ? updated : l)));
    } else {
      setListings([updated, ...listings]);
      setCurrentPage(1);
    }
    setIsEditing(false);
    setActiveListing(null);
    showToast("Listing ampas nilam berhasil disimpan!", "success");
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
          <p className="text-xs text-ink-600 mt-1 font-semibold">Publikasikan limbah sulingan nilam untuk industri pupuk, kompos, atau energi briket</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-900 hover:bg-brand-850 text-white-soft font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Listing Ampas
        </button>
      </div>

      <AmpasTable
        listings={paginatedListings}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalCount={listings.length}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AmpasDrawer
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        activeListing={activeListing}
        setActiveListing={setActiveListing}
        onSave={handleSave}
        onToggleTag={handleToggleTag}
        listings={listings}
        usageTagOptions={usageTagOptions}
      />
    </div>
  );
}
