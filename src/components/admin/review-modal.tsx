"use client";

import { useState, useEffect } from "react";
import { Check, X, Award, FileText, Compass } from "lucide-react";
import type { AdminValidationItem, Seller } from "@/lib/contracts";
import { showToast } from "../dashboard/dashboard-layout";

type ReviewModalProps = {
  item: AdminValidationItem | null;
  sellers: Seller[];
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
};

export function ReviewModal({ item, sellers, onClose, onApprove, onReject }: ReviewModalProps) {
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const handleCloseDrawers = () => {
      onClose();
    };
    window.addEventListener("close-all-drawers", handleCloseDrawers);
    return () => window.removeEventListener("close-all-drawers", handleCloseDrawers);
  }, [onClose]);

  if (!item) return null;

  const currentSeller = sellers.find((s) => s.id === item.submittedBy);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Box */}
      <div className="relative w-full max-w-lg bg-white-soft h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-350">
        {/* Title */}
        <div className="p-6 border-b border-line flex justify-between items-center bg-cream-50/50">
          <div>
            <span className="text-[10px] font-bold text-ink-600 uppercase tracking-wider block">Validasi Berkas</span>
            <h4 className="font-extrabold text-brand-950 text-base mt-0.5">
              Review Pengajuan #{item.id}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-ink-650 hover:text-brand-950 bg-cream-100 border border-line px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* Info Grid */}
        <div className="p-6 flex-1 space-y-6">
          {/* Submitter Info Card */}
          <div className="bg-cream-50/50 border border-line/45 rounded-2xl p-5 space-y-3">
            <h5 className="text-[10px] font-extrabold text-ink-600 uppercase tracking-wider">Identitas Pengaju</h5>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-650 font-medium">Nama Mitra</span>
              <strong className="font-extrabold text-brand-950">{currentSeller?.displayName || "Mitra Penyuling"}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-650 font-medium">Jenis Usaha</span>
              <strong className="font-bold text-brand-950 uppercase">{currentSeller?.type || "UMKM"}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-650 font-medium">Lokasi Penyulingan</span>
              <strong className="font-bold text-brand-950 text-right">{currentSeller?.location.city}, Aceh</strong>
            </div>
          </div>

          {/* Core Content based on Target Type */}
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-brand-950 uppercase tracking-wider pb-1 border-b border-line/45">Parameter Pengajuan</h5>
            
            {item.target === "seller" && (
              <div className="space-y-4">
                <div className="flex gap-3 text-xs bg-cream-50 p-4 border border-line rounded-2xl">
                  <FileText className="h-5 w-5 text-brand-900 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-brand-950 block">Verifikasi Pendaftaran Mitra Baru</strong>
                    <p className="text-ink-600 font-medium leading-relaxed">
                      Seller telah melampirkan berkas perizinan usaha atsiri mikro. Pemeriksaan izin legalitas, kepemilikan alat suling stainless steel, dan komitmen keberlanjutan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {item.target === "product" && (
              <div className="space-y-4">
                <div className="flex gap-3 text-xs bg-cream-50 p-4 border border-line rounded-2xl">
                  <Award className="h-5 w-5 text-brand-900 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-brand-950 block">Review Detail Produk Baru</strong>
                    <p className="text-ink-600 font-medium leading-relaxed">
                      Mengecek apakah produk yang diajukan memenuhi kriteria penamaan, penentuan harga yang rasional, serta tidak melanggar aturan copywriting medis berlebih di deskripsi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {item.target === "nilam-passport" && (
              <div className="space-y-4">
                <div className="flex gap-3 text-xs bg-cream-50 p-4 border border-line rounded-2xl">
                  <Compass className="h-5 w-5 text-brand-900 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-brand-950 block">Audit Transparansi (Nilam Passport)</strong>
                    <p className="text-ink-600 font-medium leading-relaxed">
                      Memverifikasi ketelusuran bahan baku dari distrik panen, karakter uji organoleptik aroma, petunjuk penggunaan aman, dan kelengkapan catatan keselamatan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Supporting Inspection Documents */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-ink-700 block">Dokumen Penunjang & Sertifikasi</label>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#download-surat-tani"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Mengunduh dokumen Izin Usaha Atsiri...", "success");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-line bg-white-soft text-brand-950 hover:bg-cream-100/50 transition-all text-[11px] font-bold"
                >
                  <FileText className="h-4 w-4 text-brand-900 shrink-0" />
                  <span className="truncate">IzinUsaha_ATSIRI.pdf</span>
                </a>
                <a
                  href="#download-hasil-lab"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Mengunduh lembar hasil Uji Lab GCMS...", "success");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-line bg-white-soft text-brand-950 hover:bg-cream-100/50 transition-all text-[11px] font-bold"
                >
                  <FileText className="h-4 w-4 text-brand-900 shrink-0" />
                  <span className="truncate">HasilLab_GCMS.pdf</span>
                </a>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-ink-700">Catatan/Pesan Pengaju</label>
              <div className="bg-cream-100/30 border border-line/45 p-3.5 rounded-xl text-xs text-ink-650 leading-relaxed font-medium">
                {item.notes || "Tidak ada catatan pengaju."}
              </div>
            </div>

            {/* Admin Response Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-ink-700">Catatan & Pesan Evaluasi Admin</label>
              <textarea
                rows={3}
                className="w-full text-xs font-medium border border-line rounded-xl px-4 py-2.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950 leading-relaxed"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Tulis alasan jika menolak, atau catatan kepatuhan jika menyetujui berkas..."
              />
            </div>

            {/* Rejection Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-extrabold text-ink-600 block uppercase">Alasan Penolakan Cepat:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Klaim Medis", text: "Terindikasi klaim khasiat medis berlebih di deskripsi. Platform melarang kata-kata pengobatan medis spesifik." },
                  { label: "Dokumen Kedaluwarsa", text: "Dokumen perizinan usaha atsiri mikro atau bukti sertifikat uji lab yang dilampirkan sudah kedaluwarsa." },
                  { label: "Format Nama", text: "Nama produk atau format penulisan tidak sesuai standar penamaan katalog platform Niloka." },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAdminNotes(preset.text);
                      showToast(`Preset "${preset.label}" terpilih.`, "warning");
                    }}
                    className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/50 rounded-lg px-2.5 py-1 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-line flex gap-3 bg-cream-50/50">
          <button
            onClick={() => {
              onReject(item.id, adminNotes);
              showToast("Pengajuan berhasil ditolak.", "warning");
            }}
            className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Tolak Berkas
          </button>
          <button
            onClick={() => {
              onApprove(item.id, adminNotes);
              showToast("Pengajuan berhasil disetujui & divalidasi!", "success");
            }}
            className="flex-1 py-2.5 bg-brand-900 hover:bg-brand-850 text-white-soft font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Setujui & Validasi
          </button>
        </div>
      </div>
    </div>
  );
}
