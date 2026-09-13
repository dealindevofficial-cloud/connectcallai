import type { Metadata } from "next";
import Link from "next/link";
import { industries } from "@/lib/industries-data";
import { INDUSTRY_SLUGS, getAssistantIdForIndustry } from "@/lib/vapi/assistants";
import { TestCallConsole } from "./ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browser test call",
  robots: { index: false, follow: false },
};

export default function AdminTestCallPage() {
  // Only the slug, label, and availability cross to the client; assistant IDs stay
  // server-side until /api/admin/vapi-assistant is called to start a call.
  const options = INDUSTRY_SLUGS.map((slug) => ({
    slug,
    name: industries.find((industry) => industry.slug === slug)?.name ?? slug,
    configured: Boolean(getAssistantIdForIndustry(slug)),
  }));

  return (
    <main className="relative flex-1 overflow-hidden">
      <section className="landing-section px-6 py-16 sm:px-10">
        <div className="landing-grid pointer-events-none" />
        <div className="landing-noise pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Admin</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Browser test call</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100/75">
                Talk to any industry assistant straight from this page over your microphone.
                No phone number required.
              </p>
            </div>
            <Link href="/ccai-admin/blog" className="btn-secondary">
              Back to admin
            </Link>
          </div>

          <TestCallConsole
            options={options}
            publicKeyConfigured={Boolean(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)}
          />
        </div>
      </section>
    </main>
  );
}
