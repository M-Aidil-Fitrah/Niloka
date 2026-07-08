import type { ChatRequest, ChatResponse } from "@/lib/contracts";
import { buildNilokaContext } from "@/lib/ai/context";
import { checkChatGuardrail } from "@/lib/ai/guardrails";
import { buildProductSuggestions } from "@/lib/ai/normalizers";
import { generateAiText } from "@/lib/ai/providers";
import { buildChatPrompt } from "@/lib/ai/prompts";
import { getPublishedProductsDto } from "@/lib/dal/marketplace";

export async function POST(request: Request) {
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
  const mockText = [
    "Berikut rekomendasi dari data NILOKA saat ini:",
    "",
    "| Produk | Cocok untuk | Catatan |",
    "| --- | --- | --- |",
    ...suggestions.map(
      (item) => `| **${item.name}** | ${item.reason} | Lihat detail produk untuk Nilam Passport dan harga terbaru. |`,
    ),
    "",
    "Nilam Passport membantu memahami asal-usul dan karakteristik produk nilam.",
  ].join("\n");
  const result = await generateAiText(prompt, mockText);

  return Response.json({
    answerMarkdown: result.text,
    providerUsed: result.providerUsed,
    suggestions,
    refused: false,
  } satisfies ChatResponse);
}
