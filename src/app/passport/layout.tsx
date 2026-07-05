import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/ui/navbar";
import { SiteFooter } from "@/components/ui/footer";

type PassportLayoutProps = {
  children: ReactNode;
};

export default function PassportLayout({ children }: PassportLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream-50">
      <SiteNavbar />
      <main className="flex-1 pt-28 pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
