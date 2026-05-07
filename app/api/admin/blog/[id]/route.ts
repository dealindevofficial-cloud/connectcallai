import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  deletePost,
  getById,
  slugExists,
  update,
  type UpdateBlogInput,
} from "@/lib/blog/repository";
import { revalidateBlogPublic } from "@/lib/blog/revalidate-public";
import { isPubliclyVisible } from "@/lib/blog/visibility";
import { serializeBlogDoc } from "@/lib/blog/serialize";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { updateBlogBodySchema } from "@/lib/validation/admin-blog";

export const runtime = "nodejs";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  );
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await context.params;
  try {
    const doc = await getById(id);
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(serializeBlogDoc(doc));
  } catch (err) {
    console.error("[admin blog GET id]", err);
    return NextResponse.json({ error: "Failed to load post." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await context.params;
  const before = await getById(id);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateBlogBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.slug != null && (await slugExists(data.slug, id))) {
    return NextResponse.json(
      { error: "Slug already in use." },
      { status: 409 }
    );
  }

  const input = data as UpdateBlogInput;

  try {
    const doc = await update(id, input);
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (before && (isPubliclyVisible(before) || isPubliclyVisible(doc))) {
      revalidateBlogPublic([String(before.slug), String(doc.slug)]);
    }
    return NextResponse.json(serializeBlogDoc(doc));
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json(
        { error: "Slug already in use." },
        { status: 409 }
      );
    }
    console.error("[admin blog PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const { id } = await context.params;
  const before = await getById(id);

  try {
    const removed = await deletePost(id);
    if (!removed) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (before && isPubliclyVisible(before)) {
      revalidateBlogPublic([String(before.slug)]);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin blog DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete post." },
      { status: 500 }
    );
  }
}
