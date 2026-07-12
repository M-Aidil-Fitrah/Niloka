"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

const PROBE_TIMEOUT_MS = 3_000;
const RECHECK_INTERVAL_MS = 15_000;

async function canReachServer(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch("/api/health", {
      cache: "no-store",
      headers: { "x-niloka-connectivity-check": "1" },
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Shows a sticky banner at the top when the user goes offline.
 * Disappears automatically when connection is restored.
 * Does not affect any server-rendered or authenticated UI.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const updateConnectivity = async () => {
      if (navigator.onLine) {
        if (!cancelled) setIsOffline(false);
        return;
      }

      const serverReachable = await canReachServer();
      if (!cancelled) {
        setIsOffline(!serverReachable);
      }
    };

    const handleOffline = () => {
      void updateConnectivity();
    };
    const handleOnline = () => {
      void updateConnectivity();
    };

    void updateConnectivity();
    const intervalId = window.setInterval(() => {
      if (!navigator.onLine) void updateConnectivity();
    }, RECHECK_INTERVAL_MS);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-2 bg-amber-900 px-4 py-2 text-center text-xs font-bold text-amber-50 shadow-lg"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        Tidak ada koneksi internet. Beberapa fitur tidak tersedia saat offline.
      </span>
    </div>
  );
}
