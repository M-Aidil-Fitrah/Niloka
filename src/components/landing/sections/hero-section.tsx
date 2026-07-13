import Image from "next/image";
import Link from "next/link";
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
          src="/images/landing/niloka-hero.png"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(214,170,91,0.22),transparent_28%),linear-gradient(90deg,rgba(23,34,23,0.96),rgba(32,52,31,0.72),rgba(32,52,31,0.1))]" />

        <div className="relative flex h-full flex-col p-5 sm:p-7 lg:p-9 justify-end">
          <div className="max-w-5xl pb-4 pt-12 sm:pt-24">
            <h1 className="hero-title text-4xl font-extrabold leading-[0.95] sm:text-6xl lg:text-[5rem] xl:text-[5.75rem]">
              Minyak Nilam{" "}
              <span className="font-accent italic font-medium">murni</span>
              <br />
              Aceh, langsung
              <br />
              dari penyuling.
            </h1>

            <p className="hero-copy mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg font-medium leading-6 sm:leading-7 text-white-soft/82">
              Temukan keharuman mewah minyak atsiri murni, sabun artisan alami,
              dan lilin aromaterapi buatan pengrajin lokal Aceh secara langsung
              dengan transparansi kualitas terlacak.
            </p>

            <div className="hero-actions mt-6 sm:mt-8 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 bg-brand-900 text-white-soft hover:bg-brand-700 hover:ring-2 hover:ring-gold-500/40 hover:scale-[1.02] active:scale-[0.98] h-11 px-5 text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Jelajahi Produk <ArrowRightIcon />
              </Link>

              <Link
                href="#passport"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 border border-line bg-white-soft text-brand-900 hover:bg-cream-50 hover:border-brand-700 hover:ring-2 hover:ring-gold-500/30 hover:scale-[1.02] active:scale-[0.98] h-11 px-5 text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Cek Nilam Passport
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
