"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentInstruction, PaymentStatus } from "@/lib/contracts";

type PaymentCoreModalProps = {
  orderId: string;
  payment: PaymentInstruction;
  paymentStatus: PaymentStatus;
  isChecking: boolean;
  isConfirming: boolean;
  payError: string;
  onClose: () => void;
  onCheckStatus: () => void;
  onConfirm: () => void;
};

function getStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "paid":
      return "Pembayaran diterima";
    case "failed":
      return "Pembayaran gagal";
    case "expired":
      return "Pembayaran kedaluwarsa";
    case "pending":
      return "Menunggu pembayaran";
  }
}

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

const SNAP_SRC =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

export function PaymentCoreModal({
  orderId,
  payment,
  paymentStatus,
  isChecking,
  isConfirming,
  payError,
  onClose,
  onCheckStatus,
  onConfirm,
}: PaymentCoreModalProps) {
  const isFinal = paymentStatus !== "pending";
  const [snapReady, setSnapReady] = useState(
    () => !!payment.snapToken && typeof window !== "undefined" && typeof window.snap !== "undefined",
  );
  const [isPaying, setIsPaying] = useState(false);
  const isSnap = !!payment.snapToken;

  const handlePay = useCallback(() => {
    if (!payment.snapToken) return;
    setIsPaying(true);

    window.snap!.pay(payment.snapToken, {
      onSuccess: () => {
        setIsPaying(false);
        onConfirm();
      },
      onPending: () => {
        setIsPaying(false);
      },
      onClose: () => {
        setIsPaying(false);
      },
      onError: () => {
        setIsPaying(false);
      },
    });
  }, [payment.snapToken, onConfirm]);

  return (
    <>
      {isSnap && (
        <Script
          src={SNAP_SRC}
          data-client-key={MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
          onReady={() => setSnapReady(true)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-2xl text-ink-900 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between bg-brand-950 p-4 text-white-soft">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              <div>
                <span className="block text-sm font-extrabold">NILOKA Payment Gate</span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-white-soft/70">
                  {isSnap ? "Midtrans Snap" : "Midtrans Core"}
                </span>
              </div>
            </div>
            <button
              aria-label="Tutup pembayaran"
              className="rounded-full p-1.5 text-white-soft/80 transition-colors hover:bg-white-soft/10 hover:text-white-soft"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
                  Order ID
                </span>
                <span className="font-mono text-sm font-extrabold text-brand-950">{orderId}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
                  Total
                </span>
                <span className="text-sm font-extrabold text-brand-950">
                  Rp {payment.amount.amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-cream-50 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                {payment.title}
              </span>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-700">
                {payment.description}
              </p>

              {isSnap && (
                <div className="mt-4">
                  {!snapReady ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white p-6 text-xs font-semibold text-ink-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat Midtrans Snap...
                    </div>
                  ) : (
                    <Button
                      className="h-11 w-full rounded-2xl bg-brand-950 font-extrabold text-white shadow-sm hover:bg-brand-900"
                      disabled={isPaying}
                      onClick={handlePay}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Memproses...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-1.5 h-4 w-4" />
                          Bayar Sekarang (Midtrans Snap)
                        </>
                      )}
                    </Button>
                  )}
                  {payment.snapRedirectUrl && !snapReady && (
                    <a
                      href={payment.snapRedirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line px-4 text-[10px] font-bold text-brand-900 hover:bg-cream-100"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Buka di Browser (fallback)
                    </a>
                  )}
                </div>
              )}

              {!isSnap && payment.snapRedirectUrl && (
                <div className="mt-4">
                  <a
                    href={payment.snapRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-950 px-5 text-xs font-bold text-white-soft hover:bg-brand-900"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Buka Pembayaran
                  </a>
                </div>
              )}
            </div>

            {isSnap && (
              <p className="text-center text-[9px] font-semibold text-ink-600">
                Setelah pembayaran selesai di jendela Snap, status akan diperbarui otomatis.
              </p>
            )}

            {!isFinal && (
              <Button
                className="h-11 w-full rounded-2xl bg-emerald-600 font-extrabold text-white shadow-sm hover:bg-emerald-700"
                disabled={isConfirming}
                onClick={onConfirm}
              >
                {isConfirming ? (
                  <>
                    <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" /> Mengonfirmasi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    Saya sudah bayar (manual)
                  </>
                )}
              </Button>
            )}

            <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <div>
                  <span className="block font-extrabold">{getStatusLabel(paymentStatus)}</span>
                  <span className="text-[10px] font-semibold opacity-80">
                    Polling status otomatis setiap beberapa detik.
                  </span>
                </div>
              </div>
              <Button
                className="h-9 rounded-xl px-3 text-[10px] font-bold"
                disabled={isChecking || isFinal}
                onClick={onCheckStatus}
                type="button"
              >
                <RefreshCw className={`mr-1 h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
                Cek
              </Button>
            </div>

            {payError && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center text-[11px] font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{payError}</span>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-cream-50 p-3.5 text-center text-[10px] font-semibold text-ink-600">
            Secret Midtrans diproses di server. Browser hanya menerima instruksi pembayaran.
          </div>
        </div>
      </div>
    </>
  );
}