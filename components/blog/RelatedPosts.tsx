import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPublicDoc } from "@/lib/blog/public-types";

type RelatedPostsProps = {
  posts: BlogPublicDoc[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-[#BFDBFE] pt-10" aria-label="Related posts">
      <h2 className="mb-6 text-xl font-semibold text-slate-950">Related posts</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
