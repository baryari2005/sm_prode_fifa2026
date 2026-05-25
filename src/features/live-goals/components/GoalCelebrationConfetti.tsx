"use client";

import { motion } from "framer-motion";

type Particle = {
  id: number;
  left: string;
  top: string;
  width: number;
  height: number;
  color: string;
  duration: number;
  delay: number;
  x: number;
  y: number;
  rotate: number;
  radius: string;
};

const COLORS = [
  "#ffffff",
  "#ef4444",
  "#22c55e",
  "#0ea5e9",
  "#facc15",
  "#f97316",
];

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9999) * 10000;
  return value - Math.floor(value);
}

const FALL_PARTICLES: Particle[] = Array.from({ length: 76 }, (_, index) => {
  const seed = index + 1;

  return {
    id: seed,
    left: `${seededRandom(seed) * 100}%`,
    top: `${-10 + seededRandom(seed + 2) * 32}%`,
    width: 5 + seededRandom(seed + 3) * 10,
    height: 8 + seededRandom(seed + 4) * 18,
    color: COLORS[Math.floor(seededRandom(seed + 5) * COLORS.length)],
    duration: 2.6 + seededRandom(seed + 6) * 1.8,
    delay: seededRandom(seed + 7) * 0.75,
    x: -70 + seededRandom(seed + 8) * 140,
    y: 520 + seededRandom(seed + 9) * 420,
    rotate: -420 + seededRandom(seed + 10) * 840,
    radius: seededRandom(seed + 11) > 0.45 ? "2px" : "999px",
  };
});

const BURST_PARTICLES: Particle[] = Array.from({ length: 38 }, (_, index) => {
  const seed = index + 101;
  const fromLeft = index % 2 === 0;

  return {
    id: seed,
    left: fromLeft ? "12%" : "88%",
    top: `${42 + seededRandom(seed + 1) * 28}%`,
    width: 6 + seededRandom(seed + 2) * 12,
    height: 8 + seededRandom(seed + 3) * 20,
    color: COLORS[Math.floor(seededRandom(seed + 4) * COLORS.length)],
    duration: 1.7 + seededRandom(seed + 5) * 1.1,
    delay: seededRandom(seed + 6) * 0.45,
    x: fromLeft
      ? 180 + seededRandom(seed + 7) * 320
      : -180 - seededRandom(seed + 8) * 320,
    y: -220 + seededRandom(seed + 9) * 420,
    rotate: -540 + seededRandom(seed + 10) * 1080,
    radius: "2px",
  };
});

const PARTICLES = [...FALL_PARTICLES, ...BURST_PARTICLES];

export function GoalCelebrationConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.width,
            height: particle.height,
            backgroundColor: particle.color,
            borderRadius: particle.radius,
            boxShadow: `0 0 14px ${particle.color}`,
          }}
          initial={{
            opacity: 0,
            scale: 0.35,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.35, 1, 0.95, 0.55],
            x: [0, particle.x],
            y: [0, particle.y],
            rotate: [0, particle.rotate],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Líneas deportivas de velocidad */}
      <motion.div
        className="absolute left-[-20%] top-[36%] h-[2px] w-[140%] -rotate-12 bg-white/18 blur-[1px]"
        initial={{ opacity: 0, x: -180 }}
        animate={{ opacity: [0, 0.75, 0], x: 220 }}
        transition={{ duration: 1.15, delay: 0.08, ease: "easeOut" }}
      />

      <motion.div
        className="absolute left-[-20%] top-[56%] h-[2px] w-[140%] rotate-12 bg-emerald-300/20 blur-[1px]"
        initial={{ opacity: 0, x: 180 }}
        animate={{ opacity: [0, 0.65, 0], x: -220 }}
        transition={{ duration: 1.25, delay: 0.18, ease: "easeOut" }}
      />

      <motion.div
        className="absolute left-[8%] top-[18%] h-[72%] w-[2px] -rotate-[24deg] bg-white/10 blur-sm"
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={{ opacity: [0, 0.6, 0], scaleY: [0.4, 1, 0.85] }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="absolute right-[8%] top-[18%] h-[72%] w-[2px] rotate-[24deg] bg-white/10 blur-sm"
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={{ opacity: [0, 0.6, 0], scaleY: [0.4, 1, 0.85] }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}