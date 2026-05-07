"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "draft" | "published";

type InitialValues = {
  title: string;
  slug: string;
  content: string;
  status: Status;
  excerpt: string;
  featuredImage: string;
  tags: string;
  categorySlug: string;
  categoryName: string;
};

type EditBlogFormProps = {
  postId: string;
  initial: InitialValues;
};

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function EditBlogForm({ postId, initial }: EditBlogFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [content, setContent] = useState(initial.content);
  const [status, setStatus] = useState<Status>(initial.status);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [featuredImage, setFeaturedImage] = useState(initial.featuredImage);
  const [tags, setTags] = useState(initial.tags);
  const [categorySlug, setCategorySlug] = useState(initial.categorySlug);
  const [categoryName, setCategoryName] = useState(initial.categoryName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSavedSlug(null);
    setSaving(true);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: toSlug(slug),
      content,
      status,
      excerpt: excerpt.trim(),
      featuredImage: featuredImage.trim(),
    };

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    payload.tags = parsedTags;

    if (categorySlug.trim() && categoryName.trim()) {
      payload.category = {
        slug: toSlug(categorySlug),
        name: categoryName.trim(),
      };
    } else {
      payload.category = null;
    }

    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { slug?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Failed to save post.");
        return;
      }

      setSavedSlug(data.slug ?? toSlug(slug));
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Slug *</span>
          <input
            value={slug}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Status *</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 focus:ring"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Featured image URL</span>
          <input
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">Excerpt</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="min-h-24 w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">Content (markdown) *</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-72 w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 font-mono text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Tags (comma-separated)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="voice-ai, calling, product"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-blue-100">Category slug</span>
            <input
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
              placeholder="product"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-blue-100">Category name</span>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
              placeholder="Product"
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {savedSlug ? (
        <p className="text-sm text-emerald-300">
          Post updated successfully.{" "}
          <Link href={`/blog/${savedSlug}`} className="font-medium text-cyan-300 hover:text-cyan-200">
            View published page
          </Link>
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
