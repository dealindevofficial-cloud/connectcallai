"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Renders when the root layout fails. Must include html/body (replaces root layout).
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col items-center justify-center bg-[#070b3a] px-4 antialiased text-[#f2f5ff]"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-white/14 p-8 text-center shadow-[0_20px_60px_rgba(7,10,48,0.45)]"
          style={{
            background: "linear-gradient(130deg, rgba(27, 39, 130, 0.72), rgba(12, 18, 80, 0.86))",
          }}
        >
          <p className="mb-4 inline-flex rounded-full border border-[rgba(147,164,255,0.45)] bg-[rgba(22,35,118,0.55)] px-3 py-1.5 text-xs text-[rgba(221,231,255,0.95)]">
            Application error
          </p>
          <h1 className="text-xl font-bold text-white sm:text-2xl">ConnectCall AI</h1>
          <p className="mt-3 text-sm leading-relaxed text-[rgba(221,231,255,0.78)]">
            A critical error prevented this page from loading. Please refresh or try again shortly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4e68ff] to-[#855dff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(108,120,255,0.42)]"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(156,173,255,0.48)] bg-[rgba(10,18,82,0.42)] px-5 py-2.5 text-sm font-medium text-[rgb(227,234,255)]"
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
