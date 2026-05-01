import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";

export const metadata: Metadata = {
  title: "Contact Us | CCAI",
  description: "Book a demo and connect with the CCAI team.",
};

const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/connectcallaiofficial/30min";

export default function ContactUsPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      <main className="relative z-10 px-5 pb-16 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto w-full max-w-6xl">
          <section className="mb-8 text-center md:mb-10">
            <h1 className="text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100/80">
              Tell us about your goals and our team will help you launch the right AI calling
              setup for your business.
            </p>
          </section>

          <section className="space-y-6 md:space-y-8">
            <ContactForm />

            <div>
              <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
                Book your consultation
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-blue-100/85">
                Choose a time that works for you. We will review your goals, map your call flow,
                and recommend the best setup.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#0b145f]/65">
                <iframe
                  src={calendlyUrl}
                  title="Book a consultation with Calendly"
                  className="h-[700px] w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
