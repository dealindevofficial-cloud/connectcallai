import { z } from "zod";

/** Max upload size (bytes). */
export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number];

export function assertAllowedImage(file: File): void {
  if (file.size === 0) {
    throw new Error("Empty file.");
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error(`File too large (max ${MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024)} MB).`);
  }
  const mime = file.type.toLowerCase();
  if (!(ALLOWED_IMAGE_MIME as readonly string[]).includes(mime)) {
    throw new Error(`Unsupported type "${mime}". Allowed: JPEG, PNG, WebP, GIF.`);
  }
}

export const uploadQuerySchema = z.object({
  folder: z.string().max(120).optional(),
});
