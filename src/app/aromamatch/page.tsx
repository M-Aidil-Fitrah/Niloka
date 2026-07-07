import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPublishedProducts, getPassports, getAromaMatchQuestions } from "@/lib/mock-queries";
import { SectionShell } from "@/components/ui/section-shell";
import { AromaMatchSkeleton } from "@/components/ui/skeletons";

// Lazy load AromaMatchShell with SSR enabled for SEO optimization
const AromaMatchShell = dynamic(
  () => import("@/components/aromamatch/aromamatch-shell").then((m) => m.AromaMatchShell),
  {
    loading: () => <AromaMatchSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "AromaMatch - NILOKA",
  description: "Temukan produk minyak nilam dan aromaterapi yang paling cocok dengan kebutuhan, preferensi wewangian, dan anggaran Anda melalui panduan pintar AromaMatch.",
};

export default function AromaMatchPage() {
  const products = getPublishedProducts();
  const passports = getPassports();
  const questions = getAromaMatchQuestions();

  return (
    <SectionShell
      eyebrow="Rekomendasi Pintar"
      title="AromaMatch"
      description="Jawab beberapa pertanyaan singkat untuk menemukan racikan aroma nilam Aceh yang paling sesuai dengan preferensi Anda."
    >
      <div className="mt-8">
        <AromaMatchShell
          questions={questions}
          products={products}
          passports={passports}
        />
      </div>
    </SectionShell>
  );
}
