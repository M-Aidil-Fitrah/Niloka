import type { AiProvider } from "@/lib/contracts";

type GenerateTextResult = {
  text: string;
  providerUsed: AiProvider;
};

type StreamTextResult = {
  stream: ReadableStream<string>;
  providerUsed: AiProvider;
};

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
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    throw new Error("Gemini provider is not configured.");
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
    throw new Error("Gemini request failed.");
  }

  const data: GeminiResponse = await response.json();
  const text = getGeminiText(data);

  if (!text) {
    throw new Error("Gemini returned empty response.");
  }

  return text;
}

async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_FALLBACK_MODEL;

  if (!apiKey || !model) {
    throw new Error("Groq fallback is not configured.");
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
    throw new Error("Groq request failed.");
  }

  const data: GroqResponse = await response.json();
  const text = getGroqText(data);

  if (!text) {
    throw new Error("Groq returned empty response.");
  }

  return text;
}

// ─── Streaming ─────────────────────────────────────────────────────────────────

async function streamWithGemini(prompt: string): Promise<ReadableStream<string>> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    throw new Error("Gemini provider is not configured.");
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
    throw new Error("Gemini stream request failed.");
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
  const model = process.env.GROQ_FALLBACK_MODEL;

  if (!apiKey || !model) {
    throw new Error("Groq fallback is not configured.");
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
    throw new Error("Groq stream request failed.");
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

// ─── Exports ───────────────────────────────────────────────────────────────────

export async function generateAiText(prompt: string): Promise<GenerateTextResult> {
  try {
    return { text: await generateWithGemini(prompt), providerUsed: "gemini" };
  } catch {
    try {
      return { text: await generateWithGroq(prompt), providerUsed: "groq" };
    } catch {
      throw new Error("Layanan AI sedang tidak tersedia. Silakan periksa konfigurasi API key.");
    }
  }
}

export async function streamAiText(prompt: string): Promise<StreamTextResult> {
  try {
    return { stream: await streamWithGemini(prompt), providerUsed: "gemini" };
  } catch {
    try {
      return { stream: await streamWithGroq(prompt), providerUsed: "groq" };
    } catch {
      throw new Error("Layanan AI sedang tidak tersedia. Silakan periksa konfigurasi API key.");
    }
  }
}
