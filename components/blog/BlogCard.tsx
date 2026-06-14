import Link from "next/link";
import type { BlogPublicDoc } from "@/lib/blog/public-types";

type BlogCardProps = {
  post: BlogPublicDoc;
  compact?: boolean;
};

function formatDate(d: Date | undefined | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(d));
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
  const href = `/blog/${post.slug}`;
  const excerpt = post.excerpt?.trim() ?? "";
  const image = post.featuredImage?.trim();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#C7D2FE] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#1E3A8A]/35 hover:shadow-md">
      <Link href={href} className="group block shrink-0">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- arbitrary CDN URLs from CMS */
          <img
            src={image}
            alt={post.title}
            className="block h-auto w-full rounded-2xl object-contain transition duration-300 group-hover:scale-[1.01]"
          />
        ) : (
          <div
            className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#E2E8F0] text-sm font-medium text-[#1E3A8A]/80 ${
              compact ? "aspect-[16/9]" : "aspect-[16/10]"
            }`}
          >
            CCAI
          </div>
        )}
      </Link>
      <div className={`flex flex-1 flex-col gap-3 ${compact ? "p-4 md:p-5" : "p-5 md:p-6"}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {post.category?.name ? (
            <span className="inline-flex rounded-full border border-[#BFDBFE] bg-[#DBEAFE] px-3 py-1 text-[11px] font-medium text-[#1E3A8A]">
              {post.category.name}
            </span>
          ) : null}
          <time
            dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}
          >
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h2
          className={`font-semibold leading-snug text-slate-950 ${
            compact ? "text-lg md:text-xl" : "text-xl md:text-2xl"
          }`}
        >
          <Link href={href} className="transition-colors hover:text-[#1E3A8A]">
            {post.title}
          </Link>
        </h2>
        {excerpt ? (
          <p className={`text-sm text-slate-700 ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
            {excerpt}
          </p>
        ) : null}
        <div className="mt-auto pt-1">
          <Link
            href={href}
            className="inline-flex text-sm font-semibold text-[#1E3A8A] transition-colors hover:text-slate-950"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
