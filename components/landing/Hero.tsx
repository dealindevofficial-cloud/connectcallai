"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  createFloatLoop,
  createPulseLoop,
  fadeUp,
  getMotionTuning,
  getWaveAnimationConfig,
  staggerContainer,
} from "@/lib/motion";
import { trackConversionEvent } from "@/lib/analytics/conversions";

const status = ["Calling customer...", "Understanding request...", "Sharing next steps..."];
const industryOptions = [
  { value: "real-estate", label: "Real Estate" },
  { value: "restaurants", label: "Restaurants" },
  { value: "hospitals", label: "Hospitals" },
  { value: "dental-offices", label: "Dental Offices" },
  { value: "pet-clinics", label: "Pet Clinics" },
];

type DemoCallResponse = {
  status?: "called_now" | "queued_fallback" | "validation_error" | "provider_error";
  requestId?: string;
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "industry", string>>;
};

type RequestStatus = "idle" | "submitting" | "called_now" | "queued_fallback" | "error";

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
  const [phoneDigits, setPhoneDigits] = useState("");
  const [industry, setIndustry] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Your details are captured from this widget to request a demo call.",
  );
  const formatUsPhone = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };
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
    const phone = phoneDigits.length === 10 ? `+1${phoneDigits}` : "";
    const email = String(formData.get("email") ?? "");
    const selectedIndustry = String(formData.get("industry") ?? "");

    if (!fullName) {
      setRequestStatus("error");
      setStatusMessage("Please enter your full name to continue.");
      toast.error("Please enter your full name to continue.");
      return;
    }

    if (phoneDigits.length !== 10) {
      setRequestStatus("error");
      setStatusMessage("Please enter a valid US phone number.");
      toast.error("Please enter a valid US phone number.");
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
          industry: selectedIndustry,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as DemoCallResponse;
      toast.dismiss(loadingToast);

      if (result.status === "called_now") {
        setRequestStatus("called_now");
        setStatusMessage(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        trackConversionEvent("demo_call_form_submit", {
          source: "home_hero",
          industry: selectedIndustry,
          outcome: "called_now",
        });
        toast.success(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        form.reset();
        setPhoneDigits("");
        setIndustry("");
        setIsIndustryOpen(false);
        return;
      }

      if (result.status === "queued_fallback") {
        setRequestStatus("queued_fallback");
        setStatusMessage(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        trackConversionEvent("demo_call_form_submit", {
          source: "home_hero",
          industry: selectedIndustry,
          outcome: "queued_fallback",
        });
        toast.success(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        form.reset();
        setPhoneDigits("");
        setIndustry("");
        setIsIndustryOpen(false);
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
          Pre-Built AI Voice Agents for 24/7 Call Answering, Booking & Lead Conversion.
        </motion.h1>
        <motion.p variants={fadeUp} className="max-w-xl text-lg text-blue-100/80">
        No setup. No training. Just plug & play AI agents for your business..
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <Link
            href="/contact-us"
            onClick={() =>
              trackConversionEvent("cta_click", {
                source: "home_hero",
                destination: "/contact-us",
                label: "Start your demo",
              })
            }
            className="btn-primary"
          >
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
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold text-white">Live Assistant</p>
              <span className="mt-1 block text-sm text-blue-100/80">
                See it in action, takes 30 seconds
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-emerald-300">Connected</span>
              <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
            </div>
          </div>
          <div className="mt-5">
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
                    const pastedDigits = event.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhoneDigits(pastedDigits);
                  }}
                  placeholder="(555) 123-4567"
                  className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-blue-100/55 outline-none"
                />
              </div>
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
