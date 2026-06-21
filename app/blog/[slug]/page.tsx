import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFaqAccordion } from "@/components/blog/BlogFaqAccordion";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { JsonLdArticle } from "@/components/blog/JsonLdArticle";
import { JsonLdFaq } from "@/components/blog/JsonLdFaq";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { TrackedCtaLink } from "@/components/analytics/TrackedLink";
import { markdownToSafeHtml } from "@/lib/blog/markdown";
import { listRelatedForPost } from "@/lib/blog/repository";
import { getCachedPostBySlug } from "@/lib/blog/public-cache";
import type { BlogPublicDoc } from "@/lib/blog/public-types";
import { blogDocumentToCardPost } from "@/lib/blog/serialize";
import { getSiteOrigin } from "@/lib/blog/site-url";
import type { BlogDocument } from "@/lib/db/models/Blog";
import { isMongoConfigured } from "@/lib/db/connect";
import {
  fullTitle,
  pageDescriptions,
  pageTitles,
  seoTitleSegment,
} from "@/lib/seo/page-metadata";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isMongoConfigured()) {
    return {
      title: pageTitles.blogSetup,
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }
  let raw: Awaited<ReturnType<typeof getCachedPostBySlug>>;
  try {
    raw = await getCachedPostBySlug(slug);
  } catch {
    return {
      title: pageTitles.blogUnavailable,
      description: pageDescriptions.blogUnavailable,
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }
  if (!raw) {
    return {
      title: pageTitles.postNotFound,
      description: pageDescriptions.notFound,
    };
  }
  const post = raw as BlogPublicDoc;

  const metaTitle = post.metaTitle?.trim() ?? "";
  const metaDesc = post.metaDescription?.trim() ?? "";
  const excerpt = post.excerpt?.trim() ?? "";
  const canonicalUrl = post.canonicalUrl?.trim() ?? "";
  const siteOrigin = getSiteOrigin();

  const articleTitle = metaTitle || post.title;
  const titleSegment = seoTitleSegment(articleTitle);
  const docTitle = fullTitle(titleSegment);
  const description = metaDesc || excerpt || pageDescriptions.postFallback;
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
  const ogImage = post.featuredImage?.trim() || "/blog/opengraph-image";
  const noindex = Boolean(post.noindex);
  const normalizedTags = (post.tags ?? [])
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean);
  const articleSection =
    post.category?.name?.trim() || post.industrySlug?.trim() || undefined;
  const articleTags = [
    ...normalizedTags,
    post.category?.name?.trim() ?? "",
    post.industrySlug?.trim() ?? "",
    post.templateKey?.trim() ?? "",
  ].filter(Boolean);
  const kw = [post.industrySlug, post.templateKey, ...normalizedTags]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  const keywords = kw.length > 0 ? kw.join(", ") : undefined;
  const twitterHandleRaw = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  const twitterHandle = twitterHandleRaw
    ? twitterHandleRaw.startsWith("@")
      ? twitterHandleRaw
      : `@${twitterHandleRaw}`
    : undefined;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();

  return {
    title: titleSegment,
    description,
    ...(keywords ? { keywords } : {}),
    ...(facebookAppId ? { facebook: { appId: facebookAppId } } : {}),
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: docTitle,
      description,
      type: "article",
      url: ogUrl,
      siteName: "Connect Call AI",
      publishedTime,
      modifiedTime,
      ...(articleSection ? { section: articleSection } : {}),
      ...(articleTags.length > 0 ? { tags: articleTags } : {}),
      images: post.featuredImage?.trim()
        ? [{ url: post.featuredImage.trim(), alt: articleTitle }]
        : [{ url: "/blog/opengraph-image", width: 1200, height: 630, alt: articleTitle }],
      ...(post.author?.name
        ? { authors: [post.author.name] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: docTitle,
      description,
      images: [ogImage],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
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
    throw new Error("Blogs post unavailable: MongoDB is not configured.");
  }

  let raw: Awaited<ReturnType<typeof getCachedPostBySlug>>;
  try {
    raw = await getCachedPostBySlug(slug);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database connection failed";
    throw new Error(`Blogs post unavailable: ${message}`);
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
  const faqItems = Array.isArray(post.faqs)
    ? post.faqs
        .map((item) => ({
          question: String(item?.question ?? "").trim(),
          answer: String(item?.answer ?? "").trim(),
        }))
        .filter((item) => item.question.length > 0 && item.answer.length > 0)
    : [];
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
      {!post.noindex ? (
        <JsonLdFaq faqs={faqItems} />
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
            <div className="relative mb-10 w-full overflow-hidden rounded-2xl border border-[#BFDBFE] bg-white p-2 md:p-3">
              {/* Use native img for external CMS URLs that may block Next image optimizer fetches. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs from CMS */}
              <img
                src={image}
                alt={post.title}
                className="mx-auto block h-auto w-full rounded-xl object-contain"
                loading="eager"
              />
            </div>
          ) : null}

          <BlogPostBody html={html} />

          <section
            className="relative mt-14 overflow-hidden rounded-3xl border border-[#1E3A8A]/25 bg-gradient-to-br from-[#0B144E] via-[#172574] to-[#281C74] p-6 text-white shadow-[0_22px_60px_rgba(15,23,89,0.35)] md:p-8"
            aria-labelledby="blog-cta-heading"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#A5B4FC]/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[#60A5FA]/20 blur-3xl"
            />

            <div className="relative">
              <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-blue-100/95">
                Next step
              </span>
              <h2 id="blog-cta-heading" className="mt-4 text-2xl font-bold text-white md:text-3xl">
                Turn this insight into real calls and conversions
              </h2>
              <p className="mt-3 max-w-3xl text-blue-100/90">
                Connect Call AI gives you pre-built AI voice agents that are ready to launch for
                call answering, booking, and lead conversion without setup delays or model training.
                And if your process is unique, we build a custom agent for your exact call flow and
                handle the full technical setup end-to-end.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5 text-xs font-medium text-blue-50">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  Pre-built agents
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  Custom call flows
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  No setup on your side
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  No upfront cost
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                  Pay as you go
                </span>
              </div>
            </div>

            <div className="relative mt-7 grid gap-4 md:grid-cols-3">
              <TrackedCtaLink
                href="/contact-us"
                eventProperties={{
                  source: "blog_post_cta",
                  label: "Contact Us",
                }}
                className="group rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.16]"
              >
                <p className="text-sm font-semibold text-blue-100">Talk to our team</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Contact Us</h3>
                <p className="mt-2 text-sm text-blue-100/90">
                  Tell us your goals and we will suggest the right AI call flow for your business.
                </p>
                <p className="mt-4 text-sm font-semibold text-white transition-colors group-hover:text-blue-200">
                  Start consultation {"->"}
                </p>
              </TrackedCtaLink>

              <TrackedCtaLink
                href="/price-estimator"
                eventProperties={{
                  source: "blog_post_cta",
                  label: "View Pricing",
                }}
                className="group rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.16]"
              >
                <p className="text-sm font-semibold text-blue-100">Estimate cost</p>
                <h3 className="mt-2 text-xl font-semibold text-white">View Pricing</h3>
                <p className="mt-2 text-sm text-blue-100/90">
                  Calculate your monthly AI calling cost with pay-as-you-go pricing and request a
                  custom quote for your call volume.
                </p>
                <p className="mt-4 text-sm font-semibold text-white transition-colors group-hover:text-blue-200">
                  Open estimator {"->"}
                </p>
              </TrackedCtaLink>

              <TrackedCtaLink
                href="/"
                eventProperties={{
                  source: "blog_post_cta",
                  label: "Try Demo",
                }}
                className="group rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.16]"
              >
                <p className="text-sm font-semibold text-blue-100">Start instantly</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Try Demo</h3>
                <p className="mt-2 text-sm text-blue-100/90">
                  Visit our home page and see how our AI voice experience works in real-world flows.
                </p>
                <p className="mt-4 text-sm font-semibold text-white transition-colors group-hover:text-blue-200">
                  Try live demo {"->"}
                </p>
              </TrackedCtaLink>
            </div>
          </section>

          {faqItems.length > 0 ? (
            <section className="mt-14 rounded-3xl border border-[#BFDBFE] bg-white p-6 md:p-8" aria-labelledby="blog-faq-heading">
              <h2 id="blog-faq-heading" className="text-2xl font-bold text-slate-950 md:text-3xl">
                Frequently asked questions
              </h2>
              <BlogFaqAccordion faqs={faqItems} />
            </section>
          ) : null}

          <RelatedPosts posts={relatedCards} />

          <footer className="mt-14 border-t border-[#BFDBFE] pt-10">
            <Link href="/blog" className="font-medium text-[#1E3A8A] hover:text-slate-950">
              ← All blogs
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}
