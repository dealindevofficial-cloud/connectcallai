"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatMoney(value: number) {
  return CURRENCY_FORMATTER.format(Math.max(0, Math.round(value)));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
}

export function PriceEstimator() {
  const [monthlyMinutes, setMonthlyMinutes] = useState(250);
  const perMinuteCost = 0.45;

  const estimate = useMemo(() => {
    const aiRuntimeFee = monthlyMinutes * perMinuteCost;

    return {
      minutes: monthlyMinutes,
      aiRuntimeFee,
      aiTotal: aiRuntimeFee,
    };
  }, [monthlyMinutes, perMinuteCost]);

  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-16 md:px-8">
      <div className="relative mb-10 text-center">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[2%] top-2 text-xl font-bold text-emerald-300/75 sm:text-2xl md:left-[3%] md:top-1 md:text-3xl md:text-emerald-300/80"
          style={{ animation: "money-float 3.2s ease-in-out infinite" }}
        >
          $
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-[2%] top-3 text-xl font-bold text-cyan-300/75 sm:text-2xl md:top-4 md:text-3xl md:text-cyan-300/85"
          style={{ animation: "money-float 3.8s ease-in-out infinite 0.35s" }}
        >
          $
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute left-[15%] top-16 text-base font-bold text-violet-300/65 sm:text-lg md:left-[17%] md:top-20 md:text-2xl md:text-violet-300/75"
          style={{ animation: "money-float 3s ease-in-out infinite 0.7s" }}
        >
          $
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-[15%] top-16 text-base font-bold text-indigo-200/65 sm:text-lg md:right-[17%] md:top-20 md:text-2xl md:text-indigo-200/80"
          style={{ animation: "money-float 4s ease-in-out infinite 0.2s" }}
        >
          $
        </span>
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-semibold text-white md:text-5xl">
          Estimate your monthly calling cost
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100/80 md:text-base">
          Slide minutes and get an instant estimate at $0.45 per minute.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/18 bg-[linear-gradient(135deg,rgba(67,84,175,0.38),rgba(20,31,106,0.52))] p-6 shadow-[0_18px_60px_rgba(9,16,65,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.28),transparent_38%),radial-gradient(circle_at_82%_86%,rgba(128,148,255,0.22),transparent_44%)]" />
          <div className="relative">
            <h2 className="text-xl font-semibold text-white">Input</h2>
            <p className="mt-2 text-sm text-blue-100/75">
              Adjust your monthly calling minutes with the slider.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-100/90">Total calling minutes / month</span>
                  <span className="text-sm font-semibold text-white">{formatNumber(monthlyMinutes)} min</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={monthlyMinutes}
                  onChange={(event) => setMonthlyMinutes(Number(event.target.value) || 0)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#7e92ff]"
                />
                <div className="mt-2 flex items-center justify-between text-[11px] text-blue-100/55">
                  <span>0 min</span>
                  <span>2,500 min</span>
                  <span>5,000 min</span>
                </div>
              </div>

              <div className="md:mt-26 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-blue-100/60">Quick preview</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-blue-100/65">Current minutes</p>
                    <p className="text-lg font-semibold text-white">{formatNumber(monthlyMinutes)}</p>
                  </div>
                  <div className="h-8 w-px bg-white/15" />
                  <div className="text-right">
                    <p className="text-xs text-blue-100/65">Estimated cost</p>
                    <p className="text-lg font-semibold text-white">{formatMoney(estimate.aiTotal)}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/18 bg-[linear-gradient(135deg,rgba(67,84,175,0.38),rgba(20,31,106,0.52))] p-6 shadow-[0_18px_60px_rgba(9,16,65,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.28),transparent_38%),radial-gradient(circle_at_82%_86%,rgba(128,148,255,0.22),transparent_44%)]" />
          <div className="relative">
            <h2 className="text-xl font-semibold text-white">Estimate</h2>
            <p className="mt-2 text-sm text-blue-100/75">Live monthly estimate based on your inputs.</p>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.14em] text-blue-100/70">Projected monthly cost</p>
              <p className="mt-2 text-4xl font-semibold text-white">{formatMoney(estimate.aiTotal)}</p>
              <p className="mt-2 text-sm text-blue-100/75">
                Calculated as total monthly minutes multiplied by ${perMinuteCost.toFixed(2)}.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Call minutes</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatNumber(estimate.minutes)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Runtime fee</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatMoney(estimate.aiRuntimeFee)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-blue-100/60">Per-minute rate</p>
                <p className="mt-1 text-xl font-semibold text-white">${perMinuteCost.toFixed(2)}</p>
              </div>
            </div>

            <Link
              href="/contact-us"
              className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#c4d0ff]/50 bg-gradient-to-r from-[#4c67ff] via-[#6d67ff] to-[#915eff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(93,110,255,0.4)] transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#5b74ff] hover:via-[#7a70ff] hover:to-[#a56cff] hover:shadow-[0_20px_48px_rgba(110,126,255,0.58)]"
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_22%,rgba(255,255,255,0.35)_48%,transparent_78%)] opacity-0 transition duration-500 group-hover:translate-x-8 group-hover:opacity-100" />
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="relative h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="6.5" width="18" height="11" rx="2.5" />
                <circle cx="12" cy="12" r="2.6" />
                <path d="M12 10.9v2.2" />
                <path d="M13.2 11.2c0-.45-.52-.8-1.2-.8s-1.2.35-1.2.8.52.75 1.2.75 1.2.35 1.2.8-.52.8-1.2.8-1.2-.35-1.2-.8" />
              </svg>
              <span className="relative">Get Quote</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
