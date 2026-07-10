import "server-only";

const REQUIRED_VARS = ["DATABASE_URL", "NEXTAUTH_SECRET", "MIDTRANS_SERVER_KEY"] as const;

let validated = false;

export function validateEnv(): void {
  if (validated) return;

  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Set these in .env or your deployment environment.",
    );
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    console.warn(
      "Neither GEMINI_API_KEY nor GROQ_API_KEY is set. AI features will fall back to mock responses.",
    );
  }

  validated = true;
}
