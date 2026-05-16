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
  const perMinuteCost = 0.3;

  const estimate = useMemo(() => {
    const aiRuntimeFee = monthlyMinutes * perMinuteCost;

    return {
      minutes: monthlyMinutes,
      aiRuntimeFee,
      aiTotal: aiRuntimeFee,
    };
  }, [monthlyMinutes, perMinuteCost]);

  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({
      minutes: String(estimate.minutes),
      estimate: String(Math.round(estimate.aiTotal)),
      rate: perMinuteCost.toFixed(2),
    });
    return `/contact-us?${params.toString()}`;
  }, [estimate.aiTotal, estimate.minutes, perMinuteCost]);

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
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[linear-gradient(145deg,rgba(70,87,182,0.34),rgba(18,28,96,0.62))] p-5 shadow-[0_25px_80px_rgba(7,14,58,0.5),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_9%_14%,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_82%_87%,rgba(126,146,255,0.22),transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10">
          <div className="flex h-full flex-col lg:pr-4">
            <div className="mx-auto max-w-[24rem] text-center lg:flex lg:min-h-[108px] lg:flex-col lg:justify-center">
              <h2 className="text-xl font-semibold text-white">Build your call plan</h2>
              <p className="mt-2 text-sm text-blue-100/75">
                Adjust your monthly calling minutes with the slider.
              </p>
            </div>

            <div className="mx-auto mt-5 w-full max-w-[40rem] rounded-2xl border border-white/14 bg-black/10 p-5 md:p-7">
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

            <div className="mx-auto mt-4 w-full max-w-[34rem] space-y-4 lg:mt-auto">
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
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

          <div className="space-y-5 lg:border-l lg:border-white/12 lg:pl-8">
            <div className="lg:flex lg:min-h-[108px] lg:flex-col lg:justify-center">
              <h2 className="text-2xl font-semibold leading-tight text-white">Everything you need to launch AI calling</h2>
              <p className="mt-2 text-sm text-blue-100/78">
                Pick a proven agent or request a custom one. Training, onboarding, and optimization support are included.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200/30 bg-[linear-gradient(135deg,rgba(34,197,94,0.2),rgba(16,185,129,0.08))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <p className="text-[11px] uppercase tracking-[0.12em] text-blue-100/65">Monthly estimate</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatMoney(estimate.aiTotal)}</p>
                <p className="mt-1 text-xs text-blue-100/65">{formatNumber(estimate.minutes)} min selected</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-blue-100/65">Pricing model</p>
                <p className="mt-2 text-2xl font-semibold text-white">${perMinuteCost.toFixed(2)} / min</p>
                <p className="mt-1 text-xs text-blue-100/65">Pay as you go</p>
              </div>
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-start gap-3 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/12 text-xs font-semibold text-emerald-200"
                >
                  ✓
                </span>
                <p className="text-sm text-blue-100/90">Pre-built AI agents from our proven use-case library.</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/12 text-xs font-semibold text-emerald-200"
                >
                  ✓
                </span>
                <p className="text-sm text-blue-100/90">Custom AI agents tailored to your exact call flow and goals.</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/12 text-xs font-semibold text-emerald-200"
                >
                  ✓
                </span>
                <p className="text-sm text-blue-100/90">No upfront setup cost. Pay only for runtime usage.</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[1px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/12 text-xs font-semibold text-emerald-200"
                >
                  ✓
                </span>
                <p className="text-sm text-blue-100/90">Training and onboarding included so your team goes live quickly.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={quoteHref}
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#c4d0ff]/50 bg-gradient-to-r from-[#4c67ff] via-[#6d67ff] to-[#915eff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(93,110,255,0.4)] transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#5b74ff] hover:via-[#7a70ff] hover:to-[#a56cff] hover:shadow-[0_20px_48px_rgba(110,126,255,0.58)]"
              >
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_22%,rgba(255,255,255,0.35)_48%,transparent_78%)] opacity-0 transition duration-500 group-hover:translate-x-8 group-hover:opacity-100" />
                <span className="relative">Get my custom quote</span>
              </Link>
              <Link
                href="/industries"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/15"
              >
                Browse use cases
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
