"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCases } from "@/lib/landing-data";
import { fadeUp } from "@/lib/motion";

type UseCase = (typeof useCases)[number];

const industryMarks: Record<
  string,
  { label: string; accent: string; MetricIcon: () => ReactNode }
> = {
  "Real Estate": {
    label: "Property",
    accent: "from-[#6b7dff]/40 via-[#4e66ff]/12 to-transparent",
    MetricIcon: HouseMark,
  },
  Restaurants: {
    label: "Dining",
    accent: "from-[#5fd3ff]/40 via-[#4f89ff]/12 to-transparent",
    MetricIcon: ForkKnifeMark,
  },
  Hospitals: {
    label: "Care",
    accent: "from-[#8a9bff]/40 via-[#6c7eff]/12 to-transparent",
    MetricIcon: CrossMark,
  },
  "Dental Offices": {
    label: "Dental",
    accent: "from-[#96b8ff]/40 via-[#748cff]/12 to-transparent",
    MetricIcon: ToothMark,
  },
  "Pet Clinics": {
    label: "Pets",
    accent: "from-[#7fcbff]/40 via-[#6a87ff]/12 to-transparent",
    MetricIcon: PawMark,
  },
};

function HouseMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ForkKnifeMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M7 3.5v6.2c0 1.1-.7 2-1.7 2.3V20.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5.3 3.5v5.5M8.7 3.5v5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.2 3.5c1.8 0 3.3 1.5 3.3 3.3v2.2c0 1.4-1 2.6-2.3 3V20.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 3.5v5.8c0 1.1.9 2 2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M9 3.5h6v5.5h5.5v6H15V21H9v-6H3.5v-6H9V3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToothMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M8.2 4.5c-1.7 0-3 1.5-3 3.3 0 1.4.5 2.6 1.1 3.8.5 1 1 2.1 1 3.4v3.2c0 .9.7 1.5 1.5 1.5.7 0 1.3-.5 1.4-1.2l.5-3.1c.1-.4.5-.7.9-.7s.8.3.9.7l.5 3.1c.1.7.7 1.2 1.4 1.2.8 0 1.5-.6 1.5-1.5v-3.2c0-1.3.5-2.4 1-3.4.6-1.2 1.1-2.4 1.1-3.8 0-1.8-1.3-3.3-3-3.3-1.1 0-2 .5-2.8 1.2C11.2 5 10.3 4.5 8.2 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PawMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <ellipse cx="12" cy="16.2" rx="4.2" ry="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.2" cy="9.2" r="1.85" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.8" cy="9.2" r="1.85" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9.6" cy="6.2" r="1.55" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.4" cy="6.2" r="1.55" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function parseMetric(metric: string) {
  const match = metric.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", value: 0, suffix: metric, decimals: 0 };
  }

  const [, prefix, rawValue, suffix] = match;
  const decimals = rawValue.includes(".") ? rawValue.split(".")[1]?.length ?? 0 : 0;

  return {
    prefix,
    value: Number(rawValue),
    suffix,
    decimals,
  };
}

function AnimatedMetric({
  metric,
  reducedMotion,
}: {
  metric: string;
  reducedMotion: boolean | null;
}) {
  const parsed = parseMetric(metric);
  const [display, setDisplay] = useState(reducedMotion ? parsed.value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(parsed.value);
      return;
    }

    setDisplay(0);
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parsed.value * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [metric, parsed.value, reducedMotion]);

  const formatted =
    parsed.decimals > 0 ? display.toFixed(parsed.decimals) : String(Math.round(display));

  return (
    <motion.p
      animate={
        reducedMotion
          ? undefined
          : {
              boxShadow: [
                "0 0 0 rgba(114,136,255,0)",
                "0 0 22px rgba(114,136,255,0.4)",
                "0 0 10px rgba(114,136,255,0.2)",
              ],
            }
      }
      transition={
        reducedMotion
          ? undefined
          : { duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
      }
      className="inline-flex rounded-full border border-white/20 bg-[#1a2a8a]/60 px-4 py-2 text-sm font-semibold text-[#d8e2ff]"
    >
      <span className="tabular-nums">
        {parsed.prefix}
        {formatted}
      </span>
      {parsed.suffix}
    </motion.p>
  );
}

function IndustryMark({ name }: { name: string }) {
  const visual = industryMarks[name];
  const Icon = visual?.MetricIcon ?? PawMark;

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/18 bg-white/8 text-[#b8c6ff]">
      <Icon />
    </span>
  );
}

export function UseCases() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active: UseCase = useCases[activeIndex] ?? useCases[0];
  const visual = industryMarks[active.name];

  return (
    <section
      id="use-cases"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-4xl font-bold text-white md:text-5xl">Use cases</h2>
        <p className="mt-4 text-blue-100/80">
          See how teams across industries use Connect Call AI to convert more calls into outcomes.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 md:mt-12"
      >
        <div
          role="tablist"
          aria-label="Industries"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible"
        >
          {useCases.map((item, index) => {
            const isActive = index === activeIndex;
            const mark = industryMarks[item.name];

            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`use-case-tab-${index}`}
                aria-selected={isActive}
                aria-controls="use-case-panel"
                onClick={() => setActiveIndex(index)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#93a6ff]/70 bg-[#1a2a8a]/70 text-white shadow-[0_0_18px_rgba(114,136,255,0.25)]"
                    : "border-white/15 bg-white/5 text-blue-100/75 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="text-[#b8c6ff]">
                  {mark ? <mark.MetricIcon /> : null}
                </span>
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 md:mt-8">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.name}
              id="use-case-panel"
              role="tabpanel"
              aria-labelledby={`use-case-tab-${activeIndex}`}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/75 p-7 md:p-10"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${visual?.accent ?? "from-[#7d8eff]/35 to-transparent"} blur-3xl`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[#4e66ff]/15 blur-3xl"
              />

              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
                <div>
                  <div className="flex items-center gap-3">
                    <IndustryMark name={active.name} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9db0ff]/80">
                        {visual?.label ?? "Industry"}
                      </p>
                      <h3 className="mt-0.5 text-2xl font-semibold text-white md:text-3xl">
                        {active.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-50/90 md:text-xl">
                    {active.outcome}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <AnimatedMetric metric={active.metric} reducedMotion={reducedMotion} />
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c8d6ff] transition-colors duration-200 hover:text-white"
                    >
                      Explore
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>

                <div
                  aria-hidden
                  className="hidden select-none text-[7rem] font-bold leading-none tracking-tight text-white/[0.06] md:block"
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
