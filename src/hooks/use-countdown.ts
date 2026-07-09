"use client";

import { useEffect, useState } from "react";

export function useCountdown(expiresAt: string) {
  const [remaining, setRemaining] = useState(
    () => Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes,
    seconds,
    isExpired: remaining <= 0,
  };
}