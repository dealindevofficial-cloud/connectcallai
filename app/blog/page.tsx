import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
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

type BlogIndexProps = {
  searchParams: Promise<{ page?: string; industry?: string }>;
};

function buildCanonicalPath(page: number, industrySlug?: string): string {
  if (industrySlug) {
    return getBlogIndustryArchivePath(industrySlug, page);
  }

  const query = new URLSearchParams();
  if (page > 1) {
    query.set("page", String(page));
  }
  const queryString = query.toString();
  return queryString ? `/blog?${queryString}` : "/blog";
}

export async function generateMetadata({ searchParams }: BlogIndexProps): Promise<Metadata> {
  const sp = await searchParams;
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const rawIndustry = sp.industry?.trim() ?? "";
  const industrySlug = rawIndustry !== "" ? normalizeSlug(rawIndustry) : undefined;
  const siteOrigin = getSiteOrigin();
  const canonicalPath = buildCanonicalPath(pageNum, industrySlug);

  const baseSegment = industrySlug
    ? pageTitles.blogIndustry(labelFromIndustrySlug(industrySlug))
    : pageTitles.blog;
  const titleSegment = paginatedTitle(baseSegment, pageNum);
  const docTitle = fullTitle(titleSegment);
  const baseDescription = industrySlug
    ? pageDescriptions.blogIndustry(labelFromIndustrySlug(industrySlug))
    : pageDescriptions.blog;
  const description =
    pageNum > 1 ? `${baseDescription} Page ${pageNum} of the archive.` : baseDescription;

  return {
    title: titleSegment,
    description,
    robots: industrySlug
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : undefined,
    alternates: siteOrigin ? { canonical: `${siteOrigin}${canonicalPath}` } : undefined,
    openGraph: {
      title: docTitle,
      description,
      type: "website",
      url: siteOrigin ? `${siteOrigin}${canonicalPath}` : undefined,
      images: [
        {
          url: "/blog/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Connect Call AI blogs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: docTitle,
      description,
      images: ["/blog/opengraph-image"],
    },
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  if (!isMongoConfigured()) {
    throw new Error("Blogs listing unavailable: MongoDB is not configured.");
  }

  const sp = await searchParams;
  const raw = sp.page;
  const pageNum = Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);
  const rawIndustry = sp.industry?.trim() ?? "";
  const industrySlug =
    rawIndustry !== ""
      ? normalizeSlug(rawIndustry)
      : undefined;
  if (industrySlug) {
    permanentRedirect(getBlogIndustryArchivePath(industrySlug, pageNum));
  }

  let result: Awaited<ReturnType<typeof getCachedListPublished>>;
  try {
    result = await getCachedListPublished({
      page: pageNum,
      pageSize: PAGE_SIZE,
      ...(industrySlug ? { industrySlug } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    throw new Error(`Blogs listing unavailable: ${message}`);
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
            <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">Blogs</h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-700">
              Product updates, voice AI patterns, and practical tips for better customer calls.
            </p>
            {industrySlug ? (
              <p className="mt-3 text-sm text-slate-700">
                Showing posts for industry:{" "}
                <span className="font-semibold text-[#1E3A8A]">{industrySlug}</span>
              </p>
            ) : null}
          </header>

          {posts.length === 0 ? (
            <p className="text-center text-slate-700">No posts yet. Check back soon.</p>
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
                extraSearchParams={
                  industrySlug ? { industry: industrySlug } : undefined
                }
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
