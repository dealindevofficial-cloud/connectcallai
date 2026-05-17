"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type BlogFaqAccordionProps = {
  faqs: FaqItem[];
};

export function BlogFaqAccordion({ faqs }: BlogFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-6 space-y-3">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <article
            key={`${item.question}-${idx}`}
            className={`rounded-2xl border p-4 md:p-5 ${
              isOpen
                ? "border-[#93C5FD] bg-[#EFF6FF]"
                : "border-[#DBEAFE] bg-[#F8FAFF]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-3 text-left text-base font-semibold text-slate-950 md:text-lg"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <motion.span
                aria-hidden
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="shrink-0 rounded-full border border-[#BFDBFE] px-2 py-0.5 text-xs text-[#1E3A8A]"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -4 }}
                    animate={{ y: 0 }}
                    exit={{ y: -4 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="mt-3 text-sm leading-6 text-slate-700 md:text-base"
                  >
                    {item.answer}
                  </motion.p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
