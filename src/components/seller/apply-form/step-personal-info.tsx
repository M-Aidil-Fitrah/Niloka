import React from "react";
import { User, Phone, FileText } from "lucide-react";

interface StepPersonalInfoProps {
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  nik: string;
  setNik: (val: string) => void;
  errors: Record<string, string>;
}

export function StepPersonalInfo({
  name,
  setName,
  phone,
  setPhone,
  nik,
  setNik,
  errors
}: StepPersonalInfoProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-lg font-extrabold text-brand-950 font-accent">Informasi Pribadi</h3>
        <p className="text-xs text-ink-600 font-semibold">Silakan isi data diri lengkap sesuai KTP Anda.</p>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label htmlFor="name" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Nama Lengkap
        </label>
        <div className="relative rounded-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <User className="h-3.5 w-3.5 text-ink-600" />
          </div>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
              errors.name ? "border-red-500" : "border-line/45"
            }`}
            placeholder="Nama sesuai KTP"
          />
        </div>
        {errors.name && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.name}</p>
        )}
      </div>

      {/* Nomor HP/WA */}
      <div>
        <label htmlFor="phone" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Nomor HP / WhatsApp
        </label>
        <div className="relative rounded-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Phone className="h-3.5 w-3.5 text-ink-600" />
          </div>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
              errors.phone ? "border-red-500" : "border-line/45"
            }`}
            placeholder="081234567890"
          />
        </div>
        {errors.phone && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.phone}</p>
        )}
      </div>

      {/* NIK KTP */}
      <div>
        <label htmlFor="nik" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          NIK KTP (16 Digit)
        </label>
        <div className="relative rounded-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FileText className="h-3.5 w-3.5 text-ink-600" />
          </div>
          <input
            id="nik"
            type="text"
            required
            maxLength={16}
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
            className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
              errors.nik ? "border-red-500" : "border-line/45"
            }`}
            placeholder="110102xxxxxxxxxx"
          />
        </div>
        {errors.nik && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.nik}</p>
        )}
      </div>
    </div>
  );
}
