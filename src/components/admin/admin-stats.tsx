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
      {/* Total Queue Card - Green Theme */}
      <div className="rounded-[24px] bg-emerald-50/50 border border-emerald-100 p-5 flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Antrian</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {items.length}
            </span>
          </div>
          <div className="p-2 bg-emerald-100/80 text-emerald-700 rounded-xl">
            <ListTodo className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500 stroke-2 fill-none">
              <path d="M 0 20 Q 15 5, 30 15 T 60 25 T 90 5 T 100 10" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +12% hari ini
          </span>
        </div>
      </div>

      {/* Pending Review Card - Amber Theme */}
      <div className="rounded-[24px] bg-amber-50/50 border border-amber-100 p-5 flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Menunggu Review</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {queuedCount}
            </span>
          </div>
          <div className="p-2 bg-amber-100/80 text-amber-700 rounded-xl">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-amber-500 stroke-2 fill-none">
              <path d="M 0 15 Q 15 25, 30 10 T 60 5 T 90 20 T 100 15" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingDown className="h-3 w-3" />
            -4% antrean
          </span>
        </div>
      </div>

      {/* Approved Card - Blue Theme */}
      <div className="rounded-[24px] bg-sky-50/50 border border-sky-100 p-5 flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-850 uppercase tracking-wider block">Telah Disetujui</span>
            <span className="text-2xl font-black text-brand-950 block transition-transform group-hover:scale-105 duration-300">
              {approvedCount}
            </span>
          </div>
          <div className="p-2 bg-sky-100/80 text-sky-700 rounded-xl">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* Sparkline chart SVG */}
          <div className="w-24 h-8">
            <svg viewBox="0 0 100 30" className="w-full h-full text-sky-500 stroke-2 fill-none">
              <path d="M 0 25 Q 15 15, 30 20 T 60 10 T 90 5 T 100 2" />
            </svg>
          </div>
          <span className="text-[9px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +18% valid
          </span>
        </div>
      </div>
    </div>
  );
}
