import type { ReactNode } from "react";
import { cn } from "@/lib/styles";

type SectionShellProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionShell({
  eyebrow,
  title,
  accent,
  description,
  children,
  className,
  id,
}: SectionShellProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8", className)}
      id={id}
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase text-gold-600">{eyebrow}</p>
          <h2 className="text-2xl font-semibold text-brand-950 sm:text-3xl">
            {title}
            {accent ? (
              <span className="font-accent italic text-brand-700"> {accent}</span>
            ) : null}
          </h2>
        </div>
        {description ? (
          <p className="max-w-md text-sm leading-6 text-ink-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
