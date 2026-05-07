const DEFAULT_CALENDLY_URL = "https://calendly.com/connectcallaiofficial/ccai-consultation";

function normalizeCalendlyUrl(raw?: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) return DEFAULT_CALENDLY_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return DEFAULT_CALENDLY_URL;
    return parsed.toString();
  } catch {
    return DEFAULT_CALENDLY_URL;
  }
}

export function getCalendlyEmbedUrl(raw?: string, embedDomain?: string): string {
  const parsed = new URL(normalizeCalendlyUrl(raw));
  if (embedDomain?.trim()) {
    parsed.searchParams.set("embed_domain", embedDomain.trim());
  }
  parsed.searchParams.set("embed_type", "Inline");
  parsed.searchParams.set("hide_gdpr_banner", "1");
  return parsed.toString();
}

export function getCalendlyBookingUrl(raw?: string): string {
  return normalizeCalendlyUrl(raw);
}
