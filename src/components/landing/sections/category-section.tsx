import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { CategoryTile } from "@/lib/landing-data";

type CategorySectionProps = {
  categoryTiles: CategoryTile[];
};

export function CategorySection({ categoryTiles }: CategorySectionProps) {
  return (
    <section className="page-shell py-8">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explore NILOKA</p>
          <h2 className="section-title">
            Satu platform untuk
            <span className="font-accent italic text-brand-700"> nilam Aceh</span>.
          </h2>
        </div>
        <p className="section-copy">
          Dari produk siap pakai untuk konsumen sampai ampas nilam untuk
          pelaku usaha, semua dirancang transparan, terkurasi, dan mudah
          dikembangkan ke backend PostgreSQL nanti.
        </p>
      </div>

      <div className="category-strip grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categoryTiles.map((category) => (
          <a
            className="category-card group relative min-h-72 overflow-hidden rounded-[28px] bg-brand-900 text-white-soft"
            href={category.href}
            key={category.id}
          >
            <Image
              alt={category.imageAlt}
              className="object-cover opacity-72 transition-transform duration-500 group-hover:scale-105"
              fill
              loading="lazy"
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              src={category.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-transparent" />
            <div className="relative flex min-h-72 flex-col justify-end p-5">
              <Badge tone="light">{category.label}</Badge>
              <p className="mt-3 text-sm leading-6 text-white-soft/82">
                {category.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
