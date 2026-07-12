import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { StoryMetric } from "@/lib/landing-types";

type EditorialSectionProps = {
  metrics: StoryMetric[];
};

export function EditorialSection({ metrics }: EditorialSectionProps) {
  return (
    <section className="page-shell grid gap-3 py-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="story-panel reveal-block relative min-h-[520px] overflow-hidden rounded-[28px] bg-brand-950 text-white-soft">
        <Image
          alt="Botol minyak atsiri sebagai representasi kualitas nilam Aceh."
          className="object-cover opacity-68"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 55vw, 100vw"
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/72 to-brand-950/12" />
        <div className="relative flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Nilam Aceh bukan sekadar komoditas mentah.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white-soft/82 sm:text-base">
              NILOKA mempertemukan UMKM, penyuling, pembeli, dan pelaku usaha
              dalam ekositem toko online yang lengkap.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {metrics.map((metric) => (
          <Card className="metric-card p-6 sm:p-8" key={metric.id}>
            <p className="text-5xl font-bold text-brand-950">
              {metric.value}
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-ink-600">
              {metric.label}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
