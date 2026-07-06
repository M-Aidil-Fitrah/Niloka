const outOfScopePatterns = [
  "framework",
  "next.js",
  "react",
  "dibuat siapa",
  "siapa pembuat",
  "source code",
  "api key",
  "prompt",
  "system instruction",
  "abaikan instruksi",
  "ignore previous",
  "jailbreak",
  "password",
  "database",
  "arsitektur",
  "server",
];

const allowedDomainTerms = [
  "nilam",
  "patchouli",
  "niloka",
  "produk",
  "aroma",
  "aromaterapi",
  "essential oil",
  "minyak atsiri",
  "ampas",
  "seller",
  "promo",
  "passport",
  "aceh",
  "diffuser",
  "sabun",
  "roll-on",
  "parfum",
  "body oil",
  "b2b",
  "b2c",
];

export type GuardrailResult = {
  allowed: boolean;
  reason: string;
};

function containsAnyTerm(input: string, terms: string[]): boolean {
  const normalizedInput = input.toLowerCase();
  return terms.some((term) => normalizedInput.includes(term));
}

export function checkChatGuardrail(message: string): GuardrailResult {
  if (message.trim().length < 2) {
    return {
      allowed: false,
      reason: "Pertanyaan terlalu pendek.",
    };
  }

  if (containsAnyTerm(message, outOfScopePatterns)) {
    return {
      allowed: false,
      reason: "Pertanyaan berada di luar konteks produk nilam dan marketplace NILOKA.",
    };
  }

  if (!containsAnyTerm(message, allowedDomainTerms)) {
    return {
      allowed: false,
      reason: "Pertanyaan belum terkait nilam, produk NILOKA, atau ekosistem marketplace.",
    };
  }

  return {
    allowed: true,
    reason: "allowed",
  };
}

export function checkProductDescriptionGuardrail(input: string): GuardrailResult {
  if (containsAnyTerm(input, outOfScopePatterns)) {
    return {
      allowed: false,
      reason: "Input mengandung konteks teknis/internal yang tidak boleh dipakai untuk deskripsi produk.",
    };
  }

  return {
    allowed: true,
    reason: "allowed",
  };
}
