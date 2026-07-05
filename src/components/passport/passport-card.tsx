import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "@/components/ui/icons";
import type { Product, NilamPassport } from "@/lib/contracts";

type PassportCardProps = {
  product: Product;
  passport: NilamPassport;
};

const formLabels: Record<string, string> = {
  "essential-oil": "Essential Oil",
  "roll-on": "Roll-on",
  soap: "Sabun",
  diffuser: "Diffuser",
  perfume: "Parfum",
  "body-oil": "Body Oil / Losion",
  bundle: "Bundle",
};

export function PassportCard({ product, passport }: PassportCardProps) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-white-soft p-5 transition-all duration-300 hover:border-brand-700 hover:shadow-xl">
      {/* Header Info */}
      <div>
        <div className="flex gap-4">
          {/* Small thumbnail */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-line/50 bg-cream-100">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              sizes="80px"
            />
          </div>

          {/* Product Name & Category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-600">
                {formLabels[passport.productKind] ?? passport.productKind}
              </span>
              {passport.validationStatus === "validated" && (
                <Badge tone="gold" className="flex items-center gap-0.5 text-[9px] min-h-4 px-1.5 py-0">
                  <ShieldCheckIcon className="h-3 w-3" />
                  Terkurasi
                </Badge>
              )}
            </div>
            <h3 className="mt-1 text-base font-bold text-brand-950 line-clamp-2 group-hover:text-brand-900">
              {product.name}
            </h3>
          </div>
        </div>

        <hr className="my-4 border-line/60" />

        {/* Passport details */}
        <div className="space-y-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
              Asal Bahan Baku
            </span>
            <p className="mt-0.5 text-sm font-semibold text-brand-900">{passport.origin}</p>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
              Profil Aroma
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {passport.aromaProfile.map((aroma) => (
                <Badge
                  key={aroma}
                  tone="brand"
                  className="text-[9px] min-h-4 px-1.5 py-0 bg-brand-50 border-brand-200 text-brand-900"
                >
                  {aroma}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-600">
              Catatan Keamanan
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-700 line-clamp-2">
              {passport.safetyNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-5">
        <Link href={`/products/${product.slug}`} className="block">
          <button className="w-full rounded-2xl border border-line bg-cream-50 py-2.5 text-center text-xs font-semibold text-brand-950 transition-all duration-200 hover:border-brand-700 hover:bg-cream-100">
            Lihat Produk & Paspor Lengkap
          </button>
        </Link>
      </div>
    </article>
  );
}
