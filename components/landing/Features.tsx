"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/landing-data";

type FeatureCardProps = {
  title: string;
  detail: string;
  index: number;
};

function FeatureCard({ title, detail, index }: FeatureCardProps) {
  const accents = [
    "from-[#d5d7ff]/65 to-[#9da9ff]/20",
    "from-[#cde7ff]/65 to-[#89beff]/20",
    "from-[#f0d6ff]/65 to-[#b590ff]/20",
    "from-[#ccf7ff]/65 to-[#72d2ff]/20",
    "from-[#e8dcff]/65 to-[#91a0ff]/20",
  ];
  const glyphs = ["✦", "◎", "◈", "✧", "⬢"];
  const stickerSets = [
    ["🤖", "🛰️", "✨"],
    ["📞", "🔔", "📡"],
    ["⚡", "🧠", "🌀"],
    ["🎧", "💬", "🌟"],
    ["🛡️", "🚀", "🔷"],
  ];
  const positionSets = [
    ["-left-20 top-0", "-right-20 top-10", "left-4 -bottom-12"],
    ["-left-16 top-14", "right-2 -top-12", "-right-16 bottom-8"],
    ["left-8 -top-12", "-left-20 bottom-8", "-right-16 top-1/2"],
    ["-left-16 top-1/3", "right-4 -top-12", "right-0 -bottom-12"],
    ["-left-18 top-6", "-right-20 top-1/3", "left-14 -bottom-12"],
  ];
  const fromLeft = index % 2 === 0;
  const offsetX = fromLeft ? -140 : 140;
  const activeStickers = stickerSets[index % stickerSets.length];
  const activePositions = positionSets[index % positionSets.length];
  const viewportConfig = { once: false, amount: 0.25, margin: "-5% 0px -5% 0px" } as const;

  return (
    <motion.div
      initial={{ x: offsetX, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={viewportConfig}
      transition={{
        duration: 1.05,
        delay: index * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative h-full overflow-visible"
    >
      {activeStickers.map((sticker, stickerIndex) => (
        <motion.span
          key={`${title}-sticker-${stickerIndex}`}
          aria-hidden
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          whileInView={{ opacity: [0, 0.9, 0.7], scale: [0.6, 1.08, 1], y: [8, -4, 0] }}
          viewport={viewportConfig}
          transition={{
            duration: 0.8,
            delay: index * 0.14 + 0.15 + stickerIndex * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`pointer-events-none absolute z-20 drop-shadow-[0_8px_14px_rgba(12,21,64,0.4)] ${activePositions[stickerIndex]}`}
        >
          <motion.span
            animate={{ y: [0, -6, 0], rotate: [-5, 4, -5] }}
            transition={{
              duration: 2 + stickerIndex * 0.45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: stickerIndex * 0.15,
            }}
            className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xl backdrop-blur-md md:text-2xl"
          >
            {sticker}
          </motion.span>
        </motion.span>
      ))}

      <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-6 shadow-[0_24px_60px_rgba(4,10,32,0.38)] backdrop-blur-xl md:p-7">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_8%_0%,rgba(255,255,255,0.42),rgba(255,255,255,0)_48%)]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-3xl border border-white/20" />
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${accents[index % accents.length]} opacity-70 blur-2xl`}
        />
        <motion.div
          initial={{ x: fromLeft ? "-130%" : "130%", opacity: 0 }}
          whileInView={{ x: fromLeft ? "135%" : "-135%", opacity: [0, 0.55, 0] }}
          viewport={viewportConfig}
          transition={{
            duration: 1.25,
            delay: index * 0.14 + 0.2,
            ease: "easeOut",
          }}
          className="pointer-events-none absolute -top-8 h-[150%] w-24 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-md"
        />
        <div className="relative">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          whileInView={{ scale: [0.75, 1.12, 1], opacity: 1 }}
          viewport={viewportConfig}
          transition={{
            duration: 0.8,
            delay: index * 0.14 + 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-lg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
        >
          {glyphs[index % glyphs.length]}
        </motion.div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-blue-50/90 md:text-base">{detail}</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-100/75">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-200/80" />
          Core capability
        </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-28 relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24"
    >
      <div className="pointer-events-none absolute inset-x-16 top-8 h-48 rounded-full bg-[#7f94ff]/20 blur-3xl md:top-4" />
      <div className="pointer-events-none absolute -right-12 top-28 h-40 w-40 rounded-full bg-[#b982ff]/20 blur-3xl" />

      <div className="relative">
        <h2 className="mt-3 text-center text-4xl font-bold text-white md:text-5xl">Core features</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-blue-100/80 md:text-base">
          Every ConnectCallAI deployment ships with production-ready capabilities designed for
          speed, reliability, and natural customer conversations.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              detail={feature.detail}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
