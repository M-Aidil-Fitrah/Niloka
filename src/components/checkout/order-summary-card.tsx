import { Button } from "@/components/ui/button";
import { Ticket, Trash2, HelpCircle, Lock } from "lucide-react";
import type { Promo } from "@/lib/contracts";
import { PriceDisplay } from "@/components/ui/price-display";
import React from "react";

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
            <PriceDisplay amount={subtotal} />
          </span>
        </div>
        <div className="flex justify-between items-center text-ink-600">
          <span>Biaya Platform:</span>
          <span className="font-semibold text-brand-950">
            <PriceDisplay amount={platformFee} />
          </span>
        </div>
        <div className="flex justify-between items-center text-ink-600">
          <span>Ongkos Kirim:</span>
          <span className="font-semibold text-brand-950">
            <PriceDisplay amount={shippingFee} />
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-bold">
            <span>Diskon Promo:</span>
            <span className="flex items-center">
              -<PriceDisplay amount={discountAmount} showTooltip={false} />
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
            <div className="bg-cream-50/30 border border-line/50 rounded-xl p-3 space-y-2">
              <span className="text-[9px] font-bold text-ink-600 uppercase tracking-wider block">Pilih Kupon Toko:</span>
              <div className="space-y-1.5">
                {availablePromos.map((promo) => {
                  let benefit: React.ReactNode = "";
                  if (promo.type === "percentage") {
                    benefit = `${promo.value}% OFF`;
                  } else if (promo.type === "fixed-amount") {
                    benefit = (
                      <span className="flex items-center gap-0.5">
                        -<PriceDisplay amount={promo.value} showTooltip={false} className="border-none p-0 inline text-[9px] font-bold text-emerald-800 hover:scale-100" />
                      </span>
                    );
                  } else if (promo.type === "free-shipping") {
                    benefit = "Free Ongkir";
                  }
                  return (
                    <button
                      key={promo.id}
                      onClick={() => onPromoSelect(promo.code)}
                      type="button"
                      className="w-full text-left bg-white hover:bg-emerald-50/30 border border-line/80 hover:border-emerald-600/30 p-2 rounded-lg flex items-center justify-between text-brand-950 transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider group-hover:text-emerald-800">
                          {promo.code}
                        </span>
                        <span className="text-[8.5px] text-ink-600 leading-tight flex items-center gap-0.5">
                          Min. Belanja <PriceDisplay amount={promo.minSubtotal.amount} showTooltip={false} />
                        </span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded shrink-0 flex items-center justify-center">
                        {benefit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-line/60" />

      <div className="flex justify-between items-center">
        <span className="font-bold text-brand-950">Total Pembayaran:</span>
        <span className="text-base font-extrabold text-brand-950">
          <PriceDisplay amount={grandTotal} />
        </span>
      </div>

      {/* Dynamic Currency Disclaimer (for Option 1 transaprency) */}
      <div className="rounded-2xl border border-line/50 bg-cream-50/60 p-3.5 text-[10px] text-ink-600 leading-relaxed space-y-1.5">
        <div className="flex gap-1.5 items-start">
          <HelpCircle className="h-4 w-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-brand-950">Pemberitahuan Transaksi Internasional:</p>
            <p className="mt-0.5">
              Niloka menampilkan estimasi harga dalam mata uang pilihan Anda. Namun, demi mematuhi ketentuan gerbang pembayaran, tagihan akhir Anda akan didebit dalam <span className="font-extrabold text-brand-900">Rupiah (IDR)</span> senilai <span className="font-extrabold text-brand-950">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(grandTotal)}
              </span>.
            </p>
            <p className="mt-1">
              Konversi mata uang yang sebenarnya akan ditentukan oleh bank penerbit kartu kredit atau debit Anda.
            </p>
          </div>
        </div>
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
