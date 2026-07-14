import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-accent",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niloka.store"),
  title: {
    default: "NILOKA",
    template: "%s | NILOKA",
  },
  description:
    "Marketplace produk nilam Aceh dengan Nilam Passport dan ekosistem sirkular ampas nilam.",
  applicationName: "NILOKA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://niloka.store",
    siteName: "NILOKA",
    title: "NILOKA",
    description:
      "Marketplace produk nilam Aceh dengan Nilam Passport dan ekosistem sirkular ampas nilam.",
  },
  twitter: {
    card: "summary",
    title: "NILOKA",
    description:
      "Marketplace produk nilam Aceh dengan Nilam Passport dan ekosistem sirkular ampas nilam.",
  },
  // PWA — Apple Web App support
  appleWebApp: {
    capable: true,
    title: "NILOKA",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Android Chrome toolbar and iOS status bar color
  themeColor: "#20341f",
};

import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CurrencyProvider } from "@/context/currency-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { ToastProvider } from "@/components/ui/toast";
import { PWARegister } from "@/components/ui/pwa-register";
import { OfflineBanner } from "@/components/ui/offline-banner";

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
      <head />
      <body className="min-h-full bg-cream-50 text-ink-900" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>
              <OfflineBanner />
              {children}
              <CartDrawer />
              <FloatingChatbot />
              <ToastProvider />
              <PWARegister />
            </CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
