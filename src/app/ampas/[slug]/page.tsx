import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAmpasListingBySlugDto,
  getSellerByIdDto,
} from "@/lib/dal/marketplace";
import { AmpasDetailInfo } from "@/components/ampas/ampas-detail-info";
import { ChevronLeftIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getAmpasListingBySlugDto(slug);

  if (!listing) {
    return {
      title: "Ampas Nilam Tidak Ditemukan - NILOKA",
    };
  }

  const title = listing.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${title} - Ampas Nilam NILOKA`,
    description: `Beli ${title} berkualitas langsung dari penyuling lokal Aceh. Kuantitas ${listing.quantityKg} kg, harga ${listing.pricePerKg.amount} IDR/kg.`,
  };
}

export default async function AmpasDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getAmpasListingBySlugDto(slug);

  if (!listing) {
    notFound();
  }

  const seller = await getSellerByIdDto(listing.sellerId);

  if (!seller) {
    notFound();
  }

  const title = listing.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/ampas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900 transition-colors hover:text-brand-700"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Kembali ke Bursa Ampas
        </Link>
      </div>

      {/* Main product presentation */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Image Presentation */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-line bg-cream-100 shadow-sm">
            <Image
              src={listing.image.src}
              alt={listing.image.alt || title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right column: Main Info & Cart Interface */}
        <div className="lg:col-span-6">
          <AmpasDetailInfo listing={listing} seller={seller} />
        </div>
      </div>
    </div>
  );
}
