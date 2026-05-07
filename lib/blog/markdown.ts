import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { extractCtaBlocks, injectCtaFragments } from "@/lib/blog/cta-blocks";

/** Shared allowlist for markdown output and post-processed HTML fragments. */
export const blogRehypeSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height"],
  },
  /** Strip inline styles if raw HTML ever slips through. */
  strip: [...(defaultSchema.strip ?? []), "style"],
};

/**
 * Defense-in-depth: parse rendered HTML and run through the same sanitize schema.
 * Use after Markdown → HTML so any pipeline quirks are normalized.
 */
export async function sanitizeHtmlFragment(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, blogRehypeSanitizeSchema)
    .use(rehypeStringify)
    .process(html);

  return String(file);
}

/**
 * Remove presentational attributes from user-authored markdown HTML so
 * typography/color is controlled exclusively by the site theme.
 */
function stripPresentationAttributes(html: string): string {
  return html
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sclass='[^']*'/gi, "")
    .replace(/\sid="[^"]*"/gi, "")
    .replace(/\sid='[^']*'/gi, "");
}

/**
 * Renders Markdown (GFM) to HTML safe for `html-react-parser` / DOM insertion.
 * Applies `rehype-sanitize` in the remark pipeline, re-sanitizes the HTML string,
 * then injects optional `:::cta` blocks (see `cta-blocks.ts`).
 */
export async function markdownToSafeHtml(markdown: string): Promise<string> {
  const { markdown: mdWithoutCtas, ctas } = extractCtaBlocks(markdown);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize, blogRehypeSanitizeSchema)
    .use(rehypeStringify)
    .process(mdWithoutCtas);

  let html = String(file);
  html = await sanitizeHtmlFragment(html);
  html = stripPresentationAttributes(html);
  if (ctas.length > 0) {
    html = injectCtaFragments(html, ctas);
  }
  return html;
}
