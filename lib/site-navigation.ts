import { getIndustryPath, industries } from "@/lib/industries-data";

export const serviceLinks = [
  {
    label: "AI Receptionist",
    href: "/services#ai-receptionist",
    description: "Answer every inbound call with a natural voice agent that books, qualifies, and routes.",
  },
  {
    label: "AI Phone Answering Service",
    href: "/services#ai-phone-answering-service",
    description: "Cover overflow, after-hours, and routine customer calls without adding front-desk headcount.",
  },
  {
    label: "AI Appointment Booking",
    href: "/services#ai-appointment-booking",
    description: "Collect caller details, match availability, and turn phone interest into scheduled appointments.",
  },
  {
    label: "AI Lead Qualification",
    href: "/services#ai-lead-qualification",
    description: "Ask the right intake questions before routing high-intent leads to your team.",
  },
  {
    label: "After-Hours AI Answering",
    href: "/services#after-hours-ai-answering",
    description: "Capture urgent requests, bookings, and lead details when your office is closed.",
  },
  {
    label: "AI Call Center Automation",
    href: "/services#ai-call-center-automation",
    description: "Automate repetitive call center workflows while preserving escalation paths.",
  },
  {
    label: "Custom AI Voice Agents",
    href: "/services#custom-ai-voice-agents",
    description: "Build voice agents around your scripts, integrations, compliance needs, and routing rules.",
  },
  {
    label: "AI Outbound Calling",
    href: "/services#ai-outbound-calling",
    description: "Run reminders, follow-ups, confirmations, and reactivation calls with approved workflows.",
  },
] as const;

export const industryNavLinks = industries.map((industry) => ({
  label: industry.name,
  href: getIndustryPath(industry),
}));

export const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Trust center", href: "/trust-center" },
] as const;

export const legalLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
] as const;
