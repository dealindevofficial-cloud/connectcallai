"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Industry } from "@/lib/industries-data";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";

type IndustrySolutionsProps = {
  industry: Industry;
};

function formatStepNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

const solutionMarks = [
  function AnswerMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M7 8.5h10M7 12h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="4.5" y="4.5" width="15" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 15.5 7.5 19.5 12 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  },
  function QualifyMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8.5 12.2 10.8 14.5 15.5 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
  function BookMark() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="5" y="6" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 10h14M9 4.5v3M15 4.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  },
];

export function IndustrySolutions({ industry }: IndustrySolutionsProps) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const lineDuration = reducedMotion ? 0 : isMobile ? 0.85 : 1.15;

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="inline-flex items-center rounded-full border border-[#8ea7ff]/40 bg-[#6f8eff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d6e0ff]">
          AI receptionist workflow
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          How an AI receptionist helps
        </h2>
        <p className="mt-4 text-base leading-relaxed text-blue-100/85">
          Your AI phone agent answers instantly, understands caller intent, books or routes the next
          step, and hands off to humans when the conversation needs your team.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        className="relative mt-12 md:mt-16"
      >
        <div
          aria-hidden
          className="how-timeline-track how-timeline-track--horizontal pointer-events-none absolute top-[4.85rem] right-[16.5%] left-[16.5%] hidden md:block"
        >
          <motion.div
            className="how-timeline-progress how-timeline-progress--horizontal"
            initial={{ scaleX: reducedMotion ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: lineDuration, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
        </div>

        <div
          aria-hidden
          className="how-timeline-track how-timeline-track--vertical pointer-events-none absolute top-4 bottom-4 left-[1.125rem] md:hidden"
        >
          <motion.div
            className="how-timeline-progress how-timeline-progress--vertical"
            initial={{ scaleY: reducedMotion ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: lineDuration, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </div>

        <ol className="relative m-0 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
          {industry.solutions.map((solution, index) => {
            const Mark = solutionMarks[index] ?? solutionMarks[0];
            return (
              <motion.li
                key={solution}
                variants={fadeUp}
                whileHover={reducedMotion || isMobile ? undefined : { y: -4 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative grid grid-cols-[2.25rem_1fr] gap-x-5 md:grid-cols-1 md:gap-0 md:text-center"
              >
                <div className="relative z-10 flex flex-col items-center pt-1 md:pt-0">
                  <span
                    aria-hidden
                    className="hidden select-none text-[3.5rem] font-bold leading-none tracking-tight text-white/[0.08] md:block"
                  >
                    {formatStepNumber(index)}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8ea2ff]/50 bg-[#0f1860] shadow-[0_0_0_4px_rgba(7,11,58,0.92)] md:mt-3">
                    <span className="h-2 w-2 rounded-full bg-[#9daeff]" />
                  </div>
                </div>

                <div className="min-w-0 pt-0.5 md:pt-6">
                  <span
                    aria-hidden
                    className="mb-1 block select-none text-3xl font-bold leading-none tracking-tight text-white/[0.1] md:hidden"
                  >
                    {formatStepNumber(index)}
                  </span>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#b8c6ff] shadow-[0_8px_22px_rgba(5,11,44,0.35)] md:mx-auto">
                    <Mark />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9beff]">
                    Step {formatStepNumber(index)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-100/85 md:text-[0.95rem]">{solution}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </motion.div>
    </section>
  );
}
