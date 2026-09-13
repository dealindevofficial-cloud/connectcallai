/**
 * Single source of truth for the industry -> Vapi assistant mapping.
 *
 * Reads server-only env vars, so only import this from Route Handlers and Server
 * Components. Client Components may import the types, which erase at compile time.
 */

export const INDUSTRY_SLUGS = [
  "real-estate",
  "restaurants",
  "hospitals",
  "dental-offices",
  "pet-clinics",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export function normalizeIndustrySlug(value: string | null | undefined): IndustrySlug | "" {
  const normalized = (value ?? "").trim().toLowerCase();
  return (INDUSTRY_SLUGS as readonly string[]).includes(normalized)
    ? (normalized as IndustrySlug)
    : "";
}

export function getAssistantIdForIndustry(industry: IndustrySlug): string | undefined {
  const assistantIdByIndustry: Record<IndustrySlug, string | undefined> = {
    "real-estate": process.env.VAPI_ASSISTANT_REAL_ESTATE_ID,
    restaurants: process.env.VAPI_ASSISTANT_RESTAURANTS_ID,
    hospitals: process.env.VAPI_ASSISTANT_HOSPITALS_ID,
    // TODO: Replace with a dedicated dental Vapi assistant env var when it is ready.
    "dental-offices": process.env.VAPI_ASSISTANT_HOSPITALS_ID,
    "pet-clinics": process.env.VAPI_ASSISTANT_PET_CLINICS_ID,
  };

  return assistantIdByIndustry[industry];
}
