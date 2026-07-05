import Image from "next/image";
import { IconButton } from "@/components/ui/icon-button";
import { CartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import nilokaLogo from "@/public/assets/logo/logo.png";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Shop",
    href: "#products",
  },
  {
    label: "AromaMatch AI",
    href: "#aromamatch",
  },
  {
    label: "Nilam Passport",
    href: "#passport",
  },
  {
    label: "Ampas Nilam",
    href: "#circular",
  },
  {
    label: "Seller",
    href: "#seller",
  },
];

export function SiteNavbar() {
  return (
    <header className="site-nav page-shell fixed inset-x-0 top-4 z-50">
      <div className="site-nav-surface grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-5 rounded-full border border-transparent bg-transparent px-6 text-white-soft sm:px-7">
        <a aria-label="NILOKA home" className="flex items-center" href="#top">
          <Image
            alt="NILOKA"
            className="h-auto w-28 brightness-0 invert sm:w-32"
            priority
            sizes="(min-width: 640px) 128px, 112px"
            src={nilokaLogo}
          />
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center justify-center gap-7 text-sm font-bold lg:flex"
        >
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <label className="hidden h-10 w-[min(28vw,360px)] items-center gap-2 rounded-full bg-white-soft px-4 text-sm font-semibold text-ink-600 shadow-sm md:flex">
            <SearchIcon className="text-brand-700" />
            <span className="sr-only">Cari produk</span>
            <input
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink-600"
              placeholder="Search product..."
              type="search"
            />
          </label>
          <IconButton label="Buka keranjang">
            <CartIcon />
          </IconButton>
          <IconButton label="Buka akun">
            <UserIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
