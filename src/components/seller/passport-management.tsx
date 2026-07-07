"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Compass, Sparkles, CheckCircle2, RefreshCw, Layers, MapPin, Users } from "lucide-react";
import type { NilamPassport, Product, ProductFunction } from "@/lib/contracts";
import { showToast } from "../dashboard/dashboard-layout";

type PassportManagementProps = {
  products: Product[];
};

export function PassportManagement({ products }: PassportManagementProps) {
  // Let's create mock passports associated with products
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

  // Lists of options
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

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produk Nilam Premium";
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

      {/* 2. Passport Table */}
      <div className="rounded-[28px] border border-line bg-white-soft overflow-hidden">
        <div className="p-6 border-b border-line bg-cream-50/30">
          <h4 className="font-extrabold text-brand-950 text-sm">Daftar Passport Produk Anda</h4>
          <p className="text-xs text-ink-600 mt-1">Pantau status validasi dan isi detail transparansi panen</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line/60 bg-cream-50/20 text-ink-700 font-bold uppercase tracking-wider">
                <th className="p-4 sm:p-5 font-bold">Produk Terkait</th>
                <th className="p-4 sm:p-5 font-bold">Asal Bahan Baku</th>
                <th className="p-4 sm:p-5 font-bold">Profil Utama</th>
                <th className="p-4 sm:p-5 font-bold">Status Validasi</th>
                <th className="p-4 sm:p-5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/35 font-medium text-brand-950">
              {passports.map((passport) => (
                <tr key={passport.id} className="hover:bg-cream-50/30 transition-colors">
                  <td className="p-4 sm:p-5 font-extrabold">
                    <div className="text-xs">{getProductName(passport.productId)}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] text-ink-600 font-bold">
                      <span className="bg-brand-100 text-brand-905 px-1.5 py-0.5 rounded">
                        Batch: {passport.batchCode || "B-LH-2601"}
                      </span>
                      <span className="flex items-center gap-0.5 text-ink-650">
                        <Users className="h-3 w-3 text-brand-900" /> {passport.farmerGroup || "Kelompok Tani"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 font-medium text-ink-650">
                    <div className="text-xs">{passport.origin}</div>
                    {passport.gpsCoordinates && (
                      <div className="text-[9px] font-extrabold text-brand-900 flex items-center gap-0.5 mt-1">
                        <MapPin className="h-3 w-3 text-brand-900 shrink-0" />
                        <span>{passport.gpsCoordinates}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 sm:p-5">
                    <div className="flex flex-wrap gap-1">
                      {passport.aromaProfile.map((a) => (
                        <span key={a} className="bg-cream-100 border border-line/55 px-2 py-0.5 rounded text-[10px] font-bold text-ink-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5">
                    {passport.validationStatus === "validated" ? (
                      <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full uppercase flex items-center gap-1.5 w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        Tervalidasi
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1.5 w-fit animate-pulse">
                        <RefreshCw className="h-3 w-3" />
                        Menunggu Admin
                      </span>
                    )}
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <button
                      onClick={() => handleOpenEdit(passport)}
                      className="py-1.5 px-4 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-[11px] transition-colors cursor-pointer"
                    >
                      Lengkapi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detail/Edit Drawer */}
      {isEditing && activePassport && (
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
                  Rantai Transparansi (Nilam Passport)
                </h4>
                <p className="text-xs text-ink-600 mt-0.5">
                  Lengkapi deklarasi kejujuran untuk produk: <strong className="text-brand-950 font-bold">{getProductName(activePassport.productId)}</strong>
                </p>
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
              {/* Origin */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-700">Asal Panen / Distrik Penyulingan</label>
                <input
                  type="text"
                  className="w-full text-xs font-semibold border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                  value={activePassport.origin}
                  onChange={(e) => setActivePassport({ ...activePassport, origin: e.target.value })}
                  placeholder="Contoh: Desa Lhong, Kabupaten Aceh Besar"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-ink-700">Nomor Batch / Kode Panen</label>
                  <input
                    type="text"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePassport.batchCode || ""}
                    onChange={(e) => setActivePassport({ ...activePassport, batchCode: e.target.value })}
                    placeholder="B-LH-2601"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-ink-700">Kelompok Tani / Mitra</label>
                  <input
                    type="text"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePassport.farmerGroup || ""}
                    onChange={(e) => setActivePassport({ ...activePassport, farmerGroup: e.target.value })}
                    placeholder="Kelompok Tani..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-ink-700">GPS Lahan (Koordinat)</label>
                  <input
                    type="text"
                    className="w-full text-xs font-semibold border border-line rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
                    value={activePassport.gpsCoordinates || ""}
                    onChange={(e) => setActivePassport({ ...activePassport, gpsCoordinates: e.target.value })}
                    placeholder="5.2144° N, 95.3129° E"
                  />
                </div>
              </div>

              {/* Aroma Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-700 block">Karakter Aroma Utama</label>
                <div className="flex flex-wrap gap-2">
                  {aromaOptions.map((aroma) => {
                    const isSelected = activePassport.aromaProfile?.includes(aroma);
                    return (
                      <button
                        key={aroma}
                        type="button"
                        onClick={() => handleToggleAroma(aroma)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-900 text-white-soft border-brand-950"
                            : "bg-cream-50 border-line text-ink-700 hover:bg-cream-100"
                        }`}
                      >
                        {aroma}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Function Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-700 block">Fungsi Terkait</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {functionOptions.map((opt) => {
                    const isSelected = activePassport.functions?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleToggleFunction(opt.value)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-100/50 border-brand-900/40 text-brand-950"
                            : "bg-white-soft border-line text-ink-650 hover:bg-cream-100/30"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-brand-900" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Usage Instruction */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-700">Cara Penggunaan Aman</label>
                <textarea
                  rows={3}
                  className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed"
                  value={activePassport.usage}
                  onChange={(e) => setActivePassport({ ...activePassport, usage: e.target.value })}
                  placeholder="Instruksi takaran penggunaan atau saran pengenceran..."
                />
              </div>

              {/* Safety Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-750 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                  Catatan Keamanan & Kontraindikasi
                </label>
                <textarea
                  rows={3}
                  className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed"
                  value={activePassport.safetyNotes}
                  onChange={(e) => setActivePassport({ ...activePassport, safetyNotes: e.target.value })}
                  placeholder="Informasi kerentanan alergi kulit, saran tidak ditelan, atau anak-anak..."
                />
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
                Simpan & Ajukan Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
