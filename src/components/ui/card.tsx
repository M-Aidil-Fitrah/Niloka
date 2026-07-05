import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/styles";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-[28px] border border-line bg-white-soft", className)}
      {...props}
    >
      {children}
    </div>
  );
}
