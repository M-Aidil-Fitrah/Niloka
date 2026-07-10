"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShippingForm } from "./shipping-form";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import type {
  AmpasListing,
  CartItem,
  PaymentInstruction,
  PaymentStatus,
  Product,
  Promo,
  PromoValidationResult,
} from "@/lib/contracts";
import { checkoutAction } from "@/lib/actions/checkout-actions";
import { courierRates } from "@/lib/constants/courier";
import { cn } from "@/lib/styles";

type CheckoutShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
  promos: Promo[];
  selectedIds: string[];
};

type PayMethod = "bca" | "mandiri" | "bni" | "gopay" | "qris";

const PAY_METHODS: { id: PayMethod; label: string; icon: string; desc: string }[] = [
  { id: "bca", label: "BCA Virtual Account", icon: "BCA", desc: "Transfer via mobile/ATM/Internet Banking BCA" },
  { id: "mandiri", label: "Mandiri Virtual Account", icon: "Mandiri", desc: "Transfer via Livin'/ATM Mandiri" },
  { id: "bni", label: "BNI Virtual Account", icon: "BNI", desc: "Transfer via mobile/ATM BNI" },
  { id: "gopay", label: "GoPay", icon: "GoPay", desc: "Bayar via aplikasi Gojek" },
  { id: "qris", label: "QRIS", icon: "QRIS", desc: "Scan pakai e-wallet/mobile banking" },
];

function validatePromo(items: CartItem[], promos: Promo[], code: string, sf: number): PromoValidationResult {
  const c = code.trim().toUpperCase();
  if (!c) return { status: "empty", promo: null, discountAmount: 0, eligibleSubtotal: 0, message: "" };
  const promo = promos.find((p) => p.code.toUpperCase() === c);
  if (!promo) return { status: "not-found", promo: null, discountAmount: 0, eligibleSubtotal: 0, message: "Kode promo tidak ditemukan." };
  const now = new Date();
  if (promo.status !== "active" || now < new Date(promo.startsAt) || now > new Date(promo.endsAt))
    return { status: "expired", promo: null, discountAmount: 0, eligibleSubtotal: 0, message: "Promo sudah berakhir." };
  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit)
    return { status: "usage-limit-reached", promo: null, discountAmount: 0, eligibleSubtotal: 0, message: "Kuota promo habis." };
  const eligible = items.reduce((t, item) => {
    const ok = promo.productIds.length === 0 || (item.productId ? promo.productIds.includes(item.productId) : false);
    return ok ? t + item.unitPrice.amount * item.quantity : t;
  }, 0);
  if (eligible <= 0) return { status: "no-eligible-items", promo: null, discountAmount: 0, eligibleSubtotal: 0, message: "Promo tidak berlaku." };
  if (eligible < promo.minSubtotal.amount) return { status: "minimum-subtotal-not-met", promo: null, discountAmount: 0, eligibleSubtotal: eligible, message: `Min. Rp ${promo.minSubtotal.amount.toLocaleString("id-ID")}.` };
  const d = promo.type === "percentage" ? Math.floor((eligible * promo.value) / 100) : promo.type === "fixed-amount" ? Math.min(eligible, promo.value) : sf;
  return { status: "valid", promo, discountAmount: d, eligibleSubtotal: eligible, message: "Promo diterapkan!" };
}

