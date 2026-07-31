"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  const [openId, setOpenId] = useState<number | null>(
    items.length > 0 ? items[0].id : null,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-20 h-[460px] w-[460px] rounded-full border border-white/[0.06]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 bottom-0 h-96 w-96 rounded-full bg-lime-400/[0.06] blur-[100px]"
      />

      <Container>
        <div className="relative z-10 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
              className="text-sm font-bold uppercase tracking-[0.3em] text-lime-400"
            >
              Frequently Asked Questions
            </motion.p>

            <motion.h2
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
              className="mt-5 text-5xl font-black uppercase leading-[0.92] text-white md:text-6xl lg:text-7xl"
            >
              Everything
              <span className="block text-lime-400">You Need</span>
              To Know
            </motion.h2>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
              className="mt-7 max-w-md text-lg leading-8 text-white/60"
            >
              Find answers to common questions about our services, timelines,
              development process, pricing, and ongoing support.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
              className="mt-8"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
              >
                Still Have Questions?

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
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
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-t border-white/10"
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