import type { BlogPublicDoc } from "@/lib/blog/public-types";

type JsonLdArticleProps = {
  post: BlogPublicDoc;
  pageUrl: string;
  siteOrigin: string;
};

export function JsonLdArticle({ post, pageUrl, siteOrigin }: JsonLdArticleProps) {
  const description =
    post.metaDescription?.trim() ||
    post.excerpt?.trim() ||
    undefined;

  const publisherLogo = `${siteOrigin}/icon.png`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.featuredImage?.trim()
      ? [post.featuredImage.trim()]
      : undefined,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "CCAI",
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
  };

  if (post.author?.name) {
    data.author = {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.image?.trim()
        ? { image: post.author.image.trim() }
        : {}),
    };
  }

  const industry = post.industrySlug?.trim();
  if (industry) {
    data.articleSection = industry;
  }
  const template = post.templateKey?.trim();
  if (template) {
    data.keywords = template;
  }

  const json = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      // Safe: JSON from structured fields only (no user HTML)
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
