import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PassportItem } from "@/lib/landing-data";

type PassportSectionProps = {
  passportItems: PassportItem[];
};

export function PassportSection({ passportItems }: PassportSectionProps) {
  return (
    <Card className="reveal-block p-6 sm:p-8 h-full flex flex-col justify-between" id="passport">
      <div>
        <Badge tone="gold">Nilam Passport</Badge>
        <h2 className="mt-5 text-4xl font-bold leading-tight text-brand-950 sm:text-5xl">
          Transparansi informasi asal-usul dan karakteristik produk.
        </h2>
        <p className="mt-5 text-sm leading-7 text-ink-600">
          Setiap produk menampilkan asal bahan baku, profil aroma, fungsi, cara pakai, dan catatan keamanan yang ditinjau sebelum dipublikasikan.
        </p>
      </div>
      <div className="mt-7 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
        {passportItems.map((item) => (
          <div className="rounded-2xl bg-cream-100 p-4" key={item.id}>
            <p className="font-bold text-brand-950">{item.label}</p>
            <p className="mt-1 text-ink-600">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
