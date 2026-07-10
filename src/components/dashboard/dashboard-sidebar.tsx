"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/styles";
import nilokaLogo from "@/public/assets/logo/logo.png";
import { type ComponentType } from "react";

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
};

export type DashboardSidebarProps = {
  brandName: string;
  navigation: SidebarNavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({
  brandName,
  navigation,
  activeTab,
  onTabChange,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-950/40 backdrop-blur-xs lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[240px] h-full bg-white-soft border-r border-line/60 p-5 flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line/40 pb-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Image
                  src={nilokaLogo}
                  alt="NILOKA Logo"
                  className="h-8.5 w-auto object-contain"
                  priority
                />
                <span className="text-[9px] font-black px-1.5 py-0.5 bg-brand-900 text-white-soft rounded-md uppercase tracking-wider">
                  {brandName.toLowerCase().includes("seller") ? "Seller" : "Admin"}
                </span>
              </div>
              <span className="text-[9px] text-ink-500 font-extrabold tracking-wide uppercase pl-0.5">
                {brandName.toLowerCase().includes("seller") ? "Mitra Penjual" : "Validator"}
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

          <nav className="space-y-5">
            {(() => {
              const isSeller = brandName.toLowerCase().includes("seller");

              const menuUtama = navigation.filter(item =>
                item.id === "overview" || item.id === "orders" || item.id === "products" || item.id === "ampas" || item.id === "passport" || item.id === "moderation" || item.id === "sellers" || item.id === "users"
              );
              const manajemen = navigation.filter(item =>
                item.id === "promos" || item.id === "logs"
              );

              const renderGroup = (title: string, items: typeof navigation) => {
                if (items.length === 0) return null;
                return (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-ink-500/70 tracking-widest uppercase block px-3 mb-1.5">
                      {title}
                    </span>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onTabChange(item.id);
                              if (onClose) onClose();
                            }}
                            className={cn(
                              "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all duration-200 cursor-pointer min-w-0",
                              isActive
                                ? "bg-brand-900 text-white-soft"
                                : "text-ink-600 hover:bg-cream-100/50 hover:text-brand-950"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white-soft" : "text-ink-500")} />
                              <span className="whitespace-nowrap">{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className={cn(
                                "text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ml-1.5",
                                isActive ? "bg-white-soft/20 text-white-soft" : "bg-cream-100 text-ink-700 border border-line/50"
                              )}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-5">
                  {renderGroup("Menu Utama", menuUtama)}
                  {renderGroup(isSeller ? "Manajemen" : "Audit", manajemen)}
                </div>
              );
            })()}
          </nav>
        </div>
      </aside>
    </>
  );
}
