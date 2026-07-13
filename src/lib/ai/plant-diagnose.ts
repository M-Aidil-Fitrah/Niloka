import type { AiProvider } from "@/lib/contracts";
import {
  AiProviderError,
  generateAiVisionText,
  generateAiVisionTextWithGroq,
} from "./providers";

const DISEASE_CRITERIA = `
Kamu adalah asisten identifikasi penyakit dan hama tanaman nilam (Pogostemon cablin).
Ada TEPAT 5 kemungkinan klasifikasi utama, tidak boleh di luar daftar ini:

1. Budok - Penyebab: Jamur Synchytrium pogostemonis. Ciri: benjolan kecil seperti kutil pada daun/batang, pertumbuhan terhambat, permukaan daun kasar/menebal/tidak rata.
2. Bercak Daun - Penyebab: Jamur Cercospora sp/Alternaria sp. Ciri: bercak coklat/hitam pada daun, daun menguning lalu rontok.
3. Mosaik Nilam - Penyebab: Patchouli mosaic virus. Ciri: daun belang hijau-kuning, bercak tidak merata, bentuk daun tidak normal, tanaman kerdil.
4. Busuk Akar & Pangkal Batang - Penyebab: Jamur Phytophthora sp/Fusarium sp. Ciri: tanaman layu, batang menghitam, daun menguning akibat akar tidak berfungsi optimal.
5. Sehat - tidak ada gejala di atas, daun dan tanaman tampak segar dan normal.

ATURAN PENTING:
- Gambar yang diinput adalah bukti utama. Analisis SEMUA yang terlihat di gambar dulu secara independen sebelum mempertimbangkan info tambahan.
- Info tambahan yang diberikan HANYA sebagai pendukung/konfirmasi, BUKAN patokan utama. Jangan memaksakan diagnosis sesuai info tambahan kalau gambar menunjukkan hal berbeda atau lebih jelas.
- Kalau tidak ada info tambahan untuk suatu kategori, JANGAN anggap itu berarti "normal" di kategori itu, tetap nilai murni dari gambar.
- Saat menulis "alasan", JANGAN pernah menyebut kata "user" atau merujuk pada orang yang menginput. Rujuk semuanya ke "gambar yang diinput" atau "info tambahan yang diberikan", seolah menjelaskan langsung ke pembaca hasil analisis.
- Satu tanaman bisa menunjukkan gejala dari LEBIH DARI SATU klasifikasi sekaligus (misalnya bercak daun bersamaan dengan busuk batang). Kalau ada indikasi lebih dari satu masalah di gambar, sebutkan masalah utama (paling dominan/jelas) di "diagnosis", dan masalah kedua di "kemungkinanTambahan". Kalau cuma ada satu masalah atau tidak ada, isi "kemungkinanTambahan" dengan null.

Balas HANYA object JSON valid, tanpa markdown, tanpa code fence, tanpa teks pembuka/penutup.

Kontrak JSON wajib:
- "diagnosis": salah satu string ini saja: "Budok", "Bercak Daun", "Mosaik Nilam", "Busuk Akar & Pangkal Batang", "Sehat".
- "confidence": integer 0-100.
- "kemungkinanTambahan": salah satu string diagnosis di atas jika ada indikasi ganda, atau null. Jangan tulis "null" sebagai string.
- "penyebab": nama organisme penyebab sesuai daftar, atau "Tidak ada" jika diagnosis "Sehat".
- "alasan": string penjelasan detail berbasis visual gambar dan info tambahan, tanpa menyebut kata "user".
- "rekomendasi": array berisi 2-4 string langkah konkret.

Contoh bentuk JSON valid:
{"diagnosis":"Sehat","confidence":85,"kemungkinanTambahan":null,"penyebab":"Tidak ada","alasan":"Gambar yang diinput menunjukkan daun hijau dan bentuk tanaman normal tanpa gejala penyakit yang jelas.","rekomendasi":["Pantau kondisi daun secara berkala","Jaga drainase media tanam","Berikan pemupukan seimbang sesuai kebutuhan"]}
`;

