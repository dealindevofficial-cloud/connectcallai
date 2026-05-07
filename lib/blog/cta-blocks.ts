import { getSiteOrigin } from "@/lib/blog/site-url";

export type CtaSpec = {
  title: string;
  button: string;
  href: string;
};

/** Matches `:::cta` fenced blocks (three colons). Body lines use `key: value`. */
const CTA_BLOCK =
  /(?:^|[\r\n]):::\s*cta\s*[\r\n]+([\s\S]*?)[\r\n]+:::\s*(?=[\r\n]|$)/g;

export function extractCtaBlocks(markdown: string): {
  markdown: string;
  ctas: CtaSpec[];
} {
  const ctas: CtaSpec[] = [];
  const md = markdown.replace(CTA_BLOCK, (_full, body: string) => {
    ctas.push(parseCtaBody(body));
    const i = ctas.length - 1;
    return `\n\n__CCAI_CTA_${i}__\n\n`;
  });
  return { markdown: md, ctas };
}

function parseCtaBody(body: string): CtaSpec {
  const map: Record<string, string> = {};
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^\s*([a-zA-Z0-9 _-]+)\s*:\s*(.*)$/);
    if (m) {
      map[m[1].trim().toLowerCase().replace(/\s+/g, "")] = m[2].trim();
    }
  }
  const title = map.title || map.heading || "Learn more";
  const button = map.button || map.buttontext || "Get started";
  const href = map.href || map.url || map.link || "/";
  return { title, button, href };
}

/**
 * Allow root-relative paths, hash-only links, and absolute HTTPS URLs on this site.
 */
export function sanitizePublicHref(href: string): string | null {
  const h = href.trim();
  if (!h) return null;
  if (h.startsWith("#")) return h;
  if (h.startsWith("/") && !h.startsWith("//")) return h;

  const origin = getSiteOrigin();
  if (!origin) {
    return h.startsWith("/") && !h.startsWith("//") ? h : null;
  }
  try {
    const u = new URL(h);
    const base = new URL(origin);
    if (u.protocol !== "https:" || u.hostname !== base.hostname) {
      return null;
    }
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildCtaAsideHtml(cta: CtaSpec): string {
  const safeHref = sanitizePublicHref(cta.href) ?? "#";
  const title = escapeHtml(cta.title);
  const button = escapeHtml(cta.button);
  const hrefAttr = escapeHtml(safeHref);
  return (
    `<aside class="blog-cta not-prose">` +
    `<p class="blog-cta-title">${title}</p>` +
    `<a class="blog-cta-button" href="${hrefAttr}">${button}</a>` +
    `</aside>`
  );
}

/** Replace sanitized paragraph placeholders with built CTA markup (already escaped). */
export function injectCtaFragments(html: string, ctas: CtaSpec[]): string {
  let out = html;
  ctas.forEach((cta, i) => {
    const fragment = buildCtaAsideHtml(cta);
    out = out.replace(
      new RegExp(`<p>\\s*__CCAI_CTA_${i}__\\s*</p>`, "gi"),
      fragment
    );
    out = out.replace(`__CCAI_CTA_${i}__`, fragment);
  });
  return out;
}
