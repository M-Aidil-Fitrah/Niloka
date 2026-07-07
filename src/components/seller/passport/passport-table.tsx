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

      {/* Mobile Card View */}
      <div className="block md:hidden p-4 space-y-4">
        {passports.length === 0 ? (
          <div className="text-center p-6 text-xs text-ink-600 font-bold">
            Tidak ada passport produk.
          </div>
        ) : (
          passports.map((passport) => (
            <div
              key={passport.id}
              className="rounded-2xl border border-line/60 bg-white-soft p-4.5 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-start gap-2.5">
                <div className="min-w-0 space-y-1">
                  <h4 className="font-extrabold text-brand-950 text-xs sm:text-sm leading-snug">
                    {getProductName(passport.productId)}
                  </h4>
                  <span className="inline-block bg-brand-100 text-brand-905 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    Batch: {passport.batchCode || "B-LH-2601"}
                  </span>
                </div>
                <div className="shrink-0">
                  {passport.validationStatus === "validated" ? (
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Valid
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse">
                      <RefreshCw className="h-3 w-3" />
                      Review
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2.5 border-t border-line/30">
                <div className="flex items-start gap-1.5 text-ink-650">
                  <MapPin className="h-3.5 w-3.5 text-brand-900 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold block text-[10px] text-ink-500">Asal Panen</span>
                    <span className="font-bold text-brand-950 text-[11px]">{passport.origin}</span>
                    {passport.gpsCoordinates && (
                      <span className="text-[9px] font-extrabold text-brand-900 block">{passport.gpsCoordinates}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-ink-650">
                  <Users className="h-3.5 w-3.5 text-brand-900 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold block text-[10px] text-ink-500">Kelompok Tani</span>
                    <span className="font-bold text-brand-950 text-[11px]">{passport.farmerGroup || "Kelompok Tani"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1.5">
                {passport.aromaProfile.map((a) => (
                  <span key={a} className="bg-cream-100 border border-line/55 px-2 py-0.5 rounded text-[9px] font-bold text-ink-700">
                    {a}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onOpenEdit(passport)}
                className="w-full mt-2 py-2 bg-cream-100 hover:bg-cream-250 border border-line text-brand-950 font-bold rounded-xl text-[11px] transition-colors cursor-pointer text-center block"
              >
                Lengkapi Passport
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
