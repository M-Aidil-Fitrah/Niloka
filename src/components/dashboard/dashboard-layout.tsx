"use client";

import type { ReactNode, ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Bell, MessageSquare, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/styles";

// ==========================================
// 1. DASHBOARD SHELL
// ==========================================
type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="h-screen w-full overflow-hidden flex bg-cream-50 text-ink-900 font-sans antialiased max-w-[1920px] mx-auto">
      {children}
    </div>
  );
}

// ==========================================
// 2. DASHBOARD SIDEBAR
// ==========================================
export type SidebarNavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
};

type DashboardSidebarProps = {
  brandName: string;
  logoChar: string;
  profileName: string;
  profileRole: string;
  profileImage: string;
  navigation: SidebarNavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  systemStatus?: boolean;
  backToUrl?: string;
  backToLabel?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({
  brandName,
  logoChar,
  profileName,
  profileRole,
  profileImage,
  navigation,
  activeTab,
  onTabChange,
  systemStatus = true,
  backToUrl = "/",
  backToLabel = "Kembali ke Pasar",
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-950/40 backdrop-blur-xs lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] h-full bg-white-soft border-r border-line/60 p-6 flex flex-col justify-between shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="space-y-8">
          {/* Logo / Brand Name and Close Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-brand-950 flex items-center justify-center text-white-soft font-black text-xs">
                {logoChar}
              </div>
              <span className="font-extrabold text-sm tracking-wider text-brand-950 uppercase">
                {brandName}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 text-ink-600 hover:text-brand-950 hover:bg-cream-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="bg-cream-50/50 border border-line/45 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border border-brand-950/15 bg-cream-100 shadow-sm">
              <Image
                src={profileImage}
                alt={profileName}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <span className="font-extrabold text-brand-950 mt-3 text-xs block leading-tight">
              {profileName}
            </span>
            <span className="text-[10px] text-ink-600 block mt-1">
              {profileRole}
            </span>
          </div>

          {/* Nav Menu Links */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onClose) onClose(); // Auto close on mobile
                  }}
                  className={cn(
                    "flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer hover:translate-x-0.5",
                    isActive
                      ? "bg-brand-900 text-white-soft shadow-md font-bold"
                      : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-white-soft" : "text-ink-500")} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={cn(
                      "text-[9px] font-extrabold px-1.5 py-0.5 rounded-md",
                      isActive ? "bg-white-soft/20 text-white-soft" : "bg-cream-100 text-ink-700 border border-line/50"
                    )}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Menu Items */}
        <div className="space-y-3 pt-6 border-t border-line/40">
          {systemStatus && (
            <div className="flex items-center justify-between px-3.5 text-[10px] font-bold text-ink-600">
              <span>Sistem Status</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
          <Link
            href={backToUrl}
            className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>{backToLabel}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

// ==========================================
// 3. DASHBOARD TOPBAR
// ==========================================
type DashboardTopbarProps = {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
};

export function DashboardTopbar({ title, subtitle, onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="border-b border-line/60 bg-white-soft px-6 py-4.5 sm:px-8 flex justify-between items-center shrink-0 w-full rounded-[20px] lg:rounded-none border lg:border-b shadow-sm lg:shadow-none">
      <div className="flex items-center gap-3.5">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-ink-600 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer shadow-xs"
            type="button"
            aria-label="Buka menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <div>
          <h2 className="text-base sm:text-lg font-black text-brand-950 tracking-tight leading-tight">{title}</h2>
          <p className="text-[10px] sm:text-xs text-ink-600 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Utility Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="p-1.5 sm:p-2 text-ink-600 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
        >
          <Bell className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
        </button>
        <button
          type="button"
          className="p-1.5 sm:p-2 text-ink-600 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
        >
          <MessageSquare className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
        </button>
        <button
          type="button"
          className="p-1.5 sm:p-2 text-ink-600 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
        >
          <Settings className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
        </button>
      </div>
    </header>
  );
}

// ==========================================
// 4. DASHBOARD STATS CARD
// ==========================================
type DashboardStatsCardProps = {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: {
    type: "up" | "down";
    label: string;
  };
  sparkline?: string; // Path d attribute for custom SVG line
  theme?: "brand" | "gold" | "cream";
};

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  sparkline,
  theme = "cream",
}: DashboardStatsCardProps) {
  // Theme Color Configurations
  const themeClasses = {
    brand: {
      card: "bg-brand-100/40 border-brand-200/60",
      iconBg: "bg-brand-100 text-brand-900 border-brand-200/50",
      sparklineColor: "text-brand-700",
      trendBg: "bg-brand-100/80 border-brand-200/40 text-brand-900",
    },
    gold: {
      card: "bg-gold-100/30 border-gold-500/20",
      iconBg: "bg-gold-100 text-gold-600 border-gold-500/20",
      sparklineColor: "text-gold-500",
      trendBg: "bg-gold-100 border-gold-500/10 text-gold-600",
    },
    cream: {
      card: "bg-white-soft border-line/60",
      iconBg: "bg-cream-100 text-brand-950 border-line/50",
      sparklineColor: "text-brand-850",
      trendBg: "bg-cream-50 border-line/60 text-ink-700",
    },
  };

  const selected = themeClasses[theme];

  return (
    <div className={`rounded-[24px] border p-5 flex flex-col justify-between hover:shadow-sm transition-all group ${selected.card}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-[1.02] duration-300">
            {value}
          </span>
        </div>
        <div className={`p-2 rounded-xl border shrink-0 ${selected.iconBg}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {/* Custom Sparkline Chart */}
        {sparkline ? (
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className={`w-full h-full stroke-2 fill-none ${selected.sparklineColor}`}>
              <path d={sparkline} />
            </svg>
          </div>
        ) : (
          <div className="w-24 h-8" />
        )}

        {trend && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${selected.trendBg}`}>
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
