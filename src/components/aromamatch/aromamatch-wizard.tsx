import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { AromaMatchQuestion } from "@/lib/contracts";

type AromamatchWizardProps = {
  currentStep: number;
  totalSteps: number;
  currentQuestion: AromaMatchQuestion | undefined;
  selectedPurpose: string;
  selectedAromas: string[];
  selectedForm: string;
  selectedBudget: string;
  onOptionSelect: (optionId: string, kind: string) => void;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
};

export function AromamatchWizard({
  currentStep,
  totalSteps,
  currentQuestion,
  selectedPurpose,
  selectedAromas,
  selectedForm,
  selectedBudget,
  onOptionSelect,
  onBack,
  onNext,
  isNextDisabled,
}: AromamatchWizardProps) {
  if (!currentQuestion) return null;

  return (
    <div className="max-w-xl mx-auto animate-in fade-in duration-300">
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
          {currentQuestion.prompt}
        </h3>

        {/* Choices container */}
        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected =
              currentQuestion.id === "aroma-purpose" ? selectedPurpose === option.id :
              currentQuestion.id === "aroma-form" ? selectedForm === option.id :
              currentQuestion.id === "aroma-budget" ? selectedBudget === option.id :
              selectedAromas.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => onOptionSelect(option.id, currentQuestion.kind)}
                className={`w-full text-left rounded-2xl p-4 border text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-brand-900/5 border-brand-700 text-brand-950 ring-1 ring-brand-700/30"
                    : "bg-cream-50 border-line hover:border-brand-700/50 hover:bg-cream-100"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-900 text-white-soft flex items-center justify-center cursor-pointer shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-line/60 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={currentStep === 1}
            className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              currentStep === 1 ? "text-ink-600/30 cursor-not-allowed" : "text-brand-950 hover:text-brand-700"
            }`}
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Kembali
          </button>
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            className="h-10 px-6 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            {currentStep === totalSteps ? "Cari Aroma Cocok" : "Lanjut"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
