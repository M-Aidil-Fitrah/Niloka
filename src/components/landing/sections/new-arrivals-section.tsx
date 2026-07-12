import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CartIcon } from "@/components/ui/icons";
import type { ProductCard } from "@/lib/landing-types";

type NewArrivalsSectionProps = {
  products: ProductCard[];
};

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="page-shell py-8" id="new-arrivals">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Fresh Batch</p>
          <h2 className="section-title">
            New arrivals
            <span className="font-accent italic text-brand-700"> NILOKA</span>.
          </h2>
        </div>
      </div>

      <div className="product-grid grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Card className="product-card overflow-hidden" key={product.id}>
            <div className="relative aspect-[4/3] bg-cream-100">
              <Image
                alt={product.imageAlt}
                className="object-cover"
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
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
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-ink-900">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-ink-600/50 line-through font-semibold">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 bg-brand-900 text-white-soft hover:bg-brand-700 hover:ring-2 hover:ring-gold-500/40 hover:scale-[1.02] active:scale-[0.98] h-9 px-4 text-sm"
                  style={{ touchAction: "manipulation" }}
                >
                  <CartIcon /> Cart
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
