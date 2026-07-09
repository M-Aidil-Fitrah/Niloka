"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
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

function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      } catch {}
    },
    [resetMs],
  );

  return { copied, copy };
}

const QR_CODE_PLACEHOLDER =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";

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
  const { copied, copy } = useCopyToClipboard();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!payment.expiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, [payment.expiresAt]);

  const minutesLeft = payment.expiresAt
    ? Math.max(0, Math.floor((new Date(payment.expiresAt).getTime() - now) / 60000))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-2xl text-ink-900 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between bg-brand-950 p-4 text-white-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            <div>
              <span className="block text-sm font-extrabold">NILOKA Payment Gate</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white-soft/70">
                Midtrans Core - {payment.method === "virtual-account" ? "BCA Virtual Account" : "GoPay"}
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

          {minutesLeft > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-bold">Sisa waktu: {minutesLeft} menit</span>
            </div>
          )}

          {payment.method === "virtual-account" && payment.vaNumber && (
            <div className="rounded-2xl border border-line bg-cream-50 p-5 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600">
                  BCA Virtual Account
                </span>
                <p className="text-xs text-ink-600">
                  Bayar melalui mobile banking, ATM, atau internet banking BCA.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-xl border-2 border-dashed border-brand-900/30 bg-white px-5 py-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-500 mb-1">
                    Nomor Virtual Account
                  </span>
                  <span className="block text-2xl font-extrabold tracking-widest text-brand-950 font-mono">
                    {payment.vaNumber}
                  </span>
                </div>
                <button
                  onClick={() => copy(payment.vaNumber)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-line bg-white p-2.5 hover:bg-cream-100 transition-colors cursor-pointer"
                  aria-label="Salin nomor VA"
                  type="button"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-ink-600" />
                  )}
                </button>
              </div>
              <div className="rounded-xl border border-line bg-white p-4 text-left text-xs space-y-2">
                <p className="font-bold text-brand-950 text-[10px] uppercase tracking-wider">
                  Cara Pembayaran:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-ink-700">
                  <li>Buka mobile banking BCA / ATM / internet banking BCA.</li>
                  <li>Pilih menu &quot;Transfer&quot; → &quot;Virtual Account&quot;.</li>
                  <li>Masukkan nomor Virtual Account di atas.</li>
                  <li>Konfirmasi nominal pembayaran dan ikuti instruksi.</li>
                  <li>Setelah transfer berhasil, status akan diperbarui otomatis.</li>
                </ol>
              </div>
            </div>
          )}

          {payment.method === "ewallet" && (
            <div className="rounded-2xl border border-line bg-cream-50 p-5 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600">
                  GoPay
                </span>
                <p className="text-xs text-ink-600">
                  Bayar melalui aplikasi Gojek menggunakan GoPay.
                </p>
              </div>

              {payment.qrUrl && (
                <div className="mx-auto flex flex-col items-center gap-2">
                  <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
                    <Image
                      src={`${QR_CODE_PLACEHOLDER}${encodeURIComponent(payment.qrUrl)}`}
                      alt="QR Code GoPay"
                      width={180}
                      height={180}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                  <p className="text-[10px] font-bold text-ink-600">
                    Scan QR Code di atas menggunakan aplikasi Gojek
                  </p>
                </div>
              )}

              {payment.deeplinkUrl && (
                <a
                  href={payment.deeplinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-brand-950 px-5 text-xs font-bold text-white-soft hover:bg-brand-900 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka Gojek
                </a>
              )}

              {!payment.qrUrl && !payment.deeplinkUrl && (
                <div className="rounded-xl border border-line bg-white p-4 text-xs text-ink-600">
                  Instruksi pembayaran GoPay sedang diproses. Silakan cek status secara berkala.
                </div>
              )}
            </div>
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
                  Saya sudah bayar (konfirmasi manual)
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
          Transaksi diproses melalui Midtrans Core API. Data pembayaran aman di server.
        </div>
      </div>
    </div>
  );
}