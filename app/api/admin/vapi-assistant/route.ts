import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getAssistantIdForIndustry, normalizeIndustrySlug } from "@/lib/vapi/assistants";

export const runtime = "nodejs";

/**
 * Resolves the assistant for a browser test call. Keeps assistant IDs out of the
 * client bundle and page source: they are only sent once a call is started.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdminSession(request);
  if (denied) return denied;

  const industry = normalizeIndustrySlug(request.nextUrl.searchParams.get("industry"));
  if (!industry) {
    return NextResponse.json(
      { error: "Provide a supported industry via the `industry` query parameter." },
      { status: 400 }
    );
  }

  const assistantId = getAssistantIdForIndustry(industry);
  if (!assistantId) {
    return NextResponse.json(
      { error: `No assistant is configured for ${industry}.` },
      { status: 503 }
    );
  }

  return NextResponse.json({ industry, assistantId });
}
