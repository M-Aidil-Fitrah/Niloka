"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type { Promo, PromoStatus, Product } from "@/lib/contracts";
import { showToast } from "@/lib/toast";
import { PromoTable } from "./promo/promo-table";
import { PromoDrawer } from "./promo/promo-drawer";
import { useAuth } from "@/context/auth-context";
import { savePromoAction, deletePromoAction } from "@/lib/actions/promo-actions";

type PromoManagementProps = {
  promos: Promo[];
  products?: Product[];
};

export function PromoManagement({ promos: initialPromos, products = [] }: PromoManagementProps) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [isEditing, setIsEditing] = useState(false);
  const [activePromo, setActivePromo] = useState<Partial<Promo> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const currentSellerId = user?.sellerId ?? "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPromos(initialPromos);
  }, [initialPromos]);
  
  const itemsPerPage = 6;
  const sellerPromos = promos.filter((p) => p.sellerId === currentSellerId);
  const totalPages = Math.ceil(sellerPromos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromos = sellerPromos.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsEditing(false);
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, []);

  const handleOpenAdd = () => {
    if (!currentSellerId) {
      showToast("Akun ini belum terhubung ke profil seller.", "error");
      return;
    }

    setActivePromo({
      id: `promo-${Date.now()}`,
      sellerId: currentSellerId,
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
    deletePromoAction(id).then((res) => {
      if (res.ok) {
        const filtered = promos.filter((p) => p.id !== id);
        setPromos(filtered);
        const filteredSellerPromos = filtered.filter((p) => p.sellerId === currentSellerId);
        const newTotalPages = Math.ceil(filteredSellerPromos.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        showToast("Voucher promo berhasil dinonaktifkan.", "success");
      } else {
        showToast(res.message, "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast("Gagal menghapus promo.", "error");
    });
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

    savePromoAction(updated).then((res) => {
      if (res.ok) {
        if (promos.some((p) => p.id === updated.id)) {
          setPromos(promos.map((p) => (p.id === updated.id ? updated : p)));
        } else {
          setPromos([updated, ...promos]);
          setCurrentPage(1);
        }
        setIsEditing(false);
        setActivePromo(null);
        showToast("Voucher promo berhasil disimpan!", "success");
      } else {
        showToast(res.message, "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast("Gagal menyimpan voucher promo.", "error");
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/45 pb-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Voucher & Promosi</h3>
          <p className="text-xs text-ink-600 mt-1 font-semibold">Kelola diskon belanja, kupon promo toko, dan subsidi gratis ongkir</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-900 hover:bg-brand-850 text-white-soft font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Buat Voucher Promo
        </button>
      </div>

      <PromoTable
        promos={paginatedPromos}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalCount={promos.length}
        onOpenEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <PromoDrawer
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        activePromo={activePromo}
        setActivePromo={setActivePromo}
        onSave={handleSave}
        products={products}
        onGenerateCode={handleGenerateCode}
        promos={promos}
      />
    </div>
  );
}
