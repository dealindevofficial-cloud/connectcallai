import { redirect } from "next/navigation";

import { normalizeSlug } from "@/lib/blog/repository";

type IndustryRedirectProps = {
  params: Promise<{ industry: string }>;
};

/** Shareable alias for ` /blog?industry=…` (programmatic SEO). */
export default async function IndustryBlogRedirect({
  params,
}: IndustryRedirectProps) {
  const { industry } = await params;
  const slug = normalizeSlug(decodeURIComponent(industry));
  if (!slug) {
    redirect("/blog");
  }
  redirect(`/blog?industry=${encodeURIComponent(slug)}`);
}
