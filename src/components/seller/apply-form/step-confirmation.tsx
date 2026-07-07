import React from "react";

interface StepConfirmationProps {
  name: string;
  phone: string;
  nik: string;
  shopName: string;
  businessType: string;
  detailAddress: string;
  district: string;
  city: string;
  province: string;
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
}

export function StepConfirmation({
  name,
  phone,
  nik,
  shopName,
  businessType,
  detailAddress,
  district,
  city,
  province,
  agreeTerms,
  setAgreeTerms
}: StepConfirmationProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-lg font-extrabold text-brand-950 font-accent">Tinjau & Kirim Pengajuan</h3>
        <p className="text-xs text-ink-600 font-semibold">Tinjau ulang informasi bisnis Anda sebelum proses pengiriman.</p>
      </div>

      {/* Ringkasan Data */}
      <div className="bg-cream-50 rounded-2xl p-4 border border-line/35 space-y-3.5 text-xs text-ink-600 font-semibold">
        <div className="pb-2 border-b border-line/25">
          <span className="block text-[10px] font-extrabold text-gold-700 uppercase tracking-widest mb-1">PROFIL PRIBADI</span>
          <div className="grid grid-cols-2 gap-y-1 text-[11px]">
            <span>Nama Pemohon:</span>
            <span className="text-brand-950 font-bold text-right">{name}</span>
            <span>WhatsApp:</span>
            <span className="text-brand-950 font-bold text-right">{phone}</span>
            <span>NIK KTP:</span>
            <span className="text-brand-950 font-bold text-right">{nik}</span>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-extrabold text-gold-700 uppercase tracking-widest mb-1">PROFIL BISNIS</span>
          <div className="grid grid-cols-2 gap-y-1 text-[11px]">
            <span>Nama Toko:</span>
            <span className="text-brand-950 font-bold text-right">{shopName}</span>
            <span>Tipe Usaha:</span>
            <span className="text-brand-950 font-bold text-right uppercase">{businessType}</span>
            <span>Alamat Usaha:</span>
            <span className="text-brand-950 font-bold text-right truncate pl-4">
              {detailAddress}, Kec. {district}, {city}, {province}
            </span>
          </div>
        </div>
      </div>

      {/* S&K Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 h-3.5 w-3.5 text-brand-900 border-line/65 rounded focus:ring-brand-700 accent-brand-900 cursor-pointer"
          />
          <span className="text-[10px] text-ink-600 font-semibold leading-relaxed">
            Saya menyatakan bahwa semua data yang diisi adalah benar dan foto dokumen legalitas yang saya unggah adalah milik usaha saya pribadi secara sah.
          </span>
        </label>
      </div>
    </div>
  );
}
