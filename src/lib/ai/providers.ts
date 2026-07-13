import type { AiProvider } from "@/lib/contracts";

export type AiErrorCode =
  | "AI_PROVIDER_UNCONFIGURED"
  | "AI_PRIMARY_FAILED"
  | "AI_FALLBACK_FAILED"
  | "AI_MODEL_UNAVAILABLE"
  | "AI_RESPONSE_INVALID";

type GenerateTextResult = {
  text: string;
  providerUsed: AiProvider;
};

type StreamTextResult = {
  stream: ReadableStream<string>;
  providerUsed: AiProvider;
};

type VisionTextResult = GenerateTextResult;

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

type GeminiStreamChunk = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
};

type GroqStreamChunk = {
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string | null;
  }>;
};

const AI_TIMEOUT_MS = 20_000;

export class AiProviderError extends Error {
  constructor(
    public code: AiErrorCode,
    message: string,
    public details: {
      provider?: AiProvider;
      model?: string;
      status?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

export function getSafeAiErrorMessage(error: unknown): string {
  if (error instanceof AiProviderError) {
    switch (error.code) {
      case "AI_PROVIDER_UNCONFIGURED":
        return "Layanan AI belum dikonfigurasi. Periksa API key dan model pada environment.";
      case "AI_MODEL_UNAVAILABLE":
        return `Model AI ${error.details.model ?? ""} tidak tersedia pada provider ${error.details.provider ?? "AI"}. Periksa konfigurasi model fallback.`;
      case "AI_RESPONSE_INVALID":
        return "Layanan AI mengembalikan format respons yang tidak valid. Silakan coba lagi.";
      case "AI_PRIMARY_FAILED":
      case "AI_FALLBACK_FAILED":
      default:
        return "Layanan AI sedang tidak tersedia. Silakan coba beberapa saat lagi.";
    }
  }

  return "Layanan AI sedang tidak tersedia. Silakan coba beberapa saat lagi.";
}

function logAiProviderError(context: string, error: unknown): void {
  if (error instanceof AiProviderError) {
    console.error(`[AI:${context}]`, {
      code: error.code,
      message: error.message,
      provider: error.details.provider,
      model: error.details.model,
      status: error.details.status,
      cause:
        error.details.cause instanceof Error
          ? error.details.cause.message
          : error.details.cause,
    });
    return;
  }

  console.error(`[AI:${context}]`, error);
}

function getGeminiTextModel(): string {
  return process.env.GEMINI_TEXT_MODEL || process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
}

function getGeminiVisionModel(): string {
  return process.env.GEMINI_VISION_MODEL || process.env.GEMINI_MODEL || "gemini-3.5-flash";
}

function getGroqTextModel(): string {
  return process.env.GROQ_TEXT_MODEL || process.env.GROQ_FALLBACK_MODEL || "llama-3.3-70b-versatile";
}

function getGroqVisionModel(): string | null {
  return process.env.GROQ_VISION_MODEL?.trim() || null;
}

function isUnavailableStatus(status: number): boolean {
  return status === 400 || status === 404 || status === 410;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function getGeminiText(data: GeminiResponse): string {
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

function getGroqText(data: GroqResponse): string {
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

// ─── Non-streaming (kept for internal use) ────────────────────────────────────

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getGeminiTextModel();

  if (!apiKey) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Gemini text provider is not configured.",
      { provider: "gemini", model },
    );
  }

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.8,
          maxOutputTokens: 900,
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_PRIMARY_FAILED",
      "Gemini text request failed.",
      { provider: "gemini", model, status: response.status },
    );
  }

  const data: GeminiResponse = await response.json();
  const text = getGeminiText(data);

  if (!text) {
    throw new AiProviderError("AI_RESPONSE_INVALID", "Gemini returned empty response.", {
      provider: "gemini",
      model,
    });
  }

  return text;
}

async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = getGroqTextModel();

  if (!apiKey) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Groq text fallback is not configured.",
      { provider: "groq", model },
    );
  }

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      messages: [{ role: "user", content: prompt }],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_FALLBACK_FAILED",
      "Groq text request failed.",
      { provider: "groq", model, status: response.status },
    );
  }

  const data: GroqResponse = await response.json();
  const text = getGroqText(data);

  if (!text) {
    throw new AiProviderError("AI_RESPONSE_INVALID", "Groq returned empty response.", {
      provider: "groq",
      model,
    });
  }

  return text;
}

// ─── Streaming ─────────────────────────────────────────────────────────────────

