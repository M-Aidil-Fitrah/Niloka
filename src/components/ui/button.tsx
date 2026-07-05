import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function getVariantClass(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-brand-900 text-white-soft hover:bg-brand-800";
    case "secondary":
      return "border border-line bg-white-soft text-brand-900 hover:border-brand-700";
    case "ghost":
      return "text-brand-900 hover:bg-brand-100";
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
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:pointer-events-none disabled:opacity-50",
        getVariantClass(variant),
        getSizeClass(size),
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
