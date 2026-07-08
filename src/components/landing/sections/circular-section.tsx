import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { CircularUse } from "@/lib/landing-data";

type CircularSectionProps = {
  circularUses: CircularUse[];
};

export function CircularSection({ circularUses }: CircularSectionProps) {
  return (
    <div
      className="reveal-block relative min-h-[500px] overflow-hidden rounded-[28px] bg-brand-900 text-white-soft h-full flex flex-col justify-between"
      id="circular"
    >
      <Image
        alt="Bahan alami dan minyak nilam sebagai bagian dari ekonomi sirkular."
        className="object-cover opacity-70"
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 58vw, 100vw"
        src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=85"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/70 to-transparent" />
      <div className="relative flex min-h-[500px] flex-col justify-between p-6 sm:p-8 h-full flex-1">
        <div>
          <Badge tone="light">Ekonomi sirkular B2B</Badge>
          <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Ampas nilam menjadi
            <span className="font-accent italic font-medium"> bahan bernilai</span>.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white-soft/82">
            Penyuling dapat membuat listing ampas dengan kondisi,
            kuantitas, harga/kg, lokasi, dan tag potensi penggunaan.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {circularUses.map((item) => (
            <Badge key={item.id} tone="light">
              {item.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
