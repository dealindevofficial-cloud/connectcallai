import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { uploadImageBuffer, isCloudinaryConfigured } from "@/lib/cdn/cloudinary";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { assertAllowedImage } from "@/lib/validation/admin-upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body." }, { status: 400 });
  }

  const entry = formData.get("file");
  if (!(entry instanceof File)) {
    return NextResponse.json(
      { error: 'Expected multipart field "file" with image data.' },
      { status: 400 }
    );
  }

  try {
    assertAllowedImage(entry);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const folderField = formData.get("folder");
  const folder =
    typeof folderField === "string"
      ? folderField.trim().slice(0, 120) || undefined
      : undefined;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await entry.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Could not read file." }, { status: 400 });
  }

  try {
    const result = await uploadImageBuffer(buffer, folder ? { folder } : undefined);
    return NextResponse.json({
      url: result.secureUrl,
      width: result.width,
      height: result.height,
      publicId: result.publicId,
      format: result.format,
    });
  } catch (err) {
    console.error("[admin upload]", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
