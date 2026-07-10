import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import {
  getProductCategoriesDto,
  getPublicPromoSuggestionsDto,
  getPublishedProductsDto,
} from "@/lib/dal/marketplace";
import { SectionShell } from "@/components/ui/section-shell";
import { CatalogSkeleton } from "@/components/ui/skeletons";

export const dynamic = "force-dynamic";

// Dynamically import CatalogShell with Server-Side Rendering enabled but chunking the Client JS
const CatalogShell = nextDynamic(
  () => import("@/components/catalog/catalog-shell").then((m) => m.CatalogShell),
  {
    loading: () => <CatalogSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Katalog Produk - NILOKA",
  description: "Jelajahi produk turunan minyak nilam Aceh berkualitas tinggi, mulai dari minyak atsiri murni, roll-on aromaterapi, sabun artisan, hingga lilin wangi alami.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const [products, categories, promos] = await Promise.all([
    getPublishedProductsDto({ searchQuery: search }),
    getProductCategoriesDto(),
    getPublicPromoSuggestionsDto(),
  ]);

  return (
    <SectionShell
      eyebrow="Marketplace"
      title="Katalog Produk Nilam"
      description="Koleksi produk berkualitas tinggi langsung dari produsen lokal Aceh yang terverifikasi."
    >
      <div className="mt-8">
        <CatalogShell
          products={products}
          categories={categories}
          promos={promos}
          initialSearchQuery={search ?? ""}
        />
      </div>
    </SectionShell>
  );
}
