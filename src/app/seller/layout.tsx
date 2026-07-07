import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Portal - NILOKA",
  description: "Kelola katalog produk, listing ampas B2B, pantau transparansi Nilam Passport, dan buat deskripsi produk dengan bantuan AI.",
};

type SellerLayoutProps = {
  children: ReactNode;
};

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="h-dvh w-full overflow-hidden bg-cream-50 text-ink-900 font-sans flex flex-col antialiased">
      {children}
    </div>
  );
}
