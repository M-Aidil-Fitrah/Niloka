import type { Metadata } from "next";
import { getPublishedProducts, getPassports } from "@/lib/mock-queries";
import { PassportShell } from "@/components/passport/passport-shell";
import { SectionShell } from "@/components/ui/section-shell";

export const metadata: Metadata = {
  title: "Nilam Passport - NILOKA",
  description: "Cari dan verifikasi keaslian serta transparansi asal bahan baku minyak nilam Aceh untuk produk kecantikan, kesehatan, dan wewangian Anda.",
};

export default function PassportPage() {
  const products = getPublishedProducts();
  const passports = getPassports();

  return (
    <SectionShell
      eyebrow="Transparansi"
      title="Nilam Passport"
      description="Sistem transparansi rantai pasok untuk melacak asal daerah, kegunaan, dan profil aroma produk nilam Aceh."
    >
      <div className="mt-8">
        <PassportShell products={products} passports={passports} />
      </div>
    </SectionShell>
  );
}
