"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/public/logo.png";

const SECTION_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Features", href: "/#features" },
  { label: "Testimonials", href: "/#testimonials" },
] as const;

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [activeSectionLabel, setActiveSectionLabel] = useState("Sections");
  const sectionsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!sectionsDropdownRef.current) return;
      if (!sectionsDropdownRef.current.contains(event.target as Node)) {
        setIsSectionsOpen(false);
      }
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  useEffect(() => {
    const resolveActiveSectionLabel = () => {
      if (window.location.pathname !== "/") {
        setActiveSectionLabel("Sections");
        return;
      }

      const hash = window.location.hash;
      if (!hash) {
        setActiveSectionLabel("Home");
        return;
      }

      const matchingSection = SECTION_LINKS.find((link) => link.href === `/${hash}`);
      setActiveSectionLabel(matchingSection?.label ?? "Sections");
    };

    resolveActiveSectionLabel();
    window.addEventListener("hashchange", resolveActiveSectionLabel);
    window.addEventListener("popstate", resolveActiveSectionLabel);

    return () => {
      window.removeEventListener("hashchange", resolveActiveSectionLabel);
      window.removeEventListener("popstate", resolveActiveSectionLabel);
    };
  }, []);

  const onNavLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    const selected = SECTION_LINKS.find((link) => link.href === href);
    if (selected) {
      setActiveSectionLabel(selected.label);
    }

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

  const onLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
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
          <div ref={sectionsDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsSectionsOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              {activeSectionLabel}
              <span className={`text-[10px] transition-transform ${isSectionsOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {isSectionsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+10px)] z-30 w-48 overflow-hidden rounded-2xl border border-[#9fb3ff]/35 bg-[#121d74]/95 shadow-[0_16px_42px_rgba(4,10,40,0.52)] backdrop-blur-md"
                >
                  {SECTION_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(event) => {
                        onNavLinkClick(event, link.href);
                        setIsSectionsOpen(false);
                      }}
                      className="block px-4 py-2.5 text-sm text-blue-100 transition hover:bg-[#d7e1ff] hover:text-[#12216f]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <Link
            href="/industries"
            onClick={(event) => onNavLinkClick(event, "/industries")}
            className="transition hover:text-white"
          >
            Industries
          </Link>
          <Link
            href="/contact-us"
            onClick={(event) => onNavLinkClick(event, "/contact-us")}
            className="transition hover:text-white"
          >
            Contact us
          </Link>
          <Link
            href="/price-estimator"
            onClick={(event) => onNavLinkClick(event, "/price-estimator")}
            className="transition hover:text-white"
          >
            Price estimator
          </Link>
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
              href="/contact-us"
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
              <div className="px-3 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/55">
                Sections
              </div>
              {SECTION_LINKS.map((link) => (
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
                href="/industries"
                onClick={(event) => onNavLinkClick(event, "/industries")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                Industries
              </Link>
              <Link
                href="/contact-us"
                onClick={(event) => onNavLinkClick(event, "/contact-us")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                Contact us
              </Link>
              <Link
                href="/price-estimator"
                onClick={(event) => onNavLinkClick(event, "/price-estimator")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                Price estimator
              </Link>
              <Link
                href="/contact-us"
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
