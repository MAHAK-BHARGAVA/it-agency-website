
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
      className={`min-w-0 border-b transition-colors duration-300 ${
        isOpen ? "border-lime-400/70" : "border-white/10"
      }`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="group flex w-full min-w-0 items-start gap-3 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-400 sm:gap-5 sm:py-7 lg:gap-6 lg:py-8"
      >
        {/* QUESTION NUMBER */}

        <span
          aria-hidden="true"
          className={`mt-1 shrink-0 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors duration-300 sm:text-sm sm:tracking-[0.2em] ${
            isOpen ? "text-lime-400" : "text-white/35"
          }`}
        >
          {number}
        </span>

        {/* QUESTION + ICON */}

        <div className="flex min-w-0 flex-1 items-start justify-between gap-3 sm:gap-5">
          <h3
            className={`min-w-0 flex-1 break-words text-base font-bold leading-snug transition-colors duration-300 sm:text-xl lg:text-2xl ${
              isOpen
                ? "text-white"
                : "text-white/75 group-hover:text-white"
            }`}
          >
            {faq.question}
          </h3>

          <span
            aria-hidden="true"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-11 sm:w-11 ${
              isOpen
                ? "border-lime-400 bg-lime-400 text-black"
                : "border-white/15 bg-white/[0.04] text-white group-hover:border-lime-400 group-hover:bg-lime-400 group-hover:text-black"
            }`}
          >
            {isOpen ? (
              <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={contentId}
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{
              height: {
                duration: reduceMotion ? 0 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: reduceMotion ? 0 : 0.2,
              },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-0 sm:pb-8 sm:pl-10 lg:pl-12">
              <p className="max-w-3xl break-words text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
