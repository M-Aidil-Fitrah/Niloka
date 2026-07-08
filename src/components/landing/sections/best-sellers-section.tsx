import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartIcon } from "@/components/ui/icons";
import type { ProductCard } from "@/lib/landing-types";

type BestSellersSectionProps = {
  products: ProductCard[];
};

export function BestSellersSection({ products }: BestSellersSectionProps) {
  return (
    <section className="page-shell py-8" id="products">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Curated products</p>
          <h2 className="section-title">
            Best sellers
            <span className="font-accent italic text-brand-700"> NILOKA</span>.
          </h2>
        </div>
        <p className="section-copy">
          Produk turunan nilam Aceh disiapkan dengan card stabil, harga
          jelas, badge kecil, dan action belanja yang siap dipakai untuk
          katalog penuh.
        </p>
      </div>

      <div className="product-grid grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <Card className="product-card overflow-hidden" key={product.id}>
            <div className="relative aspect-[4/3] bg-cream-100">
              <Image
                alt={product.imageAlt}
                className="object-cover"
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                src={product.imageUrl}
              />
              <Badge className="absolute left-4 top-4" tone="light">
                {product.tag}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold text-brand-950">
                {product.name}
              </h3>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink-900">
                  {product.price}
                </p>
                <Button size="sm">
                  <CartIcon /> Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
