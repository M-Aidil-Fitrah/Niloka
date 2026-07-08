import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_UPLOAD_IMAGE_BYTES =
  Number(process.env.UPLOAD_MAX_IMAGE_BYTES) || 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export type StoredImage = {
  originalFilename: string;
  storageKey: string;
  publicPath: string;
  mimeType: "image/webp";
  sizeBytes: number;
  width: number;
  height: number;
  checksum: string;
};

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "EMPTY_FILE"
      | "FILE_TOO_LARGE"
      | "UNSUPPORTED_TYPE"
      | "INVALID_IMAGE",
  ) {
    super(message);
    this.name = "ImageUploadError";
  }
}

function getUploadRoot() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "uploads");
}

function normalizeFilename(filename: string) {
  return filename
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export async function storeImageAsWebp(file: File, folder: string): Promise<StoredImage> {
  if (file.size <= 0) {
    throw new ImageUploadError("File gambar kosong.", "EMPTY_FILE");
  }

  if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new ImageUploadError("Ukuran gambar maksimal 2 MB.", "FILE_TOO_LARGE");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new ImageUploadError(
      "Format gambar harus JPEG, PNG, WebP, atau AVIF.",
      "UNSUPPORTED_TYPE",
    );
  }

  const sourceBuffer = Buffer.from(await file.arrayBuffer());
  const safeFolder = folder.replace(/[^a-z0-9/-]+/gi, "-").replace(/\/+/g, "/");
  const safeBaseName = normalizeFilename(file.name) || "niloka-image";
  const fileName = `${safeBaseName}-${randomUUID()}.webp`;
  const storageKey = path.posix.join(safeFolder, fileName);
  const uploadRoot = getUploadRoot();
  const destination = path.join(uploadRoot, storageKey);

  const image = sharp(sourceBuffer, {
    failOn: "error",
    limitInputPixels: 24_000_000,
  }).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new ImageUploadError("File gambar tidak valid.", "INVALID_IMAGE");
  }

  const webpBuffer = await image
    .webp({
      quality: 82,
      effort: 5,
    })
    .toBuffer();

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, webpBuffer, { flag: "wx" });

  const publicPrefix = process.env.UPLOAD_PUBLIC_PREFIX ?? "/uploads";

  return {
    originalFilename: file.name,
    storageKey,
    publicPath: `${publicPrefix}/${storageKey}`,
    mimeType: "image/webp",
    sizeBytes: webpBuffer.byteLength,
    width: metadata.width,
    height: metadata.height,
    checksum: createHash("sha256").update(webpBuffer).digest("hex"),
  };
}

export function resolveStoredUploadPath(storageKeyParts: string[]) {
  const uploadRoot = getUploadRoot();
  const candidate = path.resolve(uploadRoot, ...storageKeyParts);

  if (!candidate.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  return candidate;
}
