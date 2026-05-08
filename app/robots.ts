import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/blog/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ccai-admin", "/ccai-admin/"],
    },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
