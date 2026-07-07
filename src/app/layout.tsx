import type { Metadata } from "next";
import "./globals.css";

const plusJakartaSans = {
  variable: "--font-sans",
};

const cormorant = {
  variable: "--font-serif-accent",
};

export const metadata: Metadata = {
  title: "NILOKA",
  description:
    "Marketplace terkurasi produk nilam Aceh dengan Nilam Passport, AromaMatch, dan ekosistem sirkular ampas nilam.",
};

import { CartProvider } from "@/context/cart-context";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-cream-50 text-ink-900" suppressHydrationWarning>
        <CartProvider>
          {children}
          <FloatingChatbot />
        </CartProvider>
      </body>
    </html>
  );
}
