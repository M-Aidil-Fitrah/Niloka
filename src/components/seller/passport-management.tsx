"use client";

import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import type { NilamPassport, Product, ProductFunction } from "@/lib/contracts";
import { showToast } from "../dashboard/dashboard-layout";
import { PassportTable } from "./passport/passport-table";
import { PassportDrawer } from "./passport/passport-drawer";

type PassportManagementProps = {
  products: Product[];
};

export function PassportManagement({ products }: PassportManagementProps) {
  const [passports, setPassports] = useState<NilamPassport[]>([
    {
      id: "pass-001",
      productId: products[0]?.id || "prod-1",
      origin: "Kecamatan Lhoong, Aceh Besar",
      productKind: "essential-oil",
      aromaProfile: ["Woody", "Earthy", "Balsamic"],
      functions: ["relaxation", "sleep-support"],
      usage: "Teteskan 3-5 tetes pada diffuser berisi air 100ml, atau encerkan dengan carrier oil sebelum kontak kulit.",
      safetyNotes: "Hindari kontak langsung dengan mata. Tidak untuk dikonsumsi oral.",
      validationStatus: "validated",
      validatedBy: "UPTD Atsiri Aceh",
      validatedAt: "2026-06-15",
      batchCode: "B-LH-2601",
      farmerGroup: "Kelompok Tani Nilam Jaya Lhoong",
      gpsCoordinates: "5.2144° N, 95.3129° E",
    },
    {
      id: "pass-002",
      productId: products[1]?.id || "prod-2",
      origin: "Kecamatan Blangkejeren, Gayo Lues",
      productKind: "roll-on",
      aromaProfile: ["Minty", "Fresh", "Earthy"],
      functions: ["focus"],
      usage: "Oleskan secukupnya pada area pelipis, pergelangan tangan, atau belakang leher.",
      safetyNotes: "Hanya untuk pemakaian luar. Hentikan jika terjadi kemerahan/iritasi.",
      validationStatus: "pending-review",
      validatedBy: "",
      validatedAt: "",
      batchCode: "B-GL-2604",
      farmerGroup: "Koperasi Atsiri Gayo Highland",
      gpsCoordinates: "3.9873° N, 97.3912° E",
    },
  ]);

  const [activePassport, setActivePassport] = useState<NilamPassport | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setPassports(passports.map((p) => (p.id === activePassport.id ? activePassport : p)));
    setIsEditing(false);
    setActivePassport(null);
    showToast("Nilam Passport berhasil diperbarui!", "success");
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
            Nilam Passport adalah sistem deklarasi transparansi rantai pasok nilam NILOKA. Penjual mendeklarasikan asal-usul panen, profil aroma, cara pemakaian, serta instruksi keselamatan. Data ini akan divalidasi oleh administrator (atau UPTD dinas terkait) sebelum diterbitkan secara publik sebagai jaminan transparansi.
          </p>
        </div>
      </div>

      <PassportTable
        passports={passports}
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
