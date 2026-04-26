"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/landing-data";
import logo from "@/public/logo.png";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);

    if (!href.startsWith("/#")) {
      return;
    }

    const sectionId = href.slice(2);
    if (!sectionId) {
      return;
    }

    if (window.location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const offsetTop = headerHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offsetTop;

    window.history.pushState(null, "", `/#${sectionId}`);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!window.location.hash) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1054]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          onClick={onLogoClick}
          className="inline-flex items-center gap-3 text-base font-semibold tracking-wide text-white"
        >
          <Image
            src={logo}
            alt="CCAI logo"
            className="h-9 w-auto"
            loading="eager"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-blue-100/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => onNavLinkClick(event, link.href)}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-white/35 md:hidden"
          >
            <span className="relative h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 block h-[2px] w-4 rounded bg-current transition-transform duration-200 ${isMobileMenuOpen ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-[2px] w-4 rounded bg-current transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-3 block h-[2px] w-4 rounded bg-current transition-transform duration-200 ${isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block"
          >
            <Link
              href="/#demo"
              className="rounded-full border border-[#8ca0ff]/50 bg-gradient-to-r from-[#556fff] to-[#8a6dff] px-4 py-2 text-sm font-medium text-white shadow-[0_0_28px_rgba(108,126,255,0.45)]"
            >
              Book a demo
            </Link>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-white/10 bg-[#0b1054]/95 px-5 py-4 md:hidden"
          >
            <nav className="mx-auto flex w-full max-w-6xl flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => onNavLinkClick(event, link.href)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 rounded-full border border-[#8ca0ff]/50 bg-gradient-to-r from-[#556fff] to-[#8a6dff] px-4 py-2 text-center text-sm font-medium text-white shadow-[0_0_28px_rgba(108,126,255,0.45)]"
              >
                Book a demo
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
