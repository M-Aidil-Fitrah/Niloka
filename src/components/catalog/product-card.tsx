import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/formatters";
import type { Product } from "@/lib/contracts";

type ProductCardProps = {
  product: Product;
};

const tagLabels: Record<string, string> = {
  "best-seller": "Best Seller",
  "new-arrival": "Baru",
  "nilam-passport": "Passport",
  "aroma-calm": "Aroma Calm",
  "limited-batch": "Limited",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-[24px] border border-line bg-white-soft transition-all duration-200 hover:border-brand-700/40 hover:ring-2 hover:ring-gold-500/20 hover:shadow-lg"
    >
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
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-brand-950 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink-600 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-base font-bold text-brand-900">
          {formatRupiah(product.price.amount)}
        </p>
      </div>
    </Link>
  );
}
