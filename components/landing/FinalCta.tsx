"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrackedCtaLink } from "@/components/analytics/TrackedLink";

export function FinalCta() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 md:px-8">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="final-cta-banner relative overflow-hidden rounded-3xl border border-white/15 px-8 py-14 text-center md:px-14 md:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(167,184,255,0.42),transparent_55%),radial-gradient(ellipse_at_75%_80%,rgba(133,93,255,0.28),transparent_50%)]"
        />
        <div aria-hidden className="final-cta-shimmer pointer-events-none absolute inset-0" />

        <div className="relative space-y-6 md:space-y-7">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Ready to upgrade every customer call?
          </h2>
          <p className="mx-auto max-w-xl text-base text-blue-100/85 md:text-lg">
            Move from missed opportunities to always-on conversations that book, confirm, and
            convert.
          </p>
          <TrackedCtaLink
            href="/contact-us"
            eventProperties={{
              source: "final_cta",
              label: "Book my setup",
            }}
            className="btn-primary final-cta-btn inline-flex"
          >
            Book my setup
          </TrackedCtaLink>
        </div>
      </motion.div>
    </section>
  );
}
