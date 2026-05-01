import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { Faqs } from "@/components/landing/Faqs";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { UseCases } from "@/components/landing/UseCases";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <main className="relative z-10">
        <section id="hero" className="scroll-mt-28">
          <Hero />
        </section>

        <section className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#111969]/22 to-transparent">
          <HowItWorks />
        </section>

        <section className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#0f1760]/28 to-transparent">
          <UseCases />
        </section>

        <section className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#101965]/25 to-transparent">
          <Features />
        </section>

        <section className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#0e145a]/26 to-transparent">
          <Testimonials />
        </section>

        <section className="landing-section scroll-mt-28 bg-gradient-to-b from-transparent via-[#0f165f]/22 to-transparent">
          <Faqs />
        </section>

        <section className="scroll-mt-28">
          <FinalCta />
        </section>
      </main>
    </div>
  );
}
