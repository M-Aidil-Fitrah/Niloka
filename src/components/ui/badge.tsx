import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type BadgeTone = "brand" | "gold" | "light";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

function getToneClass(tone: BadgeTone): string {
  switch (tone) {
    case "brand":
      return "border-brand-200 bg-brand-100 text-brand-900";
    case "gold":
      return "border-gold-100 bg-gold-100 text-brand-950";
    case "light":
      return "border-white/35 bg-white/20 text-white-soft";
  }
}

export function Badge({ children, className, tone = "brand", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-semibold",
        getToneClass(tone),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
