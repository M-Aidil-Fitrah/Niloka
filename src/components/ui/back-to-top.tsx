"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/styles";

function getScrollPosition(): number {
  const transform = document.documentElement.style.transform;
  if (transform) {
    const match = transform.match(/translateY\((-?\d+)px\)/);
    if (match) return Math.abs(Number.parseInt(match[1], 10));
  }
  return window.scrollY;
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        if (getScrollPosition() > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      aria-label="Kembali ke atas"
      onClick={scrollToTop}
      type="button"
      className={cn(
        "fixed bottom-[84px] right-6 z-40 flex size-11 items-center justify-center rounded-full border border-white-soft/30 bg-brand-950/80 text-white-soft shadow-lg backdrop-blur transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 cursor-pointer",
        isVisible 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowRightIcon className="-rotate-90" />
    </button>
  );
}
