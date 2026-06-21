import type { Metadata } from "next";
import { TrustContentPage } from "@/components/trust/TrustContentPage";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.trust,
  description: pageDescriptions.trust,
  alternates: {
    canonical: "/trust-center",
  },
};

const sections = [
  {
    title: "Clear Caller Experiences",
    body: "AI voice agents should be transparent, helpful, and easy to escalate. We help businesses define caller disclosures, fallback paths, and handoff rules so customers know what to expect and can reach a person when needed.",
  },
  {
    title: "Human Escalation Rules",
    body: [
      "Urgent, sensitive, or out-of-scope requests should route to a human or approved fallback channel.",
      "Healthcare, dental, legal, financial, and emergency-adjacent workflows should define what the AI must not handle before launch.",
      "Businesses should review transcripts, outcomes, and edge cases after launch to keep routing accurate.",
    ],
  },
  {
    title: "Data Handling Practices",
    body: "We design call workflows to collect only the information needed for the business outcome, such as booking an appointment, qualifying a lead, or routing a support request. Sensitive fields should be scoped carefully and reviewed before production use.",
  },
  {
    title: "Integrations And Access",
    body: "Many deployments connect to calendars, CRMs, phone providers, forms, or webhooks. We recommend least-privilege access, documented handoff logic, and testing each integration before live caller traffic is routed through an AI agent.",
  },
  {
    title: "Measurement And Improvement",
    body: "Trust is operational as well as technical. We encourage teams to track call outcomes, form submissions, booking rates, escalation volume, and caller feedback so the AI agent improves against real business goals.",
  },
  {
    title: "Compliance Review",
    body: "Connect Call AI provides implementation guidance, but each business is responsible for its own legal, regulatory, and industry compliance review. We can help prepare the call-flow documentation your team needs for that review.",
  },
];

export default function TrustCenterPage() {
  return (
    <TrustContentPage
      eyebrow="Trust Center"
      title="Responsible AI Voice Automation"
      intro="Use this page as a starting point for how Connect Call AI thinks about disclosure, escalation, data handling, integrations, and operational trust."
      sections={sections}
      ctaTitle="Review your trust requirements"
      ctaBody="Schedule a demo and we will walk through your caller intents, sensitive workflows, escalation paths, and integration boundaries."
      secondaryCtaHref="/privacy-policy"
      secondaryCtaLabel="Read Privacy Policy"
    />
  );
}