async function streamWithGemini(prompt: string): Promise<ReadableStream<string>> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getGeminiTextModel();

  if (!apiKey) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Gemini stream provider is not configured.",
      { provider: "gemini", model },
    );
  }

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, topP: 0.8, maxOutputTokens: 900 },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  if (!response.ok || !response.body) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_PRIMARY_FAILED",
      "Gemini stream request failed.",
      { provider: "gemini", model, status: response.status },
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        const raw = decoder.decode(value, { stream: true });
        // SSE lines are like: "data: {...}\n\n"
        for (const line of raw.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const chunk = JSON.parse(jsonStr) as GeminiStreamChunk;
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) controller.enqueue(text);
          } catch {
            // Ignore malformed SSE chunks
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

async function streamWithGroq(prompt: string): Promise<ReadableStream<string>> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = getGroqTextModel();

  if (!apiKey) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Groq stream fallback is not configured.",
      { provider: "groq", model },
    );
  }

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok || !response.body) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_FALLBACK_FAILED",
      "Groq stream request failed.",
      { provider: "groq", model, status: response.status },
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        const raw = decoder.decode(value, { stream: true });
        for (const line of raw.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const chunk = JSON.parse(jsonStr) as GroqStreamChunk;
            const text = chunk.choices?.[0]?.delta?.content;
            if (text) controller.enqueue(text);
          } catch {
            // Ignore malformed SSE chunks
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

// ─── Vision ───────────────────────────────────────────────────────────────────

async function generateVisionWithGemini(
  prompt: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getGeminiVisionModel();

  if (!apiKey) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Gemini vision provider is not configured.",
      { provider: "gemini", model },
    );
  }

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { data: imageBase64, mimeType } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 900,
          responseMimeType: "application/json",
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_PRIMARY_FAILED",
      "Gemini vision request failed.",
      { provider: "gemini", model, status: response.status },
    );
  }

  const data: GeminiResponse = await response.json();
  const text = getGeminiText(data);

  if (!text) {
    throw new AiProviderError("AI_RESPONSE_INVALID", "Gemini vision returned empty response.", {
      provider: "gemini",
      model,
    });
  }

  return text;
}

async function generateVisionWithGroq(
  prompt: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = getGroqVisionModel();

  if (!apiKey || !model) {
    throw new AiProviderError(
      "AI_PROVIDER_UNCONFIGURED",
      "Groq vision fallback is not configured.",
      { provider: "groq", model: model ?? undefined },
    );
  }

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_completion_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new AiProviderError(
      isUnavailableStatus(response.status) ? "AI_MODEL_UNAVAILABLE" : "AI_FALLBACK_FAILED",
      "Groq vision request failed.",
      { provider: "groq", model, status: response.status },
    );
  }

  const data: GroqResponse = await response.json();
  const text = getGroqText(data);

  if (!text) {
    throw new AiProviderError("AI_RESPONSE_INVALID", "Groq vision returned empty response.", {
      provider: "groq",
      model,
    });
  }

  return text;
}

// ─── Exports ───────────────────────────────────────────────────────────────────

export async function generateAiText(prompt: string): Promise<GenerateTextResult> {
  try {
    return { text: await generateWithGemini(prompt), providerUsed: "gemini" };
  } catch (primaryError) {
    logAiProviderError("text-primary", primaryError);
    try {
      return { text: await generateWithGroq(prompt), providerUsed: "groq" };
    } catch (fallbackError) {
      logAiProviderError("text-fallback", fallbackError);
      if (fallbackError instanceof AiProviderError) throw fallbackError;
      throw new AiProviderError("AI_FALLBACK_FAILED", "Text AI fallback failed.", {
        cause: fallbackError,
      });
    }
  }
}

export async function streamAiText(prompt: string): Promise<StreamTextResult> {
  try {
    return { stream: await streamWithGemini(prompt), providerUsed: "gemini" };
  } catch (primaryError) {
    logAiProviderError("stream-primary", primaryError);
    try {
      return { stream: await streamWithGroq(prompt), providerUsed: "groq" };
    } catch (fallbackError) {
      logAiProviderError("stream-fallback", fallbackError);
      if (fallbackError instanceof AiProviderError) throw fallbackError;
      throw new AiProviderError("AI_FALLBACK_FAILED", "Streaming AI fallback failed.", {
        cause: fallbackError,
      });
    }
  }
}

export async function generateAiVisionText(
  prompt: string,
  imageBase64: string,
  mimeType: string,
): Promise<VisionTextResult> {
  try {
    return {
      text: await generateVisionWithGemini(prompt, imageBase64, mimeType),
      providerUsed: "gemini",
    };
  } catch (primaryError) {
    logAiProviderError("vision-primary", primaryError);
    try {
      return {
        text: await generateVisionWithGroq(prompt, imageBase64, mimeType),
        providerUsed: "groq",
      };
    } catch (fallbackError) {
      logAiProviderError("vision-fallback", fallbackError);
      if (fallbackError instanceof AiProviderError) throw fallbackError;
      throw new AiProviderError("AI_FALLBACK_FAILED", "Vision AI fallback failed.", {
        cause: fallbackError,
      });
    }
  }
}

export async function generateAiVisionTextWithGroq(
  prompt: string,
  imageBase64: string,
  mimeType: string,
): Promise<VisionTextResult> {
  return {
    text: await generateVisionWithGroq(prompt, imageBase64, mimeType),
    providerUsed: "groq",
  };
}
