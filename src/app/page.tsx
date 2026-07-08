import { LandingMotion } from "@/components/landing/landing-motion";
import { SiteFooter } from "@/components/ui/footer";
import { SiteNavbar } from "@/components/ui/navbar";
import { BackToTop } from "@/components/ui/back-to-top";
import { getLandingPageData } from "@/lib/landing-data";

// Import sections
import { HeroSection } from "@/components/landing/sections/hero-section";
import { CategorySection } from "@/components/landing/sections/category-section";
import { BestSellersSection } from "@/components/landing/sections/best-sellers-section";
import { EditorialSection } from "@/components/landing/sections/editorial-section";
import { PassportSection } from "@/components/landing/sections/passport-section";
import { CircularSection } from "@/components/landing/sections/circular-section";
import { NewArrivalsSection } from "@/components/landing/sections/new-arrivals-section";
import { TrustSection } from "@/components/landing/sections/trust-section";

export default async function Home() {
  const {
    bestSellerProducts,
    categoryTiles,
    circularUses,
    newArrivalProducts,
    passportItems,
    reviews,
    storyMetrics,
  } = await getLandingPageData();

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
        <NewArrivalsSection products={newArrivalProducts} />


        {/* Trust/Review Strip */}
        <TrustSection reviews={reviews} />

        <SiteFooter />

        <BackToTop />
      </main>
    </LandingMotion>
  );
}