export function CheckoutShell({ products, ampasListings, promos, selectedIds }: CheckoutShellProps) {
  const router = useRouter();
  const { items, clearCart, refreshCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [courier, setCourier] = useState("jne");
  const [payMethod, setPayMethod] = useState<PayMethod>("bca");

  const [isCreating, setIsCreating] = useState(false);
  const [payError, setPayError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [payment, setPayment] = useState<PaymentInstruction | null>(null);
  const [pStatus, setPStatus] = useState<PaymentStatus>("pending");
  const [polling, setPolling] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoErr, setPromoErr] = useState("");
  const [promoOk, setPromoOk] = useState("");

  // Sync cart on mount — fixes stale data bug
  useEffect(() => { refreshCart(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayItems = useMemo(() => items.filter((i) => selectedIds.length === 0 || selectedIds.includes(i.id)), [items, selectedIds]);

  const resolved = useMemo(() => displayItems.map((item) => {
    if (item.kind === "product") {
      const p = products.find((x) => x.id === item.productId);
      return { ...item, name: p?.name || "Produk", imageSrc: p?.image.src || "", imageAlt: p?.image.alt || "" };
    }
    const a = ampasListings.find((x) => x.id === item.ampasListingId);
    return { ...item, name: a?.slug?.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Ampas", imageSrc: a?.image.src || "", imageAlt: a?.image.alt || "" };
  }), [displayItems, products, ampasListings]);

  const subtotal = resolved.reduce((a: number, i: typeof resolved[number]) => a + i.unitPrice.amount * i.quantity, 0);
  const sf = subtotal > 0 ? (courierRates[courier]?.amount ?? 0) : 0;

  const promoResult = appliedPromo ? validatePromo(displayItems, promos, appliedPromo.code, sf) : null;
  const disc = promoResult?.status === "valid" ? promoResult.discountAmount : 0;
  const shippingValid = receiverName.trim().length >= 3 && phone.trim().length >= 4 && address.trim().length >= 10 && city.trim().length >= 3 && province.trim().length >= 3;

  const handleApplyPromo = () => {
    setPromoErr(""); setPromoOk("");
    const r = validatePromo(displayItems, promos, promoCode, sf);
    if (r.status === "valid" && r.promo) { setAppliedPromo(r.promo); setPromoOk(r.message); setPromoCode(""); }
    else { setAppliedPromo(null); setPromoErr(r.message); setPromoCode(""); }
  };

  const checkPayment = useCallback(async (oid: string) => {
    try {
      const res = await fetch(`/api/payments/${oid}/status`, { cache: "no-store" });
      const data = await res.json() as { paymentStatus?: PaymentStatus; payment?: PaymentInstruction | null };
      if (data.payment) setPayment(data.payment);
      if (data.paymentStatus === "paid") { setPStatus("paid"); clearCart(); router.push(`/orders/${oid}`); return true; }
      if (data.paymentStatus === "failed" || data.paymentStatus === "expired") { setPStatus(data.paymentStatus); setPayError("Pembayaran gagal/kedaluwarsa."); setPolling(false); }
    } catch (err) {
      console.error("Payment check polling failed:", err);
    }
    return false;
  }, [clearCart, router]);

  useEffect(() => {
    if (!polling || !orderId || pStatus !== "pending") return;
    const id = setInterval(() => checkPayment(orderId), 3000);
    return () => clearInterval(id);
  }, [polling, orderId, pStatus, checkPayment]);

  const handlePay = async () => {
    if (!shippingValid || isCreating) return;
    setIsCreating(true); setPayError("");
    try {
      const res = await checkoutAction({ receiverName, phone, address, city, province, courierCode: courier, paymentMethod: payMethod, promoCode: appliedPromo?.code ?? "" });
      if (res.ok && res.orderId && res.payment) { setOrderId(res.orderId); setPayment(res.payment); setPStatus("pending"); setStep(3); setPolling(true); }
      else setPayError(res.message || "Gagal memproses.");
    } catch { setPayError("Server error."); }
    finally { setIsCreating(false); }
  };

  const handleCheckStatus = async () => { if (orderId) checkPayment(orderId); };

  if (displayItems.length === 0 && step === 1) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4 animate-in fade-in duration-300">
        <ShoppingBag className="h-10 w-10 mx-auto text-ink-600/30" />
        <p className="text-sm font-bold text-ink-600">Keranjang belanja kosong</p>
        <div className="flex justify-center gap-3">
          <Link href="/products" className="h-10 px-5 rounded-xl bg-brand-900 text-white-soft text-xs font-bold inline-flex items-center">Produk B2C</Link>
          <Link href="/ampas" className="h-10 px-5 rounded-xl border text-xs font-bold inline-flex items-center">Ampas B2B</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Progress */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
        {([1,2,3] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={cn("size-6 rounded-full flex items-center justify-center text-[9px] font-extrabold", step === s ? "bg-brand-950 text-white" : step > s ? "bg-emerald-100 text-emerald-700" : "bg-cream-100 text-ink-600")}>
              {step > s ? <CheckCircle2 className="h-3 w-3" /> : s}
            </div>
            <span className={cn("hidden sm:inline", step === s ? "text-brand-950" : "text-ink-600")}>{s === 1 ? "Ringkasan" : s === 2 ? "Bayar" : "Menunggu"}</span>
            {s < 3 && <span className="text-line/60 mx-0.5">/</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Ringkasan */}
      {step === 1 && (
        <div className="rounded-2xl border border-line bg-white-soft p-4 sm:p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-brand-950">Alamat &amp; Kurir</h3>
          <ShippingForm {...{ receiverName, setReceiverName, phone, setPhone, address, setAddress, city, setCity, province, setProvince, courier, setCourier }} />

          <div className="border-t border-line/60 pt-4 space-y-2">
            <h4 className="text-xs font-extrabold text-brand-950 flex items-center gap-1.5"><ShoppingBag className="h-3.5 w-3.5" /> Barang ({resolved.length})</h4>
            <div className="divide-y divide-line/40">
              {resolved.map((item: typeof resolved[number]) => (
                <div key={item.id} className="flex gap-2.5 py-2 text-xs items-center">
                  <div className="relative h-10 w-10 shrink-0 rounded-lg border overflow-hidden bg-cream-100">
                    {item.imageSrc && <Image src={item.imageSrc} alt={item.imageAlt} fill className="object-cover" sizes="40px" />}
                  </div>
                  <div className="min-w-0 flex-1"><p className="font-bold text-brand-950 truncate">{item.name}</p><p className="text-ink-600">x{item.quantity}</p></div>
                  <p className="font-bold text-brand-950 shrink-0">Rp {(item.unitPrice.amount * item.quantity).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line/60 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-bold text-brand-950">Rp {subtotal.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-ink-600"><span>Biaya Platform</span><span className="font-bold text-brand-950">*(dihitung saat bayar)</span></div>
            <div className="flex justify-between text-ink-600"><span>{courierRates[courier]?.name || "Kurir"}</span><span className="font-bold text-brand-950">{sf > 0 ? `Rp ${sf.toLocaleString("id-ID")}` : "—"}</span></div>
            {disc > 0 && <div className="flex justify-between text-emerald-700 font-bold"><span>Diskon</span><span>-Rp {disc.toLocaleString("id-ID")}</span></div>}
          </div>

          <Button onClick={() => setStep(2)} disabled={!shippingValid} className="w-full h-11 rounded-2xl bg-brand-950 hover:bg-brand-900 text-white-soft text-xs font-bold">
            Lanjut ke Pembayaran <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2 — Bayar */}
      {step === 2 && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <div className="flex items-start justify-between text-xs">
              <div>
                <p className="font-bold text-brand-950">{receiverName} — {phone}</p>
                <p className="text-ink-600">{address}, {city}, {province}</p>
                <p className="text-ink-600">{courierRates[courier]?.name}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-[10px] font-bold text-brand-900 underline cursor-pointer shrink-0" type="button">Ubah</button>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <h4 className="text-xs font-extrabold text-brand-950 mb-3">Metode Pembayaran</h4>
            <div className="space-y-2">
              {PAY_METHODS.map((m) => (
                <label key={m.id} className={cn("flex items-center gap-3 rounded-xl border p-3 text-xs cursor-pointer transition-all", payMethod === m.id ? "border-brand-900 bg-brand-100/20 ring-2 ring-brand-900/20" : "border-line hover:border-brand-900/30 bg-cream-50")}>
                  <input type="radio" name="payMethod" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="accent-brand-900" />
                  <GetIcon method={m.id} />
                  <div className="min-w-0 flex-1"><p className="font-bold text-brand-950">{m.label}</p><p className="text-[10px] text-ink-600">{m.desc}</p></div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
            <h4 className="text-xs font-extrabold text-brand-950 mb-2">Promo</h4>
            {appliedPromo ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs"><span className="font-bold text-emerald-800">{appliedPromo.code} — -Rp {disc.toLocaleString("id-ID")}</span><button onClick={() => { setAppliedPromo(null); setPromoOk(""); }} className="text-[10px] font-bold text-red-600 underline cursor-pointer" type="button">Hapus</button></div>
            ) : (
              <div className="flex gap-2"><input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Kode promo" className="flex-1 h-9 rounded-xl border bg-cream-50 px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-900/30" /><Button onClick={handleApplyPromo} className="h-9 px-3 rounded-xl bg-brand-900 text-white text-xs font-bold">Pakai</Button></div>
            )}
            {promoErr && <p className="text-[10px] text-red-600 font-semibold mt-1">{promoErr}</p>}
            {promoOk && <p className="text-[10px] text-emerald-700 font-semibold mt-1">{promoOk}</p>}
            {!appliedPromo && promos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {promos.slice(0, 4).map((p) => (
                  <button key={p.code} onClick={() => { const r = validatePromo(displayItems, promos, p.code, sf); if (r.status === "valid" && r.promo) { setAppliedPromo(r.promo); setPromoOk(r.message); } else setPromoErr(r.message); }} className="rounded-lg border bg-cream-50 px-2 py-1 text-[9px] font-bold text-brand-900 hover:bg-cream-100 cursor-pointer" type="button">{p.code}</button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm space-y-1.5 text-xs">
            <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-bold text-brand-950">Rp {subtotal.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-ink-600"><span>Biaya Platform</span><span className="font-bold text-brand-950">(berdasarkan metode bayar)</span></div>
            <div className="flex justify-between text-ink-600"><span>{courierRates[courier]?.name || "Kurir"}</span><span className="font-bold text-brand-950">{sf > 0 ? `Rp ${sf.toLocaleString("id-ID")}` : "—"}</span></div>
            {disc > 0 && <div className="flex justify-between text-emerald-700 font-bold"><span>Diskon</span><span>-Rp {disc.toLocaleString("id-ID")}</span></div>}
          </div>

          {payError && <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1"><AlertCircle className="h-3 w-3" />{payError}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="h-12 px-5 rounded-2xl border border-line text-xs font-bold text-brand-950 hover:bg-cream-100 transition-colors cursor-pointer flex items-center gap-1.5" type="button"><ChevronLeft className="h-4 w-4" /> Kembali</button>
            <Button onClick={handlePay} disabled={isCreating || !shippingValid} className="flex-1 h-12 rounded-2xl bg-brand-950 hover:bg-brand-900 text-white text-sm font-bold">
              {isCreating ? "Memproses..." : `Bayar Rp ${(subtotal + sf - disc).toLocaleString("id-ID")}`}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Menunggu */}
      {step === 3 && payment && (
        <div className="rounded-2xl border border-line bg-white-soft p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-brand-950">{payment.title}</h3>
              <p className="text-[10px] text-ink-600">{payment.description}</p>
            </div>
            <div className="text-right text-[10px]"><p className="font-mono font-bold text-brand-950">{orderId}</p><p className="text-ink-600">Rp {payment.amount.amount.toLocaleString("id-ID")}</p></div>
          </div>

          {(payment.method === "virtual-account") && payment.vaNumber && (
            <div className="rounded-xl border-2 border-dashed border-brand-900/20 bg-white p-4 text-center space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-wider text-ink-600">Nomor Virtual Account</p>
              <p className="text-2xl font-extrabold tracking-widest text-brand-950 font-mono">{payment.vaNumber}</p>
              <button onClick={() => navigator.clipboard.writeText(payment.vaNumber)} className="text-[10px] font-bold text-brand-900 underline cursor-pointer" type="button">Salin</button>
            </div>
          )}

          {(payment.method === "ewallet" || payment.method === "qris") && (
            <div className="text-center space-y-3">
              {payment.qrUrl && (
                <div className="mx-auto w-36 h-36 rounded-xl border overflow-hidden bg-white p-2">
                  <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payment.qrUrl)}`} alt="QR" width={144} height={144} className="rounded-lg" unoptimized />
                </div>
              )}
              {payment.deeplinkUrl && (
                <a href={payment.deeplinkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-brand-950 text-white-soft text-xs font-bold px-6">Buka Gojek</a>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <div className="flex items-center gap-2">
              <RefreshCw className={cn("h-4 w-4", polling && "animate-spin")} />
              <span className="font-bold">Menunggu pembayaran...</span>
            </div>
            <button onClick={handleCheckStatus} className="text-[10px] font-bold text-brand-900 underline cursor-pointer" type="button">Cek Status</button>
          </div>

          <button onClick={() => { setStep(2); setPolling(false); }} className="w-full h-10 rounded-2xl border border-line text-xs font-bold text-brand-950 hover:bg-cream-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer" type="button"><ChevronLeft className="h-4 w-4" /> Ganti Metode Pembayaran</button>

          {payError && <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[11px] font-semibold text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{payError}</span></div>}
        </div>
      )}
    </div>
  );
}

function GetIcon({ method }: { method: string }) {
  const cls = "h-6 w-6 shrink-0";
  switch (method) {
    case "bca": return <svg className={cls} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#003E6B"/><text x="24" y="30" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Arial">BCA</text></svg>;
    case "mandiri": return <svg className={cls} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#002157"/><text x="24" y="28" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Arial">MANDIRI</text></svg>;
    case "bni": return <svg className={cls} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#002C6C"/><text x="24" y="28" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Arial">BNI</text></svg>;
    case "gopay": return <svg className={cls} viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#00AA13"/><circle cx="24" cy="24" r="14" fill="white"/><text x="24" y="28" fill="#00AA13" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="Arial">G</text></svg>;
    case "qris": return <svg className={cls} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#F5F5F5" stroke="#DDD"/><rect x="10" y="10" width="12" height="12" rx="2" stroke="#333" strokeWidth="2"/><rect x="26" y="10" width="12" height="12" rx="2" stroke="#333" strokeWidth="2"/><rect x="10" y="26" width="12" height="12" rx="2" stroke="#333" strokeWidth="2"/><rect x="26" y="26" width="12" height="12" rx="2" stroke="#333" strokeWidth="2"/></svg>;
  }
}