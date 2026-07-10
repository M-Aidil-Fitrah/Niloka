import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import {
  getActiveAmpasListingsDto,
  getPublicPromoSuggestionsDto,
  getPublishedProductsDto,
} from "@/lib/dal/marketplace";
import { SectionShell } from "@/components/ui/section-shell";
import { CheckoutSkeleton } from "@/components/ui/skeletons";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const CheckoutShell = nextDynamic(
  () => import("@/components/checkout/checkout-shell").then((m) => m.CheckoutShell),
  {
    loading: () => <CheckoutSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Checkout - NILOKA",
  description: "Lengkapi alamat, pilih kurir, dan bayar aman melalui Midtrans Core.",
};

type CheckoutPageProps = {
  searchParams: Promise<{ selected?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  await requireUser();
  const [products, listings, promos, sp] = await Promise.all([
    getPublishedProductsDto(),
    getActiveAmpasListingsDto(),
    getPublicPromoSuggestionsDto(),
    searchParams,
  ]);

  return (
    <SectionShell
      eyebrow="Transaksi Niloka"
      title="Checkout"
      description="Lengkapi data pengiriman dan lakukan pembayaran aman melalui Midtrans Core."
    >
      <div className="mt-8">
        <CheckoutShell products={products} ampasListings={listings} promos={promos} selectedIds={sp.selected?.split(",").filter(Boolean) ?? []} />
      </div>
    </SectionShell>
  );
}