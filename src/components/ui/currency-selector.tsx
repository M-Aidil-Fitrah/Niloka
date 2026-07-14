"use client";

import { useCurrency, SUPPORTED_CURRENCIES } from "@/context/currency-context";
import { useState, useRef, useEffect } from "react";
import { Search, Globe, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/styles";
import { createPortal } from "react-dom";

interface CurrencySelectorProps {
  className?: string;
  theme?: "light" | "dark";
}

export function CurrencySelector({
  className,
  theme = "light",
}: CurrencySelectorProps) {
  const { currentCurrency, setCurrency, config } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      // check if mobile view
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filteredCurrencies = Object.values(SUPPORTED_CURRENCIES).filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isDarkNavbar = theme === "dark";

  // Render mobile bottom sheet inside React Portal
  const mobileDrawer = isOpen && mounted && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-brand-950/45 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Bottom Sheet Card */}
      <div className="absolute bottom-0 inset-x-0 max-h-[85vh] rounded-t-[2rem] border-t border-line/60 bg-white-soft p-5 pb-8 shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
        {/* Handle Bar */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line/60" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-brand-950 uppercase tracking-wider">
            Pilih Mata Uang
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="flex size-8 items-center justify-center rounded-full border border-line bg-cream-100/50 text-brand-950 hover:bg-cream-100 cursor-pointer"
            aria-label="Tutup pemilih mata uang"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="relative mb-4 flex items-center gap-2 rounded-2xl bg-cream-100/70 border border-line/30 px-4 py-3 text-xs font-semibold">
          <Search className="h-4 w-4 text-brand-700 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata uang atau negara..."
            className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-ink-600/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-ink-600 hover:text-brand-950 shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile List Container */}
        <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1 space-y-1 divide-y divide-line/20">
          {filteredCurrencies.length > 0 ? (
            filteredCurrencies.map((c) => (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all hover:bg-cream-100/50 active:bg-cream-100 cursor-pointer",
                  currentCurrency === c.code ? "bg-cream-100 text-brand-900" : "text-ink-800"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span>{c.label}</span>
                </span>
                <span className="text-xs font-extrabold text-gold-700">
                  {c.code} ({c.symbol})
                </span>
              </button>
            ))
          ) : (
            <p className="p-4 text-center text-xs font-bold text-ink-600">
              Tidak menemukan mata uang.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className={cn("relative", className ? className : "inline-block")}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 cursor-pointer",
          isDarkNavbar
            ? "border-white/20 bg-white/10 text-white-soft hover:bg-white/20"
            : "border-line/60 bg-cream-100/55 text-brand-950 hover:bg-cream-100 hover:border-brand-700/40"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Pilih mata uang"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>
          {config.flag} {config.code}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* DESKTOP POPOVER DROPDOWN (lg:block) */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-3 hidden w-72 rounded-3xl border border-line bg-white text-brand-950 p-4 shadow-xl animate-in slide-in-from-top-2 duration-200 z-50 lg:block"
          )}
          role="listbox"
        >
          {/* Search Header */}
          <div className="relative mb-3 flex items-center gap-2 rounded-xl bg-cream-100/70 border border-line/30 px-3 py-2 text-xs font-semibold">
            <Search className="h-3.5 w-3.5 text-brand-700 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata uang..."
              className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-ink-600/70"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-ink-600 hover:text-brand-950 shrink-0 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Currencies List */}
          <div className="max-h-60 overflow-y-auto pr-1 space-y-0.5 divide-y divide-line/20 scrollbar-thin">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((c) => (
                <button
                  key={c.code}
                  role="option"
                  aria-selected={currentCurrency === c.code}
                  onClick={() => handleSelect(c.code)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all hover:bg-cream-100/50 cursor-pointer",
                    currentCurrency === c.code ? "bg-cream-100 text-brand-900" : "text-ink-800"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span>{c.label}</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-gold-700">
                    {c.code} ({c.symbol})
                  </span>
                </button>
              ))
            ) : (
              <p className="p-3 text-center text-xs font-bold text-ink-600">
                Tidak menemukan mata uang.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET DRAWER (lg:hidden) */}
      {mobileDrawer}
    </div>
  );
}
