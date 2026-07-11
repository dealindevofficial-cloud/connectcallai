"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { trackConversionEvent } from "@/lib/analytics/conversions";
import type { Industry } from "@/lib/industries-data";
import { fadeUp, motionViewport } from "@/lib/motion";

type IndustryDemoProps = {
  industry: Industry;
};

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

const nextSteps = [
  "Instant pickup by the AI receptionist workflow",
  "Natural intake, booking, and routing for your industry",
  "Follow-up actions captured for your team",
] as const;

export function IndustryDemo({ industry }: IndustryDemoProps) {
  const reducedMotion = useReducedMotion();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Your details are captured from this widget to request a demo call.",
  );

  const formatUsPhone = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const onRequestDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestStatus === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    const normalizedPhone =
      phoneDigits.length === 10
        ? `+1${phoneDigits}`
        : phoneDigits.length === 11 && phoneDigits.startsWith("1")
          ? `+${phoneDigits}`
          : "";

    if (!fullName) {
      setRequestStatus("error");
      setStatusMessage("Please enter your full name to continue.");
      toast.error("Please enter your full name to continue.");
      return;
    }

    if (!normalizedPhone) {
      setRequestStatus("error");
      setStatusMessage("Please enter a valid US phone number.");
      toast.error("Please enter a valid US phone number.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRequestStatus("error");
      setStatusMessage("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
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
          phone: normalizedPhone,
          email,
          industry: industry.slug,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as DemoCallResponse;
      toast.dismiss(loadingToast);

      if (result.status === "called_now") {
        setRequestStatus("called_now");
        setStatusMessage(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        trackConversionEvent("demo_call_form_submit", {
          source: "industry_page",
          industry: industry.slug,
          outcome: "called_now",
        });
        toast.success(`Thanks, ${fullName}. Your AI demo call is being placed now.`);
        form.reset();
        setPhoneDigits("");
        return;
      }

      if (result.status === "queued_fallback") {
        setRequestStatus("queued_fallback");
        setStatusMessage(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        trackConversionEvent("demo_call_form_submit", {
          source: "industry_page",
          industry: industry.slug,
          outcome: "queued_fallback",
        });
        toast.success(
          `Thanks, ${fullName}. We queued your request and will call you as soon as possible.`,
        );
        form.reset();
        setPhoneDigits("");
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
    <section id="demo" className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={motionViewport}
        transition={{ duration: reducedMotion ? 0 : 0.55, ease: "easeOut" }}
        className="relative mx-auto w-full overflow-hidden rounded-3xl border border-[#92abff]/30 bg-[linear-gradient(145deg,rgba(19,30,112,0.82),rgba(9,14,62,0.96))] p-6 md:p-8 lg:p-10"
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
              className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(110,233,255,0.22),transparent_72%)] blur-2xl"
              animate={{ y: [-10, 8, -10] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : null}

        <div className="relative grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="min-w-0 text-center md:text-left">
            <p className="inline-flex items-center rounded-full border border-[#9cb7ff]/35 bg-[#84a1ff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#dce5ff]">
              Live demo
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Talk to an AI receptionist for {industry.name}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100/85 md:mx-0">
              Enter your details and preview how AI phone answering can handle real{" "}
              {industry.name.toLowerCase()} caller conversations.
            </p>

            <div className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1869]/50 p-4 sm:p-5 md:mx-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8cbff]">
                What happens next
              </p>
              <ul className="mt-4 space-y-3">
                {nextSteps.map((step, index) => (
                  <motion.li
                    key={step}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: reducedMotion ? 0 : index * 0.08 }}
                    className="flex items-start gap-3 text-left text-sm text-blue-50/90"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8ea3ff]/45 bg-[#1a2680]/70 text-[10px] font-semibold text-[#c5d2ff]">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      {index === 1
                        ? `Natural intake, booking, and routing aligned to ${industry.name} use cases`
                        : step}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card min-w-0 w-full overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6">
            <form onSubmit={onRequestDemo} className="grid w-full min-w-0 gap-3 sm:gap-4">
              <label className="sr-only" htmlFor="demo-name">
                Name
              </label>
              <input
                id="demo-name"
                type="text"
                name="name"
                required
                placeholder={industry.demoPlaceholderName}
                className="box-border h-12 w-full min-w-0 max-w-full rounded-xl border border-white/20 bg-[#0b145f]/70 px-4 text-sm text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none sm:text-base"
              />
              <label className="sr-only" htmlFor="demo-phone">
                Phone
              </label>
              <div className="box-border flex h-12 w-full min-w-0 max-w-full items-center overflow-hidden rounded-xl border border-white/20 bg-[#0b145f]/70 px-3 focus-within:border-[#9ab1ff]">
                <UsFlagIcon />
                <span className="mr-2 text-sm font-medium text-blue-100/95">+1</span>
                <input
                  id="demo-phone"
                  type="tel"
                  name="phone"
                  required
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
                  placeholder={industry.demoPlaceholderPhone || "(555) 123-4567"}
                  className="h-full w-full min-w-0 max-w-full bg-transparent text-sm text-white placeholder:text-blue-200/60 focus:outline-none sm:text-base"
                />
              </div>
              <label className="sr-only" htmlFor="demo-email">
                Email
              </label>
              <input
                id="demo-email"
                type="email"
                name="email"
                required
                placeholder="e.g., you@company.com"
                className="box-border h-12 w-full min-w-0 max-w-full rounded-xl border border-white/20 bg-[#0b145f]/70 px-4 text-sm text-white placeholder:text-blue-200/60 focus:border-[#9ab1ff] focus:outline-none sm:text-base"
              />
              <button
                type="submit"
                className="btn-primary box-border mt-1 h-12 w-full min-w-0 max-w-full justify-center text-sm sm:text-base"
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}
