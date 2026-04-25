"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/landing-data";

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <section id="testimonials" className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8">
      <h2 className="text-3xl font-semibold text-white md:text-4xl">What customers say</h2>
      <div className="mt-8 rounded-2xl border border-white/12 bg-white/6 p-7">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xl leading-8 text-blue-50">
              &ldquo;{current.quote}&rdquo;
            </p>
            <footer className="mt-6">
              <p className="font-medium text-white">{current.name}</p>
              <p className="text-sm text-blue-100/70">{current.role}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}
