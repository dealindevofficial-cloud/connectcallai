"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="demo"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <div className="grid gap-8 rounded-3xl border border-white/14 bg-[#0f155f]/70 p-8 md:grid-cols-2">
        <div>
          <p className="chip">Request a personalized walkthrough</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            See your first AI receptionist in action.
          </h2>
          <p className="mt-4 text-blue-100/80">
            Share your details and we will simulate your call flow with real scripts and
            booking outcomes.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            placeholder="Your full name"
            className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3 text-white placeholder:text-blue-100/55 outline-none focus:border-[#96a9ff]"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3 text-white placeholder:text-blue-100/55 outline-none focus:border-[#96a9ff]"
          />
          <button type="submit" className="btn-primary w-full justify-center">
            Get my demo
          </button>
          <motion.p
            initial={false}
            animate={{ opacity: submitted ? 1 : 0.45 }}
            className="text-sm text-blue-100/80"
          >
            {submitted
              ? "Request received. Your specialist will call shortly."
              : ""}
          </motion.p>
        </form>
      </div>
    </section>
  );
}
