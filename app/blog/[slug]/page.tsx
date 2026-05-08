import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { JsonLdArticle } from "@/components/blog/JsonLdArticle";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { markdownToSafeHtml } from "@/lib/blog/markdown";
import { listRelatedForPost } from "@/lib/blog/repository";
import { getCachedPostBySlug } from "@/lib/blog/public-cache";
import type { BlogPublicDoc } from "@/lib/blog/public-types";
import { blogDocumentToCardPost } from "@/lib/blog/serialize";
import { getSiteOrigin } from "@/lib/blog/site-url";
import type { BlogDocument } from "@/lib/db/models/Blog";
import { isMongoConfigured } from "@/lib/db/connect";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isMongoConfigured()) {
    return {
      title: "Blogs setup | CCAI",
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }
  let raw: Awaited<ReturnType<typeof getCachedPostBySlug>>;
  try {
    raw = await getCachedPostBySlug(slug);
  } catch {
    return {
      title: "Blogs | CCAI",
      description: "Unable to load this article right now.",
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }
  if (!raw) {
    return { title: "Post not found | CCAI" };
  }
  const post = raw as BlogPublicDoc;

  const metaTitle = post.metaTitle?.trim() ?? "";
  const metaDesc = post.metaDescription?.trim() ?? "";
  const excerpt = post.excerpt?.trim() ?? "";
  const canonicalUrl = post.canonicalUrl?.trim() ?? "";
  const siteOrigin = getSiteOrigin();

  const title = metaTitle || post.title;
  const description = metaDesc || excerpt || "Article on the CCAI blogs.";
  const canonical =
    canonicalUrl ||
    (siteOrigin ? `${siteOrigin}/blog/${post.slug}` : undefined);

  const publishedTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;
  const modifiedTime = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedTime;

  const ogUrl = siteOrigin ? `${siteOrigin}/blog/${post.slug}` : canonical;
  const noindex = Boolean(post.noindex);
  const kw = [post.industrySlug, post.templateKey]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  const keywords = kw.length > 0 ? kw.join(", ") : undefined;

  return {
    title: `${title} | CCAI`,
    description,
    ...(keywords ? { keywords } : {}),
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: ogUrl,
      siteName: "CCAI",
      publishedTime,
      modifiedTime,
      images: post.featuredImage?.trim()
        ? [{ url: post.featuredImage.trim(), alt: title }]
        : undefined,
      ...(post.author?.name
        ? { authors: [post.author.name] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage?.trim() ? [post.featuredImage.trim()] : undefined,
    },
  };
}

function formatDate(d: Date | undefined | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(d));
}

function BlogBreadcrumb({ currentLabel }: { currentLabel?: string }) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#1E3A8A]" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-slate-950">
        Home
      </Link>
      <span aria-hidden>/</span>
      <Link href="/blog" className="hover:text-slate-950">
        Blogs
      </Link>
      {currentLabel ? (
        <>
          <span aria-hidden>/</span>
          <span className="text-slate-700">{currentLabel}</span>
        </>
      ) : null}
    </nav>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  if (!isMongoConfigured()) {
    throw new Error("Blog post unavailable: MongoDB is not configured.");
  }

  let raw: Awaited<ReturnType<typeof getCachedPostBySlug>>;
  try {
    raw = await getCachedPostBySlug(slug);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database connection failed";
    throw new Error(`Blog post unavailable: ${message}`);
  }

  if (!raw) {
    notFound();
  }
  const post = raw as BlogPublicDoc;
  const doc = raw as BlogDocument;

  const category = doc.category as { slug?: string; name?: string } | undefined;
  let relatedCards: ReturnType<typeof blogDocumentToCardPost>[] = [];
  try {
    const relatedDocs = await listRelatedForPost(String(post.slug), {
      tags: (doc.tags as string[] | undefined) ?? [],
      categorySlug: category?.slug ? String(category.slug) : undefined,
      curatedIds: doc.relatedPostIds?.length ? doc.relatedPostIds : undefined,
    });
    relatedCards = relatedDocs.map(blogDocumentToCardPost);
  } catch {
    relatedCards = [];
  }

  const html = await markdownToSafeHtml(post.content);
  const image = post.featuredImage?.trim() ?? "";
  const siteOrigin = getSiteOrigin();
  const pageUrl =
    siteOrigin != null && siteOrigin.length > 0
      ? `${siteOrigin}/blog/${post.slug}`
      : "";

  return (
    <div className="min-h-screen bg-[#EEF3FF]">
      {pageUrl && siteOrigin && !post.noindex ? (
        <JsonLdArticle post={post} pageUrl={pageUrl} siteOrigin={siteOrigin} />
      ) : null}
      <article className="px-5 pb-20 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto w-full max-w-5xl">
          <BlogBreadcrumb currentLabel={post.title} />

          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-700">
              {post.category?.name ? (
                <span className="inline-flex rounded-full border border-[#BFDBFE] bg-[#DBEAFE] px-3 py-1 text-[11px] font-medium text-[#1E3A8A]">
                  {post.category.name}
                </span>
              ) : null}
              {post.industrySlug?.trim() ? (
                <Link
                  href={`/blog/industry/${encodeURIComponent(post.industrySlug.trim())}`}
                  className="inline-flex rounded-full border border-[#BFDBFE] bg-[#DBEAFE] px-3 py-1 text-[11px] font-medium text-[#1E3A8A] transition-colors hover:border-[#1E3A8A]/30 hover:bg-[#BFDBFE] hover:text-slate-950"
                >
                  {post.industrySlug.trim()}
                </Link>
              ) : null}
              <time
                dateTime={
                  post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined
                }
              >
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
              {post.title}
            </h1>
            {post.author?.name ? (
              <p className="mt-4 text-slate-700">By {post.author.name}</p>
            ) : null}
          </header>

          {image ? (
            <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-[#BFDBFE] bg-white md:aspect-[3/1]">
              {/* Use native img for external CMS URLs that may block Next image optimizer fetches. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs from CMS */}
              <img
                src={image}
                alt={post.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          ) : null}

          <BlogPostBody html={html} />

          <RelatedPosts posts={relatedCards} />

          <footer className="mt-14 border-t border-[#BFDBFE] pt-10">
            <Link href="/blog" className="font-medium text-[#1E3A8A] hover:text-slate-950">
              ← All posts
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}
