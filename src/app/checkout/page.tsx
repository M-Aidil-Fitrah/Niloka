import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPublishedProductsDto, getActiveAmpasListingsDto } from "@/lib/dal/marketplace";
import { SectionShell } from "@/components/ui/section-shell";
import { CheckoutSkeleton } from "@/components/ui/skeletons";

// Lazy load CheckoutShell with SSR enabled
const CheckoutShell = dynamic(
  () => import("@/components/checkout/checkout-shell").then((m) => m.CheckoutShell),
  {
    loading: () => <CheckoutSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Keranjang & Checkout - NILOKA",
  description: "Kelola keranjang belanja produk nilam dan ajukan pembayaran aman tersertifikasi melalui Midtrans gateway mock.",
};

export default async function CheckoutPage() {
  const products = await getPublishedProductsDto();
  const listings = await getActiveAmpasListingsDto();

  return (
    <SectionShell
      eyebrow="Transaksi Niloka"
      title="Keranjang & Checkout"
      description="Tinjau daftar belanjaan Anda, lengkapi alamat pengiriman, dan lakukan simulasi pembayaran aman."
    >
      <div className="mt-8">
        <CheckoutShell products={products} ampasListings={listings} />
      </div>
    </SectionShell>
  );
}

