"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Shows a sticky banner at the top when the user goes offline.
 * Disappears automatically when connection is restored.
 * Does not affect any server-rendered or authenticated UI.
 */
export function OfflineBanner() {
  // Lazy initial state — reads navigator.onLine only on first mount
  // This avoids calling setState() synchronously inside an effect
  const [isOffline, setIsOffline] = useState<boolean>(
    () => typeof navigator !== "undefined" && !navigator.onLine
  );

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
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
