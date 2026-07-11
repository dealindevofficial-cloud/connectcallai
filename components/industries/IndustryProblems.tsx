"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Industry } from "@/lib/industries-data";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";

type IndustryProblemsProps = {
  industry: Industry;
};

export function IndustryProblems({ industry }: IndustryProblemsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport}
        className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14"
      >
        <div className="relative">
          {!reducedMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,119,148,0.28),transparent_68%)] blur-xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}

          <motion.p
            variants={fadeUp}
            className="inline-flex items-center rounded-full border border-[#ff9cb5]/35 bg-[#ff7a99]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd5df]"
          >
            Missed-call problems
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="relative mt-4 max-w-md text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Phone answering problems in {industry.name}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="relative mt-4 max-w-md text-base leading-relaxed text-blue-100/85"
          >
            These are the gaps buyers expect an AI receptionist to solve: faster pickup, clearer
            intake, smarter routing, and fewer lost opportunities.
          </motion.p>
        </div>

        <div className="relative pl-10 md:pl-14">
          <div
            aria-hidden
            className="how-timeline-track how-timeline-track--vertical pointer-events-none absolute left-[15px] top-3 h-[calc(100%-12px)] md:left-[21px]"
          >
            <motion.div
              className="how-timeline-progress how-timeline-progress--vertical"
              style={{
                background: "linear-gradient(180deg, #ff8fb0, #9cb2ff)",
                boxShadow: "0 0 12px rgba(255, 143, 176, 0.28)",
              }}
              initial={{ scaleY: reducedMotion ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reducedMotion ? 0 : 1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            />
          </div>

          <div className="space-y-8">
            {industry.problems.map((problem, index) => (
              <motion.article
                key={problem}
                variants={fadeUp}
                whileHover={reducedMotion ? undefined : { x: 4 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="absolute -left-10 top-1.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ffb1c1]/45 bg-[#1a0f3a] text-[11px] font-semibold text-white shadow-[0_0_0_4px_rgba(7,11,58,0.92)] md:-left-14 md:h-10 md:w-10 md:text-xs"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd9e3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff93b0]" />
                  Call gap
                </p>
                <p className="mt-2 text-sm leading-relaxed text-blue-50/95 md:text-base">{problem}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
