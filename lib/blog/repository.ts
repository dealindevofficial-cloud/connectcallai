import { connectDB } from "@/lib/db/connect";
import { Blog, type BlogDocument } from "@/lib/db/models/Blog";
import mongoose, { type Types } from "mongoose";

/** Plain shape accepted when creating a post (repository normalizes slug). */
export type CreateBlogInput = {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  excerpt?: string;
  featuredImage?: string;
  images?: { url: string; alt?: string }[];
  tags?: string[];
  category?: { slug: string; name: string };
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  author?: { name: string; image?: string; slug?: string };
  publishedAt?: Date | null;
  templateKey?: string;
  industrySlug?: string;
  relatedPostIds?: string[];
};

export type UpdateBlogInput = Partial<CreateBlogInput>;

export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

const RELATED_LIMIT = 4;

function toObjectIdList(ids: string[] | undefined): Types.ObjectId[] {
  if (!ids?.length) return [];
  const out: Types.ObjectId[] = [];
  for (const id of ids) {
    if (mongoose.Types.ObjectId.isValid(id) && out.length < 8) {
      out.push(new mongoose.Types.ObjectId(id));
    }
  }
  return out;
}

function publishedFilter(): Record<string, unknown> {
  const now = new Date();
  return {
    status: "published",
    publishedAt: { $ne: null, $lte: now },
  };
}

/**
 * Returns a published post by slug, or `null` if none or not yet public.
 */
/**
 * Loads a post by Mongo id (admin). Returns `null` if missing or invalid id.
 */
export async function getById(id: string): Promise<BlogDocument | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectDB();
  return Blog.findById(id).exec();
}

/** Public blog lookup only — drafts and scheduled posts never match. */
export async function getBySlug(slug: string): Promise<BlogDocument | null> {
  await connectDB();
  const q: Record<string, unknown> = {
    slug: normalizeSlug(slug),
    ...publishedFilter(),
  };
  return Blog.findOne(q as never).exec();
}

export type ListPublishedParams = {
  page?: number;
  pageSize?: number;
  /** Filter by `category.slug` */
  categorySlug?: string;
  tag?: string;
  /** Filter by programmatic `industrySlug` */
  industrySlug?: string;
};

export type ListPublishedResult = {
  posts: BlogDocument[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Lists published posts, newest first, with optional category and tag filters.
 */
/**
 * Related posts: uses manual `relatedPostIds` when present and resolvable; otherwise
 * same category and/or shared tags, published only, excluding the current slug.
 */
export async function listRelatedForPost(
  excludeSlug: string,
  options: {
    tags?: string[];
    categorySlug?: string;
    curatedIds?: (string | Types.ObjectId)[];
  } = {}
): Promise<BlogDocument[]> {
  const slug = normalizeSlug(excludeSlug);
  const { tags = [], categorySlug, curatedIds } = options;

  await connectDB();

  const collected: BlogDocument[] = [];
  const seenIdStrings = new Set<string>();

  const pushUnique = (doc: BlogDocument | undefined) => {
    if (!doc) return;
    const idStr = doc._id.toString();
    if (seenIdStrings.has(idStr) || doc.slug === slug) return;
    seenIdStrings.add(idStr);
    collected.push(doc);
  };

  if (curatedIds && curatedIds.length > 0) {
    const deduped = new Set<string>();
    const unique: Types.ObjectId[] = [];
    for (const id of curatedIds) {
      const oid =
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
      const key = oid.toString();
      if (!mongoose.Types.ObjectId.isValid(key)) continue;
      if (deduped.has(key)) continue;
      deduped.add(key);
      unique.push(oid);
      if (unique.length > 8) break;
    }

    const docs = await Blog.find({
      _id: { $in: unique },
      ...publishedFilter(),
      slug: { $ne: slug },
    } as never).exec();

    const byId = new Map(docs.map((d) => [d._id.toString(), d]));
    for (const id of unique) {
      if (collected.length >= RELATED_LIMIT) break;
      pushUnique(byId.get(id.toString()));
    }
  }

  if (collected.length >= RELATED_LIMIT) {
    return collected.slice(0, RELATED_LIMIT);
  }

  const or: Record<string, unknown>[] = [];
  if (tags.length > 0) {
    or.push({ tags: { $in: tags } });
  }
  if (categorySlug) {
    or.push({ "category.slug": normalizeSlug(categorySlug) });
  }
  if (or.length === 0) {
    return collected;
  }

  const excludeIds = [...seenIdStrings].map((s) => new mongoose.Types.ObjectId(s));

  const filter: Record<string, unknown> = {
    ...publishedFilter(),
    slug: { $ne: slug },
    $or: or,
  };
  if (excludeIds.length > 0) {
    filter._id = { $nin: excludeIds };
  }

  const need = RELATED_LIMIT - collected.length;
  const more = await Blog.find(filter as never)
    .sort({ publishedAt: -1 })
    .limit(need)
    .exec();

  for (const d of more) {
    pushUnique(d);
    if (collected.length >= RELATED_LIMIT) break;
  }

  return collected.slice(0, RELATED_LIMIT);
}

export async function listPublished(
  params: ListPublishedParams = {}
): Promise<ListPublishedResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 10));

  await connectDB();

  const filter: Record<string, unknown> = { ...publishedFilter() };
  if (params.categorySlug) {
    filter["category.slug"] = normalizeSlug(params.categorySlug);
  }
  if (params.tag) {
    filter.tags = params.tag;
  }
  if (params.industrySlug) {
    filter.industrySlug = normalizeSlug(params.industrySlug);
  }

  const filterCast = filter as never;

  const [total, posts] = await Promise.all([
    Blog.countDocuments(filterCast),
    Blog.find(filterCast)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    posts,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export type ListAllParams = {
  page?: number;
  pageSize?: number;
  status?: "draft" | "published";
};

/**
 * Lists posts for admin (all statuses). Newest `updatedAt` first.
 */
export async function listAll(
  params: ListAllParams = {}
): Promise<ListPublishedResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 10));

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (params.status) {
    filter.status = params.status;
  }

  const filterCast = filter as never;

  const [total, posts] = await Promise.all([
    Blog.countDocuments(filterCast),
    Blog.find(filterCast)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    posts,
    total,
    page,
    pageSize,
    totalPages,
  };
}

