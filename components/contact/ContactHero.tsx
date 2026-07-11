"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function ContactHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 pb-8 pt-20 md:px-8 md:pb-10 md:pt-28">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-3xl text-center"
      >
        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(138,165,255,0.28),transparent_70%)] blur-2xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        <motion.p variants={fadeUp} className="chip relative mx-auto">
          Contact Connect Call AI
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="relative mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          Let&apos;s build your always-on AI receptionist
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-100/85 md:text-lg"
        >
          Tell us about your goals and our team will help you launch the right AI calling setup for
          your business or book a live consultation below.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="relative mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#contact-form" className="btn-primary inline-flex">
            Send a message
          </a>
          <a href="#book-consultation" className="btn-secondary inline-flex">
            Book a consultation
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
