"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Same structure as `BackgroundFX` (client components cannot import that server module). */
function ErrorBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="landing-vignette" />
      <div className="landing-grid" />
      <div className="landing-noise" />
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />
      <div className="glow-orb glow-orb-accent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(83,126,255,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(49,200,255,0.12),transparent_55%)]" />
    </div>
  );
}

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="relative isolate min-h-[calc(100vh-12rem)] overflow-x-clip bg-[#070b3a]">
      <ErrorBackground />
      <main className="relative z-10 flex min-h-[55vh] flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="glass-card w-full max-w-lg rounded-2xl p-8 text-center sm:p-10">
          <p className="chip mb-5">Something went wrong</p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">We hit a snag</h1>
          <p className="mt-4 text-sm leading-relaxed text-[rgba(221,231,255,0.78)] sm:text-base">
            An unexpected error occurred. You can try again, or return home while we sort things out.
          </p>
          {process.env.NODE_ENV === "development" && error.message ? (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 font-mono text-left text-xs text-red-200/90">
              {error.message}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <button type="button" className="btn-primary justify-center" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="btn-secondary justify-center">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
