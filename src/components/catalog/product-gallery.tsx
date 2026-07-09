"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageAsset } from "@/lib/contracts";

type ProductGalleryProps = {
  mainImage: ImageAsset;
  gallery: ImageAsset[];
};

export function ProductGallery({ mainImage, gallery }: ProductGalleryProps) {
  const allImages = [mainImage, ...gallery];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] ?? mainImage;

  return (
    <div className="flex flex-col gap-4">
      {/* Active Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-line bg-cream-100">
        <Image
          alt={activeImage.alt}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          src={activeImage.src}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-14 w-14 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-200 ${
                index === activeIndex
                  ? "border-brand-900 ring-2 ring-gold-500/30"
                  : "border-line hover:border-brand-700/50"
              }`}
            >
              <Image
                alt={img.alt}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 56px, 80px"
                src={img.src}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
