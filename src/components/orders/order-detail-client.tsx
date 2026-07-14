"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, ExternalLink, RefreshCw, XCircle } from "lucide-react";
import type { OrderTracking } from "@/lib/contracts";
import { cn } from "@/lib/styles";

type OrderDetailClientProps = {
  order: OrderTracking;
};

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    "paid": { label: "Lunas", cls: "bg-emerald-100 text-emerald-800" },
    "pending": { label: "Menunggu", cls: "bg-amber-100 text-amber-800" },
    "failed": { label: "Gagal", cls: "bg-red-100 text-red-800" },
    "expired": { label: "Kadaluwarsa", cls: "bg-gray-100 text-gray-800" },
  };
  const c = cfg[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${c.cls}`}>{c.label}</span>;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [payment, setPayment] = useState(order.payments[0] || null);
  const [pStatus, setPStatus] = useState(order.paymentStatus);
  const [polling, setPolling] = useState(order.paymentStatus === "pending");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/${order.id}/status`, { cache: "no-store" });
        const data = await res.json();
        if (data.payment) setPayment(data.payment);
        if (data.paymentStatus === "paid") { setPStatus("paid"); setPolling(false); }
        if (data.paymentStatus === "failed" || data.paymentStatus === "expired") { setPStatus(data.paymentStatus); setPolling(false); }
      } catch (err) {
        console.error("Payment status polling failed:", err);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [polling, order.id]);

  const isPending = pStatus === "pending";

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Status card */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {pStatus === "paid" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : pStatus === "pending" ? <Clock className="h-5 w-5 text-amber-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
          <span className="font-bold text-brand-950">
            {pStatus === "paid" ? "Pembayaran Diterima" : pStatus === "pending" ? "Menunggu Pembayaran" : "Pembayaran Gagal"}
          </span>
        </div>
        <StatusBadge status={pStatus} />
      </div>

      {/* Payment details */}
      {payment && isPending && (
        <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-extrabold text-brand-950">Cara Bayar</h4>
          <p className="text-xs font-bold text-brand-950">{payment.method === "virtual-account" ? "Virtual Account" : payment.method === "ewallet" ? "GoPay" : "QRIS"}</p>
          {payment.vaNumber && (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-cream-50 p-3">
              <span className="text-xs text-ink-600">VA:</span>
              <span className="text-lg font-extrabold tracking-widest text-brand-950 font-mono">{payment.vaNumber}</span>
              <button onClick={() => { navigator.clipboard.writeText(payment.vaNumber); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="ml-auto text-[10px] font-bold text-brand-900 underline cursor-pointer shrink-0" type="button">{copied ? "Tersalin" : "Salin"}</button>
            </div>
          )}
          {payment.qrUrl && (
            <div className="mx-auto w-36 h-36 rounded-xl border overflow-hidden bg-white p-2">
              <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payment.qrUrl)}`} alt="QR" width={144} height={144} className="rounded-lg" unoptimized />
            </div>
          )}
          {payment.deeplinkUrl && (
            <a href={payment.deeplinkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-950 text-white-soft text-xs font-bold px-4"><ExternalLink className="h-3.5 w-3.5" /> Buka Gojek</a>
          )}
          <div className="flex items-center gap-2 text-[10px] text-ink-600"><RefreshCw className={cn("h-3 w-3", polling && "animate-spin")} /> Polling status otomatis</div>
        </div>
      )}

      {/* Items */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm">
        <h4 className="text-xs font-extrabold text-brand-950 mb-3">Barang ({order.items.length})</h4>
        <div className="divide-y divide-line/40">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 py-2.5 text-xs items-center first:pt-0 last:pb-0">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line/40 bg-cream-100">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    className="object-cover"
                    fill
                    sizes="40px"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-cream-100 flex items-center justify-center">
                    <span className="text-[10px] text-ink-400 font-bold">N/A</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brand-950 truncate">{item.name}</p>
                <p className="text-ink-600 mt-0.5">x{item.quantity} @ Rp {item.unitPrice.amount.toLocaleString("id-ID")}</p>
              </div>
              <p className="font-bold text-brand-950 shrink-0 ml-4">Rp {item.subtotal.amount.toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm text-xs space-y-1">
        <h4 className="font-extrabold text-brand-950 mb-2">Pengiriman</h4>
        <p className="font-bold">{order.shipping.receiverName} — {order.shipping.receiverPhone}</p>
        <p className="text-ink-600">{order.shipping.address}, {order.shipping.city}, {order.shipping.province}</p>
        <p className="text-ink-600">{order.shipping.courierName}</p>
      </div>

      {/* Total */}
      <div className="rounded-2xl border border-line bg-white-soft p-4 shadow-sm text-xs space-y-1.5">
        <div className="flex justify-between text-ink-600"><span>Subtotal</span><span className="font-bold text-brand-950">Rp {order.subtotal.amount.toLocaleString("id-ID")}</span></div>
        <div className="flex justify-between text-ink-600"><span>Biaya Platform</span><span className="font-bold text-brand-950">Rp {order.platformFee.amount.toLocaleString("id-ID")}</span></div>
        <div className="flex justify-between text-ink-600"><span>Ongkir</span><span className="font-bold text-brand-950">Rp {order.shippingEstimate.amount.toLocaleString("id-ID")}</span></div>
        {order.discount.amount > 0 && <div className="flex justify-between text-emerald-700 font-bold"><span>Diskon</span><span>-Rp {order.discount.amount.toLocaleString("id-ID")}</span></div>}
        <div className="flex justify-between pt-2 border-t text-sm font-extrabold text-brand-950"><span>Total</span><span>Rp {order.grandTotal.amount.toLocaleString("id-ID")}</span></div>
      </div>

      <Link href="/orders" className="inline-flex h-10 px-4 rounded-2xl border border-line text-xs font-bold text-brand-950 hover:bg-cream-100 transition-colors items-center gap-1.5">← Semua Pesanan</Link>
    </div>
  );
}