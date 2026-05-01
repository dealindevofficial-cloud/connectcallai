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
    <section
      id="testimonials"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <h2 className="text-center text-4xl font-bold text-white md:text-5xl">What customers say?</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-blue-100/80">
        Real teams share how ConnectCallAI improved response times, bookings, and customer
        experience.
      </p>
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
            <footer className="mt-6 flex items-center gap-4">
              <img
                src={current.image}
                alt={`${current.name} profile`}
                className="h-12 w-12 rounded-full border border-white/20 object-cover"
              />
              <div>
                <p className="font-medium text-white">{current.name}</p>
                <p className="text-sm text-blue-100/70">{current.role}</p>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}
