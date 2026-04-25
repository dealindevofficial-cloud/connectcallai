"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/landing-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h2 className="text-3xl font-semibold text-white md:text-4xl">Core features</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5f7bff] to-[#9d7dff] text-sm text-white">
              ✦
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-1 text-sm text-blue-100/75">{feature.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
