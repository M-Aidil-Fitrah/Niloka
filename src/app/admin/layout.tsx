import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-cream-50 text-ink-900 font-sans flex flex-col antialiased">
      {children}
    </div>
  );
}
