"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendlyTracker } from "@/components/analytics/CalendlyTracker";
import { fadeUp, motionViewport } from "@/lib/motion";

type ContactCalendlyProps = {
  calendlyUrl: string;
};

export function ContactCalendly({ calendlyUrl }: ContactCalendlyProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="book-consultation"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={motionViewport}
        transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-[#9fb5ff]/35 bg-[#6f8eff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e2ff]">
            Live consultation
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Book your consultation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100/85">
            Choose a time that works for you. We will review your goals, map your call flow, and
            recommend the best setup.
          </p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="final-cta-banner relative mt-8 overflow-hidden rounded-3xl border border-white/15 p-2 md:mt-10 md:p-3"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(167,184,255,0.28),transparent_50%)]"
          />
          <div aria-hidden className="final-cta-shimmer pointer-events-none absolute inset-0 opacity-60" />

          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0b145f]/75">
            <CalendlyTracker />
            <iframe
              src={calendlyUrl}
              title="Book a consultation with Calendly"
              className="h-[700px] w-full"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
