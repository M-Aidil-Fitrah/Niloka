import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NILOKA — Nilam Integrated Local Agro Marketplace",
    short_name: "NILOKA",
    description:
      "Marketplace terkurasi produk nilam Aceh dengan Nilam Passport dan ekosistem sirkular ampas nilam.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#20341f",
    theme_color: "#20341f",
    lang: "id",
    scope: "/",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Katalog Produk Nilam",
        short_name: "Katalog",
        description: "Jelajahi produk nilam Aceh",
        url: "/products",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Ampas Nilam B2B",
        short_name: "Ampas",
        description: "Marketplace ampas nilam untuk pelaku usaha",
        url: "/ampas",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
