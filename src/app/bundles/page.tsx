import nextDynamic from "next/dynamic";
import {
  getBundlesDto,
  getPublishedProductsDto,
  getSellersDto,
} from "@/lib/dal/marketplace";
import { BundleSkeleton } from "@/components/ui/skeletons";

export const dynamic = "force-dynamic";

const BundleShell = nextDynamic(
  () => import("@/components/catalog/bundle-shell").then((mod) => mod.BundleShell),
  {
    loading: () => <BundleSkeleton />,
  }
);

export const metadata = {
  title: "Bursa Paket Atsiri - NILOKA",
  description: "Beli paket kurasi atsiri atau rakit paket Anda sendiri dan dapatkan diskon 15% langsung.",
};

export default async function BundlesPage() {
  const [products, bundles, sellers] = await Promise.all([
    getPublishedProductsDto(),
    getBundlesDto(),
    getSellersDto(),
  ]);

  return <BundleShell products={products} bundles={bundles} sellers={sellers} />;
}
