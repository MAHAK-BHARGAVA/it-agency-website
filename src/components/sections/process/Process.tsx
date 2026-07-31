"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

import Container from "@/components/layout/Container";

import ProcessCard from "./ProcessCard";
import { processSteps } from "./Process.data";

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f0] py-20 md:py-24 lg:py-32">
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-24 h-96 w-96 rounded-full border border-black/[0.06]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-10 h-[500px] w-[500px] rounded-full border border-black/[0.06]"
      />

      <Container>
        <div className="relative z-10">
          {/* Heading */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <motion.p
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="text-sm font-bold uppercase tracking-[0.3em] text-black/60"
              >
                Our Process
              </motion.p>

              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}
                className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.92] text-black md:text-6xl lg:text-7xl"
              >
                From First Idea
                <span className="block text-lime-500">To Final Launch</span>
              </motion.h2>
            </div>

            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
              className="lg:pb-2"
            >
              <div className="flex items-start gap-5">
                <div className="mt-1 hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black/10 md:flex">
                  <ArrowDownRight className="h-5 w-5 text-black" />
                </div>

                <p className="max-w-xl text-lg leading-8 text-black/60">
                  We combine strategy, design, engineering, and continuous
                  improvement to build digital products that are practical,
                  scalable, and ready for real users.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Cards */}
          <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
            {/* Desktop connecting line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/[0.06] lg:block"
            />

            {processSteps.map((step, index) => (
              <ProcessCard
                key={step.number}
                step={step}
                index={index}
              />
            ))}
          </div>

          {/* Bottom statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-8 md:flex-row md:items-center md:justify-between"
          >
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-black/50">
              Transparent communication at every stage
            </p>

            <p className="max-w-lg text-sm leading-6 text-black/60 md:text-right">
              You stay informed through regular updates, milestone reviews,
              feedback sessions, and clear delivery timelines.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}