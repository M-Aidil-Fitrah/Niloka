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
  title: "NILOKA",
  description:
    "Marketplace terkurasi produk nilam Aceh dengan Nilam Passport dan ekosistem sirkular ampas nilam.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { ToastProvider } from "@/components/ui/toast";

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
            {children}
            <CartDrawer />
            <FloatingChatbot />
            <ToastProvider />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
