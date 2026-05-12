import type { MetadataRoute } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { listPublishedForSitemap } from "@/lib/blog/repository";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { isMongoConfigured } from "@/lib/db/connect";

/**
 * Keep sitemap fresh for active publishing.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  noStore();
  const base = getSiteOrigin();
  if (!base) {
    return [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/contact-us`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/industries`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/price-estimator`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let posts: Awaited<ReturnType<typeof listPublishedForSitemap>> = [];
  if (isMongoConfigured()) {
    try {
      posts = await listPublishedForSitemap();
    } catch {
      posts = [];
    }
  }
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
