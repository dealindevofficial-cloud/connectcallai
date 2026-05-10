import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getSiteOrigin } from "@/lib/blog/site-url";

export const runtime = "nodejs";

/** Post-call customer emails are opt-in so deploys stay safe until VAPI + Resend are configured. */
function isPostCallCustomerEmailEnabled() {
  return process.env.VAPI_POST_CALL_EMAIL_ENABLED?.trim().toLowerCase() === "true";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "ConnectCall AI <onboarding@resend.dev>";

type VapiEndOfCallMessage = {
  type?: string;
  endedReason?: string;
  call?: {
    id?: string;
    metadata?: Record<string, unknown>;
    analysis?: {
      summary?: string;
      structuredData?: unknown;
      successEvaluation?: string;
    };
  };
};

type VapiWebhookBody = {
  message?: VapiEndOfCallMessage;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/**
 * When `VAPI_WEBHOOK_SECRET` is set, require either Bearer auth or legacy `X-Vapi-Secret`
 * (see https://docs.vapi.ai/server-url/server-authentication ).
 */
function isAuthorizedWebhook(request: Request): boolean {
  const secret = process.env.VAPI_WEBHOOK_SECRET?.trim();
  if (!secret) return true;

  const auth = request.headers.get("authorization")?.trim();
  const xSecret = request.headers.get("x-vapi-secret")?.trim();

  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    return timingSafeStringEqual(token, secret);
  }
  if (auth && timingSafeStringEqual(auth, secret)) {
    return true;
  }
  if (xSecret && timingSafeStringEqual(xSecret, secret)) {
    return true;
  }
  return false;
}

function getPublicContactPageUrl(): string {
  try {
    const origin = getSiteOrigin();
    if (origin) return `${origin}/contact-us`;
  } catch {
    /* getSiteOrigin() throws in production when NEXT_PUBLIC_SITE_URL and VERCEL_URL are unset */
  }
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (explicit) return `${explicit}/contact-us`;
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000/contact-us";
  }
  return "";
}

function formatStructuredDataHtml(data: unknown): string {
  if (data == null) {
    return "<p><em>No structured summary was captured for this call.</em></p>";
  }
  if (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0) {
    return "<p><em>No structured summary was captured for this call.</em></p>";
  }

  if (typeof data === "object") {
    const rows = Object.entries(data as Record<string, unknown>)
      .map(([key, val]) => {
        const display =
          val !== null && typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);
        return `<tr><td style="padding:10px 12px;border:1px solid #e5e7eb;vertical-align:top;background:#f9fafb;width:36%"><strong>${escapeHtml(key)}</strong></td><td style="padding:10px 12px;border:1px solid #e5e7eb;vertical-align:top;white-space:pre-wrap">${escapeHtml(display)}</td></tr>`;
      })
      .join("");
    return `<table role="presentation" style="border-collapse:collapse;width:100%;max-width:560px;font-size:14px;line-height:1.5">${rows}</table>`;
  }

  return `<pre style="white-space:pre-wrap;font-size:13px;line-height:1.5;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb">${escapeHtml(String(data))}</pre>`;
}

function formatStructuredDataPlain(data: unknown): string {
  if (data == null || (typeof data === "object" && !Array.isArray(data) && Object.keys(data as object).length === 0)) {
    return "No structured summary was captured for this call.";
  }
  return typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
}

