import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/ui/navbar";
import { SiteFooter } from "@/components/ui/footer";

type ProductsLayoutProps = {
  children: ReactNode;
};

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream-50">
      <SiteNavbar />
      <main className="flex-1 pt-28 pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
