import type { Metadata } from "next";
import { getPublishedProducts, getProductCategories, getSellers } from "@/lib/mock-queries";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { SectionShell } from "@/components/ui/section-shell";

export const metadata: Metadata = {
  title: "Katalog Produk - NILOKA",
  description: "Jelajahi produk turunan minyak nilam Aceh berkualitas tinggi, mulai dari minyak atsiri murni, roll-on aromaterapi, sabun artisan, hingga lilin wangi alami.",
};

export default function ProductsPage() {
  const products = getPublishedProducts();
  const categories = getProductCategories();
  const sellers = getSellers();

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
          sellers={sellers}
        />
      </div>
    </SectionShell>
  );
}
