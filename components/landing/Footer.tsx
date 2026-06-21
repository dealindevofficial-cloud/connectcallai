import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Industries", href: "/industries" },
      { label: "Pricing estimator", href: "/price-estimator" },
      { label: "Blogs", href: "/blog" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Trust center", href: "/trust-center" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Popular use cases",
    links: [
      { label: "Real estate AI calling", href: "/industries/real-estate" },
      { label: "Restaurant phone automation", href: "/industries/restaurants" },
      { label: "Hospital call handling", href: "/industries/hospitals" },
      { label: "Pet clinic reception", href: "/industries/pet-clinics" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="footer-shell relative z-10 py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="footer-title text-2xl font-semibold uppercase">
            Connect Call AI
          </Link>
          <p className="footer-subline mt-3 max-w-sm text-sm leading-7">
            Build AI voice agents that answer, qualify, book, and route calls when your team is
            busy or offline.
          </p>
          <Link href="/contact-us" className="btn-primary mt-5">
            Book a Free Demo
          </Link>
        </div>

        <nav className="grid gap-6 sm:grid-cols-3" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="footer-detail text-xs font-semibold uppercase tracking-[0.2em]">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-100/78 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-6 pt-5 text-xs text-blue-100/55 sm:flex-row sm:items-center sm:justify-between">
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
    </footer>
  );
}
