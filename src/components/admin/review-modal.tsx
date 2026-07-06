import { Button } from "@/components/ui/button";
import type { AdminValidationItem, AdminValidationStatus } from "@/lib/contracts";
import { X, Check, AlertCircle } from "lucide-react";

type ReviewModalProps = {
  item: AdminValidationItem;
  targetLabels: Record<string, string>;
  statusConfig: Record<AdminValidationStatus, { label: string; classes: string }>;
  resolveSellerName: (sellerId: string) => string;
  formatDate: (iso: string) => string;
  moderationNote: string;
  onNoteChange: (note: string) => void;
  onClose: () => void;
  onModerate: (itemId: string, newStatus: AdminValidationStatus) => void;
};

export function ReviewModal({
  item,
  targetLabels,
  statusConfig,
  resolveSellerName,
  formatDate,
  moderationNote,
  onNoteChange,
  onClose,
  onModerate,
}: ReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-brand-950 p-6 shadow-2xl relative text-white animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div>
            <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-wider block">
              Review Moderasi
            </span>
            <h4 className="text-base font-extrabold text-white mt-1 font-serif-accent italic">
              {targetLabels[item.target]}
            </h4>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-white/10 rounded-2xl p-4 bg-white/5">
            <div>
              <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Target ID</span>
              <span className="font-mono font-bold text-white/90 mt-0.5 block text-[11px]">{item.targetId}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Diajukan Oleh</span>
              <span className="font-bold text-white/90 mt-0.5 block">{resolveSellerName(item.submittedBy)}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Tanggal Pengajuan</span>
              <span className="font-semibold text-white/80 mt-0.5 block">{formatDate(item.submittedAt)}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] font-bold uppercase tracking-wider">Status Saat Ini</span>
              <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border mt-1 ${statusConfig[item.status].classes}`}>
                {statusConfig[item.status].label}
              </span>
            </div>
          </div>

          {/* Moderation Note Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              Catatan Moderasi
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-semibold text-white placeholder:text-white/30 focus:border-red-500/50 outline-none resize-none"
              placeholder="Tambahkan catatan alasan keputusan moderasi..."
              value={moderationNote}
              onChange={(e) => onNoteChange(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-white/70 text-xs font-bold transition-all"
            >
              Batal
            </button>
            <Button
              onClick={() => onModerate(item.id, "rejected")}
              className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <X className="h-4 w-4" />
              Tolak
            </Button>
            <Button
              onClick={() => onModerate(item.id, "approved")}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Check className="h-4 w-4" />
              Setujui
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
