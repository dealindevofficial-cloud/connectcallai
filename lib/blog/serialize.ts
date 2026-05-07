import type { BlogPublicDoc } from "@/lib/blog/public-types";
import type { BlogDocument } from "@/lib/db/models/Blog";

/** Stable JSON for API responses (uses schema `toJSON`). */
export function serializeBlogDoc(doc: BlogDocument): Record<string, unknown> {
  return JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
}

/** Minimal public shape for list cards (empty `content`). */
export function blogDocumentToCardPost(doc: BlogDocument): BlogPublicDoc {
  return {
    _id: doc._id,
    slug: String(doc.slug),
    title: String(doc.title),
    content: "",
    excerpt: doc.excerpt != null ? String(doc.excerpt) : null,
    metaTitle: doc.metaTitle != null ? String(doc.metaTitle) : null,
    metaDescription: doc.metaDescription != null ? String(doc.metaDescription) : null,
    canonicalUrl: doc.canonicalUrl != null ? String(doc.canonicalUrl) : null,
    noindex: Boolean(doc.noindex),
    featuredImage: doc.featuredImage != null ? String(doc.featuredImage) : null,
    publishedAt: (doc.publishedAt as Date | null | undefined) ?? null,
    updatedAt: (doc.updatedAt as Date | null | undefined) ?? null,
    category: (doc.category as BlogPublicDoc["category"]) ?? null,
    author: (doc.author as BlogPublicDoc["author"]) ?? null,
  };
}
