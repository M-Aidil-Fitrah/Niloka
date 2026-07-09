"use client";

import { AlertCircle, CheckCircle2, Clock, Copy, ExternalLink, RefreshCw, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCode } from "@/components/ui/qr-code";
import type { PaymentInstruction, PaymentStatus } from "@/lib/contracts";
import { useCountdown } from "@/hooks/use-countdown";

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

function getStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "paid":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "failed":
    case "expired":
      return "text-red-700 bg-red-50 border-red-200";
    case "pending":
      return "text-amber-700 bg-amber-50 border-amber-200";
  }
}

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

  const { minutes, seconds, isExpired } = useCountdown(payment.expiresAt);

  const qrContent =
    payment.method === "qris" && payment.qrString
      ? payment.qrString
      : payment.method === "ewallet" && payment.deeplinkUrl
        ? payment.deeplinkUrl
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-2xl text-ink-900 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between bg-brand-950 p-4 text-white-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            <div>
              <span className="block text-sm font-extrabold">NILOKA Payment Gate</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white-soft/70">
                Midtrans Core
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
            {!isFinal && !isExpired && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700">
                <Clock className="h-3 w-3" />
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            )}

            {isExpired && !isFinal && (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold text-red-700">
                Waktu habis
              </div>
            )}

            <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
              {payment.title}
            </span>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-700">
              {payment.description}
            </p>

            {payment.method === "qris" && (
              <div className="mx-auto mt-4 flex flex-col items-center gap-3">
                {qrContent ? (
                  <div className="rounded-2xl border border-brand-900/20 bg-white p-3">
                    <QRCode value={qrContent} size={160} />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-brand-900/20 bg-white">
                    <span className="text-[9px] font-bold text-ink-600">QR tidak tersedia</span>
                  </div>
                )}
                <p className="text-[10px] font-semibold text-ink-600">
                  Scan menggunakan aplikasi pembayaran (GoPay, OVO, DANA, dll.)
                </p>
              </div>
            )}

            {payment.method === "virtual-account" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-line bg-white p-3 text-left">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
                    Nomor Virtual Account
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-lg font-black tracking-wider text-brand-950">
                      {payment.vaNumber}
                    </span>
                    <button
                      className="rounded-xl border border-line bg-cream-50 p-2 text-brand-900 hover:bg-cream-100"
                      onClick={() => navigator.clipboard.writeText(payment.vaNumber)}
                      type="button"
                      aria-label="Salin nomor virtual account"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[9px] font-semibold text-ink-600">
                  Transfer ke nomor VA di atas melalui ATM atau mobile banking bank tujuan Anda.
                </p>
              </div>
            )}

            {payment.method === "ewallet" && (
              <div className="mt-4 space-y-3">
                <a
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-950 px-5 text-xs font-bold text-white-soft hover:bg-brand-900"
                  href={payment.deeplinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka Pembayaran E-wallet
                </a>
                {qrContent && (
                  <div className="mx-auto flex flex-col items-center gap-3">
                    <div className="rounded-2xl border border-brand-900/20 bg-white p-3">
                      <QRCode value={qrContent} size={160} />
                    </div>
                    <p className="text-[9px] font-semibold text-ink-600">
                      Atau scan QR code menggunakan aplikasi e-wallet Anda.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isFinal && !isExpired && (
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
                  Saya sudah bayar
                </>
              )}
            </Button>
          )}

          <div className={`flex items-center justify-between rounded-2xl border p-3 text-xs ${getStatusColor(paymentStatus)}`}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <div>
                <span className="block font-extrabold">
                  {getStatusLabel(paymentStatus)}
                </span>
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
  );
}