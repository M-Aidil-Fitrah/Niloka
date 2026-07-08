import { readFile } from "node:fs/promises";
import { resolveStoredUploadPath } from "@/lib/uploads/image-upload";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = resolveStoredUploadPath(path);

  if (!filePath || !filePath.endsWith(".webp")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "image/webp",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