function applyPublishTimestamps<T extends Record<string, unknown>>(data: T): T {
  const status = data.status as string | undefined;
  const publishedAt = data.publishedAt as Date | null | undefined;
  if (status === "published" && publishedAt == null) {
    return { ...data, publishedAt: new Date() } as T;
  }
  if (status === "draft") {
    return { ...data, publishedAt: null } as T;
  }
  return data;
}

/**
 * Creates a post. Slug is normalized; `publishedAt` is set when status is `published`.
 */
export async function create(
  input: CreateBlogInput
): Promise<BlogDocument> {
  await connectDB();
  const relatedIds = toObjectIdList(input.relatedPostIds);
  const payload = applyPublishTimestamps({
    ...input,
    slug: normalizeSlug(input.slug),
    tags: (input.tags ?? []).map((t: string) => t.trim()).filter(Boolean),
    relatedPostIds: relatedIds,
  } as Record<string, unknown>);
  if (input.industrySlug != null && input.industrySlug.trim() !== "") {
    (payload as { industrySlug: string }).industrySlug = normalizeSlug(
      input.industrySlug
    );
  }
  return Blog.create(payload as never);
}

/**
 * Updates a post by id. Slug and tag list are normalized when present.
 */
export async function update(
  id: string | Types.ObjectId,
  input: UpdateBlogInput
): Promise<BlogDocument | null> {
  await connectDB();
  const next: UpdateBlogInput = { ...input };
  if (next.slug != null) {
    next.slug = normalizeSlug(next.slug);
  }
  if (next.tags != null) {
    next.tags = next.tags.map((t: string) => t.trim()).filter(Boolean);
  }
  if (next.industrySlug != null) {
    next.industrySlug = normalizeSlug(next.industrySlug);
  }
  if (next.relatedPostIds !== undefined) {
    (next as Record<string, unknown>).relatedPostIds = toObjectIdList(
      next.relatedPostIds
    );
  }
  const withTimes = applyPublishTimestamps({ ...next } as Record<string, unknown>);
  return Blog.findByIdAndUpdate(
    id,
    { $set: withTimes },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Deletes a post by id.
 */
export async function deletePost(id: string | Types.ObjectId): Promise<boolean> {
  await connectDB();
  const res = await Blog.findByIdAndDelete(id).exec();
  return res != null;
}

/**
 * Returns whether a slug is already used. Optionally exclude one document id (for updates).
 */
export async function slugExists(
  slug: string,
  excludeId?: string | Types.ObjectId
): Promise<boolean> {
  await connectDB();
  const q: Record<string, unknown> = { slug: normalizeSlug(slug) };
  if (excludeId) {
    q._id = { $ne: excludeId };
  }
  return (await Blog.exists(q as never).exec()) != null;
}

export type SitemapPostEntry = {
  slug: string;
  lastModified: Date;
};

export type FeedPostEntry = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: Date;
  updatedAt?: Date;
};

/**
 * All published posts meant for discovery (excludes `noindex` posts).
 */
export async function listPublishedForSitemap(): Promise<SitemapPostEntry[]> {
  await connectDB();
  const filter: Record<string, unknown> = {
    ...publishedFilter(),
    noindex: { $ne: true },
  };
  const rows = await Blog.find(filter as never)
    .select({ slug: 1, updatedAt: 1, publishedAt: 1 })
    .sort({ publishedAt: -1 })
    .lean()
    .exec();

  return rows.map((row) => {
    const updatedAt = row.updatedAt as Date | undefined;
    const publishedAt = row.publishedAt as Date | undefined;
    const slug = row.slug as string;
    return {
      slug,
      lastModified: updatedAt ?? publishedAt ?? new Date(),
    };
  });
}

/**
 * Published posts for RSS/Atom discovery (excludes `noindex` posts).
 */
export async function listPublishedForFeed(limit = 100): Promise<FeedPostEntry[]> {
  await connectDB();
  const safeLimit = Math.min(500, Math.max(1, limit));
  const filter: Record<string, unknown> = {
    ...publishedFilter(),
    noindex: { $ne: true },
  };
  const rows = await Blog.find(filter as never)
    .select({ slug: 1, title: 1, excerpt: 1, publishedAt: 1, updatedAt: 1 })
    .sort({ publishedAt: -1 })
    .limit(safeLimit)
    .lean()
    .exec();

  return rows.map((row) => ({
    slug: String(row.slug),
    title: String(row.title),
    excerpt: typeof row.excerpt === "string" ? row.excerpt : undefined,
    publishedAt: row.publishedAt instanceof Date ? row.publishedAt : undefined,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt : undefined,
  }));
}
