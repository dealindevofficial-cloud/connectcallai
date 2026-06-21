import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";
import {
  getBlogIndustryArchivePath,
  labelFromIndustrySlug,
} from "@/lib/blog/industry-archives";
import { getCachedListPublished } from "@/lib/blog/public-cache";
import type { BlogPublicDoc } from "@/lib/blog/public-types";
import { normalizeSlug } from "@/lib/blog/repository";
import { getSiteOrigin } from "@/lib/blog/site-url";
import { isMongoConfigured } from "@/lib/db/connect";
import {
  fullTitle,
  pageDescriptions,
  pageTitles,
  paginatedTitle,
} from "@/lib/seo/page-metadata";

const PAGE_SIZE = 10;

type IndustryBlogPageProps = {
  params: Promise<{ industry: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: IndustryBlogPageProps): Promise<Metadata> {
  const { industry } = await params;
  const sp = await searchParams;
  const slug = normalizeSlug(decodeURIComponent(industry));
  if (!slug) {
    return {
      title: pageTitles.blog,
      description: pageDescriptions.blog,
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }

  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const label = labelFromIndustrySlug(slug);
  const base = getSiteOrigin();
  const canonicalPath = getBlogIndustryArchivePath(slug, pageNum);

  const listTitleSegment = paginatedTitle(pageTitles.blogIndustry(label), pageNum);
  const description = pageDescriptions.blogIndustry(label);

  return {
    title: listTitleSegment,
    description,
    alternates: base ? { canonical: `${base}${canonicalPath}` } : undefined,
    openGraph: {
      title: fullTitle(listTitleSegment),
      description,
      type: "website",
      url: base ? `${base}${canonicalPath}` : undefined,
      images: [
        {
          url: "/blog/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${label} blogs`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle(listTitleSegment),
      description,
      images: ["/blog/opengraph-image"],
    },
  };
}

export default async function IndustryBlogPage({
  params,
  searchParams,
}: IndustryBlogPageProps) {
  if (!isMongoConfigured()) {
    throw new Error("Industry blogs unavailable: MongoDB is not configured.");
  }

  const { industry } = await params;
  const slug = normalizeSlug(decodeURIComponent(industry));
  if (!slug) {
    notFound();
  }

  const sp = await searchParams;
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const label = labelFromIndustrySlug(slug);

  let result: Awaited<ReturnType<typeof getCachedListPublished>>;
  try {
    result = await getCachedListPublished({
      page: pageNum,
      pageSize: PAGE_SIZE,
      industrySlug: slug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    throw new Error(`Industry blogs unavailable: ${message}`);
  }

  const { posts, page, totalPages, total } = result;
  if (total > 0 && page > totalPages) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#EEF3FF]">
      <main className="px-5 pb-20 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 text-center md:mb-14">
            <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">
              {label} Blogs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-700">
              Industry-specific voice AI patterns and practical playbooks for {label}.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-center text-slate-700">
              No posts found for this industry yet.
            </p>
          ) : (
            <>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={String(post.slug)}>
                    <BlogCard post={post as BlogPublicDoc} />
                  </li>
                ))}
              </ul>
              <Pagination
                page={page}
                totalPages={totalPages}
                basePath={`/blog/industry/${encodeURIComponent(slug)}`}
              />
              {total > 0 ? (
                <p className="mt-6 text-center text-sm text-slate-600">
                  {total} article{total === 1 ? "" : "s"}
                </p>
              ) : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
