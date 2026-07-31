"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import type { FAQItemType } from "./faq.types";

type Props = {
  faq: FAQItemType;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: Props) {
  const reduceMotion = useReducedMotion();

  const number = String(index + 1).padStart(2, "0");
  const contentId = `faq-answer-${faq.id}`;
  const buttonId = `faq-question-${faq.id}`;

  return (
    <article
      className={`border-b transition-colors duration-300 ${
        isOpen ? "border-lime-400" : "border-white/10"
      }`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="group flex w-full items-start gap-5 py-7 text-left sm:gap-8 sm:py-9"
      >
        <span
          className={`mt-1 shrink-0 font-mono text-xs font-bold tracking-[0.2em] transition-colors duration-300 sm:text-sm ${
            isOpen ? "text-lime-400" : "text-white/35"
          }`}
        >
          {number}
        </span>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-5">
          <h3
            className={`text-xl font-black leading-snug transition-colors duration-300 sm:text-2xl lg:text-3xl ${
              isOpen ? "text-white" : "text-white/80"
            }`}
          >
            {faq.question}
          </h3>

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${
              isOpen
                ? "rotate-180 border-lime-400 bg-lime-400 text-black"
                : "border-white/10 bg-white/5 text-white group-hover:border-lime-400 group-hover:bg-lime-400 group-hover:text-black"
            }`}
          >
            {isOpen ? (
              <Minus className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    height: 0,
                    opacity: 0,
                  }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    height: "auto",
                    opacity: 1,
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    height: 0,
                    opacity: 0,
                  }
            }
            transition={{
              height: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.25,
              },
            }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-0 sm:pb-10 sm:pl-[72px]">
              <p className="max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}