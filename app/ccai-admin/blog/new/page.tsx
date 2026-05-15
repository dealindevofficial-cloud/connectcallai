import Link from "next/link";
import { NewBlogForm } from "./ui";

export default function NewBlogPage() {
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
                <h1 className="mt-2 text-2xl font-semibold text-white">Create post</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/ccai-admin/blog" className="btn-secondary">
                  All posts
                </Link>
                <Link href="/blog" className="btn-secondary">
                  View blogs
                </Link>
                <form action="/api/admin/auth/logout" method="post">
                  <button type="submit" className="btn-secondary">
                    Sign out
                  </button>
                </form>
              </div>
            </div>

            <NewBlogForm />
          </div>
        </div>
      </section>
    </main>
  );
}