async function sendPostCallCustomerEmail(args: {
  to: string;
  leadName: string;
  endedReason?: string;
  summary?: string;
  successEvaluation?: string;
  structuredData: unknown;
  callId?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false as const, reason: "missing_resend_key" as const };
  }

  let contactUrl = getPublicContactPageUrl();
  if (!contactUrl) {
    console.warn("[vapi-webhook] NEXT_PUBLIC_SITE_URL (or Vercel URL) unset; contact link omitted.");
    contactUrl = "#";
  }
  const firstName = args.leadName.trim().split(/\s+/)[0] ?? args.leadName;
  const escapedName = escapeHtml(firstName);

  const summaryBlock =
    args.summary && args.summary.trim().length > 0
      ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#111827">${escapeHtml(args.summary.trim())}</p>`
      : "";

  const evalBlock =
    args.successEvaluation && String(args.successEvaluation).trim().length > 0
      ? `<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#4b5563"><strong>Call outcome:</strong> ${escapeHtml(String(args.successEvaluation).trim())}</p>`
      : "";

  const metaLine =
    args.endedReason || args.callId
      ? `<p style="margin:0 0 20px;font-size:12px;line-height:1.5;color:#6b7280">${args.endedReason ? `Status: ${escapeHtml(args.endedReason)}` : ""}${args.endedReason && args.callId ? " · " : ""}${args.callId ? `Call ID: ${escapeHtml(args.callId)}` : ""}</p>`
      : "";

  const subject = "Your ConnectCall AI demo — call recap";

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;color:#111827">
    <p style="margin:0 0 12px;font-size:16px;line-height:1.5">Hi ${escapedName},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">Thanks for taking a demo call with ConnectCall AI (CCAI). Below is a recap of what we captured from your conversation.</p>
    ${summaryBlock}
    ${evalBlock}
    ${metaLine}
    <h2 style="margin:24px 0 12px;font-size:17px;line-height:1.3">Structured summary</h2>
    ${formatStructuredDataHtml(args.structuredData)}
    <div style="margin:28px 0;padding:20px;background:linear-gradient(135deg,#f0f9ff 0%,#eef2ff 100%);border-radius:12px;border:1px solid #e0e7ff">
      <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#1e3a5f"><strong>Bring AI calling to your business</strong></p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">CCAI answers and places calls with natural, industry-aware assistants so your team spends less time on the phone and more time closing. Want a tailored walkthrough or pricing?</p>
    </div>
    <p style="margin:24px 0 8px">
      <a href="${escapeHtml(contactUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:8px">Contact us</a>
    </p>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#6b7280">Questions? Reply to this email or visit our contact page.</p>
  </div>
  `.trim();

  const textParts = [
    `Hi ${firstName},`,
    "",
    "Thanks for taking a demo call with ConnectCall AI (CCAI). Below is a recap.",
    "",
    args.summary?.trim() ? `Summary:\n${args.summary.trim()}\n` : "",
    args.successEvaluation ? `Call outcome: ${String(args.successEvaluation).trim()}\n` : "",
    args.endedReason ? `Status: ${args.endedReason}\n` : "",
    args.callId ? `Call ID: ${args.callId}\n` : "",
    "",
    "Structured summary:",
    formatStructuredDataPlain(args.structuredData),
    "",
    "Bring AI calling to your business — CCAI answers and places calls with natural, industry-aware assistants.",
    "",
    `Contact us: ${contactUrl}`,
  ].filter(Boolean);

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: args.to,
      subject,
      html,
      text: textParts.join("\n"),
    });

    if (error) {
      return { ok: false as const, reason: "resend_error" as const };
    }
    return { ok: true as const };
  } catch {
    return { ok: false as const, reason: "resend_throw" as const };
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedWebhook(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: VapiWebhookBody;
  try {
    body = (await request.json()) as VapiWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message;
  if (!message || message.type !== "end-of-call-report") {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  if (!isPostCallCustomerEmailEnabled()) {
    console.info("[vapi-webhook]", {
      outcome: "post_call_email_feature_disabled",
      callId: message.call?.id,
      hint: "Set VAPI_POST_CALL_EMAIL_ENABLED=true when ready.",
    });
    return NextResponse.json({ ok: true, postCallEmail: "disabled" }, { status: 200 });
  }

  const meta = message.call?.metadata ?? {};
  const leadEmailRaw = typeof meta.leadEmail === "string" ? meta.leadEmail.trim().toLowerCase() : "";
  const leadNameRaw = typeof meta.leadName === "string" ? meta.leadName.trim() : "";

  if (!leadEmailRaw || !EMAIL_REGEX.test(leadEmailRaw)) {
    console.info("[vapi-webhook]", {
      outcome: "skip_no_lead_email",
      callId: message.call?.id,
      hint: "Outbound demo calls should pass metadata.leadEmail from /api/demo-call.",
    });
    return NextResponse.json({ ok: true, skipped: "no_lead_email" }, { status: 200 });
  }

  const analysis = message.call?.analysis;
  const structuredData = analysis?.structuredData ?? null;
  const summary = analysis?.summary;
  const successEvaluation = analysis?.successEvaluation;

  const sendResult = await sendPostCallCustomerEmail({
    to: leadEmailRaw,
    leadName: leadNameRaw || "there",
    endedReason: message.endedReason,
    summary,
    successEvaluation,
    structuredData,
    callId: message.call?.id,
  });

  if (!sendResult.ok) {
    console.warn("[vapi-webhook]", {
      outcome: "post_call_email_failed",
      callId: message.call?.id,
      reason: sendResult.reason,
      leadEmail: leadEmailRaw,
    });
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 500 });
  }

  console.info("[vapi-webhook]", {
    outcome: "post_call_email_sent",
    callId: message.call?.id,
    requestId: typeof meta.requestId === "string" ? meta.requestId : undefined,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
