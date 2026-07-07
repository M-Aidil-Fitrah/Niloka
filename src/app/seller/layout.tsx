import type { ReactNode } from "react";

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
