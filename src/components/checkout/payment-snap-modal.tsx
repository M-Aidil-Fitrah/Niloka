import { Button } from "@/components/ui/button";
import { X, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

type PaymentSnapModalProps = {
  grandTotal: number;
  paymentMethod: string;
  isPaying: boolean;
  payError: string;
  onClose: () => void;
  onSimulateSuccess: () => void;
  onSimulateFailure: () => void;
};

export function PaymentSnapModal({
  grandTotal,
  paymentMethod,
  isPaying,
  payError,
  onClose,
  onSimulateSuccess,
  onSimulateFailure,
}: PaymentSnapModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 text-ink-900">
        {/* Header: Midtrans look-alike */}
        <div className="bg-sky-700 text-white-soft p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <span className="font-bold text-sm tracking-wide">NILOKA Payment Gate</span>
            <span className="bg-sky-650 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded text-white bg-sky-850">Mock Snap</span>
          </div>
          <button
            onClick={onClose}
            className="text-white-soft/80 hover:text-white-soft p-1 rounded-full hover:bg-sky-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
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
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center text-[11px] font-semibold text-red-700 flex items-center gap-1.5 justify-center">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{payError}</span>
            </div>
          )}

          {/* Simulator Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={onSimulateSuccess}
              disabled={isPaying}
              className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-650 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isPaying ? "Memproses..." : "Simulasikan Bayar Sukses"}
            </Button>
            <Button
              onClick={onSimulateFailure}
              disabled={isPaying}
              variant="secondary"
              className="w-full h-10 rounded-xl border-red-200 hover:bg-red-50 text-red-650 text-xs font-bold transition-all cursor-pointer"
            >
              {isPaying ? "Memproses..." : "Simulasikan Bayar Gagal"}
            </Button>
          </div>
        </div>

        {/* Footer secure shield */}
        <div className="bg-cream-50 p-3.5 text-center text-[10px] text-ink-600 flex items-center justify-center gap-1.5 border-t border-line/45">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Metode enkripsi TLS aman & bersertifikasi</span>
        </div>
      </div>
    </div>
  );
}
