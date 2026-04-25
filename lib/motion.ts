import type { Variants } from "framer-motion";

type MotionTuningOptions = {
  reducedMotion?: boolean;
  isMobile?: boolean;
};

type WaveAnimationConfig = {
  animate?: { height: number[] };
  transition?: {
    repeat: number;
    duration: number;
    delay: number;
    ease: "easeInOut";
  };
};

export const motionViewport = { once: true, amount: 0.2 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const floatLoop = {
  y: [-8, 8, -8],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
};

export const pulseLoop = {
  scale: [1, 1.08, 1],
  opacity: [0.4, 0.8, 0.4],
  transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const },
};

export const cardHover = {
  whileHover: {
    y: -6,
    rotateX: 2,
    rotateY: -2,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

export const shimmerLoop = {
  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  transition: { duration: 8, repeat: Infinity, ease: "linear" as const },
};

export function getMotionTuning(options: MotionTuningOptions) {
  const reduced = Boolean(options.reducedMotion);
  const mobile = Boolean(options.isMobile);
  const intensity = reduced ? 0 : mobile ? 0.65 : 1;

  return {
    reduced,
    mobile,
    intensity,
    floatDuration: 6 + (mobile ? 1.2 : 0),
    pulseDuration: mobile ? 3.2 : 2.4,
    waveBaseDuration: mobile ? 1.45 : 1.1,
    statusDuration: mobile ? 4.2 : 3.2,
  };
}

export function createFloatLoop(options: MotionTuningOptions) {
  const tuning = getMotionTuning(options);
  if (tuning.reduced) {
    return undefined;
  }

  return {
    y: [-8 * tuning.intensity, 8 * tuning.intensity, -8 * tuning.intensity],
    transition: {
      duration: tuning.floatDuration,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}

export function createPulseLoop(options: MotionTuningOptions) {
  const tuning = getMotionTuning(options);
  if (tuning.reduced) {
    return undefined;
  }

  const maxScale = 1 + 0.08 * tuning.intensity;
  return {
    scale: [1, maxScale, 1],
    opacity: [0.35, 0.8, 0.35],
    transition: {
      duration: tuning.pulseDuration,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}

export function getWaveAnimationConfig(
  height: number,
  index: number,
  options: MotionTuningOptions,
): WaveAnimationConfig {
  const tuning = getMotionTuning(options);
  if (tuning.reduced) {
    return {};
  }

  const low = height * (0.55 + (1 - tuning.intensity) * 0.15);
  const mid = height;
  const high = height * (0.65 + (1 - tuning.intensity) * 0.1);

  return {
    animate: { height: [low, mid, high] },
    transition: {
      repeat: Infinity,
      duration: tuning.waveBaseDuration + index * 0.03,
      delay: index * 0.05,
      ease: "easeInOut",
    },
  };
}
