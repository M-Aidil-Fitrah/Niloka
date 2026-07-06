import { Button } from "@/components/ui/button";
import type { AdminValidationItem, AdminValidationStatus } from "@/lib/contracts";
import { X, Check, Shield } from "lucide-react";

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
  resolveSellerName,
  formatDate,
  moderationNote,
  onNoteChange,
  onClose,
  onModerate,
}: ReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-[28px] border border-line bg-white p-6 shadow-2xl relative text-ink-900 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-cream-100 text-ink-600 hover:text-brand-950 transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-950/10 text-brand-950 rounded-lg">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-gold-600 uppercase tracking-wider block">
                Review Moderasi
              </span>
              <h4 className="text-base font-extrabold text-brand-950 mt-0.5">
                {targetLabels[item.target]}
              </h4>
            </div>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-line bg-cream-50/50 rounded-2xl p-4">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Target ID</span>
              <span className="font-mono font-bold text-brand-950 mt-0.5 block text-[11px]">{item.targetId}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Diajukan Oleh</span>
              <span className="font-bold text-brand-950 mt-0.5 block">{resolveSellerName(item.submittedBy)}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Tanggal Pengajuan</span>
              <span className="font-bold text-brand-950 mt-0.5 block">{formatDate(item.submittedAt)}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-wider">Status</span>
              <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full mt-1.5">
                Menunggu Review
              </span>
            </div>
          </div>

          {/* Moderation Note Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Catatan Moderasi
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-line bg-cream-50 px-3 py-2 text-xs font-semibold text-brand-950 placeholder:text-ink-600/50 focus:border-brand-700 outline-none resize-none"
              placeholder="Tambahkan catatan alasan keputusan moderasi..."
              value={moderationNote}
              onChange={(e) => onNoteChange(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-line hover:bg-cream-50 text-brand-950 text-xs font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <Button
              onClick={() => onModerate(item.id, "rejected")}
              className="h-10 px-5 rounded-xl bg-red-700 hover:bg-red-600 text-white-soft text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
              Tolak
            </Button>
            <Button
              onClick={() => onModerate(item.id, "approved")}
              className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
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
