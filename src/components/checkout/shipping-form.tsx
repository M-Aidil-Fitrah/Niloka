import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";

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
};

const PHONE_REGEX = /^\+?\d{7,15}$/;

function useFieldValidator(value: string, rules: { required?: boolean; min?: number; pattern?: RegExp; message?: string }) {
  const [touched, setTouched] = useState(false);
  const error = useMemo(() => {
    if (!touched) return "";
    if (rules.required && !value.trim()) return "Wajib diisi.";
    if (rules.min && value.trim().length < rules.min) return `Minimal ${rules.min} karakter.`;
    if (rules.pattern && value.trim() && !rules.pattern.test(value.trim())) return rules.message || "Format tidak valid.";
    return "";
  }, [value, touched, rules]);
  return { error, setTouched };
}

function ErrorMsg({ error }: { error: string }) {
  if (!error) return null;
  return <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" />{error}</p>;
}

export function ShippingForm({ receiverName, setReceiverName, phone, setPhone, address, setAddress, city, setCity, province, setProvince, courier, setCourier }: ShippingFormProps) {
  const nameField = useFieldValidator(receiverName, { required: true, min: 3 });
  const phoneField = useFieldValidator(phone, { required: true, pattern: PHONE_REGEX, message: "Nomor telepon tidak valid (7-15 digit, boleh +)." });
  const addressField = useFieldValidator(address, { required: true, min: 10 });
  const cityField = useFieldValidator(city, { required: true, min: 3 });
  const provinceField = useFieldValidator(province, { required: true, min: 3 });

  function fc(e: string) { return `w-full h-10 rounded-xl border bg-cream-50 px-3 text-xs font-semibold text-brand-950 outline-none transition-colors ${e ? "border-red-500 focus:border-red-600" : "border-line focus:border-brand-700"}`; }

  return (
    <div className="divide-y divide-line/60">
      <div className="grid gap-4 sm:grid-cols-2 pb-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Nama Penerima *</label>
          <input type="text" className={fc(nameField.error)} placeholder="Nama Lengkap" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} onBlur={() => nameField.setTouched(true)} />
          <ErrorMsg error={nameField.error} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Nomor Telepon *</label>
          <input type="tel" className={fc(phoneField.error)} placeholder="Contoh: +62812..." value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => phoneField.setTouched(true)} />
          <ErrorMsg error={phoneField.error} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Alamat Lengkap *</label>
          <textarea rows={3} className={`${fc(addressField.error)} resize-none h-auto py-3`} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => addressField.setTouched(true)} />
          <ErrorMsg error={addressField.error} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Kota / Kabupaten *</label>
          <input type="text" className={fc(cityField.error)} placeholder="Kota/Kabupaten" value={city} onChange={(e) => setCity(e.target.value)} onBlur={() => cityField.setTouched(true)} />
          <ErrorMsg error={cityField.error} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Provinsi *</label>
          <input type="text" className={fc(provinceField.error)} placeholder="Provinsi" value={province} onChange={(e) => setProvince(e.target.value)} onBlur={() => provinceField.setTouched(true)} />
          <ErrorMsg error={provinceField.error} />
        </div>
      </div>

      <div className="pt-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">Jasa Kurir</label>
          <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none">
            <option value="jne">JNE Regular (Rp 15.000)</option>
            <option value="jnt">J&T Express (Rp 18.000)</option>
            <option value="sicepat">SiCepat Halu (Rp 12.000)</option>
            <option value="gosend">GoSend Instant (Rp 25.000)</option>
          </select>
        </div>
      </div>
    </div>
  );
}