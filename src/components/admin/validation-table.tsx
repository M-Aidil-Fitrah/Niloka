import type { AdminValidationItem, AdminValidationStatus, Seller } from "@/lib/contracts";
import { Eye, ShieldAlert } from "lucide-react";

type ValidationTableProps = {
  items: AdminValidationItem[];
  sellers: Seller[];
  targetLabels: Record<string, string>;
  statusConfig: Record<AdminValidationStatus, { label: string; classes: string }>;
  resolveSellerName: (sellerId: string) => string;
  formatDate: (iso: string) => string;
  onReviewClick: (item: AdminValidationItem) => void;
};

export function ValidationTable({
  items,
  targetLabels,
  statusConfig,
  resolveSellerName,
  formatDate,
  onReviewClick,
}: ValidationTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-brand-950/20 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">Tipe & Target</th>
              <th className="p-4">Diajukan Oleh</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Catatan</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/40 block">
                    {targetLabels[item.target]}
                  </span>
                  <span className="font-bold text-white/90 block mt-0.5 font-mono text-[11px]">
                    {item.targetId}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-white/80 block">
                    {resolveSellerName(item.submittedBy)}
                  </span>
                </td>
                <td className="p-4 text-white/60 font-semibold">
                  {formatDate(item.submittedAt)}
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-white/60 truncate leading-relaxed text-[11px]" title={item.notes}>
                    {item.notes}
                  </p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${statusConfig[item.status].classes}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {statusConfig[item.status].label}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {item.status === "queued" ? (
                    <button
                      onClick={() => onReviewClick(item)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-all uppercase tracking-wider border border-red-500/30 rounded-xl px-3 py-2 hover:bg-red-500/10 active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  ) : (
                    <span className="text-[10px] text-white/30">—</span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-white/30">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="h-8 w-8 text-white/20" />
                    <p className="text-xs font-semibold">Tidak ada item validasi untuk filter ini.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
