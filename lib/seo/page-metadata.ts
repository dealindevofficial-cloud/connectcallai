/** Site name used in titles and meta descriptions. */
export const SITE_NAME = "Connect Call AI";

/** Pass-through layout template (each page sets its full title; nothing is appended). */
export const TITLE_TEMPLATE = "%s";

/** Target max length for document titles in SERPs. */
const MAX_TITLE_SEGMENT = 60;

/** Document / share title (no suffix appended). */
export function fullTitle(segment: string): string {
  return segment;
}

/** Trim long CMS titles so the full document title stays within a sensible SEO length. */
export function seoTitleSegment(text: string, maxLen = MAX_TITLE_SEGMENT): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1).trimEnd()}…`;
}

/** Page document titles (used as-is; no automatic suffix). */
export const pageTitles = {
  home: "Build Custom AI Voice Agents for Your Business - Connect Call AI",
  about: "About Connect Call AI - AI Voice Agent Company",
  contact: "Book a Free AI Voice Agent Demo & Contact - Connect Call AI",
  privacy: "Privacy Policy - Connect Call AI",
  pricing: "AI Voice Agent Pricing Estimator - Connect Call AI",
  terms: "Terms of Service - Connect Call AI",
  trust: "Trust Center for Responsible AI Voice Agents - Connect Call AI",
  industries: "Custom AI Voice Agents for Real Estate, Restaurants, and More - Connect Call AI",
  industry: (title: string) => `${title} - Connect Call AI`,
  blog: "AI Voice Agent Blogs - Connect Call AI",
  blogIndustry: (label: string) => `${label} AI Voice Agent Blogs - Connect Call AI`,
  notFound: "Page Not Found - Connect Call AI",
  blogSetup: "Blogs Setup - Connect Call AI",
  blogUnavailable: "Blogs Unavailable - Connect Call AI",
  postNotFound: "Blogs Post Not Found - Connect Call AI",
  industryNotFound: "Industry Not Found - Connect Call AI",
} as const;

/** Meta descriptions (~150–160 characters for search snippets). */
export const pageDescriptions = {
  home:
    "Never miss a call. Connect Call AI answers, books, and qualifies leads 24/7 with natural AI voice agents built for sales, support, and operations teams.",
  about:
    "Learn about Connect Call AI, the AI voice agent company helping businesses answer calls, qualify leads, book appointments, and improve customer follow-up.",
  contact:
    "Book a free Connect Call AI demo. See how AI voice agents automate inbound calls, appointment booking, and follow-ups for your business.",
  privacy:
    "Read the Connect Call AI privacy policy covering website forms, demo bookings, analytics, call-flow details, service providers, and data choices.",
  pricing:
    "Estimate monthly AI voice agent and call-handling costs with Connect Call AI. Compare automation savings by call volume, duration, and team size.",
  terms:
    "Review the Connect Call AI terms of service for website use, demo requests, AI voice agent responsibilities, third-party services, and public content.",
  trust:
    "Explore Connect Call AI trust practices for responsible AI voice automation, including caller disclosure, escalation rules, data handling, and integrations.",
  industries:
    "Explore Connect Call AI voice agents by industry—real estate, restaurants, hospitals, dental offices, pet clinics, and more. Tailored calling automation for your vertical.",
  blog:
    "Read the Connect Call AI blogs for guides on AI voice agents, phone automation, lead qualification, and 24/7 customer call workflows.",
  blogIndustry: (label: string) =>
    `AI voice agent tips and call automation guides for ${label} teams from Connect Call AI—booking, follow-ups, and inbound call handling.`,
  notFound: "The page you requested on Connect Call AI could not be found. Browse our AI voice agent solutions or contact us for help.",
  blogUnavailable:
    "This Connect Call AI article is temporarily unavailable. Visit our blogs for more on AI voice agents and automated calling.",
  postFallback:
    "Read this article on the Connect Call AI blogs—insights on AI voice agents, phone automation, and smarter customer conversations.",
} as const;

export function paginatedTitle(segment: string, page: number): string {
  return page > 1 ? `${segment} · Page ${page}` : segment;
}
