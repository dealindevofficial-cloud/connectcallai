import type { Metadata } from "next";
import { TrustContentPage } from "@/components/trust/TrustContentPage";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.about,
  description: pageDescriptions.about,
  alternates: {
    canonical: "/about",
  },
};

const sections = [
  {
    title: "What We Build",
    body: "Connect Call AI helps businesses launch custom AI voice agents that answer calls, qualify leads, book appointments, and route urgent conversations to the right people. Our focus is practical phone automation that supports real operations rather than replacing human judgment where it matters.",
  },
  {
    title: "How We Work",
    body: [
      "We start by mapping your current call flow, including common caller intents, escalation paths, calendars, and CRM or webhook needs.",
      "We configure voice agents around approved scripts, business rules, and handoff logic so callers know when they are speaking with automation.",
      "We keep launch plans measurable with demo-call goals, call handling outcomes, and conversion tracking for key forms and CTAs.",
    ],
  },
  {
    title: "Who We Serve",
    body: "Our platform is designed for teams that depend on timely phone conversations: real estate, healthcare practices, restaurants, home services, property management, professional services, and other local or service-based businesses.",
  },
  {
    title: "Responsible Automation",
    body: "AI voice agents should be clear, helpful, and bounded. We encourage disclosure, escalation for sensitive or urgent requests, and careful handling of personal information. For regulated workflows, we help teams define what the AI should handle, what it should avoid, and when a human should take over.",
  },
];

export default function AboutPage() {
  return (
    <TrustContentPage
      eyebrow="Company"
      title="About Connect Call AI"
      intro="We build AI voice agent workflows that help businesses answer faster, qualify better, and keep customer conversations moving around the clock."
      sections={sections}
    />
  );
}
