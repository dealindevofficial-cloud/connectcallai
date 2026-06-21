export function labelFromIndustrySlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getBlogIndustryArchivePath(slug: string, page = 1): string {
  const query = page > 1 ? `?page=${page}` : "";
  return `/blog/industry/${encodeURIComponent(slug)}${query}`;
}

export function getBlogIndustryArchiveCanonicalUrl(siteOrigin: string, slug: string, page = 1) {
  return `${siteOrigin.replace(/\/$/, "")}${getBlogIndustryArchivePath(slug, page)}`;
}
