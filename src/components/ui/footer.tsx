"use client";

import { useCallback, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/icons";
import { footerColumns } from "@/lib/landing-types";
import { showToast } from "@/lib/toast";

type SocialLink = {
  id: string;
  label: string;
  icon: ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: <FacebookIcon />,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <InstagramIcon />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <LinkedinIcon />,
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <YoutubeIcon />,
  },
];

const footerLinkHref: Record<string, string> = {
  "Produk Nilam": "/products",
  "Ampas Nilam": "/ampas",
  "Berita & Artikel": "/artikel",
  "Nilam Passport": "/passport",
  "Daftar Seller": "/apply-seller",
  "Dashboard": "/seller",
  "Promo Toko": "/products?promo=true",
  "Validasi Produk": "/seller",
  "Tentang": "/",
  "Riset Nilam": "/artikel",
  "Ekonomi Sirkular": "/ampas",
  "Kontak": "/chat",
};

export function SiteFooter() {
  const handleNewsletterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const email = emailInput?.value?.trim();
    if (!email) {
      showToast("Silakan masukkan email Anda.", "info");
      return;
    }
    showToast("Terima kasih! Anda telah berlangganan newsletter NILOKA.", "success");
    emailInput.value = "";
  }, []);

  return (
    <footer className="mt-8 border-t border-line bg-cream-100" id="seller">
      <div className="page-shell pb-8 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="max-w-lg text-sm font-bold leading-6 text-ink-900">
              Ikuti newsletter NILOKA untuk info produk terbaru, onboarding
              seller, dan update ekonomi sirkular.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-6 flex max-w-xl flex-col gap-3 rounded-3xl bg-white-soft p-2 sm:flex-row sm:rounded-full">
              <label className="sr-only" htmlFor="newsletter-email">
                Email newsletter
              </label>
              <input
                className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-sm outline-none placeholder:text-ink-600"
                id="newsletter-email"
                name="email"
                placeholder="Masukkan email Anda"
                type="email"
                required
              />
              <Button type="submit" className="min-w-36">Berlangganan</Button>
            </form>
            <p className="mt-4 text-xs leading-5 text-ink-600">
              Dengan berlangganan, Anda setuju menerima pembaruan dari NILOKA.
            </p>
            <div className="mt-8 flex gap-3">
              {socialLinks.map((item) => (
                <a
                  aria-label={`NILOKA ${item.label}`}
                  className="flex size-9 items-center justify-center rounded-full border border-line text-brand-900 transition-colors hover:border-brand-700 hover:bg-brand-100"
                  href={`https://${item.id}.com/niloka`}
                  key={item.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.id}>
                <h3 className="text-sm font-bold text-ink-900">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-4 text-sm text-ink-700">
                  {column.links.map((link) => {
                    const href = footerLinkHref[link] ?? "/";
                    return (
                      <li key={link}>
                        <Link href={href}>{link}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-parallax mt-12 flex items-end gap-5 pb-8 sm:gap-8">
          <p className="footer-word text-[24vw] font-black leading-[0.72] text-brand-900 sm:text-[20vw] lg:text-[18vw]">
            niloka
          </p>
          <div className="footer-word-line mb-[2.2vw] h-[clamp(5px,0.75vw,13px)] min-w-16 flex-1 rounded-full bg-brand-900" />
        </div>

        <div className="border-brand-900/15 pt-5 text-xs font-semibold text-ink-600 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 Niloka. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Curated in Aceh for a more transparent patchouli ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
