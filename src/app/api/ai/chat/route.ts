import type { ChatRequest, ChatResponse } from "@/lib/contracts";
import { buildNilokaContext } from "@/lib/ai/context";
import { checkChatGuardrail } from "@/lib/ai/guardrails";
import { buildProductSuggestions } from "@/lib/ai/normalizers";
import { generateAiText } from "@/lib/ai/providers";
import { buildChatPrompt } from "@/lib/ai/prompts";
import { getPublishedProductsDto } from "@/lib/dal/marketplace";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = checkRateLimit(`ai-chat:${user.id}:${ip}`, 20, 60_000);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }
  const payload: ChatRequest = await request.json();
  const messages = payload.messages.slice(-8);
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user" || lastMessage.content.length > 900) {
    return Response.json(
      {
        answerMarkdown:
          "Maaf, pertanyaan terlalu panjang atau belum valid. Coba tanyakan tentang produk nilam, Nilam Passport, Ampas Nilam, atau promo NILOKA.",
        providerUsed: "mock",
        suggestions: [],
        refused: true,
      } satisfies ChatResponse,
      { status: 400 },
    );
  }

  const guardrail = checkChatGuardrail(lastMessage.content);

  if (!guardrail.allowed) {
    return Response.json({
      answerMarkdown:
        "Maaf, aku hanya bisa membantu pertanyaan seputar **nilam Aceh**, produk di marketplace **NILOKA**, Nilam Passport, Ampas Nilam B2B, promo, dan rekomendasi produk. Coba tanya misalnya: _produk nilam apa yang cocok untuk relaksasi?_",
      providerUsed: "mock",
      suggestions: [],
      refused: true,
    } satisfies ChatResponse);
  }

  const [products, nilokaContext] = await Promise.all([
    getPublishedProductsDto(),
    buildNilokaContext(),
  ]);
  const prompt = buildChatPrompt(messages, nilokaContext);
  const suggestions = buildProductSuggestions(products, lastMessage.content);

  try {
    const result = await generateAiText(prompt);

    return Response.json({
      answerMarkdown: result.text,
      providerUsed: result.providerUsed,
      suggestions,
      refused: false,
    } satisfies ChatResponse);
  } catch {
    return Response.json({
      answerMarkdown: "Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.",
      providerUsed: "mock",
      suggestions: [],
      refused: true,
    } satisfies ChatResponse);
  }
}
