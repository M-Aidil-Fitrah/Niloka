import "server-only";

import type { ProductTag } from "@/lib/contracts";
import { formatRupiah } from "@/lib/formatters";
import {
  getFeaturedAmpasListingDto,
  getFeaturedPassportDto,
  getFeaturedProductCategoryDto,
  getFeaturedProductsDto,
  getRecentReviewsDto,
} from "@/lib/dal/marketplace";
import type {
  CategoryTile,
  CircularUse,
  LandingPageData,
  PassportItem,
  ProductCard,
  StoryMetric,
} from "@/lib/landing-types";

const productTagLabels: { id: ProductTag; label: string }[] = [
  {
    id: "best-seller",
    label: "Best seller",
  },
  {
    id: "new-arrival",
    label: "New arrival",
  },
  {
    id: "nilam-passport",
    label: "Nilam Passport",
  },
  {
    id: "aroma-calm",
    label: "Aroma calm",
  },
  {
    id: "limited-batch",
    label: "Limited batch",
  },
];

const ampasUsageLabels: CircularUse[] = [
  {
    id: "compost",
    label: "Pupuk kompos",
  },
  {
    id: "briquette",
    label: "Briket biomassa",
  },
  {
    id: "mushroom-media",
    label: "Media tanam jamur",
  },
  {
    id: "mulch",
    label: "Mulsa pertanian",
  },
  {
    id: "animal-feed",
    label: "Pakan ternak",
  },
  {
    id: "industrial-cellulose",
    label: "Selulosa industri",
  },
];

function getProductTagLabel(tags: ProductTag[]): string {
  const label = productTagLabels.find((item) => tags.includes(item.id));
  return label?.label ?? "Curated";
}

const storyMetrics: StoryMetric[] = [
  {
    id: "supply",
    value: "80-90%",
    label: "pasokan minyak nilam dunia berasal dari Indonesia",
  },
  {
    id: "farmers",
    value: "2.759",
    label: "KK petani nilam aktif di Aceh berdasarkan data 2023",
  },
  {
    id: "models",
    value: "Satuan + Grosir",
    label: "opsi pembelian ampas nilam yang fleksibel",
  },
];

export async function getLandingPageData(): Promise<LandingPageData> {
  const [
    featuredProducts,
    featuredPassport,
    featuredAmpasListing,
    featuredProductCategory,
    reviews,
  ] = await Promise.all([
    getFeaturedProductsDto(8),
    getFeaturedPassportDto(),
    getFeaturedAmpasListingDto(),
    getFeaturedProductCategoryDto(),
    getRecentReviewsDto(3),
  ]);

  const bestSellerProducts: ProductCard[] = featuredProducts
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      tag: getProductTagLabel(product.tags),
      price: product.price.amount,
      imageUrl: product.image.src,
      imageAlt: product.image.alt,
    }));

  const newArrivalProducts: ProductCard[] = featuredProducts
    .filter((product) => product.tags.includes("new-arrival"))
    .slice(0, 6)
    .map((product) => ({
      id: product.id,
      name: product.name,
      tag: "New arrival",
      price: product.price.amount,
      originalPrice: product.originalPrice
        ? product.originalPrice.amount
        : undefined,
      imageUrl: product.image.src,
      imageAlt: product.image.alt,
    }));

  const categoryTiles: CategoryTile[] = [
    {
      id: "aroma",
      label: "Nilam Insight",
      description:
        "Analisis kesehatan tanaman berbasis AI dan panduan budidaya, pengolahan limbah nilam.",
      imageUrl: "/images/landing/nilam-insight.jpg",
      imageAlt: "Analisis kesehatan daun nilam menggunakan AI.",
      href: "/artikel",
    },
    ...(featuredProductCategory
      ? [
          {
            id: "passport",
            label: "Nilam Passport",
            description:
              "Lihat asal bahan, profil aroma, fungsi, cara pakai, dan keamanan.",
            imageUrl: featuredProductCategory.image.src,
            imageAlt: featuredProductCategory.image.alt,
            href: "#passport",
          },
        ]
      : []),
    ...(featuredAmpasListing
      ? [
          {
            id: "ampas",
            label: "Ampas Nilam",
            description:
              "Listing ampas untuk kompos, briket, media tanam, dan biomassa.",
            imageUrl: featuredAmpasListing.image.src,
            imageAlt: featuredAmpasListing.image.alt,
            href: "#circular",
          },
        ]
      : []),
    ...(bestSellerProducts[0]
      ? [
          {
            id: "products",
            label: "Produk Nilam",
            description:
              "Minyak atsiri, roll-on relief, sabun artisan, dan produk turunan nilam.",
            imageUrl: bestSellerProducts[0].imageUrl,
            imageAlt: bestSellerProducts[0].imageAlt,
            href: "/products",
          },
        ]
      : []),
  ];

  const passportItems: PassportItem[] = featuredPassport
    ? [
        {
          id: "origin",
          label: "Asal bahan",
          value: featuredPassport.origin,
        },
        {
          id: "profile",
          label: "Profil aroma",
          value: featuredPassport.aromaProfile.join(", "),
        },
        {
          id: "usage",
          label: "Cara pakai",
          value: featuredPassport.usage,
        },
        {
          id: "safety",
          label: "Catatan aman",
          value: featuredPassport.safetyNotes,
        },
      ]
    : [];

  const circularUses: CircularUse[] = featuredAmpasListing
    ? ampasUsageLabels.filter((item) =>
        featuredAmpasListing.usageTags.includes(item.id),
      )
    : [];

  return {
    categoryTiles,
    bestSellerProducts,
    newArrivalProducts,
    passportItems,
    circularUses,
    storyMetrics,
    reviews,
  };
}
