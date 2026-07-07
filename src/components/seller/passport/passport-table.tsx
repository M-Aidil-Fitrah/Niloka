"use client";

import { Users, MapPin, CheckCircle2, RefreshCw } from "lucide-react";
import type { NilamPassport, Product } from "@/lib/contracts";

type PassportTableProps = {
  passports: NilamPassport[];
  products: Product[];
  onOpenEdit: (passport: NilamPassport) => void;
};

export function PassportTable({ passports, products, onOpenEdit }: PassportTableProps) {
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produk Nilam Premium";
  };

  return (
    <div className="rounded-[28px] border border-line bg-white-soft overflow-hidden">
      <div className="p-6 border-b border-line bg-cream-50/30">
        <h4 className="font-extrabold text-brand-950 text-sm">Daftar Passport Produk Anda</h4>
        <p className="text-xs text-ink-600 mt-1 font-semibold">Pantau status validasi dan isi detail transparansi panen</p>
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
                    onClick={() => onOpenEdit(passport)}
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
  );
}
