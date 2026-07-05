import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  children: ReactNode;
  theme?: "dark" | "light";
};

export function IconButton({
  label,
  children,
  className,
  type = "button",
  theme = "dark",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border backdrop-blur transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        theme === "light"
          ? "border-line/60 bg-cream-100/55 text-brand-950 hover:bg-cream-100 hover:border-brand-700/40"
          : "border-white/30 bg-white/20 text-white-soft hover:bg-white/30",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
