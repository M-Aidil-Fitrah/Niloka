import type { MetadataRoute } from "next";

const siteUrl = "https://niloka.store";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/ampas", priority: 0.8, changeFrequency: "daily" },
  { path: "/passport", priority: 0.7, changeFrequency: "weekly" },
  { path: "/bundles", priority: 0.7, changeFrequency: "weekly" },
  { path: "/artikel", priority: 0.6, changeFrequency: "weekly" },
  { path: "/apply-seller", priority: 0.5, changeFrequency: "monthly" },
] satisfies {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
