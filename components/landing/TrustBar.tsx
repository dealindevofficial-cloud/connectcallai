"use client";

import { motion } from "framer-motion";
import { trustLogos } from "@/lib/landing-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function TrustBar() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        {trustLogos.map((logo) => (
          <motion.div
            key={logo}
            variants={fadeUp}
            className="rounded-2xl border border-white/15 bg-white/6 px-4 py-3 text-center text-sm text-blue-100/90"
          >
            {logo}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
