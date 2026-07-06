import type { AdminValidationItem } from "@/lib/contracts";
import { ListTodo, Clock, CheckCircle2, XCircle } from "lucide-react";

type AdminStatsProps = {
  items: AdminValidationItem[];
  queuedCount: number;
  approvedCount: number;
  rejectedCount: number;
};

export function AdminStats({ items, queuedCount, approvedCount, rejectedCount }: AdminStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/5 text-white/70">
          <ListTodo className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Total Antrian</span>
          <span className="text-2xl font-extrabold text-white block">{items.length}</span>
          <span className="text-[9px] text-white/40 block">Item validasi terdaftar</span>
        </div>
      </div>

      {/* Menunggu */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
          <Clock className="h-5 w-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block">Menunggu Review</span>
          <span className="text-2xl font-extrabold text-amber-300 block">{queuedCount}</span>
          <span className="text-[9px] text-white/40 block">Perlu tindakan admin</span>
        </div>
      </div>

      {/* Disetujui */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider block">Disetujui</span>
          <span className="text-2xl font-extrabold text-emerald-300 block">{approvedCount}</span>
          <span className="text-[9px] text-white/40 block">Terverifikasi oleh admin</span>
        </div>
      </div>

      {/* Ditolak */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
          <XCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider block">Ditolak</span>
          <span className="text-2xl font-extrabold text-red-300 block">{rejectedCount}</span>
          <span className="text-[9px] text-white/40 block">Memerlukan revisi seller</span>
        </div>
      </div>
    </div>
  );
}
