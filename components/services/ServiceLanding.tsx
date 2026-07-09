import Link from "next/link";
import { JsonLdFaq } from "@/components/blog/JsonLdFaq";
import { TrackedCtaLink } from "@/components/analytics/TrackedLink";
import { getServiceBySlug, getServicePath, type ServicePage } from "@/lib/services-data";
import { SITE_NAME } from "@/lib/seo/page-metadata";

type ServiceLandingProps = {
  service: ServicePage;
  canonicalUrl?: string;
};

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="chip">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-blue-100/80">{body}</p> : null}
    </div>
  );
}

export function ServiceLanding({ service, canonicalUrl }: ServiceLandingProps) {
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

      <section className="relative text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,137,255,0.24),rgba(15,21,84,0)_66%)] blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,153,255,0.16),transparent_58%)]" />
        </div>

        <p className="chip mx-auto">AI voice agent service</p>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold text-white md:text-6xl">
          {service.seoTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100/85">
          {service.heroSubtext}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {service.painPoints.map((painPoint, index) => (
          <article
            key={painPoint}
            className="rounded-3xl border border-[#ff9cb5]/24 bg-[linear-gradient(145deg,rgba(50,27,102,0.56),rgba(12,17,76,0.82))] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd5df]">
              Pain Point {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-4 text-sm leading-7 text-blue-50/90">{painPoint}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow="How it works"
          title={`${service.navLabel} Workflow`}
          body="Connect Call AI turns your approved scripts, routing rules, and follow-up steps into a phone workflow that can answer consistently and hand off cleanly."
        />
        <div className="relative pl-10 md:pl-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[15px] top-3 h-[calc(100%-10px)] w-px bg-gradient-to-b from-[#9cb2ff] via-[#7f96ff]/50 to-transparent md:left-[21px]"
          />
          <div className="space-y-6">
            {service.howItWorks.map((step, index) => (
              <article key={step} className="relative rounded-2xl border border-white/15 bg-white/5 p-5">
                <span
                  aria-hidden="true"
                  className="absolute -left-10 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#9db5ff]/45 bg-[#84a2ff]/18 text-xs font-semibold text-white md:-left-14 md:h-10 md:w-10"
                >
                  {index + 1}
                </span>
                <p className="text-sm leading-7 text-blue-50/90">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Use cases"
          title={`Where ${service.navLabel} Fits`}
          body="These are the call types buyers usually automate first because they create missed revenue, long hold times, or repetitive front-desk work."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {service.useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(25,39,132,0.74),rgba(11,17,74,0.92))] p-5"
            >
              <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>
              <p className="mt-2 text-sm leading-7 text-blue-100/82">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 md:p-8">
          <SectionHeading
            eyebrow="Sample call flow"
            title="From Pickup to Next Step"
            body="A clear call path helps callers know what is happening and gives your team the details they need after the conversation."
          />
          <ol className="mt-6 space-y-3">
            {service.sampleCallFlow.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-7 text-blue-50/90">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9db5ff]/40 bg-[#84a2ff]/15 text-xs font-semibold text-[#d7e2ff]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl border border-white/12 bg-[linear-gradient(145deg,rgba(20,30,112,0.62),rgba(9,14,66,0.72))] p-6 md:p-8">
          <SectionHeading
            eyebrow="Integrations"
            title="Connect the Call Outcome"
            body="Send call outcomes into the systems your team already uses for scheduling, sales follow-up, support, and operations."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {service.integrations.map((integration) => (
              <span
                key={integration}
                className="rounded-full border border-[#9fb5ff]/30 bg-[#6f8eff]/12 px-3 py-2 text-sm text-blue-50/90"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#9fb5ff]/28 bg-[linear-gradient(145deg,rgba(18,31,120,0.76),rgba(8,14,64,0.9))] p-6 md:p-8">
          <SectionHeading eyebrow="Pricing and ROI" title="Model the Cost Against Missed Calls" />
          <p className="mt-5 text-sm leading-7 text-blue-100/84">{service.pricingAngle}</p>
          <Link href="/price-estimator" className="btn-secondary mt-6">
            Estimate Pricing
          </Link>
        </div>

        <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
            Proof points
          </p>
          <ul className="mt-5 space-y-3">
            {service.proofPoints.map((proofPoint) => (
              <li key={proofPoint} className="flex gap-3 text-sm leading-7 text-blue-50/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9eb6ff]" />
                <span>{proofPoint}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Industries served"
          title="Common Industries for This Service"
          body="Explore how this service supports vertical-specific call flows, intake questions, escalation rules, and booking outcomes."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.industriesServed.map((industry) => (
            <Link
              key={industry.href}
              href={industry.href}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm font-medium text-blue-50 transition hover:border-[#9fb5ff]/55 hover:bg-white/10"
            >
              {industry.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="FAQs"
          title={`Questions About ${service.navLabel}`}
          body="Visible FAQs support long-tail search intent and match the FAQ structured data on this page."
        />
        <div className="mt-8 space-y-3">
          {service.faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-white/12 bg-[#0e145d]/60 p-5">
              <h3 className="text-base font-semibold text-white md:text-lg">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-blue-100/82">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/55">
                Related services
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Related AI Calling Services</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  href={getServicePath(relatedService)}
                  className="rounded-2xl border border-white/15 bg-[#0a145b]/65 p-4 transition hover:border-[#9fb5ff]/55 hover:bg-[#101b71]"
                >
                  <h3 className="font-semibold text-white">{relatedService.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/78">
                    {relatedService.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#172484] to-[#2b1f82] p-8 text-center md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(186,201,255,0.35),transparent_52%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">{service.ctaHeadline}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100/90">{service.ctaBody}</p>
            <TrackedCtaLink
              href="/contact-us"
              eventProperties={{
                source: "service_page_bottom",
                service: service.slug,
                destination: "/contact-us",
                label: "Get a Demo Call",
              }}
              className="btn-primary mt-8 inline-flex"
            >
              Get a Demo Call
            </TrackedCtaLink>
          </div>
        </div>
      </section>
    </main>
  );
}
