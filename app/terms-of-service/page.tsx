import type { Metadata } from "next";
import { TrustContentPage } from "@/components/trust/TrustContentPage";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.terms,
  description: pageDescriptions.terms,
  alternates: {
    canonical: "/terms-of-service",
  },
};

const sections = [
  {
    title: "Use Of The Website",
    body: "You may use this website to learn about Connect Call AI, request information, estimate pricing, read content, and book a demo. You agree not to misuse the site, interfere with its operation, attempt unauthorized access, or submit unlawful, harmful, or misleading information.",
  },
  {
    title: "Demo Requests And Consultations",
    body: "Submitting a form or booking a consultation does not create a customer relationship by itself. Any paid services, implementation scope, service levels, pricing, and support obligations should be confirmed in a separate written agreement or proposal.",
  },
  {
    title: "AI Voice Agent Responsibilities",
    body: [
      "Customers are responsible for reviewing scripts, disclosures, business rules, escalation paths, and compliance requirements before deploying AI voice agents.",
      "AI voice agents should not be used for emergencies, diagnosis, legal advice, financial advice, or decisions that require licensed professional judgment unless an appropriate human review process is in place.",
      "Customers should maintain accurate contact, calendar, CRM, and routing information so callers receive reliable responses and handoffs.",
    ],
  },
  {
    title: "Content And Intellectual Property",
    body: "The website, branding, copy, design, graphics, and other content are owned by Connect Call AI or its licensors unless otherwise stated. You may not copy, reproduce, or reuse site content for commercial purposes without permission.",
  },
  {
    title: "Third-Party Services",
    body: "The site and related workflows may link to or embed third-party tools such as analytics, scheduling, phone, CRM, payment, or automation services. Those services are governed by their own terms and policies.",
  },
  {
    title: "No Warranty",
    body: "The website and informational materials are provided as-is and for general informational purposes. We do not guarantee that the site will be uninterrupted, error-free, or suitable for every business or regulatory environment.",
  },
  {
    title: "Limitation Of Liability",
    body: "To the extent allowed by law, Connect Call AI is not liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising from use of the website or reliance on informational content.",
  },
  {
    title: "Changes To These Terms",
    body: "We may update these terms as the website and services evolve. Continued use of the website after updates means you accept the revised terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <TrustContentPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms govern use of the Connect Call AI website, demo request flows, pricing estimator, and public content."
      sections={sections}
      ctaTitle="Need implementation terms?"
      ctaBody="Book a demo to discuss your workflow, compliance expectations, and the right agreement for a production launch."
    />
  );
}
