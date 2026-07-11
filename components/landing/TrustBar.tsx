"use client";

import { useReducedMotion } from "framer-motion";
import { trustLogos } from "@/lib/landing-data";

function LogoItem({ name }: { name: string }) {
  return (
    <span className="trust-marquee-item shrink-0 px-6 text-sm font-medium tracking-wide text-blue-100/55 md:px-8 md:text-[0.95rem]">
      {name}
    </span>
  );
}

export function TrustBar() {
  const reducedMotion = useReducedMotion();
  const logos = [...trustLogos];

  return (
    <section
      aria-label="Trusted by businesses"
      className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8 md:py-8"
    >
      {reducedMotion ? (
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {logos.map((logo) => (
            <LogoItem key={logo} name={logo} />
          ))}
        </div>
      ) : (
        <div className="trust-marquee relative overflow-hidden">
          <div className="trust-marquee-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {logos.map((logo) => (
                  <LogoItem key={`${copy}-${logo}`} name={logo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
