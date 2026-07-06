import { ListTodo, Clock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import type { AdminValidationItem } from "@/lib/contracts";

type AdminStatsProps = {
  items: AdminValidationItem[];
  queuedCount: number;
  approvedCount: number;
  rejectedCount: number;
};

export function AdminStats({ items, queuedCount, approvedCount, rejectedCount }: AdminStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {/* Total Queue Card - Soft Sage/Brand Green Theme */}
      <div className="rounded-[24px] bg-brand-100/40 border border-brand-200/60 p-5 flex flex-col justify-between hover:shadow-sm transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-800 uppercase tracking-wider block">Total Antrian</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {items.length}
            </span>
          </div>
          <div className="p-2 bg-brand-100 text-brand-900 rounded-xl border border-brand-200/50">
            <ListTodo className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG using Brand-700 */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-brand-700 stroke-2 fill-none">
              <path d="M 0 20 Q 15 5, 30 15 T 60 25 T 90 5 T 100 10" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-brand-900 bg-brand-100/80 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-brand-200/40">
            <TrendingUp className="h-3 w-3" />
            +12% hari ini
          </span>
        </div>
      </div>

      {/* Pending Review Card - Gold Theme */}
      <div className="rounded-[24px] bg-gold-100/30 border border-gold-500/20 p-5 flex flex-col justify-between hover:shadow-sm transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider block">Menunggu Review</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {queuedCount}
            </span>
          </div>
          <div className="p-2 bg-gold-100 text-gold-600 rounded-xl border border-gold-500/20">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG using Gold-500 */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-gold-500 stroke-2 fill-none">
              <path d="M 0 15 Q 15 25, 30 10 T 60 5 T 90 20 T 100 15" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-gold-600 bg-gold-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-gold-500/10">
            <TrendingDown className="h-3 w-3" />
            -4% antrean
          </span>
        </div>
      </div>

      {/* Approved Card - Soft Warm Cream Theme */}
      <div className="rounded-[24px] bg-cream-100/40 border border-line/60 p-5 flex flex-col justify-between hover:shadow-sm transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ink-700 uppercase tracking-wider block">Telah Disetujui</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {approvedCount}
            </span>
          </div>
          <div className="p-2 bg-cream-100 text-brand-950 rounded-xl border border-line/40">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG using Brand-800 */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-brand-800 stroke-2 fill-none">
              <path d="M 0 25 Q 15 15, 30 20 T 60 10 T 90 5 T 100 2" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-brand-800 bg-brand-100/60 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-brand-200/30">
            <TrendingUp className="h-3 w-3" />
            +18% valid
          </span>
        </div>
      </div>
    </div>
  );
}
