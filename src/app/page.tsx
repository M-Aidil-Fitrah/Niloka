import { LandingMotion } from "@/components/landing/landing-motion";
import { SiteFooter } from "@/components/ui/footer";
import { SiteNavbar } from "@/components/ui/navbar";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  bestSellerProducts,
  categoryTiles,
  circularUses,
  passportItems,
  storyMetrics,
} from "@/lib/landing-data";

// Import sections
import { HeroSection } from "@/components/landing/sections/hero-section";
import { CategorySection } from "@/components/landing/sections/category-section";
import { BestSellersSection } from "@/components/landing/sections/best-sellers-section";
import { EditorialSection } from "@/components/landing/sections/editorial-section";
import { PassportSection } from "@/components/landing/sections/passport-section";
import { CircularSection } from "@/components/landing/sections/circular-section";
import { NewArrivalsSection } from "@/components/landing/sections/new-arrivals-section";
import { TrustSection } from "@/components/landing/sections/trust-section";
import { AromaMatchSection } from "@/components/landing/sections/aromamatch-section";

export default function Home() {
  return (
    <LandingMotion>
      <main className="min-h-screen overflow-hidden bg-cream-50 text-ink-900" id="top">
        <SiteNavbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Category Strip */}
        <CategorySection categoryTiles={categoryTiles} />

        {/* Best Sellers */}
        <BestSellersSection products={bestSellerProducts} />

        {/* Feature Editorial / Story Metrics */}
        <EditorialSection metrics={storyMetrics} />

        {/* Nilam Passport & Circular Economy (Side by side) */}
        <section className="page-shell grid gap-3 py-8 lg:grid-cols-[0.92fr_1.08fr]">
          <PassportSection passportItems={passportItems} />
          <CircularSection circularUses={circularUses} />
        </section>

        {/* New Arrival Section */}
        <NewArrivalsSection />

        {/* AromaMatch AI */}
        <AromaMatchSection />

        {/* Trust/Review Strip */}
        <TrustSection />

        <SiteFooter />

        {/* Back to top button */}
        <a
          aria-label="Kembali ke atas"
          className="back-to-top pointer-events-none fixed bottom-5 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-white-soft/30 bg-brand-950/80 text-white-soft opacity-0 shadow-lg backdrop-blur transition-colors hover:bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          href="#top"
        >
          <ArrowRightIcon className="-rotate-90" />
        </a>
      </main>
    </LandingMotion>
  );
}
