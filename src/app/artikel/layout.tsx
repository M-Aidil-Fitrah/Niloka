import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/ui/navbar";
import { SiteFooter } from "@/components/ui/footer";

type ArtikelLayoutProps = {
  children: ReactNode;
};

export default function ArtikelLayout({ children }: ArtikelLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream-50">
      <SiteNavbar />
      <main className="flex-1 pt-28 pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
