"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";
import type { Industry } from "@/lib/industries-data";

type IndustryLandingProps = {
  industry: Industry;
};

type DemoCallResponse = {
  status?: "called_now" | "queued_fallback" | "validation_error" | "provider_error";
  requestId?: string;
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "industry", string>>;
};

type RequestStatus = "idle" | "submitting" | "called_now" | "queued_fallback" | "error";

export function IndustryLanding({ industry }: IndustryLandingProps) {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Your details are captured from this widget to request a demo call.",
  );

  const onRequestDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestStatus === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "");
    const email = String(formData.get("email") ?? "");

    if (!fullName) {
      setRequestStatus("error");
      setStatusMessage("Please enter your full name to continue.");
      toast.error("Please enter your full name to continue.");
      return;
    }

    setRequestStatus("submitting");
    setStatusMessage("Connecting your demo call now...");
    const loadingToast = toast.loading("Connecting your demo call…");

    try {
      const response = await fetch("/api/demo-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          industry: industry.slug,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as DemoCallResponse;
      toast.dismiss(loadingToast);

      if (result.status === "called_now") {
        setRequestStatus("called_now");
        setStatusMessage(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        toast.success(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        form.reset();
        return;
      }

      if (result.status === "queued_fallback") {
        setRequestStatus("queued_fallback");
        setStatusMessage(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        toast.success(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        form.reset();
        return;
      }

      if (result.status === "validation_error") {
        setRequestStatus("error");
        const firstFieldError = result.errors
          ? Object.values(result.errors).find((value) => Boolean(value))
          : "";
        const msg = firstFieldError || "Please review your details and try again.";
        setStatusMessage(msg);
        toast.error(msg);
        return;
      }

      setRequestStatus("error");
      const errMsg =
        result.message || "We could not process your demo call request right now. Please try again.";
      setStatusMessage(errMsg);
      toast.error(errMsg);
    } catch {
      toast.dismiss(loadingToast);
      setRequestStatus("error");
      setStatusMessage("Network error. Please check your connection and try again.");
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-20 md:px-8 md:pt-28">
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(145deg,rgba(20,31,116,0.8),rgba(11,16,70,0.95))] p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            aria-hidden="true"
            className="absolute -right-20 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(130,152,255,0.38),rgba(130,152,255,0)_67%)] blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -left-14 bottom-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(173,122,255,0.34),rgba(173,122,255,0)_67%)] blur-2xl"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative">
          <motion.p variants={fadeUp} className="chip">
            Industry Solution
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-5 text-4xl font-semibold text-white md:text-6xl">
            AI Calling Agents for {industry.name} Businesses
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-3xl text-lg text-blue-100/85">
            {industry.heroSubtext}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <Link href="/contact-us" className="btn-primary">
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-white md:text-5xl">
            Challenges in {industry.name}
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-3">
            {industry.problems.map((problem) => (
              <motion.article
                key={problem}
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: "0 20px 55px rgba(121, 147, 255, 0.25)" }}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-blue-100/90"
              >
                <h3 className="text-lg font-medium text-white">Operational gap</h3>
                <p className="mt-2 text-sm leading-relaxed">{problem}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-white md:text-5xl">
            How Connect Call AI Helps
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-3">
            {industry.solutions.map((solution) => (
              <motion.article
                key={solution}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="rounded-2xl border border-[#8ea7ff]/35 bg-[linear-gradient(155deg,rgba(36,58,183,0.42),rgba(13,23,96,0.85))] p-5 text-blue-100/90"
              >
                <h3 className="text-lg font-medium text-white">AI-powered action</h3>
                <p className="mt-2 text-sm leading-relaxed">{solution}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-white md:text-5xl">
            Top AI Calling Use Cases for {industry.name}
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industry.useCases.map((useCase) => (
              <motion.article
                key={useCase.title}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(24,36,130,0.75),rgba(10,16,72,0.95))] p-5"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl">
                  {useCase.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-100/85">{useCase.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="demo" className="mt-14 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionViewport}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8"
        >
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Live Demo</h2>
          <p className="mt-2 text-blue-100/85">
            Enter your details and preview how an AI phone agent for {industry.name.toLowerCase()} can
            handle real customer conversations.
          </p>

          <form onSubmit={onRequestDemo} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="sr-only" htmlFor="demo-name">
              Name
            </label>
            <input
              id="demo-name"
              type="text"
              name="name"
              required
              placeholder={industry.demoPlaceholderName}
              className="h-12 rounded-xl border border-white/20 bg-[#0b145f]/70 px-4 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
            />
            <label className="sr-only" htmlFor="demo-phone">
              Phone
            </label>
            <input
              id="demo-phone"
              type="tel"
              name="phone"
              required
              placeholder={industry.demoPlaceholderPhone}
              className="h-12 rounded-xl border border-white/20 bg-[#0b145f]/70 px-4 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
            />
            <label className="sr-only" htmlFor="demo-email">
              Email
            </label>
            <input
              id="demo-email"
              type="email"
              name="email"
              required
              placeholder="e.g., you@company.com"
              className="h-12 rounded-xl border border-white/20 bg-[#0b145f]/70 px-4 text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none"
            />
            <button
              type="submit"
              className="btn-primary h-12 w-full justify-center md:w-auto"
              disabled={requestStatus === "submitting"}
            >
              {requestStatus === "submitting"
                ? "Requesting..."
                : requestStatus === "called_now"
                  ? "Call requested"
                  : requestStatus === "queued_fallback"
                    ? "Request queued"
                    : "Get a Demo Call"}
            </button>
          </form>

          <motion.p
            initial={false}
            animate={{ opacity: requestStatus === "idle" ? 0.45 : 1 }}
            className="mt-4 text-sm text-[#b8cbff]"
          >
            {statusMessage}
          </motion.p>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-white md:text-5xl">
            Why {industry.name} Teams Choose Connect Call AI
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {industry.benefits.map((benefit) => (
              <motion.article
                key={benefit}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <h3 className="text-lg font-medium text-white">{benefit}</h3>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionViewport}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#172484] to-[#2b1f82] p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(186,201,255,0.35),transparent_52%)]" />
          <div className="relative text-center">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">{industry.ctaHeadline}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100/90">
              Launch a premium AI calling workflow that captures every opportunity, improves response
              speed, and boosts conversion rates.
            </p>
            <Link href="/contact-us" className="btn-primary mt-8 inline-flex">
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
