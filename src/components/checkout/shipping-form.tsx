import { useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";

type ShippingFormProps = {
  receiverName: string;
  setReceiverName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  province: string;
  setProvince: (val: string) => void;
  courier: string;
  setCourier: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
};

export function ShippingForm({
  receiverName,
  setReceiverName,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
  province,
  setProvince,
  courier,
  setCourier,
  paymentMethod,
  setPaymentMethod,
}: ShippingFormProps) {
  // Touched states for inline validations
  const [touchedName, setTouchedName] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedAddress, setTouchedAddress] = useState(false);
  const [touchedCity, setTouchedCity] = useState(false);
  const [touchedProvince, setTouchedProvince] = useState(false);

  return (
    <div className="space-y-6">
      {/* Information Section */}
      <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-line/60 pb-3">
          <MapPin className="h-5 w-5 text-brand-900" />
          <h3 className="text-base font-extrabold text-brand-950">
            Informasi Pengiriman
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Receiver Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Nama Penerima *
            </label>
            <input
              type="text"
              required
              className={`w-full h-10 rounded-xl border bg-cream-50 px-3 text-xs font-semibold text-brand-950 outline-none transition-colors ${
                touchedName && !receiverName
                  ? "border-red-500 focus:border-red-600"
                  : "border-line focus:border-brand-700"
              }`}
              placeholder="Nama Lengkap"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              onBlur={() => setTouchedName(true)}
            />
            {touchedName && !receiverName && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Nama penerima wajib diisi.
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Nomor Telepon *
            </label>
            <input
              type="tel"
              required
              className={`w-full h-10 rounded-xl border bg-cream-50 px-3 text-xs font-semibold text-brand-950 outline-none transition-colors ${
                touchedPhone && !phone
                  ? "border-red-500 focus:border-red-600"
                  : "border-line focus:border-brand-700"
              }`}
              placeholder="Contoh: 0812..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouchedPhone(true)}
            />
            {touchedPhone && !phone && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Nomor telepon wajib diisi.
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Alamat Lengkap *
            </label>
            <textarea
              required
              rows={3}
              className={`w-full rounded-xl border bg-cream-50 p-3 text-xs font-semibold text-brand-950 outline-none resize-none transition-colors ${
                touchedAddress && !address
                  ? "border-red-500 focus:border-red-600"
                  : "border-line focus:border-brand-700"
              }`}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setTouchedAddress(true)}
            />
            {touchedAddress && !address && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Alamat pengiriman lengkap wajib diisi.
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Kota / Kabupaten *
            </label>
            <input
              type="text"
              required
              className={`w-full h-10 rounded-xl border bg-cream-50 px-3 text-xs font-semibold text-brand-950 outline-none transition-colors ${
                touchedCity && !city
                  ? "border-red-500 focus:border-red-600"
                  : "border-line focus:border-brand-700"
              }`}
              placeholder="Kota/Kabupaten"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={() => setTouchedCity(true)}
            />
            {touchedCity && !city && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Kota / Kabupaten wajib diisi.
              </p>
            )}
          </div>

          {/* Province */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Provinsi *
            </label>
            <input
              type="text"
              required
              className={`w-full h-10 rounded-xl border bg-cream-50 px-3 text-xs font-semibold text-brand-950 outline-none transition-colors ${
                touchedProvince && !province
                  ? "border-red-500 focus:border-red-600"
                  : "border-line focus:border-brand-700"
              }`}
              placeholder="Provinsi"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              onBlur={() => setTouchedProvince(true)}
            />
            {touchedProvince && !province && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Provinsi wajib diisi.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Courier & Payment Method Selectors */}
      <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-5">
        <h3 className="text-base font-extrabold text-brand-950 border-b border-line/60 pb-3">
          Opsi Pengiriman & Pembayaran
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Courier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Pilih Jasa Kurir
            </label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
            >
              <option value="jne">JNE Regular (Rp 15.000)</option>
              <option value="jnt">J&T Express (Rp 18.000)</option>
              <option value="sicepat">SiCepat Halu (Rp 12.000)</option>
              <option value="gosend">GoSend Instant (Rp 25.000)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
            >
              <option value="qris">QRIS (Gopay / OVO / Dana)</option>
              <option value="va">Virtual Account (Mandiri / BCA / BNI)</option>
              <option value="cc">Kartu Kredit / Debit</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
