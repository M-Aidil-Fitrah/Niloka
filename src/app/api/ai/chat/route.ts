import type { ChatRequest, ChatResponse } from "@/lib/contracts";
import { buildContextForIntent } from "@/lib/ai/context";
import { checkChatGuardrail } from "@/lib/ai/guardrails";
import { classifyIntent } from "@/lib/ai/intent-classifier";
import { buildProductSuggestions } from "@/lib/ai/normalizers";
import { streamAiText } from "@/lib/ai/providers";
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
        errorCode: "RATE_LIMIT_EXCEEDED",
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
        errorCode: "INVALID_MESSAGE_LENGTH",
      },
      { status: 400 },
    );
  }

  const guardrail = checkChatGuardrail(lastMessage.content);

  if (!guardrail.allowed) {
    // Guardrail blocked — stream the refusal message as a sentinel so the client can parse it
    const refusal: ChatResponse = {
      answerMarkdown: guardrail.reason,
      providerUsed: "mock",
      suggestions: [],
      refused: true,
      errorCode: "GUARDRAIL_BLOCKED",
    };
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`\x00${JSON.stringify(refusal)}`));
        controller.close();
      },
    });
    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Accel-Buffering": "no" },
    });
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
    const aiStream = await streamAiText(prompt);

    // Build a ReadableStream that:
    // 1. Forwards AI text tokens as plain UTF-8 chunks
    // 2. Appends a sentinel at the end with metadata (suggestions, intent, providerUsed)
    const { readable, writable } = new TransformStream<string, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(new TextEncoder().encode(chunk));
      },
      flush(controller) {
        const meta: ChatResponse = {
          answerMarkdown: "", // filled by client from streamed chunks
          providerUsed: aiStream.providerUsed,
          suggestions,
          refused: false,
          intent,
        };
        // NUL byte (\x00) acts as delimiter — never produced by AI text
        controller.enqueue(new TextEncoder().encode(`\x00${JSON.stringify(meta)}`));
      },
    });

    // Pipe AI text stream into the transform
    aiStream.stream.pipeTo(writable).catch(() => {
      // ignore write errors (client disconnected)
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return Response.json({
      answerMarkdown: "Maaf, layanan AI sedang sibuk. Silakan coba sesaat lagi.",
      providerUsed: "mock",
      suggestions: [],
      refused: true,
      errorCode: "PROVIDER_FAILURE",
    } satisfies ChatResponse);
  }
}
