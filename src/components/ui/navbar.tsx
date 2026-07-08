"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageSquare } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { CartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import nilokaLogo from "@/public/assets/logo/logo.png";
import { cn } from "@/lib/styles";
import { useCart } from "@/context/cart-context";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Shop",
    href: "/products",
  },
  {
    label: "Bundles",
    href: "/bundles",
  },
  {
    label: "Berita & Artikel",
    href: "/artikel",
  },
  {
    label: "Nilam Passport",
    href: "/passport",
  },
  {
    label: "Ampas Nilam",
    href: "/ampas",
  },
  {
    label: "Seller",
    href: "/seller",
  },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasUnreadChats, setHasUnreadChats] = useState(false);

  // We use light theme navbar on any page that is NOT the landing page
  const isLight = pathname !== "/";
  const { totalCount } = useCart();

  useEffect(() => {
    try {
      const checkUnread = () => {
        const stored = localStorage.getItem("niloka_chats");
        if (stored) {
          const threads = JSON.parse(stored);
          const hasUnread = threads.some((t: { unread: boolean }) => t.unread);
          setHasUnreadChats(hasUnread);
        }
      };
      
      checkUnread();
      // Check every 5 seconds or on page transitions / focus
      const interval = setInterval(checkUnread, 5000);
      window.addEventListener("focus", checkUnread);
      return () => {
        clearInterval(interval);
        window.removeEventListener("focus", checkUnread);
      };
    } catch (e) {
      console.error(e);
    }
  }, [pathname]);

  return (
    <header className="site-nav page-shell fixed inset-x-0 top-6 z-50">
      <div
        className={cn(
          "site-nav-surface grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-5 rounded-full border px-6 py-3 transition-all duration-300 sm:px-7",
          isLight
            ? "border-line/45 bg-white-soft/85 text-brand-950 shadow-md backdrop-blur-md"
            : "border-transparent bg-transparent text-white-soft"
        )}
      >
        <Link aria-label="NILOKA home" className="flex items-center" href="/">
          <Image
            alt="NILOKA"
            className={cn(
              "h-auto w-28 sm:w-32 transition-all duration-300",
              !isLight && "brightness-0 invert"
            )}
            priority
            sizes="(min-width: 640px) 128px, 112px"
            src={nilokaLogo}
          />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center justify-center gap-7 text-sm font-bold lg:flex"
        >
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "transition-colors duration-200",
                isLight ? "hover:text-brand-700" : "hover:text-gold-500"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <label
            className={cn(
              "hidden h-10 w-[min(28vw,360px)] items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-sm md:flex transition-all duration-300",
              isLight
                ? "bg-cream-100/70 border border-line/30 text-brand-950"
                : "bg-white-soft text-ink-600"
            )}
          >
            <SearchIcon className="text-brand-700" />
            <span className="sr-only">Cari produk</span>
            <input
              className={cn(
                "w-full bg-transparent text-sm font-semibold outline-none",
                isLight ? "placeholder:text-ink-600/70" : "placeholder:text-ink-600"
              )}
              placeholder="Search product..."
              type="search"
            />
          </label>
          <Link href="/chat" className="relative block">
            <IconButton label="Buka chat" theme={isLight ? "light" : "dark"}>
              <MessageSquare className="h-[18px] w-[18px]" />
            </IconButton>
            {hasUnreadChats && (
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-brand-900 border border-white-soft animate-pulse" />
            )}
          </Link>
          <Link href="/checkout" className="relative block">
            <IconButton label="Buka keranjang" theme={isLight ? "light" : "dark"}>
              <CartIcon />
            </IconButton>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white-soft animate-in zoom-in duration-300">
                {totalCount}
              </span>
            )}
          </Link>
          <IconButton label="Buka akun" theme={isLight ? "light" : "dark"}>
            <UserIcon />
          </IconButton>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden flex items-center justify-center h-10 w-10 rounded-full border transition-all cursor-pointer",
              isLight 
                ? "border-line/45 bg-cream-100/70 text-brand-950 hover:bg-cream-200" 
                : "border-white-soft/20 bg-white-soft/10 text-white-soft hover:bg-white-soft/20"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mt-2.5 lg:hidden rounded-3xl border border-line/60 bg-white-soft/95 backdrop-blur-md p-4 sm:p-5 shadow-lg space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2.5 text-sm font-bold text-brand-950">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-xl hover:bg-cream-100/50 transition-all duration-200",
                  pathname === item.href && "bg-cream-100 text-brand-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile search bar */}
          <div className="pt-3 border-t border-line/45 md:hidden">
            <label className="flex h-10 w-full items-center gap-2 rounded-full bg-cream-100/70 border border-line/30 px-4 text-xs font-semibold text-brand-950">
              <SearchIcon className="text-brand-700" />
              <input
                className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-ink-600/70"
                placeholder="Cari produk..."
                type="search"
              />
            </label>
          </div>
        </div>
      )}
    </header>
  );
}
