import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { FinalCta } from "@/components/landing/FinalCta";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";
import { serviceLinks } from "@/lib/site-navigation";

export const metadata: Metadata = {
  title: pageTitles.services,
  description: pageDescriptions.services,
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <main className="relative z-10">
        <section className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-20 text-center md:px-8 md:pb-16 md:pt-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,137,255,0.2),rgba(15,21,84,0)_65%)] blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,153,255,0.14),transparent_58%)]" />
          </div>
          <div className="mx-auto max-w-4xl space-y-5">
            <p className="chip mx-auto">AI voice agent services</p>
            <h1 className="text-4xl font-semibold text-white md:text-6xl">
              AI Calling Services for Every Customer Conversation
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-blue-100/85">
              Explore Connect Call AI services for inbound answering, appointment booking, lead
              qualification, after-hours coverage, and custom voice automation.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
          <div className="grid gap-4 md:grid-cols-2">
            {serviceLinks.map((service) => (
              <article
                key={service.href}
                id={service.href.split("#")[1]}
                className="scroll-mt-28 rounded-3xl border border-white/12 bg-[linear-gradient(145deg,rgba(20,30,112,0.62),rgba(9,14,66,0.72))] p-6 shadow-[0_24px_70px_rgba(3,7,35,0.28)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
                  Service
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{service.label}</h2>
                <p className="mt-3 text-sm leading-7 text-blue-100/80">{service.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/contact-us" className="btn-primary">
                    Book a Free Demo
                  </Link>
                  <Link href="/price-estimator" className="btn-secondary">
                    Estimate Pricing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-8 md:px-8">
          <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
                  Need a custom workflow?
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Map your call flow before launch.
                </h2>
              </div>
              <p className="text-sm leading-7 text-blue-100/80">
                We help define caller intents, scripts, escalation rules, integrations, and success
                metrics before your AI voice agent goes live.
              </p>
            </div>
          </div>
        </section>

        <FinalCta />
      </main>
    </div>
  );
}
