"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon } from "@/components/ui/icons";
import type { Product, AmpasListing } from "@/lib/contracts";

type CheckoutShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
};

export function CheckoutShell({ products, ampasListings }: CheckoutShellProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  // Form State
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [courier, setCourier] = useState("jne");
  const [paymentMethod, setPaymentMethod] = useState("qris");

  // UI Flow State
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Courier Rates mapping
  const courierRates: Record<string, number> = {
    jne: 15000,
    jnt: 18000,
    sicepat: 12000,
    gosend: 25000,
  };

  const courierNames: Record<string, string> = {
    jne: "JNE Regular",
    jnt: "J&T Express",
    sicepat: "SiCepat Halu",
    gosend: "GoSend Instant",
  };

  // Helper: resolve item details (name, image, price)
  const resolvedItems = items.map((item) => {
    if (item.kind === "product") {
      const prod = products.find((p) => p.id === item.productId);
      return {
        ...item,
        name: prod?.name || "Produk Nilam",
        imageSrc: prod?.image.src || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
        imageAlt: prod?.image.alt || "Produk",
      };
    } else {
      const ampas = ampasListings.find((a) => a.id === item.ampasListingId);
      return {
        ...item,
        name: ampas
          ? ampas.slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Ampas Nilam B2B",
        imageSrc: ampas?.image.src || "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
        imageAlt: ampas?.image.alt || "Ampas Nilam",
      };
    }
  });

  // Calculate costs
  const subtotal = resolvedItems.reduce((acc, item) => acc + item.unitPrice.amount * item.quantity, 0);
  const platformFee = subtotal > 0 ? 2000 : 0;
  const shippingFee = subtotal > 0 ? courierRates[courier] : 0;
  const grandTotal = subtotal + platformFee + shippingFee;

  // Validation
  const isFormValid = receiverName && phone && address && city && province;

  const handlePayClick = () => {
    if (!isFormValid) return;
    setIsSnapOpen(true);
  };

  const handleSimulateSuccess = () => {
    setIsPaying(true);
    setPayError("");
    setTimeout(() => {
      setIsPaying(false);
      setIsSnapOpen(false);
      setIsSuccess(true);
      setGeneratedOrderId(`NLK-TX-${Math.floor(100000 + Math.random() * 900000)}`);
      // Keep items in a local state for the invoice before clearing cart
      clearCart();
    }, 1500);
  };

  const handleSimulateFailure = () => {
    setIsPaying(true);
    setPayError("");
    setTimeout(() => {
      setIsPaying(false);
      setPayError("Pembayaran ditolak. Silakan periksa kembali saldo atau kartu Anda.");
    }, 1200);
  };

  // 1. EMPTY CART STATE
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="rounded-[32px] border border-line bg-white-soft py-20 text-center max-w-xl mx-auto shadow-sm">
        <span className="text-4xl">🛒</span>
        <h3 className="mt-5 text-xl font-bold text-brand-950">Keranjang Anda Kosong</h3>
        <p className="mt-2 text-sm text-ink-600 px-6">
          Anda belum menambahkan produk nilam atau listing ampas B2B ke dalam keranjang.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/products">
            <Button className="h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold">
              Lihat Produk B2C
            </Button>
          </Link>
          <Link href="/ampas">
            <Button variant="secondary" className="h-11 px-6 rounded-2xl border-line text-xs font-bold">
              Bursa Ampas B2B
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. SUCCESS INVOICE VIEW
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500 print:p-0 print:border-0">
        <div className="rounded-[32px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 shadow-xl print:shadow-none print:border-none print:p-0">
          
          {/* Header Success Check */}
          <div className="text-center print:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              ✓
            </div>
            <h3 className="mt-4 text-2xl font-bold text-brand-950 font-serif-accent italic">Transaksi Berhasil!</h3>
            <p className="mt-1 text-xs text-ink-600">
              Pembayaran Anda telah sukses diverifikasi melalui sistem Midtrans mock.
            </p>
          </div>

          <hr className="border-line/60 print:hidden" />

          {/* Invoice Meta */}
          <div className="flex justify-between items-start text-xs border-b border-line pb-4 flex-wrap gap-2">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Order ID</span>
              <span className="font-mono font-bold text-brand-950 text-sm">{generatedOrderId}</span>
            </div>
            <div className="text-right">
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Status Pembayaran</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-0.5">
                Paid / Lunas
              </span>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Penerima</span>
              <span className="font-bold text-brand-950 block mt-0.5">{receiverName}</span>
              <span className="text-ink-700">{phone}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Alamat Pengiriman</span>
              <p className="text-ink-700 block mt-0.5 leading-relaxed">
                {address}, {city}, {province}
              </p>
            </div>
          </div>

          {/* Courier & Payment Method */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-line/60 pt-4">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Metode Pengiriman</span>
              <span className="font-bold text-brand-950 block mt-0.5">{courierNames[courier]}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Metode Pembayaran</span>
              <span className="font-bold text-brand-950 block mt-0.5 uppercase">{paymentMethod} (Midtrans Mock)</span>
            </div>
          </div>

          <hr className="border-line/60" />

          {/* Costs breakdown */}
          <div className="space-y-2.5 text-xs pt-2">
            <div className="flex justify-between items-center text-ink-600">
              <span>Subtotal Pembelian:</span>
              <span className="font-bold text-brand-950">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Biaya Platform:</span>
              <span className="font-semibold text-brand-950">
                Rp {platformFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Biaya Pengiriman:</span>
              <span className="font-semibold text-brand-950">
                Rp {shippingFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-line/60">
              <span className="font-bold text-brand-950 text-sm">Grand Total:</span>
              <span className="text-lg font-extrabold text-brand-950">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Action buttons (Print and Shop Again) */}
          <div className="flex gap-3 justify-end pt-4 border-t border-line/60 print:hidden">
            <button
              onClick={() => window.print()}
              className="h-11 px-5 rounded-2xl border border-line bg-cream-50 hover:bg-cream-100 text-brand-950 text-xs font-bold transition-all"
            >
              Cetak Invoice
            </button>
            <Button
              onClick={() => setIsSuccess(false)}
              className="h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold"
            >
              Belanja Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. EDIT CART & CHECKOUT FORM
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start animate-in fade-in duration-300">
      {/* LEFT COLUMN: Cart items table + Shipping Form */}
      <div className="space-y-6">
        
        {/* Cart Item List */}
        <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-brand-950 border-b border-line/60 pb-3">
            Keranjang Belanja
          </h3>

          <div className="divide-y divide-line/60">
            {resolvedItems.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0">
                {/* Thumbnail */}
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-line/40 bg-cream-100 shrink-0">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="object-cover"
                    fill
                    sizes="64px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.kind === "product" ? "B2C Produk" : "B2B Ampas"}
                  </span>
                  <h4 className="text-sm font-bold text-brand-950 mt-1 truncate">{item.name}</h4>
                  <p className="text-xs font-extrabold text-brand-900 mt-1">
                    Rp {item.unitPrice.amount.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-line rounded-lg overflow-hidden h-8 bg-cream-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 hover:bg-cream-100 text-xs font-bold text-brand-950"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-950 min-w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 hover:bg-cream-100 text-xs font-bold text-brand-950"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Hapus item"
                  className="p-2 text-ink-600 hover:text-red-600 transition-colors shrink-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Form */}
        <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-brand-950 border-b border-line/60 pb-3">
            Informasi Pengiriman
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Nama Penerima *
              </label>
              <input
                type="text"
                required
                className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                placeholder="Nama Lengkap"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Nomor Telepon *
              </label>
              <input
                type="tel"
                required
                className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                placeholder="Contoh: 0812..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Alamat Lengkap *
              </label>
              <textarea
                required
                rows={3}
                className="w-full rounded-xl border border-line bg-cream-50 p-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none resize-none"
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/kecamatan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Kota / Kabupaten *
              </label>
              <input
                type="text"
                required
                className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                placeholder="Kota/Kabupaten"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
                Provinsi *
              </label>
              <input
                type="text"
                required
                className="w-full h-10 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 focus:border-brand-700 outline-none"
                placeholder="Provinsi"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Courier & Payment Method Selectors */}
        <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-brand-950 border-b border-line/60 pb-3">
            Opsi Pengiriman & Pembayaran
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
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

      {/* RIGHT COLUMN: Sticky Summary checkout card */}
      <aside className="space-y-6 sticky top-28">
        <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-brand-950">Ringkasan Pesanan</h3>

          <div className="space-y-2.5 text-xs pt-1">
            <div className="flex justify-between items-center text-ink-600">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-brand-950">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Biaya Platform:</span>
              <span className="font-semibold text-brand-950">
                Rp {platformFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Ongkos Kirim:</span>
              <span className="font-semibold text-brand-950">
                Rp {shippingFee.toLocaleString("id-ID")}
              </span>
            </div>
            <hr className="border-line/60" />
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-brand-950">Total Pembayaran:</span>
              <span className="text-base font-extrabold text-brand-950">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <Button
            disabled={!isFormValid}
            onClick={handlePayClick}
            className={`w-full h-11 rounded-2xl text-white-soft text-xs font-bold mt-4 shadow-sm ${
              isFormValid
                ? "bg-brand-950 hover:bg-brand-900 cursor-pointer"
                : "bg-ink-600/30 cursor-not-allowed text-ink-600/50"
            }`}
          >
            {isFormValid ? "Bayar Sekarang (Midtrans)" : "Lengkapi Alamat Pengiriman"}
          </Button>

          {!isFormValid && (
            <p className="text-[10px] text-ink-600 text-center mt-2 leading-relaxed">
              * Silakan isi semua bidang wajib bertanda bintang (*) untuk melanjutkan ke gerbang pembayaran.
            </p>
          )}
        </div>
      </aside>

      {/* MIDTRANS SNAP POPUP SIMULATOR OVERLAY */}
      {isSnapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 text-ink-900">
            {/* Header: Midtrans look-alike */}
            <div className="bg-sky-700 text-white-soft p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">NILOKA Payment Gate</span>
                <span className="bg-sky-600 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">Mock Snap</span>
              </div>
              <button
                onClick={() => setIsSnapOpen(false)}
                className="text-white-soft/80 hover:text-white-soft text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5 bg-white">
              {/* Transaction details block */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Total Tagihan</span>
                  <span className="text-sm font-extrabold text-brand-950">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Metode Pilihan</span>
                  <span className="font-bold text-sky-700 uppercase">{paymentMethod}</span>
                </div>
              </div>

              <hr className="border-line/60" />

              {/* Status and instruction */}
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-ink-900">Simulasi Gerbang Pembayaran Midtrans Snap</p>
                <p className="text-[10px] text-ink-600 leading-normal px-2">
                  Gunakan tombol simulasi di bawah untuk menguji respon sukses atau gagal transaksi.
                </p>
              </div>

              {/* Error statement if failed */}
              {payError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center text-[11px] font-semibold text-red-700 animate-shake">
                  {payError}
                </div>
              )}

              {/* Simulator Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleSimulateSuccess}
                  disabled={isPaying}
                  className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white-soft text-xs font-bold"
                >
                  {isPaying ? "Memproses..." : "Simulasikan Bayar Sukses"}
                </Button>
                <Button
                  onClick={handleSimulateFailure}
                  disabled={isPaying}
                  variant="secondary"
                  className="w-full h-10 rounded-xl border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold"
                >
                  {isPaying ? "Memproses..." : "Simulasikan Bayar Gagal"}
                </Button>
              </div>
            </div>

            {/* Footer secure shield */}
            <div className="bg-cream-50 p-3.5 text-center text-[10px] text-ink-600 flex items-center justify-center gap-1.5 border-t border-line/45">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
              <span>Metode enkripsi TLS aman & bersertifikasi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
