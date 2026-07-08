import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  getPassportsDto,
  getPublishedProductsDto,
} from "@/lib/dal/marketplace";
import { SectionShell } from "@/components/ui/section-shell";
import { PassportSkeleton } from "@/components/ui/skeletons";

// Dynamically import PassportShell with SSR enabled for SEO indexing
const PassportShell = dynamic(
  () => import("@/components/passport/passport-shell").then((m) => m.PassportShell),
  {
    loading: () => <PassportSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Nilam Passport - NILOKA",
  description: "Cari dan verifikasi keaslian serta transparansi asal bahan baku minyak nilam Aceh untuk produk kecantikan, kesehatan, dan wewangian Anda.",
};

export default async function PassportPage() {
  const [products, passports] = await Promise.all([
    getPublishedProductsDto(),
    getPassportsDto(),
  ]);

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
