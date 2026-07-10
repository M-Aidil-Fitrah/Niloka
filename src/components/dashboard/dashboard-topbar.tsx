"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, MessageSquare, Menu, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/styles";
import nilokaLogo from "@/public/assets/logo/logo.png";

export type DashboardTopbarProps = {
  title: string;
  subtitle: string;
  profileName: string;
  profileRole: string;
  profileImage?: string;
  onMenuClick?: () => void;
  backToUrl?: string;
  backToLabel?: string;
  chatHref?: string;
};

export function DashboardTopbar({
  title,
  subtitle,
  profileName,
  profileRole,
  profileImage = "",
  onMenuClick,
  backToUrl = "/",
  backToLabel = "Kembali ke Pasar",
  chatHref = "/chat",
}: DashboardTopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white-soft px-3 py-2.5 sm:px-6 flex justify-between items-center shrink-0 w-auto mx-3 mt-3 rounded-2xl border border-line/60 shadow-xs lg:mx-0 lg:mt-0 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:shadow-none lg:py-4">
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 text-ink-600 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
            type="button"
            aria-label="Buka menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0">
          <h2 className="text-xs sm:text-base font-black text-brand-950 tracking-tight leading-tight truncate">
            {title}
          </h2>
          <p className="text-[10px] sm:text-xs text-ink-600 mt-0.5 truncate hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="lg:hidden shrink-0 mr-1 sm:mr-2">
          <Image
            src={nilokaLogo}
            alt="NILOKA Logo"
            className="h-4.5 sm:h-5 w-auto object-contain"
            priority
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 border-r border-line/60 pr-4">
          <button
            type="button"
            className="p-1.5 sm:p-2 text-ink-650 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </button>
          <Link
            href={chatHref}
            className="p-1.5 sm:p-2 text-ink-650 hover:text-brand-950 hover:bg-cream-50 border border-line/50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            aria-label="Pesan"
          >
            <MessageSquare className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          </Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-cream-50/70 border border-line/10 hover:border-line/70 rounded-xl transition-all cursor-pointer"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="relative h-7.5 w-7.5 rounded-full overflow-hidden border border-brand-950/15 bg-brand-900 shadow-sm flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={profileName}
                  fill
                  className="object-cover"
                  sizes="30px"
                />
              ) : (
                <span className="text-[10px] font-extrabold text-white-soft">
                  {profileName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-extrabold text-brand-950 text-[11px] leading-tight block">
                {profileName}
              </span>
              <span className="text-[9px] text-ink-600 font-semibold block">
                {profileRole}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-ink-600 transition-transform duration-200",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-line bg-white-soft shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-3 py-2 border-b border-line/40">
                <span className="font-bold text-brand-950 text-xs block">
                  {profileName}
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  {profileRole}
                </span>
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
