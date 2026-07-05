import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";

export function AromaMatchSection() {
  return (
    <section className="page-shell py-8" id="aromamatch">
      <div className="reveal-block rounded-[32px] bg-brand-950 px-6 py-12 text-center text-white-soft sm:px-10 lg:px-16">
        <p className="eyebrow text-gold-500">AromaMatch AI</p>
        <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
          Dari kebutuhan pengguna ke rekomendasi produk nilam yang relevan.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white-soft/75 sm:text-base">
          Wizard empat langkah akan membaca tujuan penggunaan, preferensi
          aroma, bentuk produk, dan budget. Hasilnya berupa grid rekomendasi
          dengan alasan singkat.
        </p>
        <div className="mt-8">
          <Button variant="secondary">
            Mulai AromaMatch <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
