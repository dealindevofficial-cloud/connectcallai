"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

function UsFlagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className="mr-2 h-3.5 w-5 rounded-[2px] border border-white/20"
    >
      <rect width="24" height="16" fill="#ffffff" />
      <rect y="0" width="24" height="2" fill="#B22234" />
      <rect y="4" width="24" height="2" fill="#B22234" />
      <rect y="8" width="24" height="2" fill="#B22234" />
      <rect y="12" width="24" height="2" fill="#B22234" />
      <rect width="10.5" height="8.8" fill="#3C3B6E" />
    </svg>
  );
}

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");

  const formatUsPhone = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phoneDigits.length !== 10) return;
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
          <div className="flex items-center rounded-xl border border-white/15 bg-white/7 px-3 focus-within:border-[#96a9ff]">
            <UsFlagIcon />
            <span className="mr-2 text-sm font-medium text-blue-100/90">+1</span>
            <input
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={formatUsPhone(phoneDigits)}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
                setPhoneDigits(digits);
              }}
              onPaste={(event) => {
                event.preventDefault();
                const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10);
                setPhoneDigits(pastedDigits);
              }}
              placeholder="(555) 123-4567"
              className="w-full bg-transparent py-3 text-white placeholder:text-blue-100/55 outline-none"
            />
          </div>
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
