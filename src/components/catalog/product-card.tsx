import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/ui/price-display";
import type { Product, Promo } from "@/lib/contracts";
import { Store } from "lucide-react";

type ProductCardProps = {
  product: Product;
  promos: Promo[];
};

const tagLabels: Record<string, string> = {
  "best-seller": "Best Seller",
  "new-arrival": "Baru",
  "nilam-passport": "Passport",
  "aroma-calm": "Aroma Calm",
  "limited-batch": "Limited",
};

export function ProductCard({ product, promos }: ProductCardProps) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-white-soft transition-all duration-200 hover:border-brand-700/40 hover:ring-2 hover:ring-gold-500/20 hover:shadow-lg h-full">
      <Link href={`/products/${product.slug}`} className="block flex-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
          <Image
            alt={product.image.alt}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            src={product.image.src}
          />
          {product.tags.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  tone={tag === "best-seller" ? "gold" : "brand"}
                  className="text-[10px] min-h-5 px-2 shadow-sm"
                >
                  {tagLabels[tag] ?? tag}
                </Badge>
              ))}
            </div>
          )}
          {promos.length > 0 && (
            <div className="absolute bottom-3 left-3 rounded-full bg-emerald-800 px-2.5 py-1 text-[9px] font-extrabold text-white-soft shadow-sm flex items-center gap-1.5 border border-emerald-700/50">
              <span className="font-mono tracking-wider">{promos[0].code}</span>
              <span className="border-l border-white/20 pl-1.5 opacity-90 flex items-center gap-0.5">
                {promos[0].type === "percentage" ? (
                  `Diskon ${promos[0].value}%`
                ) : promos[0].type === "fixed-amount" ? (
                  <>
                    Diskon <PriceDisplay amount={promos[0].value} showTooltip={false} className="border-none p-0 font-extrabold" />
                  </>
                ) : (
                  "Bebas Ongkir"
                )}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-brand-950 line-clamp-1 group-hover:text-brand-700">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-ink-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-extrabold text-brand-900">
              <PriceDisplay amount={product.price.amount} />
            </span>
            {product.originalPrice && product.originalPrice.amount > product.price.amount && (
              <span className="text-xs text-ink-600/50 line-through font-semibold">
                <PriceDisplay amount={product.originalPrice.amount} showTooltip={false} />
              </span>
            )}
          </div>
        </div>
      </Link>

      {product.sellerSlug && (
        <div className="border-t border-line/45 px-4 py-3 sm:px-5 bg-cream-50/45 flex items-center shrink-0">
          <Link
            href={`/sellers/${product.sellerSlug}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-900 hover:text-brand-700 hover:underline transition-colors"
          >
            <Store className="h-3.5 w-3.5 text-gold-600" />
            <span>{product.sellerName}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
