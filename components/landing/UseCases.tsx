"use client";

import { motion } from "framer-motion";
import { useCases } from "@/lib/landing-data";
import { cardHover, fadeUp, staggerContainer } from "@/lib/motion";

export function UseCases() {
  return (
    <section id="use-cases" className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h2 className="text-3xl font-semibold text-white md:text-4xl">Use cases</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-5 md:grid-cols-2"
      >
        {useCases.map((item) => (
          <motion.article
            key={item.name}
            variants={fadeUp}
            whileHover={cardHover.whileHover}
            className="group relative rounded-2xl border border-white/14 bg-[#0f155f]/75 p-6"
          >
            <div className="absolute inset-0 rounded-2xl border border-transparent transition group-hover:border-[#93a6ff]/70" />
            <p className="text-sm text-blue-200">{item.name}</p>
            <p className="mt-2 text-lg font-semibold text-white">{item.outcome}</p>
            <p className="mt-4 text-sm text-[#b7c4ff]">{item.metric}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
