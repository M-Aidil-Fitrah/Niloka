import type { AdminValidationItem, AdminValidationStatus, Seller } from "@/lib/contracts";
import { Eye, ShieldAlert, CheckCircle, Clock, AlertTriangle } from "lucide-react";

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
    <div className="rounded-[28px] border border-line/50 overflow-hidden bg-white-soft shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="bg-cream-100/50 border-b border-line/50 text-ink-600 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">Tipe & Target</th>
              <th className="p-4">Diajukan Oleh</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Catatan</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/30">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-cream-50/30 transition-colors">
                <td className="p-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-ink-600 block">
                    {targetLabels[item.target]}
                  </span>
                  <span className="font-extrabold text-brand-950 block mt-0.5 font-mono text-[11px]">
                    {item.targetId}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-bold text-ink-900 block">
                    {resolveSellerName(item.submittedBy)}
                  </span>
                </td>
                <td className="p-4 text-ink-700 font-semibold">
                  {formatDate(item.submittedAt)}
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-ink-600 truncate leading-relaxed text-[11px]" title={item.notes}>
                    {item.notes || "Tidak ada catatan."}
                  </p>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusConfig[item.status].classes}`}
                  >
                    {item.status === "approved" ? (
                      <CheckCircle className="h-2.5 w-2.5" />
                    ) : item.status === "rejected" ? (
                      <AlertTriangle className="h-2.5 w-2.5" />
                    ) : (
                      <Clock className="h-2.5 w-2.5" />
                    )}
                    {statusConfig[item.status].label}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {item.status === "queued" ? (
                    <button
                      onClick={() => onReviewClick(item)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-900 hover:text-brand-700 transition-all uppercase tracking-wider border border-brand-900/30 rounded-xl px-3 py-1.5 hover:bg-brand-900/5 active:scale-95 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  ) : (
                    <span className="text-[10px] text-ink-600 font-bold">—</span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-ink-600">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="h-8 w-8 text-ink-600/40" />
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
