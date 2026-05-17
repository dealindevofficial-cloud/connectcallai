"use client";

import Link from "next/link";
import { useState } from "react";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

type Status = "draft" | "published";
type FaqItem = { question: string; answer: string };

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
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noindex: boolean;
  authorName: string;
  authorSlug: string;
  authorImage: string;
  industrySlug: string;
  templateKey: string;
  relatedPostIds: string;
  faqs: FaqItem[];
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
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [canonicalUrl, setCanonicalUrl] = useState(initial.canonicalUrl);
  const [noindex, setNoindex] = useState(initial.noindex);
  const [authorName, setAuthorName] = useState(initial.authorName);
  const [authorSlug, setAuthorSlug] = useState(initial.authorSlug);
  const [authorImage, setAuthorImage] = useState(initial.authorImage);
  const [industrySlug, setIndustrySlug] = useState(initial.industrySlug);
  const [templateKey, setTemplateKey] = useState(initial.templateKey);
  const [relatedPostIds, setRelatedPostIds] = useState(initial.relatedPostIds);
  const [faqs, setFaqs] = useState<FaqItem[]>(
    initial.faqs.length > 0 ? initial.faqs : [{ question: "", answer: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    if (submitter?.closest(".w-md-editor")) {
      return;
    }
    setError(null);
    setSavedSlug(null);
    setSaving(true);

    if (!content.trim()) {
      setError("Content is required.");
      setSaving(false);
      return;
    }

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: toSlug(slug),
      content,
      status,
      excerpt: excerpt.trim(),
      featuredImage: featuredImage.trim(),
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
      noindex,
      templateKey: templateKey.trim(),
    };
    if (industrySlug.trim()) {
      payload.industrySlug = toSlug(industrySlug);
    }

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
    }

    if (authorName.trim()) {
      payload.author = {
        name: authorName.trim(),
        ...(authorSlug.trim() ? { slug: toSlug(authorSlug) } : {}),
        ...(authorImage.trim() ? { image: authorImage.trim() } : {}),
      };
    }

    const parsedRelated = relatedPostIds
      .split(/[\n,]/)
      .map((id) => id.trim())
      .filter(Boolean);
    payload.relatedPostIds = parsedRelated;
    payload.faqs = faqs
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0)
      .slice(0, 20);

    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        slug?: string;
        status?: string;
        publishedAt?: string | null;
        error?: string;
        details?: {
          formErrors?: string[];
          fieldErrors?: Record<string, string[] | undefined>;
        };
      };
      if (!res.ok) {
        const fieldMessages = Object.values(data.details?.fieldErrors ?? {})
          .flat()
          .filter(Boolean);
        const detailMessage = [
          ...(data.details?.formErrors ?? []),
          ...fieldMessages,
        ]
          .filter(Boolean)
          .join(" ");
        setError(
          detailMessage ||
            data.error ||
            `Failed to save post (HTTP ${res.status}).`
        );
        return;
      }

      if (status === "published" && (data.status !== "published" || !data.publishedAt)) {
        setError(
          "Post save succeeded, but publish did not complete. Please try again."
        );
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

      <div className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">Content (markdown) *</span>
        <MarkdownEditor
          value={content}
          onChange={setContent}
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Meta title</span>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="SEO title"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Canonical URL</span>
          <input
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">Meta description</span>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="min-h-20 w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
          placeholder="SEO description"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Industry slug</span>
          <input
            value={industrySlug}
            onChange={(e) => setIndustrySlug(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="healthcare"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Template key</span>
          <input
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="industry-v1"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Author name</span>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="CCAI Team"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Author slug</span>
          <input
            value={authorSlug}
            onChange={(e) => setAuthorSlug(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="ccai-team"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-blue-100">Author image URL</span>
          <input
            value={authorImage}
            onChange={(e) => setAuthorImage(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-blue-100">
          Related post ids (comma or newline separated)
        </span>
        <textarea
          value={relatedPostIds}
          onChange={(e) => setRelatedPostIds(e.target.value)}
          className="min-h-20 w-full rounded-xl border border-white/20 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
          placeholder="665a... , 665b..."
        />
      </label>

      <div className="space-y-3 rounded-xl border border-white/15 bg-slate-950/25 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-100">FAQs</p>
            <p className="text-xs text-blue-200/70">
              FAQs shown on this blog page and used for FAQ schema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFaqs((prev) => [...prev, { question: "", answer: "" }])}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-medium text-blue-100 transition hover:border-cyan-300/60 hover:text-cyan-200"
          >
            Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={`faq-${idx}`} className="rounded-lg border border-white/10 bg-slate-900/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-200/80">
                  FAQ {idx + 1}
                </span>
                {faqs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-xs font-medium text-rose-300 transition hover:text-rose-200"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                value={faq.question}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, question: e.target.value } : item
                    )
                  )
                }
                className="w-full rounded-lg border border-white/20 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
                placeholder="Question"
              />
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, answer: e.target.value } : item
                    )
                  )
                }
                className="mt-2 min-h-20 w-full rounded-lg border border-white/20 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-blue-200/50 focus:ring"
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={noindex}
          onChange={(e) => setNoindex(e.target.checked)}
          className="h-4 w-4 rounded border-white/30 bg-slate-950/45 text-cyan-300 focus:ring-cyan-300/60"
        />
        <span className="text-sm font-medium text-blue-100">Noindex this post</span>
      </label>

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
