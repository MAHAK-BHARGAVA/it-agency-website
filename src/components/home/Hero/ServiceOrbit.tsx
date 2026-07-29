"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Palette,
  Cloud,
  Smartphone,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const services = [
  { icon: Code2, label: "Development", angle: -90 },
  { icon: Palette, label: "Design", angle: -30 },
  { icon: Cloud, label: "Cloud", angle: 30 },
  { icon: Smartphone, label: "Mobile", angle: 90 },
  { icon: BarChart3, label: "Analytics", angle: 150 },
  { icon: ShieldCheck, label: "Security", angle: 210 },
];

const RADIUS_PCT = 36; // orbit radius as % of container

export default function ServiceOrbit() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative aspect-square w-full max-w-[650px]">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.3, 0.55, 0.3], scale: [0.95, 1.05, 0.95] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-[100px] will-change-transform"
      />

      {/* Connection lines */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {services.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const x = 50 + RADIUS_PCT * Math.cos(rad);
          const y = 50 + RADIUS_PCT * Math.sin(rad);
          return (
            <motion.line
              key={s.label}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="rgba(163,230,53,0.35)"
              strokeWidth="0.4"
              strokeDasharray="2 3"
              animate={
                shouldReduceMotion ? undefined : { strokeDashoffset: [0, -10] }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.15,
              }}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r={RADIUS_PCT}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          fill="none"
        />
      </svg>

      {/* Slow-rotating outer ring */}
      <motion.div
        aria-hidden
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 will-change-transform"
      />

      {/* Central glowing core */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.06, 1],
                boxShadow: [
                  "0 0 40px rgba(163,230,53,0.25)",
                  "0 0 70px rgba(163,230,53,0.45)",
                  "0 0 40px rgba(163,230,53,0.25)",
                ],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white will-change-transform sm:h-32 sm:w-32"
      >
        <span className="text-3xl font-black text-black sm:text-4xl">{"</>"}</span>
      </motion.div>

      {/* Orbiting service icons (fixed position, independent float) */}
      {services.map((s, i) => {
        const Icon = s.icon;
        const rad = (s.angle * Math.PI) / 180;
        const x = 50 + RADIUS_PCT * Math.cos(rad);
        const y = 50 + RADIUS_PCT * Math.sin(rad);

        return (
          <motion.div
            key={s.label}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -10, 0] }
            }
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.12 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-black/80 backdrop-blur-md transition-shadow duration-300 hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(163,230,53,0.25)] sm:h-16 sm:w-16"
            >
              <Icon size={24} className="text-lime-400" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}