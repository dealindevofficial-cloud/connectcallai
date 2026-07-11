"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { trackConversionEvent } from "@/lib/analytics/conversions";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";

type SubmitState = "idle" | "submitting" | "success" | "error";

const highlights = [
  {
    title: "Launch-ready agents",
    detail: "Pre-built voice agents for booking, support, and lead qualification.",
  },
  {
    title: "Guided setup",
    detail: "We map your call flow, number connection, and handoff rules with you.",
  },
  {
    title: "Fast response",
    detail: "Most teams hear back within one business day with clear next steps.",
  },
] as const;

export function ContactForm() {
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const prefilledMessage = useMemo(() => {
    const minutes = searchParams.get("minutes");
    const estimate = searchParams.get("estimate");
    const rate = searchParams.get("rate");

    if (!minutes || !estimate || !rate) return "";

    const parsedMinutes = Number(minutes);
    const parsedEstimate = Number(estimate);
    const parsedRate = Number(rate);

    if (
      !Number.isFinite(parsedMinutes) ||
      parsedMinutes < 0 ||
      !Number.isFinite(parsedEstimate) ||
      parsedEstimate < 0 ||
      !Number.isFinite(parsedRate) ||
      parsedRate <= 0
    ) {
      return "";
    }

    const safeMinutes = new Intl.NumberFormat("en-US").format(Math.round(parsedMinutes));
    const safeEstimate = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(parsedEstimate));
    const safeRate = parsedRate.toFixed(2);

    return `Hi, I used the price estimator and selected ${safeMinutes} minutes per month. The estimate shown was ${safeEstimate} at $${safeRate} per minute. Please share a custom quote for my business.`;
  }, [searchParams]);

  const [messageValue, setMessageValue] = useState(prefilledMessage);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: messageValue.trim(),
    };

    const loadingToast = toast.loading("Sending your message…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Unable to submit your message right now.");
      }

      toast.dismiss(loadingToast);
      form.reset();
      setMessageValue(prefilledMessage);
      setSubmitState("success");
      trackConversionEvent("contact_form_submit", {
        source: prefilledMessage ? "price_estimator" : "contact_page",
      });
      toast.success("Message sent. Our team will get back to you soon.");
    } catch (error) {
      toast.dismiss(loadingToast);
      const message =
        error instanceof Error ? error.message : "Something went wrong while sending your message.";
      setSubmitState("error");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      className="relative overflow-hidden rounded-3xl border border-[#92abff]/30 bg-[linear-gradient(145deg,rgba(19,30,112,0.82),rgba(9,14,62,0.96))] p-6 shadow-[0_24px_80px_rgba(5,10,50,0.35)] md:p-8 lg:p-10"
    >
      {!reducedMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(138,165,255,0.4),transparent_68%)] blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(110,233,255,0.2),transparent_72%)] blur-2xl"
            animate={{ y: [-10, 8, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
        <motion.div variants={fadeUp} className="min-w-0">
          <p className="inline-flex items-center rounded-full border border-[#9cb7ff]/35 bg-[#84a1ff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#dce5ff]">
            Send a message
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Tell us what you want to automate
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100/85 md:text-base">
            Share your requirements and our team will help you launch the right AI calling setup
            for your business.
          </p>

          <ul className="mt-7 space-y-4">
            {highlights.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#8ea3ff]/45 bg-[#1a2680]/70 text-[11px] font-semibold text-[#c5d2ff]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-blue-100/75">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="glass-card min-w-0 overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6">
          {prefilledMessage ? (
            <p className="mb-4 rounded-xl border border-[#93a6ff]/35 bg-[#6f8eff]/12 px-3 py-2 text-xs leading-5 text-[#d8e2ff]">
              Your price estimator details were added to the message below. Edit anything before
              sending.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-blue-100/80">
                Full name
              </label>
              <input
                id="contact-name"
                required
                name="name"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/22 bg-[#0b145f]/70 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none md:text-base"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-blue-100/80">
                Email
              </label>
              <input
                id="contact-email"
                required
                name="email"
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/22 bg-[#0b145f]/70 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none md:text-base"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-blue-100/80">
                How can we help?
              </label>
              <textarea
                id="contact-message"
                required
                name="message"
                rows={6}
                placeholder="Tell us about your business, call volume, and what you need."
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
                className="w-full resize-y rounded-xl border border-white/22 bg-[#0b145f]/70 px-4 py-3 text-sm text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none md:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="btn-primary h-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "submitting" ? "Sending..." : "Send message"}
            </button>
          </form>

          <p
            className={`mt-4 text-sm ${
              submitState === "error" ? "text-[#ffb4c4]" : "text-blue-100/80"
            }`}
          >
            {submitState === "success"
              ? "Your message has been sent. Our team will contact you soon."
              : submitState === "error"
                ? errorMessage
                : "We usually respond within one business day."}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
