import { AlertCircle, Clock, Copy, QrCode, RefreshCw, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentInstruction, PaymentStatus } from "@/lib/contracts";

type PaymentCoreModalProps = {
  orderId: string;
  payment: PaymentInstruction;
  paymentStatus: PaymentStatus;
  isChecking: boolean;
  payError: string;
  onClose: () => void;
  onCheckStatus: () => void;
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

export function PaymentCoreModal({
  orderId,
  payment,
  paymentStatus,
  isChecking,
  payError,
  onClose,
  onCheckStatus,
}: PaymentCoreModalProps) {
  const isFinal = paymentStatus !== "pending";

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
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
              {payment.title}
            </span>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-700">
              {payment.description}
            </p>

            {payment.method === "qris" && (
              <div className="mx-auto mt-4 flex h-40 w-40 flex-col items-center justify-center rounded-2xl border border-brand-900/20 bg-white text-brand-950">
                <QrCode className="h-16 w-16" />
                <span className="mt-3 max-w-32 truncate font-mono text-[9px] font-bold">
                  {payment.qrString}
                </span>
              </div>
            )}

            {payment.method === "virtual-account" && (
              <div className="mt-4 rounded-2xl border border-line bg-white p-3 text-left">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
                  Nomor Virtual Account
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-lg font-black text-brand-950">
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
            )}

            {payment.method === "ewallet" && (
              <a
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-brand-950 px-5 text-xs font-bold text-white-soft hover:bg-brand-900"
                href={payment.deeplinkUrl}
              >
                Buka Pembayaran E-wallet
              </a>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-800" />
              <div>
                <span className="block font-extrabold text-brand-950">
                  {getStatusLabel(paymentStatus)}
                </span>
                <span className="text-[10px] font-semibold text-ink-600">
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
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
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
