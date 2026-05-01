 "use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "@/lib/landing-data";

export function Faqs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      id="faqs"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="mb-8 space-y-3 text-center md:mb-10">
        <h2 className="text-center text-4xl font-bold text-white md:text-5xl">FAQs</h2>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-blue-100/75 md:text-base">
          Explore the most common questions teams ask before launching an AI receptionist for
          booking, support, and lead qualification.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-6 md:p-8">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <article
                key={faq.question}
                className="rounded-2xl border border-white/12 bg-[#0e145d]/60 px-5 py-4 backdrop-blur-sm transition-colors hover:border-[#93a6ff]/45"
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
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-6 text-blue-100/80 md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
