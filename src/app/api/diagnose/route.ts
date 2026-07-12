import { NextRequest, NextResponse } from "next/server";
import { diagnosePlantImage } from "@/lib/ai/plant-diagnose";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const conditionsRaw = formData.get("conditions") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan" },
        { status: 400 },
      );
    }
    if (!conditionsRaw) {
      return NextResponse.json(
        { error: "Kondisi belum dipilih" },
        { status: 400 },
      );
    }

    const conditions = JSON.parse(conditionsRaw);

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const result = await diagnosePlantImage(base64, file.type, conditions);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Diagnose error:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis" },
      { status: 500 },
    );
  }
}
