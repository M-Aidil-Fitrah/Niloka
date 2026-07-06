import type { AiProvider } from "@/lib/contracts";

type GenerateTextResult = {
  text: string;
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

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
};

const AI_TIMEOUT_MS = 12000;

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
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.8,
          maxOutputTokens: 900,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
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
      messages: [
        {
          role: "user",
          content: prompt,
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
    throw new Error("Groq request failed.");
  }

  const data: GroqResponse = await response.json();
  const text = getGroqText(data);

  if (!text) {
    throw new Error("Groq returned empty response.");
  }

  return text;
}

export async function generateAiText(prompt: string, mockText: string): Promise<GenerateTextResult> {
  try {
    return {
      text: await generateWithGemini(prompt),
      providerUsed: "gemini",
    };
  } catch {
    try {
      return {
        text: await generateWithGroq(prompt),
        providerUsed: "groq",
      };
    } catch {
      return {
        text: mockText,
        providerUsed: "mock",
      };
    }
  }
}
