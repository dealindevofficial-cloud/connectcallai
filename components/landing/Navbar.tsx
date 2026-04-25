"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/landing-data";
import logo from "@/public/logo.png";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1054]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-base font-semibold tracking-wide text-white">
          <Image
            src={logo}
            alt="CCAI logo"
            className="h-9 w-auto"
            loading="eager"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-blue-100/80 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <motion.a
          href="#demo"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border border-[#8ca0ff]/50 bg-gradient-to-r from-[#556fff] to-[#8a6dff] px-4 py-2 text-sm font-medium text-white shadow-[0_0_28px_rgba(108,126,255,0.45)]"
        >
          Book a demo
        </motion.a>
      </div>
    </header>
  );
}
