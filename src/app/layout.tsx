import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NILOKA",
  description:
    "Marketplace terkurasi produk nilam Aceh dengan Nilam Passport, AromaMatch AI, dan ekosistem sirkular ampas nilam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream-50 text-ink-900">{children}</body>
    </html>
  );
}
