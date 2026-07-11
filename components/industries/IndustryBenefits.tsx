"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Industry } from "@/lib/industries-data";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";

type IndustryBenefitsProps = {
  industry: Industry;
};

const benefitIcons: Array<() => ReactNode> = [
  function CaptureMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3.5 5.5 13h4.2v7.5h4.6V13h4.2L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
  function SpeedMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M13 4.5 7 13.5h4.5L11 19.5 17 10.5h-4.5L13 4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
  function ExperienceMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M8 10v4M11 7.5v9M14 9v6M17 11v2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  },
  function ConsistencyMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 8.2v4.1l2.8 1.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
];

export function IndustryBenefits({ industry }: IndustryBenefitsProps) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const enableHover = !reducedMotion && !isMobile;

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Why {industry.name} teams choose AI phone answering
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {industry.benefits.map((benefit, index) => {
          const Icon = benefitIcons[index] ?? benefitIcons[0];
          return (
            <motion.article
              key={benefit}
              variants={fadeUp}
              whileHover={enableHover ? { y: -3, transition: { duration: 0.22, ease: "easeOut" } } : undefined}
              className="group relative overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/65 p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#93a6ff]/55 hover:shadow-[0_0_24px_rgba(114,136,255,0.2)] md:p-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#7d8eff]/20 to-transparent blur-xl"
              />
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/18 bg-white/8 text-[#b8c6ff]">
                <Icon />
              </span>
              <p className="relative mt-4 text-sm leading-relaxed text-blue-50/95 md:text-[0.95rem]">
                {benefit}
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
