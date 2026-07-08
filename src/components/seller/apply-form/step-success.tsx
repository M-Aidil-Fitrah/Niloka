import React from "react";
import Link from "next/link";
import { FileCheck } from "lucide-react";

interface StepSuccessProps {
  name: string;
  shopName: string;
}

export function StepSuccess({ name, shopName }: StepSuccessProps) {
  return (
    <div className="text-center py-6 space-y-5 animate-fade-in">
      <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-900">
        <FileCheck className="h-9 w-9" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-brand-950 font-accent tracking-tight">
          Pengajuan Dikirim!
        </h2>
        <p className="text-xs text-ink-600 font-semibold leading-relaxed max-w-sm mx-auto">
          Terima kasih, pengajuan seller Anda telah berhasil disimpan di antrean. Tim verifikator NILOKA akan memeriksa dokumen legalitas Anda dalam kurun waktu 1x24 jam.
        </p>
      </div>
      <div className="pt-4 border-t border-line/25 max-w-xs mx-auto text-left space-y-2 text-[10px] text-ink-600 font-semibold">
        <div className="flex justify-between">
          <span>Nama Toko:</span>
          <span className="text-brand-950 font-bold">{shopName}</span>
        </div>
        <div className="flex justify-between">
          <span>Pemilik:</span>
          <span className="text-brand-950 font-bold">{name}</span>
        </div>
        <div className="flex justify-between">
          <span>Status Verifikasi:</span>
          <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-bold uppercase tracking-wider text-[8px]">
            Menunggu Review
          </span>
        </div>
      </div>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-full shadow-sm text-xs font-bold !text-white bg-brand-950 hover:bg-brand-900 transition-all cursor-pointer"
        >
          Kembali ke Pasar
        </Link>
      </div>
    </div>
  );
}
