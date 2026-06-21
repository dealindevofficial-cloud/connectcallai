import Link from "next/link";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";

type TrustSection = {
  title: string;
  body: string | string[];
};

type TrustContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: TrustSection[];
  ctaTitle?: string;
  ctaBody?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
};

export function TrustContentPage({
  eyebrow,
  title,
  intro,
  sections,
  ctaTitle = "Ready to talk through your call flow?",
  ctaBody = "Book a free demo and we will review your goals, handoff needs, and privacy expectations before recommending a setup.",
  secondaryCtaHref = "/trust-center",
  secondaryCtaLabel = "Visit Trust Center",
}: TrustContentPageProps) {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <main className="relative z-10 px-5 py-16 md:px-8 md:py-24">
        <article className="mx-auto max-w-4xl">
          <header className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">{title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-blue-100/82 md:text-lg">
              {intro}
            </p>
          </header>

          <div className="space-y-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-white/14 bg-[linear-gradient(135deg,rgba(67,84,175,0.34),rgba(12,18,80,0.66))] p-6 shadow-[0_18px_58px_rgba(4,10,45,0.34)] backdrop-blur-xl md:p-8"
              >
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                {Array.isArray(section.body) ? (
                  <ul className="mt-4 space-y-3 text-blue-100/82">
                    {section.body.map((item) => (
                      <li key={item} className="leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 leading-8 text-blue-100/82">{section.body}</p>
                )}
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-[#9fb3ff]/35 bg-[#101b74]/72 p-6 text-center shadow-[0_22px_70px_rgba(64,84,210,0.25)] backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-semibold text-white">{ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-blue-100/82">{ctaBody}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact-us" className="btn-primary">
                Book a Free Demo
              </Link>
              <Link href={secondaryCtaHref} className="btn-secondary">
                {secondaryCtaLabel}
              </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
