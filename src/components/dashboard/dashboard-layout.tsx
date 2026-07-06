"use client";

import { useState, useRef, useEffect, type ReactNode, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, MessageSquare, Settings, Menu, X, ChevronDown, LogOut, ShieldCheck, User } from "lucide-react";
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
  brandName: string; // e.g. "NILOKA SELLER" or "NILOKA ADMIN"
  logoChar: string;
  navigation: SidebarNavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({
  brandName,
  logoChar,
  navigation,
  activeTab,
  onTabChange,
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
          "fixed inset-y-0 left-0 z-50 w-[240px] h-full bg-white-soft border-r border-line/60 p-5 flex flex-col justify-between shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="space-y-6">
          {/* Logo / Brand Name and Close Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-900 flex items-center justify-center text-white-soft font-black text-sm shadow-sm">
                {logoChar}
              </div>
              <span className="font-black text-[12px] sm:text-xs tracking-wider text-brand-950 uppercase">
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

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
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
                    "flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-200 cursor-pointer hover:translate-x-0.5",
                    isActive
                      ? "bg-brand-900 text-white-soft shadow-md font-bold"
                      : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white-soft" : "text-ink-500")} />
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

        {/* Footer info: system status badge compact */}
        <div className="pt-4 border-t border-line/40 flex items-center justify-between text-[9px] font-bold text-ink-500">
          <span>NILOKA HUB v1.0</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </aside>
    </>
  );
}

// ==========================================
// 3. DASHBOARD TOPBAR WITH DROPDOWN PROFILE
// ==========================================
type DashboardTopbarProps = {
  title: string;
  subtitle: string;
  profileName: string;
  profileRole: string;
  profileImage: string;
  onMenuClick?: () => void;
  backToUrl?: string;
  backToLabel?: string;
};

export function DashboardTopbar({
  title,
  subtitle,
  profileName,
  profileRole,
  profileImage,
  onMenuClick,
  backToUrl = "/",
  backToLabel = "Kembali ke Pasar",
}: DashboardTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-line/60 bg-white-soft px-4.5 py-4 sm:px-6 flex justify-between items-center shrink-0 w-full rounded-[20px] lg:rounded-none border lg:border-b shadow-sm lg:shadow-none">
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
          <h2 className="text-sm sm:text-base font-black text-brand-950 tracking-tight leading-tight">{title}</h2>
          <p className="text-[10px] sm:text-xs text-ink-600 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Utility Toolbar & Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Quick Toolbar */}
        <div className="hidden sm:flex items-center gap-2 border-r border-line/60 pr-4">
          <button
            type="button"
            className="p-1.5 sm:p-2 text-ink-650 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </button>
          <button
            type="button"
            className="p-1.5 sm:p-2 text-ink-650 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
            aria-label="Pesan"
          >
            <MessageSquare className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </button>
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-cream-50/70 border border-line/10 hover:border-line/70 rounded-xl transition-all cursor-pointer"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="relative h-7.5 w-7.5 rounded-full overflow-hidden border border-brand-950/15 bg-cream-100 shadow-sm">
              <Image
                src={profileImage}
                alt={profileName}
                fill
                className="object-cover"
                sizes="30px"
              />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-extrabold text-brand-950 text-[11px] leading-tight block">
                {profileName}
              </span>
              <span className="text-[9px] text-ink-600 font-semibold block">
                {profileRole}
              </span>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 text-ink-600 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>

          {/* Floating Dropdown Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-line bg-white-soft shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-3 py-2 border-b border-line/40">
                <span className="font-bold text-brand-950 text-xs block">{profileName}</span>
                <span className="text-[10px] text-ink-500 block mt-0.5">{profileRole}</span>
              </div>
              <div className="py-1.5 space-y-0.5">
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-ink-700 hover:bg-cream-100/50 hover:text-brand-950 transition-colors">
                  <User className="h-4 w-4 text-ink-500" />
                  Pengaturan Profil
                </button>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-ink-700 hover:bg-cream-100/50 hover:text-brand-950 transition-colors">
                  <Settings className="h-4 w-4 text-ink-500" />
                  Pengaturan Toko
                </button>
              </div>
              <div className="border-t border-line/40 pt-1.5">
                <Link
                  href={backToUrl}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>{backToLabel}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
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
  sparkline?: string;
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
  const themeClasses = {
    brand: {
      card: "bg-brand-100/30 border-brand-200/50",
      iconBg: "bg-brand-100 text-brand-900 border-brand-200/50",
      sparklineColor: "text-brand-700",
      trendBg: "bg-brand-100/80 border-brand-200/40 text-brand-900",
    },
    gold: {
      card: "bg-gold-100/20 border-gold-500/20",
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
    <div className={`rounded-[24px] border p-4.5 flex flex-col justify-between hover:shadow-xs transition-all group ${selected.card}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-ink-600 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-xl sm:text-2xl font-black text-brand-950 block transition-transform group-hover:scale-[1.02] duration-300">
            {value}
          </span>
        </div>
        <div className={`p-2 rounded-xl border shrink-0 ${selected.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5">
        {sparkline ? (
          <div className="w-24 h-7">
            <svg viewBox="0 0 100 30" className={`w-full h-full stroke-2 fill-none ${selected.sparklineColor}`}>
              <path d={sparkline} />
            </svg>
          </div>
        ) : (
          <div className="w-24 h-7" />
        )}

        {trend && (
          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${selected.trendBg}`}>
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
