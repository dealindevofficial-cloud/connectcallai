import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCalendly } from "@/components/contact/ContactCalendly";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { getCalendlyEmbedUrl } from "@/lib/config/calendly";
import { pageDescriptions, pageTitles } from "@/lib/seo/page-metadata";

type ContactUsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: ContactUsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasQueryParams = Object.values(params).some((value) =>
    Array.isArray(value) ? value.some((entry) => entry.trim() !== "") : (value ?? "").trim() !== ""
  );

  return {
    title: pageTitles.contact,
    description: pageDescriptions.contact,
    alternates: {
      canonical: "/contact-us",
    },
    robots: hasQueryParams
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
  };
}

function getEmbedDomain(): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return undefined;
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return undefined;
  }
}

const calendlyUrl = getCalendlyEmbedUrl(
  process.env.NEXT_PUBLIC_CALENDLY_URL,
  getEmbedDomain()
);

function ContactFormFallback() {
  return (
    <div className="rounded-3xl border border-[#92abff]/30 bg-[linear-gradient(145deg,rgba(19,30,112,0.82),rgba(9,14,62,0.96))] p-6 text-blue-100/80 md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="h-8 w-3/4 rounded-lg bg-white/10" />
          <div className="h-16 w-full rounded-lg bg-white/8" />
        </div>
        <div className="space-y-3 rounded-2xl border border-white/12 bg-white/5 p-5">
          <div className="h-12 w-full rounded-xl bg-white/8" />
          <div className="h-12 w-full rounded-xl bg-white/8" />
          <div className="h-32 w-full rounded-xl bg-white/8" />
          <div className="h-12 w-full rounded-full bg-white/10" />
        </div>
      </div>
      <p className="mt-4 text-sm text-blue-100/70">Loading contact form...</p>
    </div>
  );
}

export default function ContactUsPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <main className="relative z-10 overflow-x-clip">
        <ContactHero />

        <section
          id="contact-form"
          className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#111969]/22 to-transparent"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
            <Suspense fallback={<ContactFormFallback />}>
              <ContactForm />
            </Suspense>
          </div>
        </section>

        <section className="landing-section bg-gradient-to-b from-transparent via-[#0f1760]/26 to-transparent">
          <ContactCalendly calendlyUrl={calendlyUrl} />
        </section>
      </main>
    </div>
  );
}
