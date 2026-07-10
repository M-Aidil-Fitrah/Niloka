"use client";

import { type ComponentType } from "react";

export type DashboardStatsCardProps = {
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
      card: "bg-[#FFFDF7] border-brand-200/50",
      iconBg: "bg-brand-100 text-brand-900 border-brand-200/50",
      sparklineColor: "text-brand-700",
      trendBg: "bg-brand-100/80 border-brand-200/40 text-brand-900",
    },
    gold: {
      card: "bg-[#FFFDF7] border-gold-500/20",
      iconBg: "bg-gold-100 text-gold-600 border-gold-500/20",
      sparklineColor: "text-gold-500",
      trendBg: "bg-gold-100 border-gold-500/10 text-gold-600",
    },
    cream: {
      card: "bg-[#FFFDF7] border-line/60",
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
