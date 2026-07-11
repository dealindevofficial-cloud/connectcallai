import Link from "next/link";
import { industryNavLinks, legalLinks, resourceLinks, serviceLinks } from "@/lib/site-navigation";

const companyLinks = [
  ...resourceLinks,
  { label: "Pricing estimator", href: "/price-estimator" },
  { label: "Contact", href: "/contact-us" },
] as const;

export function Footer() {
  return (
    <footer className="footer-shell relative z-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9fb3ff]/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
          <div className="max-w-sm shrink-0">
            <Link href="/" className="footer-title text-2xl font-semibold uppercase">
              Connect Call AI
            </Link>
            <p className="footer-subline mt-3 text-sm leading-relaxed">
              AI voice agents that answer, qualify, book, and route calls when your team is busy or
              offline.
            </p>
            <Link href="/contact-us" className="btn-primary mt-6 text-sm">
              Book a Free Demo
            </Link>
          </div>

          <nav
            className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            aria-label="Footer navigation"
          >
            <div className="sm:col-span-2">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="footer-detail text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Services
                </h2>
                <Link
                  href="/services"
                  className="text-[11px] font-medium text-[#9fb3ff] transition hover:text-white"
                >
                  View all
                </Link>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link text-[13px] leading-snug">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="footer-detail text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Industries
                </h2>
                <Link
                  href="/industries"
                  className="text-[11px] font-medium text-[#9fb3ff] transition hover:text-white"
                >
                  View all
                </Link>
              </div>
              <ul className="mt-4 space-y-2">
                {industryNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link text-[13px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="footer-detail text-[11px] font-semibold uppercase tracking-[0.22em]">
                Company
              </h2>
              <ul className="mt-4 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link text-[13px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="footer-detail mt-7 text-[11px] font-semibold uppercase tracking-[0.22em]">
                Legal
              </h2>
              <ul className="mt-4 space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link text-[13px]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-blue-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Connect Call AI. All rights reserved.</p>
          <a
            href="https://dealindev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
            aria-label="Visit Deal in Dev website"
          >
            Crafted with AI Voice by Deal in Dev
          </a>
        </div>
      </div>
    </footer>
  );
}
