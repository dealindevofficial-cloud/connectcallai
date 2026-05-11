import { unstable_cache } from "next/cache";
import { isMongoConfigured } from "@/lib/db/connect";
import { getBySlug, listPublished, type ListPublishedParams } from "./repository";
import type { ListPublishedResult } from "./repository";
import { isPubliclyVisible } from "./visibility";

export const BLOG_LIST_TAG = "blog-list";
const BLOG_CACHE_TTL_SECONDS = 300;

export function blogPostCacheTag(slug: string): string {
  return `blog-post-${slug.trim().toLowerCase()}`;
}

export function getCachedListPublished(params: ListPublishedParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 10));
  const categorySlug = params.categorySlug ?? "";
  const tag = params.tag ?? "";
  const industrySlug = params.industrySlug ?? "";

  if (!isMongoConfigured()) {
    const empty: ListPublishedResult = {
      posts: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
    return Promise.resolve(empty);
  }

  return unstable_cache(
    async (p: ListPublishedParams) => listPublished(p),
    [
      "blog-list-published",
      String(page),
      String(pageSize),
      categorySlug,
      tag,
      industrySlug,
    ],
    { tags: [BLOG_LIST_TAG], revalidate: BLOG_CACHE_TTL_SECONDS }
  )(params);
}

export function getCachedPostBySlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!isMongoConfigured()) {
    return Promise.resolve(null);
  }
  return unstable_cache(
    async (s: string) => {
      const doc = await getBySlug(s);
      if (!doc || !isPubliclyVisible(doc)) return null;
      return doc;
    },
    ["blog-post-by-slug", normalized],
    { tags: [blogPostCacheTag(normalized)], revalidate: BLOG_CACHE_TTL_SECONDS }
  )(normalized);
}
