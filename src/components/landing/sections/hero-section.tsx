import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";

export function HeroSection() {
  return (
    <section className="page-shell flex h-svh items-center py-4 sm:py-5">
      <div className="hero-card landing-hero relative h-full w-full overflow-hidden rounded-[36px] bg-brand-950 text-white-soft">
        <Image
          alt="Koleksi produk aromaterapi dan kosmetik natural sebagai visual utama NILOKA."
          className="object-cover opacity-75"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2200&q=85"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(214,170,91,0.22),transparent_28%),linear-gradient(90deg,rgba(23,34,23,0.96),rgba(32,52,31,0.72),rgba(32,52,31,0.1))]" />

        <div className="relative flex h-full flex-col p-5 sm:p-7 lg:p-9 justify-end">
          <div className="max-w-5xl pb-4 pt-24">
            <h1 className="hero-title text-5xl font-extrabold leading-[0.9] sm:text-6xl lg:text-[5rem] xl:text-[5.75rem]">
              Minyak Nilam <span className="font-accent italic font-medium">murni</span>
              <br />
              Aceh, langsung
              <br />
              dari penyuling.
            </h1>

            <p className="hero-copy mt-6 max-w-2xl text-base font-medium leading-7 text-white-soft/82 sm:text-lg">
              Temukan keharuman mewah minyak atsiri murni, sabun artisan alami, 
              dan lilin aromaterapi buatan pengrajin lokal Aceh. Temukan wewangian 
              terbaik untuk Anda melalui rekomendasi pintar AromaMatch AI.
            </p>

            <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="inline-block">
                <Button>
                  Jelajahi Produk <ArrowRightIcon />
                </Button>
              </Link>

              <a href="#passport" className="inline-block">
                <Button variant="secondary">
                  Cek Nilam Passport
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
