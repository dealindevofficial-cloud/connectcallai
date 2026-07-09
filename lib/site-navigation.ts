import { getIndustryPath, industries } from "@/lib/industries-data";
import { getServiceLinks } from "@/lib/services-data";

export const serviceLinks = getServiceLinks();

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
