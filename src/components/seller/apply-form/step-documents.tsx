import React, { useRef } from "react";
import { Upload, Check, X } from "lucide-react";

interface StepDocumentsProps {
  ktpFileName: string;
  setKtpFileName: (val: string) => void;
  nibFileName: string;
  setNibFileName: (val: string) => void;
  errors: Record<string, string>;
}

export function StepDocuments({
  ktpFileName,
  setKtpFileName,
  nibFileName,
  setNibFileName,
  errors
}: StepDocumentsProps) {
  const ktpRef = useRef<HTMLInputElement>(null);
  const nibRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(
    ref: React.RefObject<HTMLInputElement | null>,
    setter: (name: string) => void,
  ) {
    const input = ref.current;
    if (!input) return;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) setter(file.name);
    };
    input.click();
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <input ref={ktpRef} type="file" accept="image/jpeg,image/png" hidden />
      <input ref={nibRef} type="file" accept="image/jpeg,image/png,application/pdf" hidden />

      <div>
        <h3 className="text-lg font-extrabold text-brand-950 font-accent">Unggah Dokumen Legalitas</h3>
        <p className="text-xs text-ink-600 font-semibold">Unggah dokumen pelengkap untuk validasi identitas.</p>
      </div>

      {/* KTP */}
      <div>
        <span className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Foto KTP Asli (Wajib)
        </span>
        {ktpFileName ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-50 border border-line/45 text-xs">
            <span className="font-semibold text-brand-950 truncate max-w-[80%] flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              {ktpFileName}
            </span>
            <button 
              type="button" 
              onClick={() => setKtpFileName("")}
              className="p-1 rounded-full hover:bg-cream-100 text-red-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => handleFileSelect(ktpRef, setKtpFileName)}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-cream-50/30 ${
              errors.ktp ? "border-red-500" : "border-line/50"
            }`}
          >
            <Upload className="h-6 w-6 text-ink-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-brand-950">Klik untuk unggah Foto KTP</p>
            <p className="text-[9px] text-ink-600/65 font-semibold mt-1">Mendukung format JPG, PNG maksimal 5MB</p>
          </div>
        )}
        {errors.ktp && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.ktp}</p>
        )}
      </div>

      {/* NIB / Surat Keterangan */}
      <div>
        <span className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Foto NIB / Surat Izin Usaha (Opsional)
        </span>
        {nibFileName ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-50 border border-line/45 text-xs">
            <span className="font-semibold text-brand-950 truncate max-w-[80%] flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              {nibFileName}
            </span>
            <button 
              type="button" 
              onClick={() => setNibFileName("")}
              className="p-1 rounded-full hover:bg-cream-100 text-red-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => handleFileSelect(nibRef, setNibFileName)}
            className="border-2 border-dashed border-line/50 rounded-2xl p-6 text-center cursor-pointer hover:bg-cream-50/30 transition-all"
          >
            <Upload className="h-6 w-6 text-ink-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-brand-950">Klik untuk unggah Dokumen NIB</p>
            <p className="text-[9px] text-ink-600/65 font-semibold mt-1">Format PDF, JPG, PNG maksimal 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
