import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { DemoForm } from "@/components/landing/DemoForm";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Testimonials } from "@/components/landing/Testimonials";
import { UseCases } from "@/components/landing/UseCases";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <section id="hero" className="scroll-mt-28">
          <Hero />
        </section>

        <section className="scroll-mt-28 bg-gradient-to-b from-transparent via-[#111969]/22 to-transparent">
          <HowItWorks />
        </section>

        <section className="scroll-mt-28 bg-gradient-to-b from-transparent via-[#0f1760]/28 to-transparent">
          <UseCases />
        </section>

        <section className="scroll-mt-28 bg-gradient-to-b from-transparent via-[#101965]/25 to-transparent">
          <Features />
        </section>

        <section className="scroll-mt-28 bg-gradient-to-b from-transparent via-[#0f165f]/22 to-transparent">
          <DemoForm />
        </section>

        <section className="scroll-mt-28 bg-gradient-to-b from-transparent via-[#0e145a]/26 to-transparent">
          <Testimonials />
        </section>

        <section className="scroll-mt-28">
          <FinalCta />
        </section>
      </main>
    </div>
  );
}
