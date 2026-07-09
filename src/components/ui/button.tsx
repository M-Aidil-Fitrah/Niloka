import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

function getVariantClass(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-brand-900 text-white-soft hover:bg-brand-700 hover:ring-2 hover:ring-gold-500/40 hover:scale-[1.02] active:scale-[0.98]";
    case "secondary":
      return "border border-line bg-white-soft text-brand-900 hover:bg-cream-50 hover:border-brand-700 hover:ring-2 hover:ring-gold-500/30 hover:scale-[1.02] active:scale-[0.98]";
    case "ghost":
      return "text-brand-900 hover:bg-brand-100 hover:scale-[1.02] active:scale-[0.98]";
  }
}

function getSizeClass(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-9 px-4 text-sm";
    case "md":
      return "h-11 px-5 text-sm";
  }
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:pointer-events-none disabled:opacity-50",
        getVariantClass(variant),
        getSizeClass(size),
        className,
      )}
      type={type}
      style={{ touchAction: "manipulation" }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
