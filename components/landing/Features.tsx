"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { features } from "@/lib/landing-data";
import { fadeUp, staggerContainer } from "@/lib/motion";

const featureIcons: Array<() => ReactNode> = [
  AgentMark,
  ConfigMark,
  DeployMark,
  VoiceMark,
  ClockMark,
];

function AgentMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="6" y="7" width="12" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7V4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="12" r="1.1" fill="currentColor" />
      <path d="M4.5 12h1.5M18 12h1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ConfigMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 8h8M17 8h2M5 16h2M11 16h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function DeployMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 3.5 5.5 13h4.2v7.5h4.6V13h4.2L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VoiceMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M8 10v4M11 7.5v9M14 9v6M17 11v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8.2v4.1l2.8 1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FeatureCardProps = {
  title: string;
  detail: string;
  index: number;
  featured?: boolean;
  enableHover?: boolean;
};

function FeatureCard({
  title,
  detail,
  index,
  featured = false,
  enableHover = true,
}: FeatureCardProps) {
  const Icon = featureIcons[index] ?? AgentMark;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={
        enableHover
          ? { y: -3, transition: { duration: 0.22, ease: "easeOut" } }
          : undefined
      }
      className={`group relative h-full overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/75 p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#93a6ff]/55 hover:shadow-[0_0_28px_rgba(114,136,255,0.22)] md:p-7 ${
        featured ? "md:flex md:flex-col md:justify-between" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-[#7d8eff]/25 via-[#5a6dff]/10 to-transparent opacity-80 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.12),transparent_55%)]"
      />

      <div className="relative">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/18 bg-white/8 text-[#b8c6ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-[border-color,box-shadow] duration-300 group-hover:border-[#93a6ff]/45 group-hover:shadow-[0_0_16px_rgba(114,136,255,0.25)]">
          <Icon />
        </span>

        <h3
          className={`mt-5 font-semibold tracking-tight text-white ${
            featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-3 leading-relaxed text-blue-50/90 ${
            featured ? "max-w-sm text-base md:text-lg" : "text-sm md:text-base"
          }`}
        >
          {detail}
        </p>
      </div>

      {featured ? (
        <p className="relative mt-8 text-xs font-medium uppercase tracking-[0.18em] text-[#9db0ff]/75 md:mt-10">
          Flagship capability
        </p>
      ) : null}
    </motion.article>
  );
}

export function Features() {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const stagger = reducedMotion || isMobile ? 0.06 : 0.12;

  return (
    <section
      id="features"
      className="scroll-mt-28 relative mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-16 top-8 h-48 rounded-full bg-[#7f94ff]/15 blur-3xl md:top-4"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-28 h-40 w-40 rounded-full bg-[#b982ff]/12 blur-3xl"
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <h2 className="text-4xl font-bold text-white md:text-5xl">Core features</h2>
        <p className="mt-4 text-sm leading-relaxed text-blue-100/80 md:text-base">
          Every Connect Call AI deployment ships with production-ready capabilities designed for
          speed, reliability, and natural customer conversations.
        </p>
      </motion.div>

      <motion.div
        variants={{
          ...staggerContainer,
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: reducedMotion ? 0 : 0.08,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5"
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={index === 0 ? "h-full md:row-span-2" : "h-full"}
          >
            <FeatureCard
              title={feature.title}
              detail={feature.detail}
              index={index}
              featured={index === 0}
              enableHover={!reducedMotion && !isMobile}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
