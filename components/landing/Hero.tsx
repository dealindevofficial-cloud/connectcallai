"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  createFloatLoop,
  createPulseLoop,
  fadeUp,
  getMotionTuning,
  getWaveAnimationConfig,
  staggerContainer,
} from "@/lib/motion";

const status = ["Calling customer...", "Confirming availability...", "Booking confirmed"];

export function Hero() {
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = Boolean(reducedMotionPreference);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const motionTuning = getMotionTuning({
    reducedMotion,
    isMobile,
  });
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [submittedName, setSubmittedName] = useState("");
  const floatAnimation = createFloatLoop({
    reducedMotion,
    isMobile,
  });
  const pulseAnimation = createPulseLoop({
    reducedMotion,
    isMobile,
  });
  const onRequestDemo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") ?? "").trim();

    if (!fullName) {
      setRequestStatus("error");
      return;
    }

    setSubmittedName(fullName);
    setRequestStatus("submitting");

    window.setTimeout(() => {
      setRequestStatus("submitted");
      event.currentTarget.reset();
    }, 850);
  };

  return (
    <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-14 pt-16 md:grid-cols-2 md:px-8 md:pb-20 md:pt-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-7"
      >
        <motion.p variants={fadeUp} className="chip">
          AI voice agents for high-intent calls
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-semibold leading-tight text-white md:text-6xl"
        >
          Automate Business Calls with Specialized AI Voice Agents.
        </motion.h1>
        <motion.p variants={fadeUp} className="max-w-xl text-lg text-blue-100/80">
          CCAI handles inbound and outbound calls, qualifies leads, books appointments,
          and syncs outcomes to your workflow without adding operational drag.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <Link href="/#demo" className="btn-primary">
            Start your demo
          </Link>
          <Link href="/#how-it-works" className="btn-secondary">
            See how it works
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative"
      >
        <motion.div
          animate={floatAnimation}
          className="glass-card relative overflow-hidden rounded-3xl p-7"
        >
          <div className="absolute right-5 top-5 h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
          <p className="mb-2 text-sm text-blue-100/70">AI Call Demo</p>
          <p className="text-xl font-semibold text-white">Live Booking Assistant</p>
          <div className="mt-6 rounded-2xl border border-white/15 bg-[#0e155f]/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-blue-100/80">Live test call</span>
              <span className="text-xs text-emerald-300">Connected</span>
            </div>
            <div className="mb-6 flex h-16 items-end gap-1.5">
              {[28, 18, 46, 22, 34, 52, 20, 40, 27, 49].map((height, idx) => {
                const waveAnimation = getWaveAnimationConfig(height, idx, {
                  reducedMotion,
                  isMobile,
                });

                return (
                  <motion.span
                    key={idx}
                    className="wave-bar flex-1 rounded-full"
                    animate={waveAnimation.animate}
                    transition={waveAnimation.transition}
                  />
                );
              })}
            </div>
            <form onSubmit={onRequestDemo} className="space-y-3">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-2.5 text-sm text-white placeholder:text-blue-100/55 outline-none focus:border-[#96a9ff]"
              />
              <input
                name="phone"
                required
                type="tel"
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-2.5 text-sm text-white placeholder:text-blue-100/55 outline-none focus:border-[#96a9ff]"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-2.5 text-sm text-white placeholder:text-blue-100/55 outline-none focus:border-[#96a9ff]"
              />
              <button
                type="submit"
                className="btn-primary w-full justify-center py-2.5 text-sm"
                disabled={requestStatus === "submitting"}
              >
                {requestStatus === "submitting" ? "Requesting..." : "Request demo call"}
              </button>
              <div className="space-y-1.5 pt-1 text-sm">
                {status.map((label, idx) => (
                  <motion.p
                    key={label}
                    className="text-blue-100/85"
                    animate={reducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
                    transition={{
                      repeat: Infinity,
                      duration: motionTuning.statusDuration,
                      delay: idx * 0.75,
                      ease: "easeInOut",
                    }}
                  >
                    {label}
                  </motion.p>
                ))}
              </div>
              <motion.p
                initial={false}
                animate={{ opacity: requestStatus === "idle" ? 0.45 : 1 }}
                className="text-xs text-blue-100/80"
              >
                {requestStatus === "submitted"
                  ? `Request received, ${submittedName}. We will call you shortly.`
                  : requestStatus === "error"
                    ? "Please enter your name to continue."
                    : "Your details are captured from this widget to request a demo call."}
              </motion.p>
            </form>
          </div>
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full border border-[#96a7ff]/40"
            animate={pulseAnimation}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
