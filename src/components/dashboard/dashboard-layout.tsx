"use client";

import { useEffect, type ReactNode } from "react";

export { DashboardSidebar, type SidebarNavItem, type DashboardSidebarProps } from "./dashboard-sidebar";
export { DashboardTopbar, type DashboardTopbarProps } from "./dashboard-topbar";
export { DashboardStatsCard, type DashboardStatsCardProps } from "./dashboard-stats-card";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.dispatchEvent(new CustomEvent("close-all-drawers"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-dvh w-full overflow-hidden flex bg-cream-50 text-ink-900 font-sans antialiased max-w-[1920px] mx-auto relative">
      {children}
    </div>
  );
}
