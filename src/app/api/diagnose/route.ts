import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { diagnosePlantImage } from "@/lib/ai/plant-diagnose";
import {
  AiProviderError,
  getSafeAiErrorMessage,
} from "@/lib/ai/providers";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function getMaxImageBytes(): number {
  const configured = Number(process.env.UPLOAD_MAX_IMAGE_BYTES);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : 2 * 1024 * 1024;
}

const MAX_IMAGE_BYTES = getMaxImageBytes();
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const conditionsSchema = z.object({
  daun: z.array(z.string()).max(10),
  batang: z.array(z.string()).max(10),
  tanaman: z.array(z.string()).max(10),
});

function getAiErrorStatus(error: AiProviderError): number {
  switch (error.code) {
    case "AI_RESPONSE_INVALID":
      return 502;
    case "AI_PROVIDER_UNCONFIGURED":
    case "AI_MODEL_UNAVAILABLE":
    case "AI_PRIMARY_FAILED":
    case "AI_FALLBACK_FAILED":
    default:
      return 503;
  }
}

function parseConditions(raw: string) {
  try {
    return conditionsSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rateCheck = checkRateLimit(`ai-diagnose:${ip}`, 5, 60_000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan analisis. Silakan coba lagi dalam 1 menit.",
          errorCode: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const conditionsRaw = formData.get("conditions") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan.", errorCode: "IMAGE_REQUIRED" },
        { status: 400 },
      );
    }
    if (!conditionsRaw) {
      return NextResponse.json(
        { error: "Kondisi belum dikirim.", errorCode: "CONDITIONS_REQUIRED" },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.",
          errorCode: "UNSUPPORTED_IMAGE_TYPE",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran gambar maksimal ${Math.floor(MAX_IMAGE_BYTES / 1024 / 1024)} MB.`,
          errorCode: "IMAGE_TOO_LARGE",
        },
        { status: 400 },
      );
    }

    const conditions = parseConditions(conditionsRaw);
    if (!conditions) {
      return NextResponse.json(
        { error: "Format kondisi tanaman tidak valid.", errorCode: "INVALID_CONDITIONS" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const result = await diagnosePlantImage(base64, file.type, conditions);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AiProviderError) {
      console.error("[AI:diagnose-route]", {
        code: error.code,
        provider: error.details.provider,
        model: error.details.model,
        status: error.details.status,
        message: error.message,
      });
      return NextResponse.json(
        {
          error: getSafeAiErrorMessage(error),
          errorCode: error.code,
        },
        { status: getAiErrorStatus(error) },
      );
    }

    console.error("Diagnose error:", error);
    return NextResponse.json(
      {
        error: "Gagal memproses analisis. Silakan coba lagi.",
        errorCode: "DIAGNOSE_UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}
