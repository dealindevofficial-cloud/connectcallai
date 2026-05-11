import { revalidatePath, revalidateTag } from "next/cache";
import { BLOG_LIST_TAG, blogPostCacheTag } from "./public-cache";

/**
 * Invalidates cached blog list and individual post entries after admin mutations.
 */
export function revalidateBlogPublic(slugs: string[]) {
  revalidateTag(BLOG_LIST_TAG, "max");
  const unique = [...new Set(slugs.map((s) => s.trim().toLowerCase()).filter(Boolean))];
  for (const slug of unique) {
    revalidateTag(blogPostCacheTag(slug), "max");
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
}
