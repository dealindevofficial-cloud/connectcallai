import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";
import { BlogMongoConnectionFailedNotice } from "@/components/blog/BlogMongoConnectionFailedNotice";
import { MongoNotConfiguredNotice } from "@/components/blog/MongoNotConfiguredNotice";
import { getCachedListPublished } from "@/lib/blog/public-cache";
import type { BlogPublicDoc } from "@/lib/blog/public-types";
import { normalizeSlug, type ListPublishedResult } from "@/lib/blog/repository";
import { isMongoConfigured } from "@/lib/db/connect";

export const metadata: Metadata = {
  title: "Blog | CCAI",
  description:
    "Insights on AI voice agents, automation, and customer conversations from the CCAI team.",
  openGraph: {
    title: "Blog | CCAI",
    description:
      "Insights on AI voice agents, automation, and customer conversations from the CCAI team.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | CCAI",
    description:
      "Insights on AI voice agents, automation, and customer conversations from the CCAI team.",
  },
};

const PAGE_SIZE = 10;

type BlogIndexProps = {
  searchParams: Promise<{ page?: string; industry?: string }>;
};

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const sp = await searchParams;
  const raw = sp.page;
  const pageNum = Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);
  const rawIndustry = sp.industry?.trim() ?? "";
  const industrySlug =
    rawIndustry !== ""
      ? normalizeSlug(rawIndustry)
      : undefined;

  let mongoLoadError: string | null = null;
  let result: ListPublishedResult;
  try {
    result = await getCachedListPublished({
      page: pageNum,
      pageSize: PAGE_SIZE,
      ...(industrySlug ? { industrySlug } : {}),
    });
  } catch (err) {
    mongoLoadError = err instanceof Error ? err.message : "Unknown database error";
    result = {
      posts: [],
      total: 0,
      page: pageNum,
      pageSize: PAGE_SIZE,
      totalPages: 1,
    };
  }

  const { posts, page, totalPages, total } = result;

  return (
    <div className="min-h-screen bg-[#EEF3FF]">
      <main className="px-5 pb-20 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 text-center md:mb-14">
            <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">Blog</h1>
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

          {mongoLoadError ? (
            <BlogMongoConnectionFailedNotice technical={mongoLoadError} />
          ) : !isMongoConfigured() ? (
            <MongoNotConfiguredNotice />
          ) : posts.length === 0 ? (
            <p className="text-center text-slate-700">No posts yet. Check back soon.</p>
          ) : (
            <>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
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
