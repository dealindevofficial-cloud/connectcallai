import Link from "next/link";
import { listAll } from "@/lib/blog/repository";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function AdminBlogListPage() {
  const { posts } = await listAll({ page: 1, pageSize: 50 });

  return (
    <main className="relative flex-1 overflow-hidden">
      <section className="landing-section px-6 py-16 sm:px-10">
        <div className="landing-grid pointer-events-none" />
        <div className="landing-noise pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">Blog posts</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/ccai-admin/blog/new" className="btn-primary">
                  + New post
                </Link>
                <form action="/api/admin/auth/logout" method="post">
                  <button type="submit" className="btn-secondary">
                    Sign out
                  </button>
                </form>
              </div>
            </div>

            {posts.length === 0 ? (
              <p className="text-sm text-blue-100/80">No posts yet. Create your first one.</p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li
                    key={post._id.toString()}
                    className="rounded-xl border border-white/15 bg-slate-950/35 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {String(post.title)}
                        </p>
                        <p className="mt-1 text-xs text-blue-100/70">/{String(post.slug)}</p>
                        <p className="mt-1 text-xs text-blue-200/60">
                          {post.status === "published" ? "Published" : "Draft"} · Updated{" "}
                          {formatDate(
                            post.updatedAt as Date | string | null | undefined
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/ccai-admin/blog/${post._id.toString()}`} className="btn-secondary">
                          Edit
                        </Link>
                        <Link href={`/blog/${post.slug}`} className="btn-secondary">
                          View
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
