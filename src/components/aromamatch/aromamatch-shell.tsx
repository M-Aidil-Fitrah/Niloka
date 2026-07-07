"use client";

import { useState } from "react";
import { AromamatchWizard } from "./aromamatch-wizard";
import { AromamatchResults } from "./aromamatch-results";
import { Sparkles } from "lucide-react";
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
          score += 10;
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
      if (formOptId === "form-oil" && product.form === "essential-oil") score += 20;
      else if (formOptId === "form-rollon" && product.form === "roll-on") score += 20;
      else if (formOptId === "form-soap" && (product.form === "soap" || product.form === "body-oil")) score += 20;
      else if (formOptId === "form-diffuser" && product.form === "diffuser") score += 20;
      else score += 5;

      // 4. Budget match (10 pts)
      const price = product.price.amount;
      if (budgetOptId === "budget-low" && price < 75000) score += 10;
      else if (budgetOptId === "budget-medium" && price >= 75000 && price <= 150000) score += 10;
      else if (budgetOptId === "budget-high" && price > 150000) score += 10;
      else {
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
          <div className="absolute inset-0 rounded-full bg-brand-900/10 animate-ping" />
          <Sparkles className="h-8 w-8 text-brand-900 animate-pulse" />
        </div>
        <h3 className="mt-8 text-xl font-bold text-brand-950">AromaMatch sedang meracik</h3>
        <p className="mt-2 text-xs text-ink-600 max-w-sm px-6 leading-relaxed">
          Menganalisis preferensi aroma, tujuan relaksasi, format produk, dan menyelaraskan dengan Nilam Passport terverifikasi...
        </p>
      </div>
    );
  }

  // 2. RESULTS STATE
  if (currentStep > totalSteps) {
    return (
      <AromamatchResults
        recommendations={recommendations}
        formLabels={formLabels}
        onReset={() => {
          setCurrentStep(1);
          setSelectedPurpose("");
          setSelectedAromas([]);
          setSelectedForm("");
          setSelectedBudget("");
          setRecommendations([]);
        }}
      />
    );
  }

  // 3. WIZARD STEPPERS STATE
  return (
    <AromamatchWizard
      currentStep={currentStep}
      totalSteps={totalSteps}
      currentQuestion={currentQuestion}
      selectedPurpose={selectedPurpose}
      selectedAromas={selectedAromas}
      selectedForm={selectedForm}
      selectedBudget={selectedBudget}
      onOptionSelect={handleOptionSelect}
      onBack={() => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      }}
      onNext={handleNext}
      isNextDisabled={isNextDisabled()}
    />
  );
}
