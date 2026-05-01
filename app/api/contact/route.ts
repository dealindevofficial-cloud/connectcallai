import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "connectcallaiofficial@gmail.com";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "ConnectCall AI <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Contact form is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  const subject = `New Contact Form Submission from ${name}`;
  const submittedAt = new Date().toISOString();
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapedName}</p>
    <p><strong>Email:</strong> ${escapedEmail}</p>
    <p><strong>Submitted at:</strong> ${submittedAt}</p>
    <p><strong>Message:</strong></p>
    <p>${escapedMessage}</p>
  `;

  const text = [
    "New contact form submission",
    `Name: ${name}`,
    `Email: ${email}`,
    `Submitted at: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
    }

    return NextResponse.json(
      {
        ok: true,
        submittedAt,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
  }
}
