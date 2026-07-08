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
  const [currentSellerId, setCurrentSellerId] = useState("seller-aceh-aroma");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niloka_ampas_listings");
      const user = localStorage.getItem("niloka_current_user");
      setTimeout(() => {
        if (stored) {
          setListings(JSON.parse(stored));
        }
        if (user && user !== "buyer") {
          setCurrentSellerId(user);
        }
      }, 0);
    }
  }, []);
  
  const itemsPerPage = 4;
  const sellerListings = listings;
  const totalPages = Math.ceil(sellerListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = sellerListings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      sellerId: currentSellerId,
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
    if (typeof window !== "undefined") {
      localStorage.setItem("niloka_ampas_listings", JSON.stringify(filtered));
    }
    const filteredSellerListings = filtered.filter((l) => l.sellerId === currentSellerId);
    const newTotalPages = Math.ceil(filteredSellerListings.length / itemsPerPage);
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

    if (activeListing.wholesaleEnabled) {
      const minQty = activeListing.wholesaleMinQtyKg;
      const wholesalePrice = activeListing.wholesalePricePerKg?.amount;
      const normalPrice = activeListing.pricePerKg.amount;
      const stock = activeListing.quantityKg;

      if (minQty === undefined || minQty === null || minQty <= 1) {
        showToast("Minimal pembelian grosir harus lebih dari 1 kg.", "warning");
        return;
      }
      if (wholesalePrice === undefined || wholesalePrice === null || wholesalePrice >= normalPrice) {
        showToast("Harga grosir harus lebih rendah dari harga normal.", "warning");
        return;
      }
      if (minQty > stock) {
        showToast("Minimal pembelian grosir tidak boleh melebihi stok yang tersedia.", "warning");
        return;
      }
    }

    const updated = { ...activeListing } as AmpasListing;
    if (!updated.slug) {
      updated.slug = `ampas-nilam-${updated.id.replace("ampas-", "")}`;
    }

    let updatedListings: AmpasListing[] = [];
    if (listings.some((l) => l.id === updated.id)) {
      updatedListings = listings.map((l) => (l.id === updated.id ? updated : l));
    } else {
      updatedListings = [updated, ...listings];
      setCurrentPage(1);
    }
    setListings(updatedListings);
    if (typeof window !== "undefined") {
      localStorage.setItem("niloka_ampas_listings", JSON.stringify(updatedListings));
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
          <strong className="font-extrabold text-amber-950">Catatan Regulasi Residue (Ampas Nilam)</strong>
          <p className="text-amber-900/90 leading-relaxed font-medium">
            Residu atau ampas nilam dikategorikan sebagai bahan daur ulang dalam ekonomi sirkular. Penjual wajib menyertakan deskripsi proses penyulingan, profil fisik, dan sediaan volume secara akurat demi kelancaran transaksi.
          </p>
        </div>
      </div>

      {/* 2. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Kelola Ampas Nilam</h3>
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
