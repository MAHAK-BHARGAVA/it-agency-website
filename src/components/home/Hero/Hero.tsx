"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import Container from "@/components/layout/Container";
import QuickEnquiryForm from "./QuickEnquiryForm";

type ServiceOption = {
  id: number;
  name: string;
};

type HeroData = {
  badge: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
  heroImage: string;
};

type Props = {
  services: ServiceOption[];
  hero: HeroData;
};

const transitionBase = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...transitionBase,
      delay: 0.15,
    },
  },
};

const badgeVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitionBase,
      delay: 0.1,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function Hero({ services, hero }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const headingLines = hero.title.split(" ");

  const animationProps = shouldReduceMotion
    ? { initial: false as const, animate: "visible" as const }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section className="relative min-h-0 overflow-hidden bg-[#080808] pt-8 text-white sm:pt-12 lg:min-h-screen lg:pt-[100px]">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[20%] top-[15%] h-[260px] w-[260px] rounded-full bg-lime-400/[0.06] blur-[100px] sm:left-[38%] sm:top-[24%] sm:h-[520px] sm:w-[520px] sm:blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 hidden h-[420px] w-[420px] rounded-full border border-white/[0.05] sm:block"
      />

      <Container className="relative z-10">
        <div className="grid min-h-0 items-center gap-10 py-8 sm:gap-12 sm:py-10 lg:min-h-[calc(100vh-100px)] lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:py-10">
          {/* Hero content */}
          <motion.div
            {...animationProps}
            variants={staggerContainer}
            className="relative z-20 min-w-0"
          >
            <motion.div
              variants={badgeVariant}
              className="inline-flex max-w-full items-center rounded-full border border-lime-400 px-4 py-2.5 sm:px-6 sm:py-3"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400 sm:text-sm sm:tracking-[0.32em]">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-[780px] break-words text-[clamp(2rem,9.5vw,3.625rem)] font-black uppercase leading-[0.92] tracking-[-0.055em] sm:mt-8 sm:text-[76px] sm:leading-[0.88] lg:text-[92px] xl:text-[112px]"
            >
              {headingLines.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={fadeUp}
                  className="block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[620px] text-base leading-7 text-white/70 sm:mt-10 sm:text-xl sm:leading-8"
            >
              {hero.description}
            </motion.p>

            {/* Call-to-action buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5"
            >
              <Link
                href={hero.primaryButtonLink}
                className="group inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-4 text-center text-xs font-bold uppercase leading-5 text-black transition-all duration-300 hover:bg-lime-300 sm:min-h-14 sm:w-auto sm:gap-3 sm:px-8 sm:py-5 sm:text-sm sm:hover:-translate-y-[5px] sm:hover:shadow-[0_24px_70px_rgba(163,230,53,0.22)]"
              >
                <span className="break-words">{hero.primaryButtonText}</span>

                <ArrowUpRight
                  size={18}
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
                />
              </Link>

              <Link
                href={hero.secondaryButtonLink || "/portfolio"}
                className="group inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-4 text-center text-xs font-bold uppercase leading-5 text-white transition-all duration-300 hover:border-lime-400 hover:text-lime-400 sm:min-h-14 sm:w-auto sm:gap-3 sm:px-8 sm:py-5 sm:text-sm sm:hover:-translate-y-[5px] sm:hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)]"
              >
                <span className="break-words">
                  {hero.secondaryButtonText || "Our Work"}
                </span>

                <ArrowUpRight
                  size={18}
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick enquiry form */}
          <motion.div
            {...animationProps}
            variants={fadeRight}
            className="relative mx-auto w-full min-w-0 max-w-[590px]"
          >
            <QuickEnquiryForm services={services} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}