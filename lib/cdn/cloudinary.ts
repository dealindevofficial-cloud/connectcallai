import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function ensureConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured (missing CLOUDINARY_* env vars).");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type CloudinaryUploadResult = {
  secureUrl: string;
  width: number;
  height: number;
  publicId: string;
  format: string;
};

/**
 * Upload an image buffer to Cloudinary (folder `CLOUDINARY_UPLOAD_FOLDER` or `connectcallai-blog`).
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  options?: { folder?: string }
): Promise<CloudinaryUploadResult> {
  ensureConfigured();
  const folder =
    options?.folder ??
    (process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "connectcallai-blog");

  const result = await new Promise<{
    secure_url: string;
    width: number;
    height: number;
    public_id: string;
    format: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, res) => {
        if (err) reject(err);
        else if (!res) reject(new Error("Empty Cloudinary response."));
        else resolve(res);
      }
    );
    Readable.from(buffer).pipe(stream);
  });

  return {
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    publicId: result.public_id,
    format: result.format,
  };
}
