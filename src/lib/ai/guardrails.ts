export type GuardrailResult = {
  allowed: boolean;
  reason: string;
};

const forbiddenPatterns = [
  "api key",
  "api_key",
  "source code",
  "source_code",
  "database password",
  "db password",
  "db_password",
  "jailbreak",
  "ignore previous",
  "abaikan instruksi",
  "system instruction",
  "system_instruction",
  "bypass guardrail",
  "prompt injection",
  "reveal prompt",
];

export function checkChatGuardrail(message: string): GuardrailResult {
  if (message.trim().length < 2) {
    return {
      allowed: false,
      reason: "Pertanyaan terlalu pendek.",
    };
  }

  const normalized = message.toLowerCase();

  if (forbiddenPatterns.some((pattern) => normalized.includes(pattern))) {
    return {
      allowed: false,
      reason: "Pertanyaan Anda mengandung instruksi/topik yang dibatasi demi keamanan sistem NILOKA.",
    };
  }

  return {
    allowed: true,
    reason: "allowed",
  };
}

export function checkProductDescriptionGuardrail(input: string): GuardrailResult {
  const normalized = input.toLowerCase();
  const dangerousPatterns = ["source code", "database", "api key"];
  
  if (dangerousPatterns.some((pattern) => normalized.includes(pattern))) {
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
