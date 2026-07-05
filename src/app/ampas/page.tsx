import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getActiveAmpasListings } from "@/lib/mock-queries";
import { SectionShell } from "@/components/ui/section-shell";
import { AmpasSkeleton } from "@/components/ui/skeletons";

// Lazy load AmpasShell with SSR enabled for B2B SEO indexation
const AmpasShell = dynamic(
  () => import("@/components/ampas/ampas-shell").then((m) => m.AmpasShell),
  {
    loading: () => <AmpasSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "B2B Ampas Nilam - NILOKA",
  description: "Marketplace B2B ampas penyulingan minyak nilam Aceh. Temukan biomasa kering atau kompos basah berkualitas sisa penyulingan untuk kebutuhan industri, briket, dan kompos.",
};

export default function AmpasPage() {
  const listings = getActiveAmpasListings();

  return (
    <SectionShell
      eyebrow="Ekonomi Sirkular B2B"
      title="Bursa Ampas Nilam"
      description="Direktori sisa ampas penyulingan nilam Aceh. Hubungi langsung penyuling untuk pemanfaatan kompos, briket, atau bahan baku industri."
    >
      <div className="mt-8">
        <AmpasShell listings={listings} />
      </div>
    </SectionShell>
  );
}
