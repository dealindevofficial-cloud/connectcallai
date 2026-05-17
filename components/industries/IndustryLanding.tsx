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

export function IndustryLanding({ industry }: IndustryLandingProps) {
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

    // Keep client validation lightweight and aligned with native email input expectations.
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
    <main className="relative z-10 mx-auto w-full max-w-6xl overflow-x-clip px-5 pb-24 pt-20 md:px-8 md:pt-28">
      <section className="relative pb-2 pt-2 md:pb-4 md:pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.h1 variants={fadeUp} className="text-4xl font-semibold text-white md:text-6xl">
            AI Calling Agents for {industry.name} Businesses
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-3xl text-lg text-blue-100/85">
            {industry.heroSubtext}
          </motion.p>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          <div className="relative">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,119,148,0.35),rgba(255,119,148,0)_68%)] blur-xl"
              animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute right-8 top-28 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(133,160,255,0.3),rgba(133,160,255,0)_70%)] blur-2xl"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center rounded-full border border-[#ff9cb5]/40 bg-[#ff7a99]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd5df]"
            >
              Critical friction points
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="relative mt-4 max-w-md text-3xl font-semibold text-white md:text-5xl"
            >
              Challenges in {industry.name}
            </motion.h2>
            <motion.p variants={fadeUp} className="relative mt-4 max-w-md text-base leading-relaxed text-blue-100/85">
              These operational gaps create delayed responses, missed opportunities, and inconsistent customer
              experience.
            </motion.p>
          </div>

          <div className="relative pl-10 md:pl-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[15px] top-3 h-[calc(100%-10px)] w-px bg-gradient-to-b from-[#ff8fb0] via-[#9cb2ff] to-transparent md:left-[21px]"
            />
            <div className="space-y-7">
              {industry.problems.map((problem, index) => (
                <motion.article key={problem} variants={fadeUp} whileHover={{ x: 4 }} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-10 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ffb1c1]/50 bg-[linear-gradient(145deg,rgba(255,112,148,0.35),rgba(255,112,148,0.12))] text-[11px] font-semibold text-white md:-left-14 md:h-10 md:w-10 md:text-xs"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd9e3]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff93b0]" />
                    Operational Gap
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-50/95 md:text-base">{problem}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="relative"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,153,255,0.22),rgba(126,153,255,0)_72%)] blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid gap-8 lg:grid-cols-[1.25fr_1.15fr] lg:items-center">
            <div className="order-2 relative lg:order-1">
              <motion.div
                variants={fadeUp}
                className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full border border-[#b6c8ff]/35 bg-[radial-gradient(circle_at_30%_30%,rgba(180,201,255,0.42),rgba(65,92,217,0.3)_45%,rgba(24,35,130,0.9)_90%)] text-center shadow-[0_0_45px_rgba(123,150,255,0.35)]"
              >
                <span className="px-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/95">AI Core</span>
              </motion.div>

              <div className="space-y-4">
                {industry.solutions.map((solution, index) => (
                  <motion.article
                    key={solution}
                    variants={fadeUp}
                    whileHover={{ x: -4 }}
                    className="relative rounded-2xl border border-white/15 bg-[linear-gradient(150deg,rgba(25,39,132,0.75),rgba(11,17,74,0.96))] px-5 py-4"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-[calc(1.25rem+0.875rem)] top-0 h-6 w-px -translate-x-1/2 -translate-y-full bg-gradient-to-t from-[#95adff] to-transparent"
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9beff]">AI-powered action</p>
                        <p className="mt-1 text-sm leading-relaxed text-blue-50/95">{solution}</p>
                      </div>
                      <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9db5ff]/40 bg-[#84a2ff]/15 text-xs font-semibold text-[#d7e2ff]">
                        {index + 1}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} className="order-1 space-y-4 lg:order-2">
              <p className="inline-flex items-center rounded-full border border-[#8ea7ff]/40 bg-[#6f8eff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d6e0ff]">
                Solution architecture
              </p>
              <h2 className="text-3xl font-semibold text-white md:text-5xl">How Connect Call AI Helps</h2>
              <p className="max-w-lg text-base leading-relaxed text-blue-100/85">
                Your AI phone agent acts as a control tower: it picks up instantly, manages intent, and routes
                outcomes into the right business workflow without delays.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="relative"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(137,164,255,0.24),rgba(137,164,255,0)_70%)] blur-2xl"
            animate={{ x: [0, -10, 0], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div variants={fadeUp} className="mb-8 max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-[#9fb5ff]/35 bg-[#6f8eff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e2ff]">
              Deployment playbook
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              Top AI Calling Use Cases for {industry.name}
            </h2>
          </motion.div>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#9bb1ff]/70 via-[#7f96ff]/30 to-transparent lg:block"
            />

            <div className="space-y-5 md:space-y-6">
              {industry.useCases.map((useCase, index) => (
                <motion.article
                  key={useCase.title}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className={`relative w-full rounded-2xl border px-5 py-5 md:px-6 ${
                    index % 2 === 0
                      ? "border-[#8ea7ff]/35 bg-[linear-gradient(145deg,rgba(28,43,145,0.8),rgba(11,17,73,0.95))] lg:mr-auto lg:w-[calc(50%-18px)]"
                      : "border-[#9dc3ff]/30 bg-[linear-gradient(145deg,rgba(18,56,150,0.72),rgba(9,25,88,0.94))] lg:ml-auto lg:w-[calc(50%-18px)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-7 hidden h-px w-8 bg-gradient-to-r from-[#9fb4ff] to-transparent lg:block ${
                      index % 2 === 0 ? "-right-8" : "-left-8 rotate-180"
                    }`}
                  />

                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl">
                      {useCase.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c8d6ff]">
                        Use Case {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{useCase.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-blue-100/90">{useCase.description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="demo" className="mt-14 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionViewport}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-full overflow-hidden rounded-3xl border border-[#92abff]/30 bg-[linear-gradient(145deg,rgba(19,30,112,0.8),rgba(9,14,62,0.96))] p-6 md:p-8 lg:p-10"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(138,165,255,0.45),rgba(138,165,255,0)_68%)] blur-2xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(110,233,255,0.25),rgba(110,233,255,0)_72%)] blur-2xl"
            animate={{ y: [-10, 8, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid min-w-0 gap-6 md:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="min-w-0 text-center md:text-left">
              <p className="inline-flex items-center rounded-full border border-[#9cb7ff]/35 bg-[#84a1ff]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#dce5ff]">
                Live demo
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                Talk to your AI call agent
              </h2>
              <p className="mx-auto mt-3 max-w-md break-words text-blue-100/85 md:mx-0">
                Enter your details and preview how an AI phone agent for {industry.name.toLowerCase()} can
                handle real customer conversations.
              </p>

              <div className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-white/15 bg-[#0c1869]/50 p-4 sm:p-5 md:mx-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8cbff]">What happens next</p>
                <ul className="mt-3 space-y-2 text-[13px] text-blue-50/90 sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#9eb6ff]" />
                    <span className="min-w-0 break-words">Instant call routing to the AI voice workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#9eb6ff]" />
                    <span className="min-w-0 break-words">
                      Natural conversation aligned to {industry.name} use cases
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#9eb6ff]" />
                    <span className="min-w-0 break-words">Follow-up actions captured for your team</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-white/20 bg-[#0a145b]/65 p-4 sm:p-5 md:p-6">
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
                    placeholder="(555) 123-4567"
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

      <section className="mt-14 md:mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="space-y-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-white md:text-5xl">
            Why {industry.name} Teams Choose Connect Call AI?
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {industry.benefits.map((benefit, index) => (
              <motion.article
                key={benefit}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5"
              >
                <span className="pointer-events-none absolute -right-4 -top-4 text-4xl opacity-15 blur-[1px] transition-opacity duration-300 group-hover:opacity-30">
                  {index === 0 ? "🎓" : index === 1 ? "🔌" : index === 2 ? "🗣️" : "📈"}
                </span>
                <span className="pointer-events-none absolute -bottom-2 -left-2 text-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-35">
                  {index === 0 ? "⚡" : index === 1 ? "📞" : index === 2 ? "✨" : "🚀"}
                </span>
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
