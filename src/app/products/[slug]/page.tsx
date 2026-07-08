import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPassportByProductIdDto,
  getProductBySlugDto,
  getPromosForSellerDto,
  getReviewsForProductDto,
  getSellerByIdDto,
} from "@/lib/dal/marketplace";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductInfo } from "@/components/catalog/product-info";
import { PassportSummary } from "@/components/catalog/passport-summary";
import { ProductReviews } from "@/components/catalog/product-reviews";
import { ChevronLeftIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugDto(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - NILOKA",
    };
  }

  return {
    title: `${product.name} - NILOKA`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugDto(slug);

  if (!product) {
    notFound();
  }

  const [passport, seller, reviews, promos] = await Promise.all([
    getPassportByProductIdDto(product.id),
    getSellerByIdDto(product.sellerId),
    getReviewsForProductDto(product.id),
    getPromosForSellerDto(product.sellerId),
  ]);

  if (!seller) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900 transition-colors hover:text-brand-700"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Kembali ke Katalog
        </Link>
      </div>

      {/* Main product presentation */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery mainImage={product.image} gallery={product.gallery} />
        </div>

        {/* Right column: Main Info */}
        <div className="lg:col-span-6">
          <ProductInfo product={product} seller={seller} promos={promos} />
        </div>
      </div>

      {/* Passport and Reviews Sections */}
      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {/* Passport summary */}
        <div>
          {passport ? (
            <PassportSummary passport={passport} />
          ) : (
            <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 text-center text-ink-600">
              Nilam Passport tidak tersedia untuk produk ini.
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <ProductReviews reviews={reviews} productId={product.id} sellerId={product.sellerId} />
        </div>
      </div>
    </div>
  );
}
