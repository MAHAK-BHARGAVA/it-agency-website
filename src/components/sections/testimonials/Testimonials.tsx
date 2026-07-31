// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// import Container from "@/components/layout/Container";
// import type { TestimonialItem } from "./testimonial.types";

// import TestimonialCard from "./TestimonialCard";

// type Props = {
//   testimonials: TestimonialItem[];
// };

// const headerVariants = {
//   hidden: {
//     opacity: 0,
//     y: 24,
//   },
//   visible: (index: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       delay: index * 0.08,
//       ease: [0.22, 1, 0.36, 1] as const,
//     },
//   }),
// };

// export default function Testimonials({ testimonials }: Props) {
//   const items = testimonials ?? [];
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const reduceMotion = useReducedMotion();

//   const hasMultiple = items.length > 1;

//   const goToNext = useCallback(() => {
//     if (!hasMultiple) return;

//     setDirection(1);
//     setActiveIndex((current) => (current + 1) % items.length);
//   }, [hasMultiple, items.length]);

//   const goToPrevious = () => {
//     if (!hasMultiple) return;

//     setDirection(-1);
//     setActiveIndex(
//       (current) => (current - 1 + items.length) % items.length,
//     );
//   };

//   useEffect(() => {
//     if (!hasMultiple || reduceMotion) return;

//     const interval = window.setInterval(goToNext, 6000);

//     return () => window.clearInterval(interval);
//   }, [goToNext, hasMultiple, reduceMotion]);

//   if (items.length === 0) {
//     return null;
//   }

//   const activeTestimonial = items[activeIndex];

//   return (
//     <section className="relative overflow-hidden bg-[#f5f5f0] py-20 md:py-24 lg:py-32">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 opacity-[0.05]"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at center, #ffffff 1px, transparent 1px)",
//           backgroundSize: "28px 28px",
//         }}
//       />

//       <Container>
//         <div className="relative z-10">
//           <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
//             <div>
//               <motion.p
//                 custom={0}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 variants={headerVariants}
//                className="text-sm font-bold uppercase tracking-[0.3em] text-black/60">
//                 Client Testimonials
//               </motion.p>

//               <motion.h2
//                 custom={1}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 variants={headerVariants}
//                className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.95] text-black md:text-6xl lg:text-7xl">
//                 What Clients Say
//                 <span className="block text-black/35">
//                   About Working With Us
//                 </span>
//               </motion.h2>
//             </div>

//             {hasMultiple && (
//               <motion.div
//                 custom={2}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 variants={headerVariants}
//                 className="flex items-center gap-3"
//               >
//                 <button
//                   type="button"
//                   onClick={goToPrevious}
//                   aria-label="Show previous testimonial"
//                  className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black">
//                   <ArrowLeft className="h-5 w-5" />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={goToNext}
//                   aria-label="Show next testimonial"
//                   className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black">
//                   <ArrowRight className="h-5 w-5" />
//                 </button>
//               </motion.div>
//             )}
//           </div>

//           <div className="mt-14 overflow-hidden md:mt-16">
//             <AnimatePresence mode="wait" initial={false}>
//               <motion.div
//                 key={activeTestimonial.id}
//                 initial={
//                   reduceMotion
//                     ? { opacity: 0 }
//                     : {
//                         opacity: 0,
//                         x: direction > 0 ? 70 : -70,
//                       }
//                 }
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                 }}
//                 exit={
//                   reduceMotion
//                     ? { opacity: 0 }
//                     : {
//                         opacity: 0,
//                         x: direction > 0 ? -70 : 70,
//                       }
//                 }
//                 transition={{
//                   duration: 0.45,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//               >
//                 <TestimonialCard testimonial={activeTestimonial} />
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {hasMultiple && (
//             <div className="mt-8 flex items-center justify-center gap-2">
//               {items.map((testimonial, index) => (
//                 <button
//                   key={testimonial.id}
//                   type="button"
//                   onClick={() => {
//                     setDirection(index > activeIndex ? 1 : -1);
//                     setActiveIndex(index);
//                   }}
//                   aria-label={`Show testimonial ${index + 1}`}
//                   aria-current={index === activeIndex ? "true" : undefined}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     index === activeIndex
//                       ? "w-10 bg-lime-400"
//                       : "w-2 bg-black/20 hover:bg-black/40"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import type { TestimonialItem } from "./testimonial.types";
import TestimonialCard from "./TestimonialCard";

type Props = {
  testimonials: TestimonialItem[];
};

export default function Testimonials({ testimonials }: Props) {
  const items = testimonials ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const hasMultiple = items.length > 1;

  const goToNext = useCallback(() => {
    if (!hasMultiple) return;

    setDirection(1);
    setActiveIndex((current) => (current + 1) % items.length);
  }, [hasMultiple, items.length]);

  const goToPrevious = useCallback(() => {
    if (!hasMultiple) return;

    setDirection(-1);
    setActiveIndex(
      (current) => (current - 1 + items.length) % items.length,
    );
  }, [hasMultiple, items.length]);

  useEffect(() => {
    if (!hasMultiple || reduceMotion) return;

    const interval = window.setInterval(goToNext, 6000);

    return () => window.clearInterval(interval);
  }, [goToNext, hasMultiple, reduceMotion]);

  if (items.length === 0) {
    return null;
  }

  const activeTestimonial = items[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#f5f5f0] py-20 md:py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-lime-400/[0.05] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 bottom-0 h-80 w-80 rounded-full border border-black/[0.05]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full border border-black/[0.05]"
      />

      <Container>
        <div className="relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-sm font-bold uppercase tracking-[0.3em] text-black/55"
            >
              Client Testimonials
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-5 text-5xl font-black uppercase leading-[0.92] text-black md:text-6xl lg:text-7xl"
            >
              Trusted By Businesses
              <span className="block text-black/30">
                Across Industries
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/60"
            >
              Real feedback from clients who trusted us to design, build, and
              grow their digital products.
            </motion.p>
          </div>

          <div className="mx-auto mt-14 max-w-5xl overflow-hidden md:mt-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTestimonial.id}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: direction > 0 ? 70 : -70,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: direction > 0 ? -70 : 70,
                      }
                }
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TestimonialCard testimonial={activeTestimonial} />
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMultiple && (
            <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Show previous testimonial"
                className="group inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-6 py-3 font-bold uppercase tracking-widest text-black transition-all duration-300 hover:border-lime-400 hover:bg-lime-400"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {items.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    onClick={() => {
                      if (index === activeIndex) return;

                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                    aria-label={`Show testimonial ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-10 bg-lime-400"
                        : "w-2 bg-black/20 hover:bg-black/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Show next testimonial"
                className="group inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-6 py-3 font-bold uppercase tracking-widest text-black transition-all duration-300 hover:border-lime-400 hover:bg-lime-400"
              >
                Next
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}