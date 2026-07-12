"use client";

import { useEffect } from "react";

/**
 * Registers the NILOKA Service Worker silently.
 * Mounted in root layout — renders nothing to the DOM.
 * SW is only registered in production-like environments (not during Next.js HMR dev mode)
 * to avoid conflicts with hot-module replacement.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Skip registration in dev to prevent HMR interference
    if (process.env.NODE_ENV === "development") return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          // Never serve a stale SW — always fetch fresh
          updateViaCache: "none",
        })
        .then((registration) => {
          // Check for updates every 60 seconds
          setInterval(() => registration.update(), 60_000);
        })
        .catch((err) => {
          console.warn("[NILOKA SW] Registration failed:", err);
        });
    });
  }, []);

  return null;
}
