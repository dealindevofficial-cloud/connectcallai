import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { CursorGlow } from "@/components/landing/CursorGlow";

export const metadata: Metadata = {
  title: "Page not found | CCAI",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#070b3a]">
      <BackgroundFX />
      <CursorGlow />
      {/* Match lander hero depth: section wash + center glow so vignette does not read as flat black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#111969]/28 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_32%,rgba(83,126,255,0.22),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(49,200,255,0.1),transparent_52%)]"
      />
      <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:min-h-[75vh] sm:py-24">
        <div className="glass-card w-full max-w-lg rounded-2xl p-8 text-center sm:p-10">
          <p className="chip mb-5">404</p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Page not found</h1>
          <p className="mt-4 text-sm leading-relaxed text-[rgba(221,231,255,0.78)] sm:text-base">
            This page doesn&apos;t exist, or the link may be outdated. Head back home or reach out if you need help.
          </p>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-primary justify-center">
              Back to home
            </Link>
            <Link href="/contact-us" className="btn-secondary justify-center">
              Contact us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
