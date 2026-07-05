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
  // Generate a realistic, distinct Batch Code for transparency tracking
  const originCode = passport.origin.split(" ")[0].toUpperCase();
  const productCode = product.id.split("-").pop()?.slice(0, 4).toUpperCase() || "001";
  const batchCode = `NLK-${originCode}-${productCode}`;

  const formattedDate = new Date(passport.validatedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-white-soft p-5 transition-all duration-300 hover:border-brand-700 hover:shadow-xl">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold tracking-wider text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md">
            BATCH: {batchCode}
          </span>
          {passport.validationStatus === "validated" && (
            <Badge tone="gold" className="flex items-center gap-0.5 text-[9px] min-h-4 px-1.5 py-0">
              <ShieldCheckIcon className="h-3 w-3" />
              Terkurasi
            </Badge>
          )}
        </div>

        <div className="flex gap-4">
          {/* Small thumbnail */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line/50 bg-cream-100">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              sizes="64px"
            />
          </div>

          {/* Product Name & Category */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600">
              {formLabels[passport.productKind] ?? passport.productKind}
            </span>
            <h3 className="text-sm font-bold text-brand-950 line-clamp-1 group-hover:text-brand-900">
              {product.name}
            </h3>
            <p className="text-[10px] text-ink-600 truncate mt-0.5">
              Oleh: {passport.validatedBy}
            </p>
          </div>
        </div>

        <hr className="my-3 border-line/60" />

        {/* Passport details */}
        <div className="space-y-2.5">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
              Asal Bahan Baku
            </span>
            <p className="text-xs font-bold text-brand-900">{passport.origin}</p>
          </div>

          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
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
            <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600">
              Catatan Keamanan
            </span>
            <p className="text-[11px] leading-relaxed text-ink-700 line-clamp-2">
              {passport.safetyNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Footer log */}
      <div className="mt-4 pt-3 border-t border-line/40">
        <p className="text-[9px] text-ink-600">
          Tgl Cek: <span className="font-semibold text-brand-900">{formattedDate}</span>
        </p>
        <Link href={`/products/${product.slug}`} className="block mt-2">
          <button className="w-full rounded-xl border border-line bg-cream-50 py-2 text-center text-[11px] font-semibold text-brand-950 transition-all duration-200 hover:border-brand-700 hover:bg-cream-100">
            Lihat Paspor Lengkap
          </button>
        </Link>
      </div>
    </article>
  );
}
