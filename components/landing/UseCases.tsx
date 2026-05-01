"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useCases } from "@/lib/landing-data";
import { cardHover, fadeUp } from "@/lib/motion";

const useCaseVisuals: Record<
  string,
  { icon: string; accent: string; chip: string; metricGlow: string }
> = {
  "Real Estate": {
    icon: "🏠",
    accent: "from-[#6b7dff]/45 via-[#4e66ff]/18 to-transparent",
    chip: "from-[#90a5ff]/30 to-[#6d86ff]/15",
    metricGlow: "shadow-[0_0_22px_rgba(114,136,255,0.35)]",
  },
  Restaurants: {
    icon: "🍽️",
    accent: "from-[#5fd3ff]/45 via-[#4f89ff]/18 to-transparent",
    chip: "from-[#88e4ff]/30 to-[#5fafff]/15",
    metricGlow: "shadow-[0_0_22px_rgba(91,186,255,0.35)]",
  },
  Hospitals: {
    icon: "🏥",
    accent: "from-[#8a9bff]/45 via-[#6c7eff]/18 to-transparent",
    chip: "from-[#a5b3ff]/30 to-[#7c90ff]/15",
    metricGlow: "shadow-[0_0_22px_rgba(132,145,255,0.35)]",
  },
  "Pet Clinics": {
    icon: "🐾",
    accent: "from-[#7fcbff]/45 via-[#6a87ff]/18 to-transparent",
    chip: "from-[#9bddff]/30 to-[#78a1ff]/15",
    metricGlow: "shadow-[0_0_22px_rgba(116,176,255,0.35)]",
  },
};

function renderUseCaseIcon(icon: string, className: string) {
  return (
    <span
      aria-hidden
      className={`${className} ${icon === "🐾" ? "inline-block [filter:grayscale(1)_brightness(2.15)_contrast(1.12)]" : ""}`}
    >
      {icon}
    </span>
  );
}

export function UseCases() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((targetIndex: number) => {
    const track = trackRef.current;
    if (!track) return;

    const children = Array.from(track.children);
    const target = children[targetIndex] as HTMLElement | undefined;
    if (!target) return;

    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  const scrollByDirection = useCallback(
    (direction: "next" | "prev") => {
      const track = trackRef.current;
      if (!track) return;

      const maxIndex = useCases.length - 1;
      const nextIndex =
        direction === "next"
          ? Math.min(activeIndex + 1, maxIndex)
          : Math.max(activeIndex - 1, 0);

      scrollToIndex(nextIndex);
    },
    [activeIndex, scrollToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      if (!children.length) return;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      children.forEach((child, index) => {
        const distance = Math.abs(track.scrollLeft - child.offsetLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    event.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    startScrollLeftRef.current = track.scrollLeft;
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isDraggingRef.current) return;

    event.preventDefault();
    const deltaX = event.clientX - dragStartXRef.current;
    track.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      id="use-cases"
      className="scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20"
    >
      <h2 className="text-center text-4xl font-bold text-white md:text-5xl">Use cases</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-blue-100/80">
        See how teams across industries use ConnectCallAI to convert more calls into outcomes.
      </p>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection("prev")}
            disabled={activeIndex === 0}
            aria-label="Previous use case"
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#93a6ff]/70"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection("next")}
            disabled={activeIndex === useCases.length - 1}
            aria-label="Next use case"
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#93a6ff]/70"
          >
            Next
          </button>
        </div>

        <motion.div
          ref={trackRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className="-mt-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pt-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:cursor-grab md:active:cursor-grabbing"
        >
        {useCases.map((item) => {
          const visual = useCaseVisuals[item.name] ?? {
            icon: "✨",
            accent: "from-[#7d8eff]/40 via-[#6377ff]/15 to-transparent",
            chip: "from-[#9dadff]/25 to-[#7085ff]/10",
            metricGlow: "shadow-[0_0_18px_rgba(124,141,255,0.3)]",
          };

          return (
          <motion.article
            key={item.name}
            variants={fadeUp}
            whileHover={cardHover.whileHover}
            className="group relative w-full shrink-0 snap-start overflow-hidden rounded-2xl border border-white/14 bg-[#0f155f]/75 p-6 select-none md:w-[calc(50%-0.625rem)]"
            draggable={false}
          >
            <div className="absolute inset-0 rounded-2xl border border-transparent transition group-hover:border-[#93a6ff]/70" />
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${visual.accent} blur-2xl`}
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-20 drop-shadow-[0_6px_20px_rgba(126,146,255,0.45)] transition-opacity duration-300 group-hover:opacity-30">
              {renderUseCaseIcon(visual.icon, "text-6xl md:text-7xl")}
            </div>
            <div className="relative flex items-center justify-between gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-br ${visual.chip} px-3 py-1.5 text-sm font-medium text-blue-100`}
              >
                {renderUseCaseIcon(visual.icon, "text-base")}
                {item.name}
              </div>
            </div>
            <p className="relative mt-3 text-lg font-semibold text-white">{item.outcome}</p>
            <p
              className={`relative mt-5 inline-flex rounded-full border border-white/20 bg-[#1a2a8a]/60 px-3 py-1.5 text-sm font-semibold text-[#d8e2ff] ${visual.metricGlow}`}
            >
              {item.metric}
            </p>
          </motion.article>
          );
        })}
        </motion.div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {useCases.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to ${item.name}`}
              aria-current={activeIndex === index}
              className={`h-2.5 w-2.5 rounded-full transition ${
                activeIndex === index ? "bg-white" : "bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
