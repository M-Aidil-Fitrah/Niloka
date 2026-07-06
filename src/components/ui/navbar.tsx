"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    label: "AromaMatch AI",
    href: "/aromamatch",
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
  // We use light theme navbar on any page that is NOT the landing page
  const isLight = pathname !== "/";
  const { totalCount } = useCart();

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

        <div className="flex items-center justify-end gap-2">
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
        </div>
      </div>
    </header>
  );
}
