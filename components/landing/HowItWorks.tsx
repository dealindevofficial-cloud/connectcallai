"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { steps } from "@/lib/landing-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

const stepImages = [
  { src: "/how-it-works/pick-agent.svg", alt: "AI agent setup illustration" },
  { src: "/how-it-works/connect-number.svg", alt: "Phone number connection illustration" },
  { src: "/how-it-works/start-calls.svg", alt: "Live calls activation illustration" },
] as const;

function formatStepNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function HowItWorks() {
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
    <section
      id="how-it-works"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-4xl font-bold text-white md:text-5xl">How it works</h2>
        <p className="mt-4 text-blue-100/80">
          Start with ready-made AI agents, connect your phone number, and go live quickly.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-12 md:mt-16"
      >
        {/* Desktop: horizontal connector through step markers */}
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

        {/* Mobile: vertical connector through step markers */}
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
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
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
                <div className="mb-4 inline-flex rounded-xl border border-white/15 bg-white/10 p-2 shadow-[0_8px_22px_rgba(5,11,44,0.35)] md:mx-auto">
                  <Image
                    src={stepImages[index]?.src ?? "/how-it-works/pick-agent.svg"}
                    alt={stepImages[index]?.alt ?? "How it works step image"}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-blue-100/80">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
