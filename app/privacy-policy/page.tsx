import type { Metadata } from "next";
import { TrustContentPage } from "@/components/trust/TrustContentPage";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

export const metadata: Metadata = {
  title: pageTitles.privacy,
  description: pageDescriptions.privacy,
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "Contact details you submit through forms, including name, email address, phone number, company, website, and details about your business goals.",
      "Scheduling details shared through demo booking tools, including selected meeting time and information you include with the booking.",
      "Website usage data such as pages visited, CTA clicks, referral sources, device information, and analytics events that help us understand site performance.",
      "Call-flow and implementation details you provide during consultations, such as scripts, business hours, escalation rules, and integration requirements.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "To respond to inquiries, schedule demos, prepare recommendations, and communicate about requested services.",
      "To design, configure, support, and improve AI voice agent workflows for customers.",
      "To measure marketing performance, improve website content, and understand which pages and calls to action are useful.",
      "To maintain security, prevent abuse, and comply with legal obligations.",
    ],
  },
  {
    title: "Sharing And Service Providers",
    body: "We may use trusted service providers for hosting, analytics, form delivery, email, scheduling, CRM, phone, payment, and automation workflows. These providers are used to operate the website and deliver requested services. We do not sell personal information.",
  },
  {
    title: "Cookies And Analytics",
    body: "The site may use cookies or similar technologies for analytics, conversion tracking, embedded scheduling, and basic functionality. You can control cookies through your browser settings, though some embedded tools may not work as expected if disabled.",
  },
  {
    title: "Data Retention",
    body: "We keep personal information only as long as reasonably needed for the purposes described here, including responding to inquiries, supporting services, keeping business records, resolving disputes, and meeting legal requirements.",
  },
  {
    title: "Your Choices",
    body: "You may ask us to update, delete, or provide information you have shared with us, subject to legal, security, and operational limits. To make a privacy request, contact us through the contact page.",
  },
  {
    title: "Sensitive And Regulated Information",
    body: "Do not submit emergency, medical, financial, or highly sensitive information through general website forms. For regulated workflows such as healthcare or dental calls, we recommend a scoped implementation review before using AI agents with sensitive caller information.",
  },
  {
    title: "Policy Updates",
    body: "We may update this privacy policy as our website, services, or legal requirements change. The latest version will be posted on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <TrustContentPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains how Connect Call AI collects, uses, and protects information submitted through our website, demo forms, scheduling tools, and service conversations."
      sections={sections}
      ctaTitle="Questions about privacy?"
      ctaBody="Contact us before sharing sensitive call-flow details and we will help scope the right review process."
    />
  );
}
