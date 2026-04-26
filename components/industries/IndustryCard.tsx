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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(145,173,255,0.24),transparent_52%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#8f75ff]/20 blur-3xl transition-opacity duration-300 group-hover:opacity-95" />

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
