import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";

export function AromaMatchSection() {
  return (
    <section className="page-shell py-8" id="edukasi">
      <div className="reveal-block rounded-[32px] bg-brand-950 px-6 py-12 text-center text-white-soft sm:px-10 lg:px-16">
        <p className="eyebrow text-gold-500">Edukasi Tani &amp; Sirkular</p>
        <h2 className="mx-auto mt-3 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
          Pelajari Pengolahan Limbah Nilam Menjadi Produk Bernilai Tinggi
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white-soft/75 sm:text-base">
          Temukan koleksi artikel panduan praktis dan video instruktif untuk membantu petani mengolah ampas suling nilam menjadi pupuk organik cair, biobriket energi, pakan ternak, hingga media tanam jamur tiram yang bernilai ekonomis.
        </p>
        <div className="mt-8">
          <Link href="/artikel" className="inline-block">
            <Button variant="secondary" className="cursor-pointer">
              Buka Pusat Edukasi <ArrowRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
