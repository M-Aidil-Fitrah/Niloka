import type { ChatRequest, ChatResponse } from "@/lib/contracts";
import { buildContextForIntent } from "@/lib/ai/context";
import { checkChatGuardrail } from "@/lib/ai/guardrails";
import { classifyIntent } from "@/lib/ai/intent-classifier";
import { buildProductSuggestions } from "@/lib/ai/normalizers";
import { generateAiText } from "@/lib/ai/providers";
import { buildChatPrompt } from "@/lib/ai/prompts";
import { getPublishedProductsDto } from "@/lib/dal/marketplace";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  
  // Tiered rate limit: 30/min for logged-in, 10/min for guests
  const limit = user ? 30 : 10;
  const rateLimitKey = user ? `ai-chat:${user.id}:${ip}` : `ai-chat:guest:${ip}`;
  const rateCheck = checkRateLimit(rateLimitKey, limit, 60_000);
  
  if (!rateCheck.allowed) {
    return Response.json(
      { 
        error: `Batas pesan habis. Pengguna ${user ? "terdaftar" : "tamu"} dibatasi maksimal ${limit} pesan per menit. Silakan coba lagi dalam 1 menit.`,
        errorCode: "RATE_LIMIT_EXCEEDED"
      },
      { status: 429 },
    );
  }

  let payload: ChatRequest;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Payload request tidak valid.", errorCode: "INVALID_PAYLOAD" },
      { status: 400 },
    );
  }

  const messages = payload.messages.slice(-10); // Keep last 10 messages for context
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user" || lastMessage.content.length > 900) {
    return Response.json(
      {
        error: "Pertanyaan terlalu panjang atau tidak valid (maksimal 900 karakter).",
        errorCode: "INVALID_MESSAGE_LENGTH"
      },
      { status: 400 },
    );
  }

  const guardrail = checkChatGuardrail(lastMessage.content);

  if (!guardrail.allowed) {
    return Response.json({
      answerMarkdown: guardrail.reason,
      providerUsed: "mock",
      suggestions: [],
      refused: true,
      errorCode: "GUARDRAIL_BLOCKED"
    } satisfies ChatResponse);
  }

  // Classify User Intent
  const intent = classifyIntent(lastMessage.content);

  // Modular context fetching from database (RAG)
  const [products, dynamicContext] = await Promise.all([
    getPublishedProductsDto({ limit: 40 }),
    buildContextForIntent(intent, lastMessage.content),
  ]);

  const isProductIntent = intent === "product_search" || intent === "product_detail";
  const prompt = buildChatPrompt(messages, dynamicContext, intent);
  const suggestions = buildProductSuggestions(products, lastMessage.content, !isProductIntent);

  try {
    const result = await generateAiText(prompt);

    return Response.json({
      answerMarkdown: result.text,
      providerUsed: result.providerUsed,
      suggestions,
      refused: false,
      intent
    } satisfies ChatResponse);
  } catch {
    return Response.json({
      answerMarkdown: "Maaf, layanan AI sedang sibuk. Silakan coba sesaat lagi.",
      providerUsed: "mock",
      suggestions: [],
      refused: true,
      errorCode: "PROVIDER_FAILURE"
    } satisfies ChatResponse);
  }
}
