import type { BlogDocument } from "@/lib/db/models/Blog";

/**
 * True when the post may appear on the public blog, sitemap, and caches.
 * Drafts, missing dates, and future `publishedAt` are never visible.
 */
export function isPubliclyVisible(doc: BlogDocument | null | undefined): boolean {
  if (!doc) return false;
  if (doc.status !== "published") return false;
  if (!doc.publishedAt) return false;
  return doc.publishedAt <= new Date();
}
