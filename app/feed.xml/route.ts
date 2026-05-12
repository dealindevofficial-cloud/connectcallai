import { unstable_noStore as noStore } from "next/cache";
import { listPublishedForFeed } from "@/lib/blog/repository";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { isMongoConfigured } from "@/lib/db/connect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  noStore();
  const siteOrigin = getSiteOrigin();
  if (!siteOrigin || !isMongoConfigured()) {
    return new Response("Feed unavailable", { status: 503 });
  }

  let posts: Awaited<ReturnType<typeof listPublishedForFeed>> = [];
  try {
    posts = await listPublishedForFeed(200);
  } catch {
    return new Response("Feed unavailable", { status: 503 });
  }
  const itemsXml = posts
    .map((post) => {
      const url = `${siteOrigin}/blog/${post.slug}`;
      const published = post.publishedAt ?? post.updatedAt;
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
  ${published ? `<pubDate>${published.toUTCString()}</pubDate>` : ""}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>CCAI Blog</title>
  <link>${escapeXml(`${siteOrigin}/blog`)}</link>
  <description>Insights on AI voice agents, automation, and customer conversations from the CCAI team.</description>
  <language>en-us</language>
  ${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
