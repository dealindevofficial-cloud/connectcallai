"use client";

import { motion } from "framer-motion";
import { steps } from "@/lib/landing-data";
import { cardHover, fadeUp, staggerContainer } from "@/lib/motion";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <h2 className="text-3xl font-semibold text-white md:text-4xl">How it works</h2>
      <p className="mt-4 max-w-2xl text-blue-100/80">
        Start with ready-made AI agents, connect your phone number, and go live quickly.
      </p>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-10 grid gap-5 md:grid-cols-3"
      >
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            variants={fadeUp}
            whileHover={cardHover.whileHover}
            className="glass-card relative rounded-2xl p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#8ea2ff]/45 bg-[#16207a] text-sm font-semibold text-white">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/80">{step.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
