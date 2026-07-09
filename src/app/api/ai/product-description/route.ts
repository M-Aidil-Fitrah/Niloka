import type {
  ProductDescriptionRequest,
  ProductDescriptionResponse,
} from "@/lib/contracts";
import { checkProductDescriptionGuardrail } from "@/lib/ai/guardrails";
import { normalizeProductDescription } from "@/lib/ai/normalizers";
import { generateAiText } from "@/lib/ai/providers";
import { buildProductDescriptionPrompt } from "@/lib/ai/prompts";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

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

  const payload: ProductDescriptionRequest = await request.json();
  const missingFields = getMissingFields(payload);

  if (missingFields.length > 0) {
    return Response.json(
      {
        providerUsed: "mock",
        shortDescription: "",
        fullDescriptionMarkdown: "",
        suggestedTags: [],
        suggestedFunctions: [],
        passportDraftSuggestion: {
          origin: payload.origin,
          aromaProfile: [],
          functions: [],
          usage: "",
          safetyNotes: payload.safetyNotes,
        },
        safetyNotice: payload.safetyNotes,
        missingFields,
      } satisfies ProductDescriptionResponse,
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
        providerUsed: "mock",
        shortDescription: "",
        fullDescriptionMarkdown: "",
        suggestedTags: [],
        suggestedFunctions: [],
        passportDraftSuggestion: {
          origin: payload.origin,
          aromaProfile: [],
          functions: [],
          usage: "",
          safetyNotes: payload.safetyNotes,
        },
        safetyNotice: payload.safetyNotes,
        missingFields: [guardrail.reason],
      } satisfies ProductDescriptionResponse,
      { status: 400 },
    );
  }

  const mockMarkdown = [
    `**${payload.productName}** menghadirkan karakter nilam Aceh dari ${payload.origin} dengan profil aroma ${payload.aromaProfile}.`,
    "",
    "Produk ini cocok untuk pengguna yang mencari pengalaman natural, transparan, dan mudah dipahami melalui data Nilam Passport.",
    "",
    "- Dibuat untuk kebutuhan yang sesuai dengan fungsi produk yang dipilih.",
    "- Informasi asal bahan dan catatan keamanan tetap perlu diverifikasi sebelum publikasi.",
    "- Tidak memuat klaim sertifikasi resmi atau klaim medis.",
  ].join("\n");
  const result = await generateAiText(
    buildProductDescriptionPrompt(payload),
    mockMarkdown,
  );

  return Response.json(
    normalizeProductDescription(payload, result.text, result.providerUsed),
  );
}
