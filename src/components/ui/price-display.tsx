"use client";

import { useCurrency } from "@/context/currency-context";
import { cn } from "@/lib/styles";
import { useState } from "react";

interface PriceDisplayProps {
  amount: number; // base amount in IDR
  className?: string;
  showTooltip?: boolean;
}

export function PriceDisplay({
  amount,
  className,
  showTooltip = true,
}: PriceDisplayProps) {
  const { currentCurrency, formatPrice } = useCurrency();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const formattedValue = formatPrice(amount);
  const isForeign = currentCurrency !== "IDR";

  // Format the base IDR price for the tooltip
  const baseFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  const baseFormattedValue = baseFormatter.format(amount);

  return (
    <span
      className={cn(
        "relative inline-flex items-center group cursor-help select-none",
        isForeign && showTooltip ? "border-b border-dotted border-ink-600/40" : "",
        className
      )}
      onMouseEnter={() => isForeign && showTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onClick={(e) => {
        if (isForeign && showTooltip) {
          e.preventDefault();
          e.stopPropagation();
          setIsTooltipVisible(!isTooltipVisible);
        }
      }}
      aria-label={`${formattedValue}. Original price in IDR: ${baseFormattedValue}`}
    >
      <span className="transition-all duration-300 ease-out transform group-hover:scale-[1.01]">
        {formattedValue}
      </span>
      
      {isForeign && showTooltip && isTooltipVisible && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-xl bg-brand-950 px-3 py-1.5 text-center text-[10px] font-bold text-white-soft shadow-xl animate-in fade-in slide-in-from-bottom-1 duration-200">
          Harga Dasar: {baseFormattedValue}
          <span className="block text-[8px] text-gold-400 font-medium mt-0.5">
            Didebit dalam IDR (kurs bank Anda)
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-950" />
        </span>
      )}
    </span>
  );
}
