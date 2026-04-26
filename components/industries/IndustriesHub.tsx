"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IndustryCard } from "@/components/industries/IndustryCard";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";
import { industries } from "@/lib/industries-data";

export function IndustriesHub() {
  return (
    <main className="relative z-10">
      <section className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-20 text-center md:px-8 md:pb-16 md:pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,137,255,0.2),rgba(15,21,84,0)_65%)] blur-2xl"
            animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,153,255,0.14),transparent_58%)]" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl space-y-5"
        >
          <motion.p variants={fadeUp} className="chip">
            Industry-ready AI voice agents
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl font-semibold text-white md:text-6xl">
            AI Calling Agents for Every Industry
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-lg text-blue-100/85">
            From real estate to healthcare, deploy ready-to-use AI agents tailored for your
            business.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
        <div className="rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(20,30,112,0.42),rgba(10,16,74,0.35))] p-3 md:p-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport}
            className="grid gap-4 md:grid-cols-2"
          >
            {industries.map((industry) => (
              <motion.div key={industry.slug} variants={fadeUp}>
                <IndustryCard
                  icon={industry.icon}
                  title={industry.name}
                  description={industry.shortDescription}
                  href={`/industries/${industry.slug}`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionViewport}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#172484] to-[#2b1f82] p-10 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(186,201,255,0.35),transparent_52%)]" />
          <div className="relative space-y-5">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">
              Find the Right AI Agent for Your Business
            </h2>
            <p className="mx-auto max-w-2xl text-blue-100/85">
              Launch a voice agent tuned for your workflows, customer intents, and conversion
              goals.
            </p>
            <Link href="/#demo" className="btn-primary inline-flex">
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
