"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { ProcessStep } from "./Process.types";

type Props = {
  step: ProcessStep;
  index: number;
};

export default function ProcessCard({ step, index }: Props) {
  const reduceMotion = useReducedMotion();
  const Icon = step.icon;

  return (
    <motion.article
      initial={
        reduceMotion
          ? undefined
          : {
              opacity: 0,
              y: 36,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative h-full"
    >
      <div className="relative flex h-full min-h-[480px] flex-col overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#111111] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-lime-400/70 hover:bg-[#151515] hover:shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
        {/* Hover background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-400/0 blur-[90px] transition-colors duration-500 group-hover:bg-lime-400/[0.08]"
        />

        {/* Large background number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1 text-[110px] font-black leading-none text-white/[0.025] transition-colors duration-500 group-hover:text-lime-400/[0.05] sm:text-[140px]"
        >
          {step.number}
        </span>

        {/* Top row */}
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-500 group-hover:border-lime-400/40 group-hover:bg-lime-400 group-hover:text-black">
            <Icon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
          </div>

          <span className="font-mono text-sm font-medium tracking-[0.2em] text-lime-400">
            {step.number}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-10">
          <h3 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            {step.title}
          </h3>

          <p className="mt-5 leading-7 text-gray-400">
            {step.description}
          </p>
        </div>

        {/* Points */}
       <ul className="relative z-10 mt-8 flex-1 space-y-3">
          {step.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 text-sm text-gray-300 sm:text-base"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/[0.08]">
                <Check className="h-3.5 w-3.5 text-lime-400" />
              </span>

              {point}
            </li>
          ))}
        </ul>

        {/* Bottom arrow */}
        {/* <div className="relative z-10 mt-auto flex justify-end pt-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-lime-400 group-hover:bg-lime-400 group-hover:text-black">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div> */}

        {/* Bottom hover line */}
        <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-lime-400 transition-all duration-500 ease-out group-hover:w-full" />
      </div>
    </motion.article>
  );
}