"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Industry } from "@/lib/industries-data";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";

type IndustryUseCasesProps = {
  industry: Industry;
};

const useCaseIcons: Array<() => ReactNode> = [
  function IntakeMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="5" y="4.5" width="14" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  },
  function QuestionsMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M9.8 9.4a2.4 2.4 0 0 1 4.4 1.2c0 1.4-2.2 1.8-2.2 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
      </svg>
    );
  },
  function BookingMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="5" y="6" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 10h14M9 4.5v3M15 4.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  },
  function AfterHoursMark() {
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
  function HandoffMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M7 12h10M13.5 8.5 17 12l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  },
];

export function IndustryUseCases({ industry }: IndustryUseCasesProps) {
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
  const [featured, ...rest] = industry.useCases;

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="inline-flex items-center rounded-full border border-[#9fb5ff]/35 bg-[#6f8eff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e2ff]">
          Industry use cases
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          AI receptionist use cases for {industry.name}
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-6"
      >
        {featured ? (
          <motion.article
            variants={fadeUp}
            whileHover={enableHover ? { y: -3, transition: { duration: 0.22, ease: "easeOut" } } : undefined}
            className="group relative overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/75 p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#93a6ff]/55 hover:shadow-[0_0_28px_rgba(114,136,255,0.22)] md:col-span-2 md:p-7 lg:col-span-3 lg:row-span-2 lg:flex lg:flex-col lg:justify-between"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#7d8eff]/25 via-[#5a6dff]/10 to-transparent blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/18 bg-white/8 text-[#b8c6ff]">
                {useCaseIcons[0]()}
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#9db0ff]/80">
                Featured workflow
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-blue-50/90">
                {featured.description}
              </p>
            </div>
            <p className="relative mt-8 text-xs font-medium uppercase tracking-[0.18em] text-[#9db0ff]/75 lg:mt-10">
              Built for {industry.name.toLowerCase()} teams
            </p>
          </motion.article>
        ) : null}

        {rest.map((useCase, index) => {
          const Icon = useCaseIcons[index + 1] ?? useCaseIcons[0];
          return (
            <motion.article
              key={useCase.title}
              variants={fadeUp}
              whileHover={enableHover ? { y: -3, transition: { duration: 0.22, ease: "easeOut" } } : undefined}
              className="group relative overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/75 p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#93a6ff]/55 hover:shadow-[0_0_28px_rgba(114,136,255,0.22)] md:p-6 lg:col-span-3"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-[#7d8eff]/20 to-transparent blur-2xl"
              />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/18 bg-white/8 text-[#b8c6ff]">
                  <Icon />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-50/90">{useCase.description}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
