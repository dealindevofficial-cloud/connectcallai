"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createFloatLoop,
  createPulseLoop,
  fadeUp,
  getMotionTuning,
  getWaveAnimationConfig,
  staggerContainer,
} from "@/lib/motion";

const status = ["Calling customer...", "Understanding request...", "Sharing next steps..."];
const industryOptions = [
  { value: "real-estate", label: "Real Estate" },
  { value: "restaurants", label: "Restaurants" },
  { value: "hospitals", label: "Hospitals" },
  { value: "pet-clinics", label: "Pet Clinics" },
];

type DemoCallResponse = {
  status?: "called_now" | "queued_fallback" | "validation_error" | "provider_error";
  requestId?: string;
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "industry", string>>;
};

type RequestStatus = "idle" | "submitting" | "called_now" | "queued_fallback" | "error";

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
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [industry, setIndustry] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Your details are captured from this widget to request a demo call.",
  );
  const industryDropdownRef = useRef<HTMLDivElement>(null);
  const floatAnimation = createFloatLoop({
    reducedMotion,
    isMobile,
  });
  const pulseAnimation = createPulseLoop({
    reducedMotion,
    isMobile,
  });
  const onRequestDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestStatus === "submitting") return;
    const form = event.currentTarget;

    const formData = new FormData(form);
    const fullName = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "");
    const email = String(formData.get("email") ?? "");
    const selectedIndustry = String(formData.get("industry") ?? "");

    if (!fullName) {
      setRequestStatus("error");
      setStatusMessage("Please enter your full name to continue.");
      return;
    }

    setRequestStatus("submitting");
    setStatusMessage("Connecting your demo call now...");

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
          industry: selectedIndustry,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as DemoCallResponse;

      if (result.status === "called_now") {
        setRequestStatus("called_now");
        setStatusMessage(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        form.reset();
        setIndustry("");
        setIsIndustryOpen(false);
        return;
      }

      if (result.status === "queued_fallback") {
        setRequestStatus("queued_fallback");
        setStatusMessage(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        form.reset();
        setIndustry("");
        setIsIndustryOpen(false);
        return;
      }

      if (result.status === "validation_error") {
        setRequestStatus("error");
        const firstFieldError = result.errors
          ? Object.values(result.errors).find((value) => Boolean(value))
          : "";
        setStatusMessage(firstFieldError || "Please review your details and try again.");
        return;
      }

      setRequestStatus("error");
      setStatusMessage(
        result.message || "We could not process your demo call request right now. Please try again.",
      );
    } catch {
      setRequestStatus("error");
      setStatusMessage("Network error. Please check your connection and try again.");
    }
  };

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!industryDropdownRef.current) return;
      if (!industryDropdownRef.current.contains(event.target as Node)) {
        setIsIndustryOpen(false);
      }
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-14 pt-16 md:grid-cols-2 md:px-8 md:pb-20 md:pt-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-7"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_8px_26px_rgba(90,118,255,0.45)] md:text-6xl"
        >
          Automate Business Calls with Specialized AI Voice Agents.
        </motion.h1>
        <motion.p variants={fadeUp} className="max-w-xl text-lg text-blue-100/80">
          CCAI handles inbound and outbound calls, qualifies leads, books appointments,
          and syncs outcomes to your workflow without adding operational drag.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <Link href="/contact-us" className="btn-primary">
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
          <p className="text-xl font-semibold text-white">Live Assistant</p>
          <div className="mt-6 rounded-2xl border border-white/15 bg-[#0e155f]/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-blue-100/80">Free Live test call</span>
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
              <div ref={industryDropdownRef} className="relative">
                <input type="hidden" name="industry" value={industry} required />
                <button
                  type="button"
                  onClick={() => setIsIndustryOpen((prev) => !prev)}
                  className="w-full rounded-full border border-white/20 bg-white/8 px-4 py-2.5 pr-10 text-left text-sm text-blue-100 outline-none transition duration-300 hover:bg-white/12"
                >
                  {industryOptions.find((option) => option.value === industry)?.label ??
                    "Select industry"}
                </button>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-100/80 transition-transform duration-200 ${
                    isIndustryOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
                <AnimatePresence>
                  {isIndustryOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[#9fb3ff]/40 bg-[#121d74]/95 shadow-[0_16px_42px_rgba(4,10,40,0.52)] backdrop-blur-md"
                    >
                      {industryOptions.map((option) => {
                        const isSelected = industry === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setIndustry(option.value);
                              setIsIndustryOpen(false);
                            }}
                            className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                              isSelected
                                ? "bg-[#dfe6ff] text-[#10206d]"
                                : "text-blue-100 hover:bg-[#d7e1ff] hover:text-[#12216f]"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                className="btn-primary w-full justify-center py-2.5 text-sm"
                disabled={requestStatus === "submitting"}
              >
                {requestStatus === "submitting"
                  ? "Requesting..."
                  : requestStatus === "called_now"
                    ? "Call requested"
                    : requestStatus === "queued_fallback"
                      ? "Request queued"
                      : "Request demo call"}
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
                {statusMessage}
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
