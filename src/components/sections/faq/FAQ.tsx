
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/Container";
import FAQItem from "./FAQItem";
import type { FAQItemType } from "./faq.types";

type Props = {
  faqs: FAQItemType[];
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
      duration: 0.65,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function FAQ({ faqs }: Props) {
  const items = faqs ?? [];
  const reduceMotion = useReducedMotion();

  const [openId, setOpenId] = useState<number | null>(
    items.length > 0 ? items[0].id : null,
  );

  // Keep the initial FAQ synchronized if the data changes.
  useEffect(() => {
    setOpenId((current) => {
      if (items.length === 0) return null;

      if (current !== null && items.some((faq) => faq.id === current)) {
        return current;
      }

      return items[0].id;
    });
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative isolate overflow-hidden bg-black py-16 sm:py-20 md:py-24 lg:py-32"
    >
      {/* Decorative background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full border border-white/[0.06] sm:-left-52 sm:h-[460px] sm:w-[460px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-lime-400/[0.06] blur-[80px] sm:-right-44 sm:h-96 sm:w-96 sm:blur-[100px]"
      />

      <Container>
        <div className="relative z-10 grid min-w-0 grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 xl:gap-20">
          {/* LEFT: SECTION INTRO */}

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <motion.p
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headerVariants}
              className="inline-flex max-w-full items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-400 sm:text-sm sm:tracking-[0.3em]"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-lime-400" />
              Frequently Asked Questions
            </motion.p>

            <motion.h2
              id="faq-heading"
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headerVariants}
              className="mt-5 max-w-[600px] break-words text-[clamp(2.4rem,8vw,4rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-white sm:mt-6 md:text-6xl lg:text-6xl xl:text-7xl"
            >
              Everything
              <span className="block text-lime-400">You Need</span>
              To Know
            </motion.h2>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headerVariants}
              className="mt-5 max-w-md text-base leading-7 text-white/60 sm:mt-7 sm:text-lg sm:leading-8"
            >
              Find answers to common questions about our services, timelines,
              development process, pricing, and ongoing support.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headerVariants}
              className="mt-7 sm:mt-8"
            >
              <Link
                href="/contact"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:text-sm sm:tracking-widest"
              >
                <span>Still Have Questions?</span>

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: FAQ ACCORDION */}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="min-w-0 border-t border-white/10"
          >
            {items.map((faq, index) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                index={index}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === faq.id ? null : faq.id,
                  )
                }
              />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
