
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/Container";
import type { getPortfolio } from "@/repositories/portfolio.repository";

import PortfolioCard from "./PortfolioCard";

export type PortfolioItem = Awaited<
  ReturnType<typeof getPortfolio>
>[number];

type Props = {
  portfolio: PortfolioItem[];
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Portfolio({ portfolio }: Props) {
  const projects = (portfolio ?? []).slice(0, 4);
  const count = projects.length;

  return (
    <section className="relative overflow-hidden bg-black py-14 sm:py-16 md:py-24 lg:py-32">
      {/* Decorative background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Container>
        <div className="relative z-10 min-w-0">
          {/* Section heading */}
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">
            <div className="min-w-0">
              <motion.p
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400 sm:text-sm sm:tracking-[0.3em]"
              >
                Our Projects
              </motion.p>

              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="mt-3 text-[clamp(2rem,9vw,3rem)] font-black uppercase leading-[0.95] tracking-tight text-white sm:mt-4 sm:text-5xl sm:tracking-normal md:text-6xl lg:text-7xl"
              >
                Selected Work
              </motion.h2>
            </div>

            {count > 0 && (
              <motion.div
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="flex items-center gap-3 font-mono text-xs text-gray-500 sm:text-sm"
              >
                <span className="h-px w-6 bg-white/20 sm:w-8" />
                {String(count).padStart(2, "0")} Case Studies
              </motion.div>
            )}
          </div>

          {/* Portfolio cards */}
          {count === 0 ? (
            <EmptyPortfolioState />
          ) : (
            <>
              <div className="mt-9 grid min-w-0 grid-cols-1 items-stretch gap-5 sm:mt-12 sm:gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
                {projects.map((project, index) => (
                  <PortfolioCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>

              {/* All projects button */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex justify-center pt-10 sm:pt-14"
              >
                <Link
                  href="/portfolio"
                  className="group relative inline-flex min-h-12 max-w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-center text-sm font-bold uppercase tracking-widest text-white transition-colors duration-500 hover:border-lime-400 sm:px-10 sm:py-5"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-lime-400 transition-transform duration-500 ease-out group-hover:scale-x-100" />

                  <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                    Many More
                  </span>

                  <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

function EmptyPortfolioState() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center sm:mt-16 sm:rounded-[32px] sm:px-6 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 sm:text-sm">
        No case studies yet
      </p>

      <p className="mt-2 max-w-sm text-sm text-gray-400 sm:text-base">
        Projects will appear here as soon as they are published.
      </p>
    </div>
  );
}