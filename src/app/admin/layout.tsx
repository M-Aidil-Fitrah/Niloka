import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - NILOKA",
  description: "Panel moderasi internal untuk validasi seller, produk, Nilam Passport, dan review listing ampas nilam.",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-dvh w-full overflow-hidden bg-cream-50 text-ink-900 font-sans flex flex-col antialiased">
      {children}
    </div>
  );
}
