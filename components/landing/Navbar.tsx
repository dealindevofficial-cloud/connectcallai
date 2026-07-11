"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/public/logo.png";
import { trackConversionEvent } from "@/lib/analytics/conversions";
import { industryNavLinks, legalLinks, resourceLinks, serviceLinks } from "@/lib/site-navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<
    "services" | "industries" | "resources" | null
  >(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);
  const [mobileMenuTop, setMobileMenuTop] = useState(0);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!desktopNavRef.current) return;
      if (!desktopNavRef.current.contains(event.target as Node)) {
        setActiveDesktopMenu(null);
      }
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || !headerBarRef.current) {
      return;
    }

    const updateMobileMenuTop = () => {
      setMobileMenuTop(headerBarRef.current?.getBoundingClientRect().bottom ?? 0);
    };

    updateMobileMenuTop();
    window.addEventListener("resize", updateMobileMenuTop);
    return () => window.removeEventListener("resize", updateMobileMenuTop);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => {
      const nextOpen = !open;
      if (nextOpen && headerBarRef.current) {
        setMobileMenuTop(headerBarRef.current.getBoundingClientRect().bottom);
      }
      return nextOpen;
    });
  };

  const onNavLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    setActiveDesktopMenu(null);

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

  const toggleDesktopMenu = (menu: NonNullable<typeof activeDesktopMenu>) => {
    setActiveDesktopMenu((current) => (current === menu ? null : menu));
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
    <>
      {isMobileMenuOpen ? (
        <div
          className="md:hidden"
          style={{ height: mobileMenuTop > 0 ? mobileMenuTop : "4.5rem" }}
          aria-hidden
        />
      ) : null}
      <header
        className={`z-40 border-b border-white/10 bg-[#0b1054]/70 backdrop-blur-xl ${
          isMobileMenuOpen ? "fixed inset-x-0 top-0" : "sticky top-0"
        }`}
      >
      <div
        ref={headerBarRef}
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8"
      >
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

        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-5 text-sm text-blue-100/80 md:flex lg:gap-7"
          aria-label="Primary navigation"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDesktopMenu("services")}
              className="inline-flex items-center gap-2 transition hover:text-white"
              aria-expanded={activeDesktopMenu === "services"}
            >
              Services
              <span className={`text-[10px] transition-transform ${activeDesktopMenu === "services" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {activeDesktopMenu === "services" ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+10px)] z-30 w-72 overflow-hidden rounded-2xl border border-[#9fb3ff]/35 bg-[#121d74]/95 shadow-[0_16px_42px_rgba(4,10,40,0.52)] backdrop-blur-md"
                >
                  <Link
                    href="/services"
                    onClick={(event) => onNavLinkClick(event, "/services")}
                    className="block border-b border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d7e1ff] hover:text-[#12216f]"
                  >
                    All services
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(event) => onNavLinkClick(event, link.href)}
                      className="block px-4 py-2.5 text-sm text-blue-100 transition hover:bg-[#d7e1ff] hover:text-[#12216f]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDesktopMenu("industries")}
              className="inline-flex items-center gap-2 transition hover:text-white"
              aria-expanded={activeDesktopMenu === "industries"}
            >
              Industries
              <span className={`text-[10px] transition-transform ${activeDesktopMenu === "industries" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {activeDesktopMenu === "industries" ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+10px)] z-30 w-64 overflow-hidden rounded-2xl border border-[#9fb3ff]/35 bg-[#121d74]/95 shadow-[0_16px_42px_rgba(4,10,40,0.52)] backdrop-blur-md"
                >
                  <Link
                    href="/industries"
                    onClick={(event) => onNavLinkClick(event, "/industries")}
                    className="block border-b border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d7e1ff] hover:text-[#12216f]"
                  >
                    All industries
                  </Link>
                  {industryNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(event) => onNavLinkClick(event, link.href)}
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
            href="/price-estimator"
            onClick={(event) => onNavLinkClick(event, "/price-estimator")}
            className="transition hover:text-white"
          >
            Price estimator
          </Link>
          <Link
            href="/contact-us"
            onClick={(event) => onNavLinkClick(event, "/contact-us")}
            className="transition hover:text-white"
          >
            Contact
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDesktopMenu("resources")}
              className="inline-flex items-center gap-2 transition hover:text-white"
              aria-expanded={activeDesktopMenu === "resources"}
            >
              Resources
              <span className={`text-[10px] transition-transform ${activeDesktopMenu === "resources" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {activeDesktopMenu === "resources" ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+10px)] z-30 w-56 overflow-hidden rounded-2xl border border-[#9fb3ff]/35 bg-[#121d74]/95 shadow-[0_16px_42px_rgba(4,10,40,0.52)] backdrop-blur-md"
                >
                  {[...resourceLinks, ...legalLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(event) => onNavLinkClick(event, link.href)}
                      className="block px-4 py-2.5 text-sm text-blue-100 transition hover:bg-[#d7e1ff] hover:text-[#12216f]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
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
              onClick={() =>
                trackConversionEvent("cta_click", {
                  source: "desktop_nav",
                  destination: "/contact-us",
                  label: "Book a demo",
                })
              }
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
            style={{
              top: mobileMenuTop > 0 ? mobileMenuTop : undefined,
              maxHeight:
                mobileMenuTop > 0
                  ? `calc(100dvh - ${mobileMenuTop}px)`
                  : "calc(100dvh - 4.5rem)",
            }}
            className="fixed inset-x-0 top-[4.5rem] z-50 overflow-y-auto overscroll-contain border-t border-white/10 bg-[#0b1054] px-5 pt-4 shadow-[0_24px_70px_rgba(3,7,35,0.55)] [-webkit-overflow-scrolling:touch] md:hidden"
          >
            <nav className="mx-auto flex w-full max-w-6xl flex-col gap-2 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
              <div className="px-3 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/55">
                Services
              </div>
              <Link
                href="/services"
                onClick={(event) => onNavLinkClick(event, "/services")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                All services
              </Link>
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => onNavLinkClick(event, link.href)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/55">
                Industries
              </div>
              <Link
                href="/industries"
                onClick={(event) => onNavLinkClick(event, "/industries")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                All industries
              </Link>
              {industryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => onNavLinkClick(event, link.href)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/55">
                Contact and pricing
              </div>
              <Link
                href="/price-estimator"
                onClick={(event) => onNavLinkClick(event, "/price-estimator")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                Price estimator
              </Link>
              <Link
                href="/contact-us"
                onClick={(event) => onNavLinkClick(event, "/contact-us")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-100/90 transition hover:bg-white/10 hover:text-white"
              >
                Contact
              </Link>
              <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/55">
                Resources
              </div>
              {[...resourceLinks, ...legalLinks].map((link) => (
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
                href="/contact-us"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackConversionEvent("cta_click", {
                    source: "mobile_nav",
                    destination: "/contact-us",
                    label: "Book a demo",
                  });
                }}
                className="mt-1 rounded-full border border-[#8ca0ff]/50 bg-gradient-to-r from-[#556fff] to-[#8a6dff] px-4 py-2 text-center text-sm font-medium text-white shadow-[0_0_28px_rgba(108,126,255,0.45)]"
              >
                Book a demo
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
    </>
  );
}
