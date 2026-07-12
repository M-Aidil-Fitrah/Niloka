"use client";

import { useState } from "react";
import { Sparkles, Wand2, Check } from "lucide-react";
import type { Product } from "@/lib/contracts";
import { showToast } from "@/lib/toast";

type AIDescriptionGeneratorProps = {
  activeProduct: Partial<Product>;
  setActiveProduct: React.Dispatch<React.SetStateAction<Partial<Product> | null>>;
};

type AiDescriptionError = {
  error?: string;
  missingFields?: string[];
};

export function AIDescriptionGenerator({ activeProduct, setActiveProduct }: AIDescriptionGeneratorProps) {
  const [aiAroma, setAiAroma] = useState("");
  const [aiOrigin, setAiOrigin] = useState("Gayo Lues, Aceh");
  const aiSafety = "Hindari kontak langsung dengan mata. Jauhkan dari jangkauan anak-anak.";
  const [aiAudience, setAiAudience] = useState("Pencinta aroma terapi alami & relaksasi");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    if (!activeProduct?.name) {
      showToast("Masukkan nama produk terlebih dahulu di form utama sebelum menggunakan AI.", "warning");
      return;
    }

    setIsGenerating(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: activeProduct.name,
          form: activeProduct.form ?? "essential-oil",
          origin: aiOrigin,
          aromaProfile: aiAroma || "Woody, Earthy, Sweet",
          functions: activeProduct.functions || ["relaxation"],
          safetyNotes: aiSafety,
          targetAudience: aiAudience,
          tone: "premium",
        }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => null)) as AiDescriptionError | null;
        throw new Error(
          errorData?.error ??
            errorData?.missingFields?.[0] ??
            "Gagal memanggil asisten AI.",
        );
      }

      const data = await res.json();
      if (data.shortDescription) {
        setActiveProduct((prev) => prev ? { ...prev, shortDescription: data.shortDescription } : null);
        setAiFeedback("Deskripsi berhasil digenerate!");
        showToast("AI berhasil menyusun deskripsi produk!", "success");
      }
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Gagal membuat deskripsi AI.";
      setAiFeedback(message);
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border border-brand-900/15 bg-brand-100/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-brand-950">
        <Sparkles className="h-4.5 w-4.5 text-brand-900" />
        <h6 className="text-xs font-extrabold uppercase tracking-wider">Asisten AI Copywriter</h6>
      </div>
      <p className="text-[11px] text-ink-600 leading-normal font-semibold">
        Generate deskripsi produk otomatis yang ramah promosi namun mematuhi aturan platform (tidak overclaim/medis).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-ink-600 uppercase">Profil Aroma</label>
            <button
              type="button"
              onClick={() => {
                const recommendations: Record<string, string> = {
                  "essential-oil": "Earthy, Camphorous, Balsamic",
                  "roll-on": "Minty, Fresh, Sweet",
                  "soap": "Herbaceous, Floral, Earthy",
                  "diffuser": "Woody, Spicy, Warm",
                  "perfume": "Rich, Sweet, Musky",
                  "body-oil": "Warm, Earthy, Relaxing"
                };
                const form = activeProduct.form || "essential-oil";
                setAiAroma(recommendations[form] || "Patchouli, Woody");
                showToast("Rekomendasi aroma AI disematkan!", "success");
              }}
              className="text-[9px] font-extrabold text-brand-900 hover:text-brand-850 underline cursor-pointer"
            >
              Rekomendasi AI
            </button>
          </div>
          <input
            type="text"
            className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
            value={aiAroma}
            onChange={(e) => setAiAroma(e.target.value)}
            placeholder="Contoh: Woody, Lembut, Patchouli"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-ink-600 uppercase">Asal Bahan Baku</label>
          <input
            type="text"
            className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
            value={aiOrigin}
            onChange={(e) => setAiOrigin(e.target.value)}
            placeholder="Gayo Lues, Aceh"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-ink-600 uppercase">Target Audience</label>
        <input
          type="text"
          className="w-full text-xs font-medium border border-line rounded-lg px-3 py-1.5 outline-none focus:border-brand-900 bg-white-soft text-brand-950"
          value={aiAudience}
          onChange={(e) => setAiAudience(e.target.value)}
          placeholder="Contoh: Pekerja kantoran yang stres, butuh relaksasi malam hari"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={isGenerating}
          className="bg-brand-950 hover:bg-brand-900 disabled:bg-ink-600 text-white-soft font-extrabold text-[10px] uppercase tracking-wider rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Wand2 className="h-3.5 w-3.5" />
          {isGenerating ? "Menyusun Deskripsi..." : "Generate Deskripsi"}
        </button>
        {aiFeedback && (
          <span className="text-[11px] font-bold text-brand-900 flex items-center gap-1">
            <Check className="h-3.5 w-3.5 shrink-0" />
            {aiFeedback}
          </span>
        )}
      </div>
    </div>
  );
}
