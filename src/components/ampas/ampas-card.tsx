import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { AmpasListing } from "@/lib/contracts";

type AmpasCardProps = {
  listing: AmpasListing;
  viewMode: "grid" | "list";
};

const usageLabels: Record<string, string> = {
  compost: "Kompos Organik",
  briquette: "Bahan Briket",
  mulch: "Mulsa Pertanian",
  "industrial-cellulose": "Selulosa Industri",
  "mushroom-media": "Media Jamur",
  "animal-feed": "Pakan Ternak",
};

export function AmpasCard({ listing, viewMode }: AmpasCardProps) {
  const formattedPrice = `Rp ${listing.pricePerKg.amount.toLocaleString("id-ID")}/Kg`;
  const locationString = `${listing.location.district}, ${listing.location.city}`;

  const conditionBadge =
    listing.condition === "dry" ? (
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-md">
        Kering (Dry Biomass)
      </span>
    ) : (
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">
        Basah (Wet Compost)
      </span>
    );

  // 1. LIST VIEW MODE (Highly utilitarian, data-dense)
  if (viewMode === "list") {
    return (
      <div className="group rounded-2xl border border-line bg-white-soft p-5 flex flex-col md:flex-row justify-between gap-5 transition-all duration-300 hover:border-brand-700 hover:shadow-lg">
        {/* Info Left */}
        <div className="flex gap-4 items-start flex-1">
          {/* Thumbnail */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line/50 bg-cream-100">
            <Image
              src={listing.image.src}
              alt={listing.image.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              sizes="80px"
            />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {conditionBadge}
              <span className="text-[10px] text-ink-600 font-medium">• {locationString}</span>
            </div>
            <Link href={`/ampas/${listing.slug}`}>
              <h3 className="text-base font-bold text-brand-950 hover:text-brand-900 transition-colors cursor-pointer truncate">
                {listing.slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </h3>
            </Link>
            
            {/* Horizontal Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div>
                <span className="text-ink-600 block text-[9px] font-bold uppercase">Stok Tersedia</span>
                <span className="font-bold text-brand-900">{listing.quantityKg.toLocaleString("id-ID")} Kg</span>
              </div>
              <div>
                <span className="text-ink-600 block text-[9px] font-bold uppercase">Harga per Kg</span>
                <span className="font-extrabold text-brand-950">{formattedPrice}</span>
              </div>
              <div className="col-span-2">
                <span className="text-ink-600 block text-[9px] font-bold uppercase">Metode Suling</span>
                <p className="text-ink-700 truncate text-[11px] font-semibold">{listing.distillationProcess}</p>
              </div>
            </div>

            {/* Usage Tags */}
            <div className="flex flex-wrap gap-1 pt-1.5">
              {listing.usageTags.map((tag) => (
                <Badge
                  key={tag}
                  tone="brand"
                  className="text-[9px] min-h-4 px-1.5 py-0 bg-brand-50 border-brand-100 text-brand-900 font-medium"
                >
                  {usageLabels[tag] ?? tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Right */}
        <div className="shrink-0 flex md:flex-col justify-between md:justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-line/60 pt-3 md:pt-0 md:pl-5">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-ink-600 block">Total Nilai Batch</span>
            <span className="text-sm font-extrabold text-brand-950">
              Rp {(listing.pricePerKg.amount * listing.quantityKg).toLocaleString("id-ID")}
            </span>
          </div>
          <Link
            href={`/ampas/${listing.slug}`}
            className="w-full md:w-auto h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold transition-all duration-200 text-center inline-flex items-center justify-center"
            style={{ touchAction: "manipulation" }}
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    );
  }

  // 2. GRID VIEW MODE (Clean, spec-card focused)
  return (
    <article className="group rounded-[28px] border border-line bg-white-soft p-5 flex flex-col justify-between transition-all duration-300 hover:border-brand-700 hover:shadow-xl">
      <div>
        {/* Card Image & Condition badge overlay */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line/50 bg-cream-100 mb-4">
          <Link href={`/ampas/${listing.slug}`}>
            <Image
              src={listing.image.src}
              alt={listing.image.alt}
              className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
            />
          </Link>
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            <span className="bg-white-soft/90 backdrop-blur-sm rounded-lg px-2 py-0.5 shadow-sm inline-block">
              {conditionBadge}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-ink-600 font-bold block uppercase tracking-wider">
              {locationString}
            </span>
            <Link href={`/ampas/${listing.slug}`}>
              <h3 className="text-base font-bold text-brand-950 group-hover:text-brand-900 mt-0.5 line-clamp-1 cursor-pointer">
                {listing.slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </h3>
            </Link>
          </div>

          {/* Specifications list */}
          <div className="rounded-xl bg-cream-50/50 border border-line/40 p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-ink-600 font-medium">Stok Tersedia</span>
              <span className="font-bold text-brand-900">{listing.quantityKg.toLocaleString("id-ID")} Kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ink-600 font-medium">Harga per Kg</span>
              <span className="font-extrabold text-brand-950">{formattedPrice}</span>
            </div>
            <div className="pt-1.5 border-t border-line/40">
              <span className="text-[9px] text-ink-600 block font-bold uppercase">Deskripsi Penyulingan</span>
              <p className="text-ink-700 leading-normal mt-0.5 text-[11px] line-clamp-2">
                {listing.distillationProcess}
              </p>
            </div>
          </div>

          {/* Potential Uses */}
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-600 mb-1.5">
              Potensi Penggunaan (Klaim Seller)
            </span>
            <div className="flex flex-wrap gap-1">
              {listing.usageTags.map((tag) => (
                <Badge
                  key={tag}
                  tone="brand"
                  className="text-[9px] min-h-4 px-1.5 py-0 bg-brand-50 border-brand-100 text-brand-900 font-medium"
                >
                  {usageLabels[tag] ?? tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-line/40">
        <Link
          href={`/ampas/${listing.slug}`}
          className="w-full h-10 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold transition-all duration-200 text-center inline-flex items-center justify-center"
          style={{ touchAction: "manipulation" }}
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
