import type { MetadataRoute } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { listPublishedForSitemap } from "@/lib/blog/repository";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { isMongoConfigured } from "@/lib/db/connect";
import { getIndustryCanonicalUrl, industries } from "@/lib/industries-data";

/**
 * Keep sitemap fresh for active publishing.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveCanonicalSitemapUrl(
  baseUrl: URL,
  slug: string,
  canonicalUrl?: string | null,
  noindex?: boolean
): string | null {
  if (noindex) return null;

  const fallback = new URL(`/blog/${slug}`, baseUrl);
  const rawCanonical = canonicalUrl?.trim();
  if (!rawCanonical) return fallback.toString();

  try {
    const resolved = new URL(rawCanonical, baseUrl);
    if (resolved.origin !== baseUrl.origin) {
      return null;
    }
    resolved.hash = "";
    return resolved.toString();
  } catch {
    return fallback.toString();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  noStore();
  const base = getSiteOrigin();
  if (!base) {
    return [];
  }
  const baseUrl = new URL(`${base}/`);

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
  const seenBlogUrls = new Set<string>();
  const blogRoutes: MetadataRoute.Sitemap = [];
  for (const p of posts) {
    const url = resolveCanonicalSitemapUrl(baseUrl, p.slug, p.canonicalUrl, p.noindex);
    if (!url || seenBlogUrls.has(url)) continue;
    seenBlogUrls.add(url);
    blogRoutes.push({
      url,
      lastModified: p.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });
  }

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: getIndustryCanonicalUrl(base, industry),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...industryRoutes, ...blogRoutes];
}
