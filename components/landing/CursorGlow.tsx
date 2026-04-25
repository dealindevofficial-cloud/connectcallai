"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer:fine)");
    const updateEnabled = () => setEnabled(mediaQuery.matches);

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    if (!enabled) {
      return;
    }
    const onMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, prefersReducedMotion]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,145,255,0.42)_0%,rgba(120,145,255,0.1)_45%,transparent_72%)] blur-2xl"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 28, stiffness: 180, mass: 0.2 }}
    />
  );
}
