"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import Container from "@/components/layout/Container";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const stats = [
  {
    value: "50+",
    label: "Happy Clients",
  },
  {
    value: "100+",
    label: "Projects Delivered",
  },
  {
    value: "24/7",
    label: "Ongoing Support",
  },
];

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 md:py-24 lg:py-32">
      {/* Lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-lime-400/[0.12] blur-[160px]"
      />

      {/* Secondary glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-48 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[140px]"
      />

      {/* Decorative circle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full border border-white/[0.06]"
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <Container>
        <div className="relative z-10">
          <div className="mx-auto max-w-6xl text-center">
            <motion.p
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="text-sm font-bold uppercase tracking-[0.32em] text-lime-400"
            >
              Let&apos;s Work Together
            </motion.p>

            <motion.h2
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="mx-auto mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white md:text-7xl lg:text-[96px]"
            >
              Ready To Build
              <span className="block text-white/25">
                Something Amazing?
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg"
            >
              Whether you&apos;re launching a new business, modernizing an
              existing platform, or building a custom digital product, we&apos;re
              ready to turn your idea into something powerful.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-lime-400 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-black transition-all duration-300 hover:-translate-y-1 hover:bg-lime-300 hover:shadow-[0_18px_50px_rgba(163,230,53,0.22)]"
              >
                Start Your Project

                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact?type=call"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
              >
                <CalendarDays className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                Schedule A Call
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-1 border-y border-white/10 sm:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center px-6 py-8 text-center ${
                  index !== stats.length - 1
                    ? "border-b border-white/10 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <span className="text-4xl font-black tracking-tight text-white md:text-5xl">
                  {stat.value}
                </span>

                <span className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-white/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}