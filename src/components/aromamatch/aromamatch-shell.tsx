"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "@/components/ui/icons";
import type { Product, NilamPassport, AromaMatchQuestion } from "@/lib/contracts";

type AromaMatchShellProps = {
  questions: AromaMatchQuestion[];
  products: Product[];
  passports: NilamPassport[];
};

const formLabels: Record<string, string> = {
  "essential-oil": "Essential Oil",
  "roll-on": "Roll-on",
  soap: "Sabun",
  diffuser: "Diffuser",
  perfume: "Parfum",
  "body-oil": "Body Oil / Losion",
  bundle: "Bundle",
};

export function AromaMatchShell({ questions, products, passports }: AromaMatchShellProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");

  const [isMatching, setIsMatching] = useState(false);
  const [recommendations, setRecommendations] = useState<
    {
      product: Product;
      passport: NilamPassport | null;
      score: number;
      reason: string;
    }[]
  >([]);

  const totalSteps = questions.length;
  const currentQuestion = questions.find((q) => q.step === currentStep);

  function handleOptionSelect(optionId: string, kind: string) {
    if (kind === "single-choice" && currentQuestion?.id === "aroma-purpose") {
      setSelectedPurpose(optionId);
    } else if (kind === "single-choice" && currentQuestion?.id === "aroma-form") {
      setSelectedForm(optionId);
    } else if (kind === "budget-range") {
      setSelectedBudget(optionId);
    } else if (kind === "multi-choice") {
      if (selectedAromas.includes(optionId)) {
        setSelectedAromas(selectedAromas.filter((id) => id !== optionId));
      } else {
        setSelectedAromas([...selectedAromas, optionId]);
      }
    }
  }

  function handleNext() {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start matching logic simulation
      setIsMatching(true);
      setTimeout(() => {
        calculateMatches();
        setIsMatching(false);
        setCurrentStep(totalSteps + 1); // Move to results step
      }, 2000);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleReset() {
    setCurrentStep(1);
    setSelectedPurpose("");
    setSelectedAromas([]);
    setSelectedForm("");
    setSelectedBudget("");
    setRecommendations([]);
  }

  // Matching algorithm
  function calculateMatches() {
    const purposeOpt = questions[0]?.options.find((o) => o.id === selectedPurpose);
    const chosenAromas = selectedAromas.map((id) => {
      const opt = questions[1]?.options.find((o) => o.id === id);
      return opt ? opt.label.split(" ")[0].toLowerCase() : "";
    });
    const formOptId = selectedForm;
    const budgetOptId = selectedBudget;

    const scoredProducts = products.map((product) => {
      const passport = passports.find((p) => p.productId === product.id) || null;
      let score = 0;

      // 1. Purpose match (35 pts)
      if (purposeOpt) {
        const matchingFuncs = purposeOpt.productFunctions.filter((f) =>
          product.functions.includes(f)
        );
        if (matchingFuncs.length > 0) {
          score += 35;
        } else {
          score += 10; // partial match baseline
        }
      }

      // 2. Scent profile match (35 pts)
      if (passport && chosenAromas.length > 0) {
        let matchesCount = 0;
        chosenAromas.forEach((aromaKeyword) => {
          const hasMatch = passport.aromaProfile.some((profile) =>
            profile.toLowerCase().includes(aromaKeyword)
          );
          if (hasMatch) matchesCount++;
        });
        const ratio = matchesCount / chosenAromas.length;
        score += Math.round(ratio * 35);
      } else {
        score += 15;
      }

      // 3. Form factor match (20 pts)
      // Options map: form-oil (essential-oil), form-rollon (roll-on), form-soap (soap/body-oil), form-diffuser (diffuser)
      if (formOptId === "form-oil" && product.form === "essential-oil") score += 20;
      else if (formOptId === "form-rollon" && product.form === "roll-on") score += 20;
      else if (formOptId === "form-soap" && (product.form === "soap" || product.form === "body-oil")) score += 20;
      else if (formOptId === "form-diffuser" && product.form === "diffuser") score += 20;
      else score += 5; // mismatched form baseline

      // 4. Budget match (10 pts)
      const price = product.price.amount;
      if (budgetOptId === "budget-low" && price < 75000) score += 10;
      else if (budgetOptId === "budget-medium" && price >= 75000 && price <= 150000) score += 10;
      else if (budgetOptId === "budget-high" && price > 150000) score += 10;
      else {
        // Closeness calculation
        score += 3;
      }

      // Cap at 99% for humanized mock AI feel
      const finalScore = Math.min(score, 99);

      // Generate dynamic personalized explanation
      const purposeText = purposeOpt ? purposeOpt.label.split(" & ")[0] : "kebutuhan harian";
      const formText = formOptId === "form-oil" ? "minyak esensial murni" :
                       formOptId === "form-rollon" ? "olesan praktis" :
                       formOptId === "form-soap" ? "perawatan kulit sabun/losion" : "keharuman aromatik ruangan";
      
      let reason = `Sangat direkomendasikan untuk Anda yang berfokus pada ${purposeText}. `;
      if (passport && passport.aromaProfile.length > 0) {
        reason += `Produk ini dibekali profil aroma ${passport.aromaProfile.join(" & ")} yang selaras dengan karakter penciuman Anda. `;
      }
      reason += `Format ${formText} ini sangat praktis serta harganya bersahabat dengan anggaran Anda.`;

      return { product, passport, score: finalScore, reason };
    });

    // Sort descending by score and take top 3
    const topMatches = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setRecommendations(topMatches);
  }

  // Helper validation
  function isNextDisabled() {
    if (currentQuestion?.id === "aroma-purpose") return !selectedPurpose;
    if (currentQuestion?.id === "aroma-profile") return selectedAromas.length === 0;
    if (currentQuestion?.id === "aroma-form") return !selectedForm;
    if (currentQuestion?.id === "aroma-budget") return !selectedBudget;
    return false;
  }

  // 1. LOADING STATE
  if (isMatching) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] border border-line bg-white-soft py-24 text-center max-w-xl mx-auto shadow-xl">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-100/50 text-brand-900">
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full bg-brand-900/10 animate-ping" />
          <span className="font-serif-accent text-3xl italic font-bold">A</span>
        </div>
        <h3 className="mt-8 text-xl font-bold text-brand-950">AromaMatch AI sedang meracik</h3>
        <p className="mt-2 text-sm text-ink-600 max-w-sm px-6">
          Menganalisis preferensi aroma, tujuan relaksasi, format produk, dan menyelaraskan dengan Nilam Passport terverifikasi...
        </p>
      </div>
    );
  }

  // 2. RESULTS STATE
  if (currentStep > totalSteps) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="text-center">
          <Badge tone="gold">Rekomendasi AI</Badge>
          <h3 className="mt-3 text-3xl font-bold text-brand-950 font-serif-accent italic">Aroma Cocok Anda Ditemukan</h3>
          <p className="mt-2 text-sm text-ink-600">
            Berikut adalah 3 produk terbaik hasil kurasi algoritma AromaMatch berdasarkan konsultasi Anda.
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map(({ product, passport, score, reason }, idx) => (
            <div
              key={product.id}
              className={`relative overflow-hidden rounded-[32px] border p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 hover:shadow-2xl ${
                idx === 0 ? "border-gold-500 bg-gold-500/5" : "border-line bg-white-soft"
              }`}
            >
              {/* Highlight ribbon for top match */}
              {idx === 0 && (
                <div className="absolute left-0 top-0 bg-gold-500 text-brand-950 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-br-2xl">
                  Rekomendasi Utama
                </div>
              )}

              {/* Match Score Circle */}
              <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-gold-500/40 bg-gold-100/50">
                <span className="text-2xl font-extrabold text-brand-950 leading-none">{score}%</span>
                <span className="text-[9px] font-bold text-ink-600 mt-1 uppercase tracking-wider">Cocok</span>
              </div>

              {/* Product Thumbnail & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-gold-600 bg-gold-100/30 px-2 py-0.5 rounded-md">
                    {formLabels[product.form] ?? product.form}
                  </span>
                  {passport?.validationStatus === "validated" && (
                    <Badge tone="gold" className="flex items-center gap-0.5 text-[9px] min-h-4 px-1.5 py-0">
                      <ShieldCheckIcon className="h-3 w-3" />
                      Paspor Terverifikasi
                    </Badge>
                  )}
                </div>
                <h4 className="mt-2 text-lg font-bold text-brand-950 line-clamp-1">{product.name}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink-700">{reason}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-brand-950">
                    Rp {product.price.amount.toLocaleString("id-ID")}
                  </span>
                  {passport?.origin && (
                    <span className="text-[11px] text-ink-600">
                      • Asal: {passport.origin}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                <Link href={`/products/${product.slug}`} className="block w-full">
                  <Button className="w-full h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-semibold">
                    Detail Produk & Paspor
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleReset} variant="secondary" className="px-8 h-12 rounded-2xl border-line">
            Ulangi Konsultasi
          </Button>
        </div>
      </div>
    );
  }

  // 3. WIZARD STEPPERS STATE
  return (
    <div className="max-w-xl mx-auto animate-in fade-in duration-300">
      {/* Curation Card Container */}
      <div className="rounded-[32px] border border-line bg-white-soft p-6 sm:p-8 shadow-lg">
        {/* Progress header */}
        <div className="flex items-center justify-between text-xs text-ink-600 mb-6">
          <span className="font-bold uppercase tracking-wider">
            Langkah {currentStep} dari {totalSteps}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx + 1 === currentStep
                    ? "w-8 bg-brand-900"
                    : idx + 1 < currentStep
                    ? "w-2 bg-brand-700/50"
                    : "w-2 bg-cream-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Prompt */}
        <h3 className="text-xl font-extrabold text-brand-950 leading-tight">
          {currentQuestion?.prompt}
        </h3>

        {/* Choices container */}
        <div className="mt-6 space-y-3">
          {currentQuestion?.options.map((option) => {
            const isSelected =
              currentQuestion.id === "aroma-purpose" ? selectedPurpose === option.id :
              currentQuestion.id === "aroma-form" ? selectedForm === option.id :
              currentQuestion.id === "aroma-budget" ? selectedBudget === option.id :
              selectedAromas.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, currentQuestion.kind)}
                className={`w-full text-left rounded-2xl p-4 border text-xs font-semibold transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-brand-900/5 border-brand-700 text-brand-950 ring-1 ring-brand-700/30"
                    : "bg-cream-50 border-line hover:border-brand-700/50 hover:bg-cream-100"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-brand-900 text-white-soft flex items-center justify-center text-[9px]">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-line/60 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`text-xs font-bold transition-colors ${
              currentStep === 1 ? "text-ink-600/30 cursor-not-allowed" : "text-brand-950 hover:text-brand-700"
            }`}
          >
            ← Kembali
          </button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="h-10 px-6 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs"
          >
            {currentStep === totalSteps ? "Cari Aroma Cocok" : "Lanjut →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
