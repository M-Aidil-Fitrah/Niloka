import { Button } from "@/components/ui/button";
import { Ticket, Trash2, HelpCircle, Lock } from "lucide-react";
import type { Promo } from "@/lib/contracts";

type OrderSummaryCardProps = {
  subtotal: number;
  platformFee: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  isFormValid: boolean;
  promoCodeInput: string;
  onPromoCodeInputChange: (val: string) => void;
  appliedPromo: Promo | null;
  availablePromos: Promo[];
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  promoError: string;
  onPayClick: () => void;
  onPromoSelect: (code: string) => void;
};

export function OrderSummaryCard({
  subtotal,
  platformFee,
  shippingFee,
  discountAmount,
  grandTotal,
  isFormValid,
  promoCodeInput,
  onPromoCodeInputChange,
  appliedPromo,
  availablePromos,
  onApplyPromo,
  onRemovePromo,
  promoError,
  onPayClick,
  onPromoSelect,
}: OrderSummaryCardProps) {
  return (
    <div className="rounded-[32px] border border-line bg-white-soft p-5 sm:p-6 shadow-sm space-y-5">
      <h3 className="text-base font-extrabold text-brand-950">Ringkasan Pesanan</h3>

      <div className="space-y-2.5 text-xs pt-1 border-b border-line/60 pb-3">
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
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-bold">
            <span>Diskon Promo:</span>
            <span>
              -Rp {discountAmount.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      {/* Coupon Entry Block */}
      <div className="space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block flex items-center gap-1">
          <Ticket className="h-3.5 w-3.5" />
          Voucher Toko / Kode Promo
        </span>
        
        {appliedPromo ? (
          <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 block">{appliedPromo.title}</span>
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase font-mono">{appliedPromo.code}</span>
            </div>
            <button
              onClick={onRemovePromo}
              type="button"
              className="text-xs font-bold text-red-650 hover:text-red-500 px-2 py-1 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Hapus
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 h-9 rounded-xl border border-line bg-cream-50 px-3 text-xs font-semibold text-brand-950 uppercase outline-none focus:border-brand-700"
                placeholder="Contoh: ATSIRI10"
                value={promoCodeInput}
                onChange={(e) => onPromoCodeInputChange(e.target.value)}
              />
              <button
                onClick={onApplyPromo}
                type="button"
                className="h-9 px-4 rounded-xl bg-brand-900 hover:bg-brand-850 text-white-soft text-xs font-bold cursor-pointer"
              >
                Pakai
              </button>
            </div>
            
            {promoError && (
              <p className="text-[10px] font-bold text-red-600">{promoError}</p>
            )}

            {/* Suggestions List */}
            <div className="bg-cream-50/50 border border-line/60 rounded-xl p-2.5 space-y-1.5">
              <span className="text-[9px] font-bold text-ink-600 uppercase tracking-wider block">Kupon Tersedia:</span>
              <div className="flex flex-wrap gap-1.5">
                {availablePromos.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => onPromoSelect(promo.code)}
                    type="button"
                    className="text-[9px] font-bold bg-white hover:bg-cream-100 border border-line/85 px-2 py-1 rounded-lg text-brand-950 font-mono cursor-pointer"
                  >
                    {promo.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-line/60" />

      <div className="flex justify-between items-center">
        <span className="font-bold text-brand-950">Total Pembayaran:</span>
        <span className="text-base font-extrabold text-brand-950">
          Rp {grandTotal.toLocaleString("id-ID")}
        </span>
      </div>

      <Button
        disabled={!isFormValid}
        onClick={onPayClick}
        className={`w-full h-11 rounded-2xl text-white-soft text-xs font-bold mt-4 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
          isFormValid
            ? "bg-brand-950 hover:bg-brand-900 cursor-pointer"
            : "bg-ink-600/30 cursor-not-allowed text-ink-600/50"
        }`}
      >
        <Lock className="h-3.5 w-3.5" />
        {isFormValid ? "Bayar Sekarang (Midtrans)" : "Lengkapi Alamat Pengiriman"}
      </Button>

      {!isFormValid && (
        <p className="text-[10px] text-ink-600 text-center mt-2 leading-relaxed flex items-center gap-1 justify-center">
          <HelpCircle className="h-3 w-3 shrink-0" />
          <span>Isi semua bidang wajib (*) untuk melanjutkan.</span>
        </p>
      )}
    </div>
  );
}
