"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

type Status = "draft" | "published";

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function NewBlogForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; slug: string } | null>(null);

  const effectiveSlug = useMemo(() => {
    if (slugEdited) return slug;
    return toSlug(title);
  }, [slug, slugEdited, title]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    if (submitter?.closest(".w-md-editor")) {
      return;
    }
    setError(null);
    setCreated(null);
    setSubmitting(true);

    if (!content.trim()) {
      setError("Content is required.");
      setSubmitting(false);
      return;
    }

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: effectiveSlug,
      content,
      status,
    };

    if (excerpt.trim()) payload.excerpt = excerpt.trim();
    if (featuredImage.trim()) payload.featuredImage = featuredImage.trim();

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (parsedTags.length > 0) payload.tags = parsedTags;

    if (categorySlug.trim() && categoryName.trim()) {
      payload.category = {
        slug: toSlug(categorySlug),
        name: categoryName.trim(),
      };
    }

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        _id?: string;
        slug?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Failed to create post.");
        return;
      }

      setCreated({ id: data._id ?? "", slug: data.slug ?? effectiveSlug });
      setTitle("");
      setSlug("");
      setSlugEdited(false);
      setContent("");
      setStatus("draft");
      setExcerpt("");
      setFeaturedImage("");
      setTags("");
      setCategorySlug("");
      setCategoryName("");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
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
            placeholder="Post title"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Slug *</span>
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(toSlug(e.target.value));
            }}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="my-post-slug"
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
          placeholder="Short summary"
        />
      </label>

      <div className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">Content (markdown) *</span>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder={"# Heading\nWrite your post here..."}
        />
      </div>

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

      {created ? (
        <p className="text-sm text-emerald-300">
          Post created successfully.{" "}
          <Link href={`/blog/${created.slug}`} className="font-medium text-cyan-300 hover:text-cyan-200">
            View published page
          </Link>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating..." : "Create post"}
        </button>
      </div>
    </form>
  );
}
