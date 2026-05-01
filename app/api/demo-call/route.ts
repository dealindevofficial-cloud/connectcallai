import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type DemoCallPayload = {
  name?: string;
  phone?: string;
  email?: string;
  industry?: string;
};

type IndustrySlug = "real-estate" | "restaurants" | "hospitals" | "pet-clinics";

type ValidationErrors = Partial<Record<"name" | "phone" | "email" | "industry", string>>;

type QueuedLeadRecord = {
  requestId: string;
  queuedAt: string;
  reason: string;
  ip: string;
  payload: {
    name: string;
    phone: string;
    email: string;
    industry: IndustrySlug;
    assistantId: string;
  };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "connectcallaiofficial@gmail.com";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "ConnectCall AI <onboarding@resend.dev>";
const INDUSTRY_TO_ASSISTANT_ENV: Record<IndustrySlug, string | undefined> = {
  "real-estate": process.env.VAPI_ASSISTANT_REAL_ESTATE_ID,
  restaurants: process.env.VAPI_ASSISTANT_RESTAURANTS_ID,
  hospitals: process.env.VAPI_ASSISTANT_HOSPITALS_ID,
  "pet-clinics": process.env.VAPI_ASSISTANT_PET_CLINICS_ID,
};

const vapiApiKey = process.env.VAPI_API_KEY;
const vapiApiBaseUrl = (process.env.VAPI_API_BASE_URL ?? "https://api.vapi.ai").replace(/\/+$/, "");
const vapiPhoneNumberId = process.env.VAPI_OUTBOUND_PHONE_NUMBER_ID;
const requestTimeoutMs = getRequestTimeout();

const RATE_WINDOW_MS = getRateWindowMs();
const RATE_MAX_REQUESTS = getRateMaxRequests();
const RATE_MAX_TRACKED_PEOPLE = getRateMaxTrackedPeople();
const personRequestHistory = new Map<string, number[]>();

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getRequestTimeout() {
  const raw = Number.parseInt(process.env.VAPI_REQUEST_TIMEOUT_MS ?? "12000", 10);
  if (!Number.isFinite(raw) || raw < 1000) return 12000;
  return raw;
}

function getRateWindowMs() {
  const raw = Number.parseInt(process.env.DEMO_CALL_RATE_WINDOW_MS ?? "60000", 10);
  if (!Number.isFinite(raw) || raw < 10_000) return 60_000;
  return raw;
}

function getRateMaxRequests() {
  const raw = Number.parseInt(process.env.DEMO_CALL_RATE_MAX_REQUESTS ?? "3", 10);
  if (!Number.isFinite(raw) || raw < 1) return 3;
  return raw;
}

function getRateMaxTrackedPeople() {
  const raw = Number.parseInt(process.env.DEMO_CALL_RATE_MAX_TRACKED_PEOPLE ?? "2000", 10);
  if (!Number.isFinite(raw) || raw < 100) return 2000;
  return raw;
}

function normalizeName(value: string | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function normalizeIndustry(value: string | undefined): IndustrySlug | "" {
  const normalized = (value ?? "").trim().toLowerCase();
  if (
    normalized === "real-estate" ||
    normalized === "restaurants" ||
    normalized === "hospitals" ||
    normalized === "pet-clinics"
  ) {
    return normalized;
  }
  return "";
}

function normalizePhone(value: string | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const compact = raw.replace(/[^\d+]/g, "");
  const digitsOnly = compact.replace(/[^\d]/g, "");

  if (compact.startsWith("+")) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  return digitsOnly ? `+${digitsOnly}` : "";
}

function validatePayload(body: DemoCallPayload) {
  const name = normalizeName(body.name);
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const industry = normalizeIndustry(body.industry);
  const errors: ValidationErrors = {};

  if (!name || name.length < 2) {
    errors.name = "Please provide your full name.";
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
    errors.phone = "Please enter a valid phone number with country code.";
  }

  if (!industry) {
    errors.industry = "Please select your industry.";
  }

  return {
    normalized: { name, email, phone, industry },
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function getPersonRateLimitKey(args: { phone: string; email: string }) {
  return `${args.phone}|${args.email}`;
}

function isRateLimited(personKey: string) {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;
  pruneRateLimitMap(windowStart);
  const records = personRequestHistory.get(personKey) ?? [];
  const recent = records.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= RATE_MAX_REQUESTS) {
    personRequestHistory.set(personKey, recent);
    return true;
  }

  recent.push(now);
  personRequestHistory.set(personKey, recent);
  return false;
}

function pruneRateLimitMap(windowStart: number) {
  for (const [trackedPerson, timestamps] of personRequestHistory.entries()) {
    const recent = timestamps.filter((timestamp) => timestamp > windowStart);
    if (recent.length === 0) {
      personRequestHistory.delete(trackedPerson);
      continue;
    }
    personRequestHistory.set(trackedPerson, recent);
  }

  if (personRequestHistory.size <= RATE_MAX_TRACKED_PEOPLE) return;

  const sortedEntries = [...personRequestHistory.entries()].sort(
    (a, b) => (a[1][a[1].length - 1] ?? 0) - (b[1][b[1].length - 1] ?? 0),
  );
  const itemsToDelete = personRequestHistory.size - RATE_MAX_TRACKED_PEOPLE;
  for (let index = 0; index < itemsToDelete; index += 1) {
    const entry = sortedEntries[index];
    if (entry) {
      personRequestHistory.delete(entry[0]);
    }
  }
}

async function enqueueFallbackLead(record: QueuedLeadRecord) {
  const queueDirectory = path.join(process.cwd(), ".data");
  const queueFile = path.join(queueDirectory, "demo-call-queue.jsonl");
  await mkdir(queueDirectory, { recursive: true });
  await appendFile(queueFile, `${JSON.stringify(record)}\n`, "utf8");
}

async function createOutboundCall(args: {
  assistantId: string;
  phone: string;
  requestId: string;
  name: string;
  email: string;
  industry: IndustrySlug;
}) {
  if (!vapiApiKey || !vapiPhoneNumberId) {
    return {
      ok: false as const,
      statusCode: 500,
      message: "Vapi outbound calling is not configured.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${vapiApiBaseUrl}/call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: args.assistantId,
        phoneNumberId: vapiPhoneNumberId,
        customer: { number: args.phone },
        metadata: {
          requestId: args.requestId,
          leadName: args.name,
          leadEmail: args.email,
          industry: args.industry,
        },
      }),
      signal: controller.signal,
    });

    const responseText = await response.text();
    let parsed: unknown = null;
    try {
      parsed = responseText ? (JSON.parse(responseText) as unknown) : null;
    } catch {
      parsed = responseText || null;
    }

    if (!response.ok) {
      return {
        ok: false as const,
        statusCode: response.status,
        message: "Vapi rejected outbound call request.",
        raw: parsed,
      };
    }

    return {
      ok: true as const,
      statusCode: response.status,
      data: parsed,
    };
  } catch (error) {
    return {
      ok: false as const,
      statusCode: 504,
      message: error instanceof Error ? error.message : "Unknown provider error.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function sendDemoCallSubmissionEmail(args: {
  requestId: string;
  submittedAt: string;
  ip: string;
  name: string;
  phone: string;
  email: string;
  industry: IndustrySlug;
}) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false as const };
  }

  const escapedName = escapeHtml(args.name);
  const escapedEmail = escapeHtml(args.email);
  const escapedPhone = escapeHtml(args.phone);
  const escapedIndustry = escapeHtml(args.industry);
  const escapedIp = escapeHtml(args.ip);
  const escapedRequestId = escapeHtml(args.requestId);
  const escapedSubmittedAt = escapeHtml(args.submittedAt);

  const subject = "New Demo Call Form Submission";
  const html = `
    <h2>New demo call form submission</h2>
    <p><strong>Name:</strong> ${escapedName}</p>
    <p><strong>Email:</strong> ${escapedEmail}</p>
    <p><strong>Phone:</strong> ${escapedPhone}</p>
    <p><strong>Industry:</strong> ${escapedIndustry}</p>
    <p><strong>Request ID:</strong> ${escapedRequestId}</p>
    <p><strong>IP:</strong> ${escapedIp}</p>
    <p><strong>Submitted at:</strong> ${escapedSubmittedAt}</p>
  `;

  const text = [
    "New demo call form submission",
    `Name: ${args.name}`,
    `Email: ${args.email}`,
    `Phone: ${args.phone}`,
    `Industry: ${args.industry}`,
    `Request ID: ${args.requestId}`,
    `IP: ${args.ip}`,
    `Submitted at: ${args.submittedAt}`,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: args.email,
      subject,
      html,
      text,
    });

    if (error) {
      return { ok: false as const };
    }

    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const ip = getClientIp(request);
  const startedAt = new Date().toISOString();

  let payload: DemoCallPayload;
  try {
    payload = (await request.json()) as DemoCallPayload;
  } catch {
    return NextResponse.json(
      {
        status: "validation_error",
        requestId,
        errors: {
          name: "Invalid request payload.",
        },
      },
      { status: 400 },
    );
  }

  const validation = validatePayload(payload);
  if (!validation.isValid || !validation.normalized.industry) {
    console.info("[demo-call]", {
      requestId,
      ip,
      outcome: "validation_error",
      fields: Object.keys(validation.errors),
    });
    return NextResponse.json(
      {
        status: "validation_error",
        requestId,
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const personRateLimitKey = getPersonRateLimitKey({
    phone: validation.normalized.phone,
    email: validation.normalized.email,
  });
  if (isRateLimited(personRateLimitKey)) {
    console.info("[demo-call]", {
      requestId,
      ip,
      outcome: "rate_limited",
      personKey: personRateLimitKey,
    });
    return NextResponse.json(
      {
        status: "validation_error",
        requestId,
        errors: {
          phone: "You have reached the demo call limit (3 requests). Please try again later.",
        },
        retryAfterSeconds: Math.ceil(RATE_WINDOW_MS / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)),
        },
      },
    );
  }

  const industry = validation.normalized.industry;
  const emailResult = await sendDemoCallSubmissionEmail({
    requestId,
    submittedAt: startedAt,
    ip,
    name: validation.normalized.name,
    phone: validation.normalized.phone,
    email: validation.normalized.email,
    industry,
  });

  if (!emailResult.ok) {
    console.warn("[demo-call]", {
      requestId,
      ip,
      industry,
      outcome: "email_notification_failed",
      reason: "demo_email_failed",
    });
  }

  const assistantId = INDUSTRY_TO_ASSISTANT_ENV[industry];
  if (!assistantId) {
    console.error("[demo-call]", {
      requestId,
      ip,
      industry,
      outcome: "provider_error",
      reason: "assistant_not_configured",
    });
    return NextResponse.json(
      {
        status: "provider_error",
        requestId,
        message: "This industry assistant is not configured yet.",
      },
      { status: 500 },
    );
  }

  const callResult = await createOutboundCall({
    assistantId,
    phone: validation.normalized.phone,
    requestId,
    name: validation.normalized.name,
    email: validation.normalized.email,
    industry,
  });

  if (callResult.ok) {
    console.info("[demo-call]", {
      requestId,
      ip,
      industry,
      outcome: "called_now",
      providerStatusCode: callResult.statusCode,
    });
    return NextResponse.json(
      {
        status: "called_now",
        requestId,
        submittedAt: startedAt,
      },
      { status: 200 },
    );
  }

  const queuedLead: QueuedLeadRecord = {
    requestId,
    queuedAt: new Date().toISOString(),
    reason: callResult.message,
    ip,
    payload: {
      name: validation.normalized.name,
      phone: validation.normalized.phone,
      email: validation.normalized.email,
      industry,
      assistantId,
    },
  };

  try {
    await enqueueFallbackLead(queuedLead);
    console.warn("[demo-call]", {
      requestId,
      ip,
      industry,
      outcome: "queued_fallback",
      providerStatusCode: callResult.statusCode,
    });
    return NextResponse.json(
      {
        status: "queued_fallback",
        requestId,
        submittedAt: startedAt,
      },
      { status: 202 },
    );
  } catch {
    console.error("[demo-call]", {
      requestId,
      ip,
      industry,
      outcome: "provider_error",
      reason: "queue_persist_failed",
    });
    return NextResponse.json(
      {
        status: "provider_error",
        requestId,
        message: "We could not process your call request right now.",
      },
      { status: 502 },
    );
  }
}
