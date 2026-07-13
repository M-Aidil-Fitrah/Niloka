import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSellerBySlugDto,
  getPublishedProductsDto,
  getPromosForSellerDto,
  getProductCategoriesDto,
} from "@/lib/dal/marketplace";
import { SellerStoreShell } from "@/components/seller/seller-store-shell";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seller = await getSellerBySlugDto(slug);

  if (!seller) {
    return {
      title: "Toko Tidak Ditemukan - NILOKA",
    };
  }

  return {
    title: `${seller.displayName} - Toko Resmi NILOKA`,
    description: `Jelajahi produk turunan minyak nilam Aceh berkualitas tinggi dari ${seller.displayName}. Lokasi: ${seller.location.city}, ${seller.location.province}.`,
  };
}

export default async function SellerStorePage({ params }: Props) {
  const { slug } = await params;
  const seller = await getSellerBySlugDto(slug);

  if (!seller) {
    notFound();
  }

  const [products, promos, categories] = await Promise.all([
    getPublishedProductsDto({ sellerId: seller.id }),
    getPromosForSellerDto(seller.id),
    getProductCategoriesDto(),
  ]);

  return (
    <SellerStoreShell
      seller={seller}
      products={products}
      promos={promos}
      categories={categories}
    />
  );
}
