"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { TrackedCtaLink } from "@/components/analytics/TrackedLink";
import type { Industry } from "@/lib/industries-data";
import { useCases as landingUseCases } from "@/lib/landing-data";
import {
  createFloatLoop,
  createPulseLoop,
  fadeUp,
  getMotionTuning,
  getWaveAnimationConfig,
  staggerContainer,
} from "@/lib/motion";
import { useEffect, useState } from "react";

type IndustryHeroProps = {
  industry: Industry;
};

function IndustryMark({ slug }: { slug: string }) {
  const common = "h-10 w-10 text-[#c5d2ff]";
  switch (slug) {
    case "real-estate":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <path
            d="M4.5 11.5 12 5l7.5 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-4v5H5.5a1 1 0 0 1-1-1v-7.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "restaurants":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <path
            d="M8 4v7M8 11v9M6 4c0 2.2 1 3.5 2 3.5S10 6.2 10 4M16 4v6c0 1.5-1.2 2.5-2.5 2.5H13V20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "hospitals":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <rect x="4.5" y="4.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "dental-offices":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <path
            d="M12 4c3.2 0 5.5 2.2 5.5 5.2 0 2.4-1 4.4-2.2 6.2-.7 1-1.5 2.4-1.8 3.8-.2.8-.7 1.3-1.5 1.3s-1.3-.5-1.5-1.3c-.3-1.4-1.1-2.8-1.8-3.8C7.5 13.6 6.5 11.6 6.5 9.2 6.5 6.2 8.8 4 12 4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pet-clinics":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <circle cx="8" cy="8.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="8.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6.5" cy="13" r="1.4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17.5" cy="13" r="1.4" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="15.5" rx="3.2" ry="2.6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

const waveHeights = [14, 22, 30, 18, 26, 34, 20, 28, 16, 24];

export function IndustryHero({ industry }: IndustryHeroProps) {
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = Boolean(reducedMotionPreference);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const motionTuning = getMotionTuning({ reducedMotion, isMobile });
  const floatLoop = createFloatLoop({ reducedMotion, isMobile });
  const pulseLoop = createPulseLoop({ reducedMotion, isMobile });

  const metric =
    landingUseCases.find((item) => item.name === industry.name)?.metric ?? "24/7 coverage";

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 pb-10 pt-20 md:px-8 md:pb-14 md:pt-28">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="chip mb-5"
          >
            {industry.name}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            {industry.seoTitle}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-blue-100/85 md:text-lg">
            {industry.heroSubtext}
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-6 space-y-3">
            {industry.valueProps.map((prop) => (
              <li key={prop} className="flex items-start gap-3 text-sm text-blue-50/95 md:text-base">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8ea3ff]/45 bg-[#1a2680]/70"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-[#b8c6ff]" fill="none">
                    <path
                      d="M2.5 6.2 4.8 8.5 9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{prop}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#demo" className="btn-primary inline-flex">
              Request a demo call
            </a>
            <TrackedCtaLink
              href="/contact-us"
              eventProperties={{
                source: "industry_hero",
                industry: industry.slug,
                label: "Talk to sales",
              }}
              className="btn-secondary inline-flex"
            >
              Talk to sales
            </TrackedCtaLink>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <motion.div
            animate={floatLoop}
            className="glass-card relative overflow-hidden rounded-3xl p-6 md:p-7"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(138,165,255,0.35),transparent_70%)] blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <IndustryMark slug={industry.slug} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Receptionist</p>
                  <p className="text-xs text-blue-100/70">{industry.name} agent</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                <motion.span
                  animate={pulseLoop}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
                Live
              </div>
            </div>

            <div className="relative mt-8 flex h-16 items-end justify-center gap-1.5">
              {waveHeights.map((height, index) => {
                const wave = getWaveAnimationConfig(height, index, {
                  reducedMotion,
                  isMobile,
                });
                return (
                  <motion.span
                    key={`wave-${index}`}
                    className="wave-bar w-1.5 rounded-full"
                    style={{ height }}
                    animate={wave.animate}
                    transition={wave.transition}
                  />
                );
              })}
            </div>

            <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9db0ff]/80">
                  Outcome
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{metric}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9db0ff]/80">
                  Coverage
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Always-on answering</p>
              </div>
            </div>

            <p className="relative mt-5 text-sm leading-relaxed text-blue-100/75">
              {industry.longDescription}
            </p>

            <div className="relative mt-5">
              <Link
                href="#demo"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c8d6ff] transition-colors hover:text-white"
              >
                Try the live demo
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>

          {!motionTuning.reduced ? (
            <motion.div
              aria-hidden
              animate={pulseLoop}
              className="pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 rounded-full border border-[#93a6ff]/25"
            />
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}
