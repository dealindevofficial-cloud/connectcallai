import Link from "next/link";
import { notFound } from "next/navigation";
import { getById } from "@/lib/blog/repository";
import { EditBlogForm } from "./ui";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditPageProps) {
  const { id } = await params;
  const post = await getById(id);

  if (!post) {
    notFound();
  }
  const category = post.category as { slug?: string; name?: string } | undefined;
  const author = post.author as { name?: string; slug?: string; image?: string } | undefined;
  const relatedIds = Array.isArray(post.relatedPostIds)
    ? post.relatedPostIds.map((id) => String(id)).join(", ")
    : "";
  const faqs = Array.isArray(post.faqs)
    ? post.faqs
        .map((item) => ({
          question: String(item?.question ?? ""),
          answer: String(item?.answer ?? ""),
        }))
        .filter((item) => item.question.length > 0 || item.answer.length > 0)
    : [];

  return (
    <main className="relative flex-1 overflow-hidden">
      <section className="landing-section px-6 py-16 sm:px-10">
        <div className="landing-grid pointer-events-none" />
        <div className="landing-noise pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">Edit post</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/ccai-admin/blog" className="btn-secondary">
                  All posts
                </Link>
                <Link href="/ccai-admin/blog/new" className="btn-secondary">
                  New post
                </Link>
              </div>
            </div>

            <EditBlogForm
              postId={post._id.toString()}
              initial={{
                title: String(post.title ?? ""),
                slug: String(post.slug ?? ""),
                content: String(post.content ?? ""),
                status: post.status === "published" ? "published" : "draft",
                excerpt: String(post.excerpt ?? ""),
                featuredImage: String(post.featuredImage ?? ""),
                tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
                categorySlug: String(category?.slug ?? ""),
                categoryName: String(category?.name ?? ""),
                metaTitle: String(post.metaTitle ?? ""),
                metaDescription: String(post.metaDescription ?? ""),
                canonicalUrl: String(post.canonicalUrl ?? ""),
                noindex: Boolean(post.noindex),
                authorName: String(author?.name ?? ""),
                authorSlug: String(author?.slug ?? ""),
                authorImage: String(author?.image ?? ""),
                industrySlug: String(post.industrySlug ?? ""),
                templateKey: String(post.templateKey ?? ""),
                relatedPostIds: relatedIds,
                faqs,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
