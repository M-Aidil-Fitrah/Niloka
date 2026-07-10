import React from "react";
import { Building2 } from "lucide-react";

interface StepBusinessInfoProps {
  shopName: string;
  setShopName: (val: string) => void;
  businessType: string;
  setBusinessType: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  province: string;
  city: string;
  setCity: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  detailAddress: string;
  setDetailAddress: (val: string) => void;
  errors: Record<string, string>;
}

export function StepBusinessInfo({
  shopName,
  setShopName,
  businessType,
  setBusinessType,
  description,
  setDescription,
  province,
  city,
  setCity,
  district,
  setDistrict,
  detailAddress,
  setDetailAddress,
  errors
}: StepBusinessInfoProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-lg font-extrabold text-brand-950 font-accent">Profil Bisnis</h3>
        <p className="text-xs text-ink-600 font-semibold">Tentukan identitas toko minyak atsiri Anda.</p>
      </div>

      {/* Nama Toko */}
      <div>
        <label htmlFor="shopName" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Nama Toko / Usaha
        </label>
        <div className="relative rounded-full shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Building2 className="h-3.5 w-3.5 text-ink-600" />
          </div>
          <input
            id="shopName"
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
              errors.shopName ? "border-red-500" : "border-line/45"
            }`}
            placeholder="Aceh Atsiri Group"
          />
        </div>
        {errors.shopName && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.shopName}</p>
        )}
      </div>

      {/* Tipe Usaha */}
      <div>
        <label htmlFor="businessType" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Tipe Badan Usaha
        </label>
        <select
          id="businessType"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="block w-full px-4 py-2.5 bg-white border border-line/45 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs text-brand-950 font-semibold transition-all"
        >
          <option value="umkm">UMKM Mandiri</option>
          <option value="distiller">Penyuling Minyak Atsiri</option>
          <option value="cooperative">Koperasi Petani Nilam</option>
        </select>
      </div>

      {/* Deskripsi Toko */}
      <div>
        <label htmlFor="description" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Deskripsi Singkat Usaha
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`block w-full px-4 py-2.5 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
            errors.description ? "border-red-500" : "border-line/45"
          }`}
          placeholder="Tuliskan komitmen penyulingan minyak atsiri Anda..."
        />
        {errors.description && (
          <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{errors.description}</p>
        )}
      </div>

      {/* Alamat Wilayah */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="province" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
            Provinsi
          </label>
          <input
            id="province"
            type="text"
            readOnly
            value={province}
            className="block w-full px-4 py-2.5 bg-cream-50 border border-line/45 rounded-full text-xs text-ink-600 font-semibold"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
            Kota / Kabupaten
          </label>
          <input
            id="city"
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`block w-full px-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs text-brand-950 font-semibold transition-all ${
              errors.city ? "border-red-500" : "border-line/45"
            }`}
            placeholder="Aceh Selatan"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label htmlFor="district" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
            Kecamatan
          </label>
          <input
            id="district"
            type="text"
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={`block w-full px-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs text-brand-950 font-semibold transition-all ${
              errors.district ? "border-red-500" : "border-line/45"
            }`}
            placeholder="Tapaktuan"
          />
        </div>
      </div>

      {/* Alamat Detil */}
      <div>
        <label htmlFor="detailAddress" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
          Alamat Lengkap Toko / Penyulingan
        </label>
        <input
          id="detailAddress"
          type="text"
          required
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          className="block w-full px-4 py-2.5 bg-white border border-line/45 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs text-brand-950 font-semibold transition-all"
          placeholder="Jl. Raya Tapaktuan No. 45, Desa Lhok Raya"
        />
      </div>
    </div>
  );
}
