"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type IndustryCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
};

export function IndustryCard({ icon, title, description, href }: IndustryCardProps) {
  const isPawIcon = icon === "🐾";
  const outsideAccents: Record<string, string[]> = {
    "Real Estate": ["🏠", "📍", "🔑"],
    Restaurants: ["🍕", "🍔", "☕"],
    Hospitals: ["💊", "🩺", "❤️"],
    "Pet Clinics": ["🐶", "🐱", "🦴"],
  };
  const accents = outsideAccents[title] ?? ["✨", "⭐", "💫"];

  return (
    <motion.article
      whileHover={{
        y: -10,
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
        boxShadow: "0 28px 70px rgba(94, 121, 255, 0.28)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative isolate overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(150deg,rgba(20,31,116,0.85),rgba(10,16,74,0.96))] p-7 backdrop-blur-md"
      style={{ transformStyle: "preserve-3d" }}
    >
      {accents.map((accent, index) => (
        <motion.span
          key={`${title}-outside-${accent}-${index}`}
          aria-hidden
          animate={{
            y: [0, -10, 0],
            x: [0, index % 2 === 0 ? 6 : -6, 0],
            opacity: [0.35, 0.8, 0.35],
            rotate: [0, index % 2 === 0 ? 14 : -14, 0],
          }}
          transition={{
            duration: 3.2 + index * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          className={`pointer-events-none absolute z-20 text-lg drop-shadow-[0_6px_18px_rgba(105,127,255,0.45)] ${
            index === 0
              ? "-left-4 top-6"
              : index === 1
                ? "-right-4 top-14"
                : "left-8 -bottom-4"
          }`}
        >
          {accent}
        </motion.span>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(145,173,255,0.24),transparent_52%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#8f75ff]/20 blur-3xl transition-opacity duration-300 group-hover:opacity-95" />
      <motion.span
        aria-hidden
        animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4], scale: [0.98, 1.04, 0.98] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className={`pointer-events-none absolute right-5 top-1/2 z-0 -translate-y-1/2 text-6xl text-white opacity-20 drop-shadow-[0_8px_24px_rgba(111,132,255,0.45)] transition-opacity duration-300 group-hover:opacity-30 md:text-7xl ${
          isPawIcon ? "[filter:grayscale(1)_brightness(2.15)_contrast(1.12)]" : ""
        }`}
      >
        {icon}
      </motion.span>

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
          {icon}
        </div>

        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 flex-1 text-blue-100/85">{description}</p>

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c8d6ff] transition-colors duration-200 group-hover:text-white"
        >
          Explore
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </motion.article>
  );
}
