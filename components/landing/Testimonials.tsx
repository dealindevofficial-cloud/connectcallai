"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/lib/landing-data";
import { fadeUp } from "@/lib/motion";

const ROTATE_MS = 5000;

export function Testimonials() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = (next: number) => {
    const length = testimonials.length;
    setIndex(((next % length) + length) % length);
    setProgressKey((key) => key + 1);
  };

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
      setProgressKey((key) => key + 1);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [reducedMotion, progressKey]);

  const current = testimonials[index] ?? testimonials[0];

  return (
    <section
      id="testimonials"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-4xl font-bold text-white md:text-5xl">What customers say?</h2>
        <p className="mt-4 text-blue-100/80">
          Real teams share how Connect Call AI improved response times, bookings, and customer
          experience.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto mt-10 max-w-3xl md:mt-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4e66ff]/12 blur-3xl md:h-80 md:w-80"
        />

        <div className="relative text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.name}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
            >
              <p className="text-2xl leading-snug font-medium tracking-tight text-white md:text-3xl md:leading-snug lg:text-[2.15rem] lg:leading-snug">
                &ldquo;{current.quote}&rdquo;
              </p>
              <footer className="mt-8">
                <p className="text-base font-semibold text-white">{current.name}</p>
                <p className="mt-1 text-sm text-blue-100/70">{current.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div
          className="testimonial-progress mx-auto mt-8"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={reducedMotion ? Math.round(((index + 1) / testimonials.length) * 100) : undefined}
          aria-label="Time until next testimonial"
        >
          {reducedMotion ? (
            <div
              className="testimonial-progress-fill testimonial-progress-fill--static"
              style={{ transform: `scaleX(${(index + 1) / testimonials.length})` }}
            />
          ) : (
            <div key={progressKey} className="testimonial-progress-fill" />
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#c8d6ff] transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft />
          </button>

          <div
            role="tablist"
            aria-label="Customer testimonials"
            className="flex items-center gap-3"
          >
            {testimonials.map((item, itemIndex) => {
              const isActive = itemIndex === index;

              return (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  id={`testimonial-tab-${itemIndex}`}
                  aria-selected={isActive}
                  aria-label={`Show testimonial from ${item.name}`}
                  onClick={() => goTo(itemIndex)}
                  className={`relative rounded-full transition ${
                    isActive
                      ? "scale-110 ring-2 ring-[#93a6ff]/80 ring-offset-2 ring-offset-[#070b3a]"
                      : "opacity-55 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full border border-white/20 object-cover"
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#c8d6ff] transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
