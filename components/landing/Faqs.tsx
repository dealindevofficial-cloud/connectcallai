"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/lib/landing-data";
import { fadeUp } from "@/lib/motion";

export function Faqs() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      id="faqs"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] md:items-start md:gap-14 lg:gap-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="md:sticky md:top-32"
        >
          <h2 className="text-4xl font-bold text-white md:text-5xl">FAQs</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/75 md:text-base">
            Explore the most common questions teams ask before launching an AI receptionist for
            booking, support, and lead qualification.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <article
                key={faq.question}
                className={`rounded-2xl border bg-[#0e145d]/55 px-5 py-4 backdrop-blur-sm transition-[border-color,background-color] duration-300 ${
                  isOpen
                    ? "border-[#8ea3ff]/70 bg-[#121a6e]/70"
                    : "border-white/12 hover:border-[#93a6ff]/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base font-semibold text-white md:text-lg">
                    {faq.question}
                  </h3>
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition ${
                      isOpen
                        ? "border-[#8ea3ff] bg-[#2a3ba8] text-white"
                        : "border-white/20 text-blue-100/80"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`${faq.question}-answer`}
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-[#8ea3ff]/25 pt-3 text-sm leading-6 text-blue-100/80 md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
