import type {
  ProductDescriptionRequest,
} from "@/lib/contracts";
import { z } from "zod";
import { checkProductDescriptionGuardrail } from "@/lib/ai/guardrails";
import { normalizeProductDescription } from "@/lib/ai/normalizers";
import {
  AiProviderError,
  generateAiText,
  getSafeAiErrorMessage,
} from "@/lib/ai/providers";
import { buildProductDescriptionPrompt } from "@/lib/ai/prompts";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

const productDescriptionSchema = z.object({
  productName: z.string(),
  form: z.enum([
    "essential-oil",
    "roll-on",
    "soap",
    "diffuser",
    "perfume",
    "body-oil",
    "bundle",
  ]),
  origin: z.string(),
  aromaProfile: z.string(),
  functions: z.array(
    z.enum([
      "relaxation",
      "focus",
      "sleep-support",
      "skin-care",
      "home-fragrance",
      "gift",
    ]),
  ),
  safetyNotes: z.string(),
  targetAudience: z.string(),
  tone: z.enum(["premium", "educational", "concise"]).default("premium"),
});

function getMissingFields(input: ProductDescriptionRequest): string[] {
  const missingFields: string[] = [];

  if (!input.productName.trim()) {
    missingFields.push("nama produk");
  }
  if (!input.origin.trim()) {
    missingFields.push("asal bahan");
  }
  if (!input.aromaProfile.trim()) {
    missingFields.push("profil aroma");
  }
  if (input.functions.length === 0) {
    missingFields.push("fungsi produk");
  }
  if (!input.safetyNotes.trim()) {
    missingFields.push("catatan keamanan");
  }
  if (!input.targetAudience.trim()) {
    missingFields.push("target audience");
  }

  return missingFields;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(`ai-desc:${user.id}:${ip}`, 10, 60_000);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }

  let payload: ProductDescriptionRequest;
  try {
    payload = productDescriptionSchema.parse(await request.json());
  } catch {
    return Response.json(
      { error: "Payload request tidak valid.", errorCode: "INVALID_PAYLOAD" },
      { status: 400 },
    );
  }

  const missingFields = getMissingFields(payload);

  if (missingFields.length > 0) {
    return Response.json(
      {
        error: `Lengkapi data berikut sebelum memakai AI: ${missingFields.join(", ")}.`,
        errorCode: "MISSING_REQUIRED_FIELDS",
        missingFields,
      },
      { status: 400 },
    );
  }

  const guardrailInput = [
    payload.productName,
    payload.origin,
    payload.aromaProfile,
    payload.safetyNotes,
    payload.targetAudience,
  ].join(" ");
  const guardrail = checkProductDescriptionGuardrail(guardrailInput);

  if (!guardrail.allowed) {
    return Response.json(
      {
        error: guardrail.reason,
        errorCode: "GUARDRAIL_BLOCKED",
      },
      { status: 400 },
    );
  }

  try {
    const result = await generateAiText(buildProductDescriptionPrompt(payload));

    return Response.json(
      normalizeProductDescription(payload, result.text, result.providerUsed),
    );
  } catch (error) {
    if (error instanceof AiProviderError) {
      return Response.json(
        {
          error: getSafeAiErrorMessage(error),
          errorCode: error.code,
        },
        { status: 503 },
      );
    }

    return Response.json(
      {
        error: "Layanan AI sedang tidak tersedia. Silakan coba beberapa saat lagi.",
        errorCode: "AI_FALLBACK_FAILED",
      },
      { status: 503 },
    );
  }
}
