"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, Loader2, AlertCircle, Check } from "lucide-react";
import type { DiagnoseResult } from "@/lib/ai/plant-diagnose";

type Category = {
  id: "daun" | "batang" | "tanaman";
  label: string;
  options: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "daun",
    label: "Kondisi Daun",
    options: [
      "Ada Bercak Coklat/Hitam",
      "Belang Hijau-Kuning",
      "Permukaan Kasar/Menebal",
      "Menguning & Rontok",
      "Bentuk Tidak Normal",
    ],
  },
  {
    id: "batang",
    label: "Kondisi Batang",
    options: ["Menghitam", "Ada Benjolan/Kutil"],
  },
  {
    id: "tanaman",
    label: "Kondisi Tanaman",
    options: ["Layu", "Kerdil", "Pertumbuhan Terhambat"],
  },
];

const EMPTY_CONDITIONS = { daun: [], batang: [], tanaman: [] };
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type DiagnoseErrorResponse = {
  error?: string;
};

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 75 ? "bg-emerald-600" : value >= 50 ? "bg-gold-500" : "bg-red-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600">
          Tingkat Keyakinan
        </span>
        <span className="text-xs font-bold text-brand-950">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function DiagnoseWidget() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [conditions, setConditions] =
    useState<Record<Category["id"], string[]>>(EMPTY_CONDITIONS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleOption(categoryId: Category["id"], option: string) {
    setConditions((prev) => {
      const current = prev[categoryId];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [categoryId]: next };
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setResult(null);
    setError(null);

    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(selected.type)) {
      setFile(null);
      setPreview(null);
      setError("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (selected.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setPreview(null);
      setError("Ukuran gambar maksimal 2 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubmit() {
    if (!file) {
      setError("Upload gambar tanaman terlebih dahulu");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("conditions", JSON.stringify(conditions));

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = (await res.json().catch(() => null)) as DiagnoseErrorResponse | null;
        throw new Error(errorData?.error ?? "Analisis gagal");
      }
      const data = await res.json();
      setResult(data);
      try {
        const stored = localStorage.getItem("niloka_recent_diagnoses");
        const list = stored ? JSON.parse(stored) : [];
        const newItem = { ...data, timestamp: new Date().toISOString() };
        const updated = [newItem, ...list].slice(0, 5);
        localStorage.setItem("niloka_recent_diagnoses", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save diagnosis to localStorage:", e);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menganalisis gambar. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-12 rounded-3xl border border-line bg-white-soft p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-900">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-950">
            AI Diagnosa Kesehatan Tanaman Nilam
          </h2>
          <p className="text-xs text-ink-600">
            Deteksi cepat kondisi tanaman nilam Anda berbasis AI.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold text-ink-700">
            Foto Tanaman
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-cream-100/50 p-6 text-center hover:border-brand-700 transition-all">
            <Upload className="h-6 w-6 text-brand-700/60" />
            <span className="text-xs font-semibold text-ink-600">
              {file ? file.name : "Klik atau drag foto tanaman ke sini"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview tanaman"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <p className="mt-4 text-[11px] text-ink-600">
            Opsional: centang kondisi yang kamu lihat langsung di kebun sebagai
            informasi tambahan.
          </p>

          <div className="mt-3 space-y-4">
            {CATEGORIES.map((category) => (
              <div key={category.id}>
                <p className="mb-2 text-xs font-bold text-ink-700">
                  {category.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => {
                    const isSelected = conditions[category.id].includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(category.id, option)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-800 bg-brand-100 text-brand-900"
                            : "border-line bg-white-soft text-ink-700 hover:border-brand-700/50"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-xs font-bold text-white-soft hover:bg-brand-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menganalisis...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Analisis Sekarang
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" /> {error}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-line/60 bg-cream-100/40 p-5">
          {!result && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink-600">
              <Sparkles className="mb-2 h-6 w-6 text-brand-700/40" />
              <p className="text-xs">Hasil analisis akan muncul di sini</p>
            </div>
          )}

          {loading && (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink-600">
              <Loader2 className="mb-2 h-6 w-6 animate-spin text-brand-700" />
              <p className="text-xs">Sedang menganalisis...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600">
                  Diagnosis
                </span>
                <p className="text-base font-bold text-brand-950">
                  {result.diagnosis}
                </p>
                {result.kemungkinanTambahan && (
                  <p className="mt-1 text-xs font-semibold text-ink-600">
                    Kemungkinan tambahan: {result.kemungkinanTambahan}
                  </p>
                )}
              </div>

              <ConfidenceBar value={result.confidence} />

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600">
                  Penyebab
                </span>
                <p className="text-sm text-ink-700">{result.penyebab}</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600">
                  Alasan
                </span>
                <p className="text-sm text-ink-700">{result.alasan}</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600">
                  Rekomendasi Penanganan
                </span>
                <ul className="mt-1 space-y-1.5">
                  {result.rekomendasi.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-700">
                      <span className="font-bold text-brand-800">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      try {
                        const result = reader.result as string;
                        const base64Data = result.split(",")[1];
                        sessionStorage.setItem("niloka_share_image_base64", base64Data);
                        sessionStorage.setItem("niloka_share_image_name", file.name);
                        sessionStorage.setItem("niloka_share_image_type", file.type);
                      } catch (e) {
                        console.error("Failed to save image to sessionStorage (likely size limit):", e);
                      }
                      router.push("/nilam-hub?share_diagnose=true");
                    };
                    reader.readAsDataURL(file);
                  } else {
                    router.push("/nilam-hub?share_diagnose=true");
                  }
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-brand-900 bg-brand-50 px-6 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-100 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-brand-700 animate-pulse" />
                Bagikan & Tanya Petani di Nilam Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
