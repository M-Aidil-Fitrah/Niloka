"use client";

import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import type { NilamPassport, Product, ProductFunction } from "@/lib/contracts";
import { showToast } from "../dashboard/dashboard-layout";
import { PassportTable } from "./passport/passport-table";
import { PassportDrawer } from "./passport/passport-drawer";
import { useAuth } from "@/context/auth-context";
import { savePassportAction, getSellerPassportsAction } from "@/lib/actions/passport-actions";

type PassportManagementProps = {
  products: Product[];
};

export function PassportManagement({ products }: PassportManagementProps) {
  const [passports, setPassports] = useState<NilamPassport[]>([]);
  const [activePassport, setActivePassport] = useState<NilamPassport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const currentSellerId = user?.sellerId ?? "";

  useEffect(() => {
    if (user?.sellerId) {
      getSellerPassportsAction()
        .then((data) => {
          setPassports(data);
        })
        .catch((err) => {
          console.error("Failed to load seller passports", err);
        });
    }
  }, [user]);

  // Filter products by seller and then filter passports matching those products
  const sellerProductIds = products.filter((p) => p.sellerId === currentSellerId).map((p) => p.id);
  const sellerPassports = passports.filter((pass) => sellerProductIds.includes(pass.productId));

  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsEditing(false);
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, []);

  const aromaOptions = ["Woody", "Earthy", "Balsamic", "Sweet", "Minty", "Spicy", "Camphorous", "Herbaceous"];
  const functionOptions: { value: ProductFunction; label: string }[] = [
    { value: "relaxation", label: "Relaksasi & Ketenangan" },
    { value: "focus", label: "Konsentrasi & Fokus" },
    { value: "sleep-support", label: "Membantu Tidur" },
    { value: "skin-care", label: "Perawatan Kulit" },
    { value: "home-fragrance", label: "Wewangian Ruangan" },
  ];

  const handleOpenEdit = (passport: NilamPassport) => {
    setActivePassport({
      batchCode: "B-LH-2601",
      farmerGroup: "Kelompok Tani Nilam Jaya Lhoong",
      gpsCoordinates: "5.2144° N, 95.3129° E",
      ...passport,
    });
    setIsEditing(true);
  };

  const handleToggleAroma = (aroma: string) => {
    if (!activePassport) return;
    const current = activePassport.aromaProfile || [];
    if (current.includes(aroma)) {
      setActivePassport({ ...activePassport, aromaProfile: current.filter((a) => a !== aroma) });
    } else {
      setActivePassport({ ...activePassport, aromaProfile: [...current, aroma] });
    }
  };

  const handleToggleFunction = (func: ProductFunction) => {
    if (!activePassport) return;
    const current = activePassport.functions || [];
    if (current.includes(func)) {
      setActivePassport({ ...activePassport, functions: current.filter((f) => f !== func) });
    } else {
      setActivePassport({ ...activePassport, functions: [...current, func] });
    }
  };

  const handleSave = () => {
    if (!activePassport) return;

    // Set validationStatus temporarily to pending-review in optimistic UI update
    const updatedPassport = {
      ...activePassport,
      validationStatus: "pending-review" as const,
    };

    savePassportAction(updatedPassport).then((res) => {
      if (res.ok) {
        setPassports(passports.map((p) => (p.id === updatedPassport.id ? updatedPassport : p)));
        setIsEditing(false);
        setActivePassport(null);
        showToast("Nilam Passport berhasil diajukan untuk peninjauan!", "success");
      } else {
        showToast(res.message, "error");
      }
    }).catch((err) => {
      console.error(err);
      showToast("Gagal mengajukan Nilam Passport.", "error");
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Nilam Passport Concept Explainer */}
      <div className="rounded-2xl border border-line bg-white-soft p-6 flex flex-col sm:flex-row gap-5 items-start">
        <div className="p-3 bg-brand-100/50 border border-brand-200/50 rounded-2xl text-brand-900 shrink-0">
          <Compass className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-brand-950 text-sm">Apa itu Nilam Passport?</h4>
          <p className="text-xs text-ink-600 leading-relaxed font-medium">
            Nilam Passport merupakan fitur transparansi produk pada platform NILOKA. Penjual mengisi informasi transparansi produk saat membuat atau melengkapi produk, yang kemudian ditinjau oleh administrator sebelum dipublikasikan kepada konsumen guna meningkatkan transparansi dan kepercayaan.
          </p>
        </div>
      </div>

      <PassportTable
        passports={sellerPassports}
        products={products}
        onOpenEdit={handleOpenEdit}
      />

      <PassportDrawer
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        activePassport={activePassport}
        setActivePassport={setActivePassport}
        onSave={handleSave}
        products={products}
        onToggleAroma={handleToggleAroma}
        onToggleFunction={handleToggleFunction}
        aromaOptions={aromaOptions}
        functionOptions={functionOptions}
      />
    </div>
  );
}
