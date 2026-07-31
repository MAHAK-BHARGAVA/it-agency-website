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
  /*
   * The repository already returns only four projects.
   * slice(0, 4) adds another safety layer.
   */
  const projects = (portfolio ?? []).slice(0, 4);
  const count = projects.length;

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-24 lg:py-32">
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
        <div className="relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="text-sm font-bold uppercase tracking-[0.3em] text-lime-400"
              >
                Our Projects
              </motion.p>

              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="mt-4 text-5xl font-black uppercase leading-[0.95] text-white md:text-6xl lg:text-7xl"
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
                className="flex items-center gap-3 font-mono text-sm text-gray-500"
              >
                <span className="h-px w-8 bg-white/20" />

                {String(count).padStart(2, "0")} Case Studies
              </motion.div>
            )}
          </div>

          {count === 0 ? (
            <EmptyPortfolioState />
          ) : (
            <>
              <div className="mt-14 grid items-stretch gap-8 md:mt-16 md:grid-cols-2">
                {projects.map((project, index) => (
                  <PortfolioCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>

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
                className="flex justify-center pt-14"
              >
                <Link
                  href="/portfolio"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.03] px-10 py-5 font-bold uppercase tracking-widest text-white transition-colors duration-500 hover:border-lime-400"
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
    <div className="mt-16 flex flex-col items-center justify-center rounded-[32px] border border-dashed border-white/15 px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
        No case studies yet
      </p>

      <p className="mt-2 max-w-sm text-gray-400">
        Projects will appear here as soon as they are published.
      </p>
    </div>
  );
}