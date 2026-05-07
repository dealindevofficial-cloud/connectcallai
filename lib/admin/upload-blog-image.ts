/**
 * Upload an image to Cloudinary via `POST /api/admin/upload` (admin session cookie required).
 */
export async function uploadBlogImage(
  file: File,
  options?: { folder?: string }
): Promise<{ url: string; width: number; height: number }> {
  const body = new FormData();
  body.append("file", file);
  if (options?.folder) {
    body.append("folder", options.folder);
  }

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body,
    credentials: "include",
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as { url?: unknown }).url !== "string" ||
    typeof (data as { width?: unknown }).width !== "number" ||
    typeof (data as { height?: unknown }).height !== "number"
  ) {
    throw new Error("Unexpected upload response.");
  }

  return {
    url: (data as { url: string }).url,
    width: (data as { width: number }).width,
    height: (data as { height: number }).height,
  };
}
