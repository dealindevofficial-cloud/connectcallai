"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { JsonLdFaq } from "@/components/blog/JsonLdFaq";
import { TrackedCtaLink } from "@/components/analytics/TrackedLink";
import { fadeUp, motionViewport, staggerContainer } from "@/lib/motion";
import { getServiceBySlug, getServicePath, type ServicePage } from "@/lib/services-data";
import { SITE_NAME } from "@/lib/seo/page-metadata";

type ServiceLandingProps = {
  service: ServicePage;
  canonicalUrl?: string;
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fb5ff]/90">
      {children}
    </p>
  );
}

export function ServiceLanding({ service, canonicalUrl }: ServiceLandingProps) {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const relatedServices = service.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is ServicePage => Boolean(item));

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.label,
    alternateName: service.secondaryKeywords,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    areaServed: "United States",
    url: canonicalUrl,
    serviceType: service.primaryKeyword,
    category: "AI voice agent services",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Businesses that handle phone calls",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.label,
        item: canonicalUrl ?? getServicePath(service),
      },
    ],
  };

  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl overflow-x-clip px-5 pb-24 pt-20 md:px-8 md:pt-28">
      <JsonLdFaq faqs={service.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(116,137,255,0.32),transparent_68%)] blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(133,100,255,0.28),transparent_70%)] blur-3xl"
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
        >
          <div>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link
                href="/services"
                className="text-xs font-medium uppercase tracking-[0.18em] text-blue-100/55 transition hover:text-blue-100/90"
              >
                Services
              </Link>
              <span aria-hidden="true" className="text-blue-100/30">
                /
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8c8ff]">
                {service.navLabel}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-[4rem]"
            >
              {service.seoTitle}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/85"
            >
              {service.heroSubtext}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <TrackedCtaLink
                href="/contact-us"
                eventProperties={{
                  source: "service_page_hero",
                  service: service.slug,
                  destination: "/contact-us",
                  label: "Get a Demo Call",
                }}
                className="btn-primary"
              >
                Get a Demo Call
              </TrackedCtaLink>
              <Link href="/price-estimator" className="btn-secondary">
                Estimate Pricing
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="relative aspect-square">
              {[0, 1, 2].map((ring) => (
                <motion.span
                  key={ring}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[#9fb5ff]/25"
                  style={{ inset: `${ring * 14}%` }}
                  animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 1.03, 1] }}
                  transition={{
                    duration: 4 + ring,
                    delay: ring * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <div className="absolute inset-[28%] flex flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(180,201,255,0.35),rgba(40,55,160,0.55)_55%,rgba(12,18,80,0.95))] shadow-[0_0_60px_rgba(110,140,255,0.35)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c8d6ff]">
                  Live signal
                </span>
                <span className="mt-2 text-center text-sm font-medium text-white/95">
                  {service.navLabel}
                </span>
                <div className="mt-4 flex items-end gap-1">
                  {[10, 18, 12, 22, 14, 20, 11].map((h, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="w-1 rounded-full bg-[#a8bcff]"
                      animate={{ height: [h * 0.55, h, h * 0.7] }}
                      transition={{
                        duration: 1.1 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.06,
                      }}
                      style={{ height: h }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pain points — open numbered list, no cards */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="relative"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,119,148,0.28),transparent_68%)] blur-2xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Why teams look for this</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                The call gaps {service.navLabel} closes
              </h2>
            </motion.div>

            <div className="space-y-0">
              {service.painPoints.map((painPoint, index) => (
                <motion.article
                  key={painPoint}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="group relative border-t border-white/10 py-7 last:border-b"
                >
                  <div className="flex gap-5 md:gap-8">
                    <span className="font-mono text-3xl font-light leading-none text-[#ff9cb5]/55 transition group-hover:text-[#ff9cb5] md:text-4xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-base leading-7 text-blue-50/90 md:text-lg md:leading-8">
                      {painPoint}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works — connected horizontal flow */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              {service.navLabel} Workflow
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100/80">
              Connect Call AI turns your approved scripts, routing rules, and follow-up steps into a
              phone workflow that can answer consistently and hand off cleanly.
            </p>
          </motion.div>

          <div className="relative mt-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-[#9cb2ff]/50 to-transparent md:block"
            />
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {service.howItWorks.map((step, index) => (
                <motion.article
                  key={step}
                  variants={fadeUp}
                  className="relative"
                >
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
                    <motion.span
                      className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a145b] text-sm font-semibold text-white ring-2 ring-[#9db5ff]/50"
                      whileHover={{ scale: 1.08 }}
                    >
                      {index + 1}
                    </motion.span>
                    <p className="text-sm leading-7 text-blue-50/90 md:text-[15px]">{step}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Use cases — editorial magazine rows */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
        >
          <motion.div variants={fadeUp} className="max-w-3xl">
            <SectionEyebrow>Use cases</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              Where {service.navLabel} Fits
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100/80">
              These are the call types buyers usually automate first because they create missed
              revenue, long hold times, or repetitive front-desk work.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2">
            {service.useCases.map((useCase, index) => (
              <motion.article
                key={useCase.title}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="group border-t border-white/10 py-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ea7ff]/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold text-white transition group-hover:text-[#d4deff]">
                    {useCase.title}
                  </h3>
                </div>
                <p className="mt-3 pl-9 text-sm leading-7 text-blue-100/82 md:text-[15px]">
                  {useCase.description}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-5 ml-9 block h-px w-0 bg-gradient-to-r from-[#9fb5ff] to-transparent transition-all duration-500 group-hover:w-24"
                />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sample call flow + Integrations */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="grid gap-16 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Sample call flow</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                From Pickup to Next Step
              </h2>
              <p className="mt-4 text-base leading-7 text-blue-100/80">
                A clear call path helps callers know what is happening and gives your team the
                details they need after the conversation.
              </p>
            </motion.div>

            <ol className="relative mt-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 left-5 top-5 w-px -translate-x-1/2 bg-gradient-to-b from-[#9cb2ff] via-[#7f96ff]/40 to-transparent"
              />
              {service.sampleCallFlow.map((step, index) => (
                <motion.li
                  key={step}
                  variants={fadeUp}
                  className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5"
                >
                  <span className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0c1869] text-xs font-semibold text-[#d7e2ff] ring-1 ring-[#9db5ff]/40">
                    {index + 1}
                  </span>
                  <p className="min-w-0 flex-1 pt-2 pr-1 text-sm leading-7 text-blue-50/90 md:text-[15px]">
                    {step}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>

          <div>
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Integrations</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                Connect the Call Outcome
              </h2>
              <p className="mt-4 text-base leading-7 text-blue-100/80">
                Send call outcomes into the systems your team already uses for scheduling, sales
                follow-up, support, and operations.
              </p>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-x-3 gap-y-4"
            >
              {service.integrations.map((integration, index) => (
                <motion.li
                  key={integration}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={motionViewport}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className="border-b border-[#9fb5ff]/35 pb-1 text-sm font-medium text-blue-50/95 transition hover:border-[#c4d0ff] hover:text-white md:text-base"
                >
                  {integration}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </section>

      {/* Pricing + proof — open split band */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-10 md:px-10 md:py-14"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(110,140,255,0.18),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(133,100,255,0.14),transparent_50%)]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div variants={fadeUp}>
              <SectionEyebrow>Pricing and ROI</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                Model the Cost Against Missed Calls
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-blue-100/84">
                {service.pricingAngle}
              </p>
              <Link href="/price-estimator" className="btn-secondary mt-8">
                Estimate Pricing
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
                Proof points
              </p>
              <ul className="mt-6 space-y-5">
                {service.proofPoints.map((proofPoint, index) => (
                  <motion.li
                    key={proofPoint}
                    variants={fadeUp}
                    className="flex gap-4 text-sm leading-7 text-blue-50/90 md:text-[15px]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6f8eff]/20 text-[10px] text-[#b8c8ff] ring-1 ring-[#9eb6ff]/40"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">{proofPoint}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Industries — text link strip */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
        >
          <motion.div variants={fadeUp} className="max-w-3xl">
            <SectionEyebrow>Industries served</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              Common Industries for This Service
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100/80">
              Explore how this service supports vertical-specific call flows, intake questions,
              escalation rules, and booking outcomes.
            </p>
          </motion.div>

          <motion.nav
            variants={fadeUp}
            aria-label="Industries served"
            className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-4"
          >
            {service.industriesServed.map((industry, index) => (
              <span key={industry.href} className="flex items-center gap-2">
                <Link
                  href={industry.href}
                  className="group relative text-lg font-medium text-white/90 transition hover:text-white md:text-xl"
                >
                  {industry.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#9fb5ff] transition-transform duration-300 group-hover:scale-x-100"
                  />
                </Link>
                {index < service.industriesServed.length - 1 ? (
                  <span aria-hidden="true" className="mx-2 text-[#9fb5ff]/35">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </motion.nav>
        </motion.div>
      </section>

      {/* FAQs — accordion */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
        >
          <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
            <SectionEyebrow>FAQs</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              Questions About {service.navLabel}
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100/80">
              Visible FAQs support long-tail search intent and match the FAQ structured data on this
              page.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="divide-y divide-white/10 border-y border-white/10">
            {service.faqs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;

              return (
                <article key={faq.question} className="py-1">
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex min-w-0 items-start gap-4">
                      <span className="mt-1 hidden font-mono text-xs text-[#9fb5ff]/70 sm:inline">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold text-white md:text-lg">
                        {faq.question}
                      </h3>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-xl text-[#b8c8ff]"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key={`${faq.question}-answer`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm leading-7 text-blue-100/82 sm:pl-10 md:text-[15px]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </article>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Related services */}
      <section className="mt-20 md:mt-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport}
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow>Related services</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                Related AI Calling Services
              </h2>
            </div>
          </motion.div>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {relatedServices.map((relatedService) => (
              <motion.div key={relatedService.slug} variants={fadeUp}>
                <Link
                  href={getServicePath(relatedService)}
                  className="group flex flex-col gap-2 py-7 transition md:flex-row md:items-center md:justify-between md:gap-8"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white transition group-hover:text-[#d4deff]">
                      {relatedService.label}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-blue-100/78">
                      {relatedService.shortDescription}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#9fb5ff] transition group-hover:translate-x-1 group-hover:text-white"
                  >
                    Explore
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 md:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={motionViewport}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden px-6 py-16 text-center md:px-12 md:py-20"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(130,150,255,0.35),transparent_65%)] blur-2xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9fb5ff]/50 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9fb5ff]/50 to-transparent"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold text-white md:text-5xl">
              {service.ctaHeadline}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100/90">
              {service.ctaBody}
            </p>
            <TrackedCtaLink
              href="/contact-us"
              eventProperties={{
                source: "service_page_bottom",
                service: service.slug,
                destination: "/contact-us",
                label: "Get a Demo Call",
              }}
              className="btn-primary mt-9 inline-flex"
            >
              Get a Demo Call
            </TrackedCtaLink>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