export type DiagnoseResult = {
  diagnosis: string;
  confidence: number;
  kemungkinanTambahan: string | null;
  penyebab: string;
  alasan: string;
  rekomendasi: string[];
  providerUsed: AiProvider;
};

type SelectedConditions = {
  daun: string[];
  batang: string[];
  tanaman: string[];
};

function formatConditions(conditions: SelectedConditions): string {
  const parts: string[] = [];
  if (conditions.daun.length > 0)
    parts.push(`Daun: ${conditions.daun.join(", ")}`);
  if (conditions.batang.length > 0)
    parts.push(`Batang: ${conditions.batang.join(", ")}`);
  if (conditions.tanaman.length > 0)
    parts.push(`Tanaman: ${conditions.tanaman.join(", ")}`);

  if (parts.length === 0) {
    return "Tidak ada info tambahan yang diberikan. Analisis murni dari gambar.";
  }
  return `Info tambahan (bukan patokan utama): ${parts.join(". ")}.`;
}

const ALLOWED_DIAGNOSES = [
  "Budok",
  "Bercak Daun",
  "Mosaik Nilam",
  "Busuk Akar & Pangkal Batang",
  "Sehat",
] as const;

function cleanAiJson(text: string): string {
  const withoutFence = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return withoutFence.slice(start, end + 1).trim();
  }

  return withoutFence;
}

function isAllowedDiagnosis(value: unknown): value is (typeof ALLOWED_DIAGNOSES)[number] {
  return (
    typeof value === "string" &&
    (ALLOWED_DIAGNOSES as readonly string[]).includes(value)
  );
}

function normalizeDiagnoseResult(
  value: unknown,
  providerUsed: AiProvider,
): DiagnoseResult {
  if (!value || typeof value !== "object") {
    throw new AiProviderError(
      "AI_RESPONSE_INVALID",
      "Vision AI response is not an object.",
      { provider: providerUsed },
    );
  }

  const result = value as Partial<DiagnoseResult>;
  const recommendations = Array.isArray(result.rekomendasi)
    ? result.rekomendasi
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  if (
    !isAllowedDiagnosis(result.diagnosis) ||
    typeof result.confidence !== "number" ||
    !Number.isInteger(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 100 ||
    !(
      result.kemungkinanTambahan === null ||
      isAllowedDiagnosis(result.kemungkinanTambahan)
    ) ||
    typeof result.penyebab !== "string" ||
    typeof result.alasan !== "string" ||
    recommendations.length < 2 ||
    recommendations.length > 4
  ) {
    throw new AiProviderError(
      "AI_RESPONSE_INVALID",
      "Vision AI response failed diagnose schema validation.",
      { provider: providerUsed },
    );
  }

  return {
    diagnosis: result.diagnosis,
    confidence: result.confidence,
    kemungkinanTambahan: result.kemungkinanTambahan,
    penyebab: result.penyebab,
    alasan: result.alasan,
    rekomendasi: recommendations,
    providerUsed,
  };
}

function parseDiagnoseResult(text: string, providerUsed: AiProvider): DiagnoseResult {
  const cleaned = cleanAiJson(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AiProviderError(
      "AI_RESPONSE_INVALID",
      "Vision AI response could not be parsed as JSON.",
      { provider: providerUsed },
    );
  }

  return normalizeDiagnoseResult(parsed, providerUsed);
}

export async function diagnosePlantImage(
  imageBase64: string,
  mimeType: string,
  conditions: SelectedConditions,
): Promise<DiagnoseResult> {
  const conditionsText = formatConditions(conditions);
  const prompt = `${DISEASE_CRITERIA}\n\n${conditionsText}`;
  const result = await generateAiVisionText(prompt, imageBase64, mimeType);

  try {
    return parseDiagnoseResult(result.text, result.providerUsed);
  } catch (error) {
    if (
      error instanceof AiProviderError &&
      error.code === "AI_RESPONSE_INVALID" &&
      result.providerUsed === "gemini"
    ) {
      const fallbackResult = await generateAiVisionTextWithGroq(
        prompt,
        imageBase64,
        mimeType,
      );
      return parseDiagnoseResult(fallbackResult.text, fallbackResult.providerUsed);
    }
    throw error;
  }
}
