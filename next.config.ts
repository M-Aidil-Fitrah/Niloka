import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  deploymentId:
    process.env.DEPLOYMENT_VERSION || process.env.NEXT_DEPLOYMENT_ID,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com",
      },
      {
        protocol: "https",
        hostname: "asset.kompas.com",
      },
      {
        protocol: "https",
        hostname: "agropedia.id",
      },
      {
        protocol: "https",
        hostname: "andreasdamanik14.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "www.acehprov.go.id",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      // Global security headers
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // Service Worker — must never be cached by the browser HTTP cache
      // so users always get the latest version
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
