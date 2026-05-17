import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  create,
  listAll,
  slugExists,
  type CreateBlogInput,
} from "@/lib/blog/repository";
import { revalidateBlogPublic } from "@/lib/blog/revalidate-public";
import { isPubliclyVisible } from "@/lib/blog/visibility";
import { serializeBlogDoc } from "@/lib/blog/serialize";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  createBlogBodySchema,
  listAdminBlogQuerySchema,
} from "@/lib/validation/admin-blog";

export const runtime = "nodejs";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  );
}

export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = listAdminBlogQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await listAll(parsed.data);
    return NextResponse.json({
      posts: result.posts.map((p) => serializeBlogDoc(p)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (err) {
    console.error("[admin blog GET]", err);
    return NextResponse.json(
      { error: "Failed to list posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createBlogBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (await slugExists(data.slug)) {
    return NextResponse.json(
      { error: "Slug already in use." },
      { status: 409 }
    );
  }

  const input: CreateBlogInput = {
    title: data.title,
    slug: data.slug,
    content: data.content,
    status: data.status,
    excerpt: data.excerpt,
    featuredImage: data.featuredImage,
    images: data.images,
    tags: data.tags,
    category: data.category,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    canonicalUrl: data.canonicalUrl,
    noindex: data.noindex,
    author: data.author,
    publishedAt: data.publishedAt ?? undefined,
    templateKey: data.templateKey,
    industrySlug: data.industrySlug,
    relatedPostIds: data.relatedPostIds,
    faqs: data.faqs,
  };

  try {
    const doc = await create(input);
    if (isPubliclyVisible(doc)) {
      revalidateBlogPublic([String(doc.slug)]);
    }
    return NextResponse.json(serializeBlogDoc(doc), { status: 201 });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json(
        { error: "Slug already in use." },
        { status: 409 }
      );
    }
    console.error("[admin blog POST]", err);
    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}
