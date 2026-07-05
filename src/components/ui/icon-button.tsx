import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white-soft backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
