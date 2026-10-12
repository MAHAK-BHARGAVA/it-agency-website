
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  animate,
  useReducedMotion,
} from "framer-motion";
import Container from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function Counter({ to = 15 }: { to?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      setCount(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });

    return () => controls.stop();
  }, [isInView, to, shouldReduceMotion]);

  return <span ref={ref}>{count}+</span>;
}

type AboutData = {
  sectionTitle: string;
  title: string;
  description: string;
  experience: number;
  image: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string | null;
};

type Props = {
  about: AboutData;
};

export default function About({ about }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-white py-14 sm:py-16 md:py-24 lg:py-32">
      {/* Ambient background effects */}

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.4, 0.7, 0.4],
                scale: [0.95, 1.08, 0.95],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-lime-300/25 blur-[90px] sm:h-[420px] sm:w-[420px] sm:blur-[110px]"
      />

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.3, 0.55, 0.3],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-300/20 blur-[90px] sm:h-[380px] sm:w-[380px] sm:blur-[120px]"
      />

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.2, 0.4, 0.2],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="pointer-events-none absolute right-1/3 top-0 hidden h-[300px] w-[300px] rounded-full bg-fuchsia-300/10 blur-[100px] sm:block"
      />

      {/* Decorative shapes */}

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -16, 0],
                rotate: [0, 5, 0],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-8 top-16 hidden h-16 w-16 rounded-2xl border border-lime-400/40 lg:block"
      />

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, 14, 0],
                rotate: [0, -6, 0],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-16 right-12 hidden h-12 w-12 rounded-full border border-black/10 xl:block"
      />

      <Container className="relative z-10">
        <div className="grid min-w-0 grid-cols-1 items-center gap-14 sm:gap-16 lg:grid-cols-2 xl:gap-24">
          {/* LEFT IMAGE */}

          <motion.div
            initial={
              shouldReduceMotion ? false : { opacity: 0, x: -40 }
            }
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full min-w-0 max-w-[620px] pb-14 sm:pb-10 lg:mx-0"
          >
            {/* Dashed decorative border */}

            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute -inset-2 rounded-[26px] border border-dashed border-lime-400/40 will-change-transform sm:-inset-4 sm:rounded-[36px] lg:-inset-6 lg:rounded-[42px]"
            />

            {/* Soft glow */}

            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: [0.3, 0.55, 0.3],
                      scale: [0.96, 1.03, 0.96],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -inset-1 rounded-[26px] bg-lime-400/10 blur-xl sm:-inset-2 sm:rounded-[30px] sm:blur-2xl lg:-inset-3 lg:rounded-[36px]"
            />

            {/* Responsive image */}

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-black sm:aspect-[16/10] sm:rounded-[32px]">
              <Image
                src={about.image}
                alt={about.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 50vw"
                className="object-contain"
                priority={false}
              />
            </div>

            {/* EXPERIENCE CARD */}

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.85,
                      y: 20,
                    }
              }
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -5,
                      rotate: -1,
                    }
              }
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 16px 40px rgba(132,204,22,0.22)",
                        "0 20px 55px rgba(132,204,22,0.38)",
                        "0 16px 40px rgba(132,204,22,0.22)",
                      ],
                    }
              }
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
                boxShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute -bottom-1 right-2 z-10 rounded-2xl bg-lime-400 px-5 py-5 will-change-transform sm:-bottom-3 sm:right-[-12px] sm:rounded-[24px] sm:px-7 sm:py-6 lg:-bottom-8 lg:right-[-20px] lg:rounded-[28px] lg:px-10 lg:py-9"
            >
              <h3 className="text-4xl font-black leading-none text-black sm:text-5xl lg:text-6xl">
                <Counter to={about.experience} />
              </h3>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-black sm:mt-3 sm:text-xs lg:text-sm lg:tracking-[0.16em]">
                Years Experience
              </p>
            </motion.div>

            {/* Floating decorative dot */}

            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -12, 0],
                      backgroundColor: [
                        "#ffffff",
                        "#ecfccb",
                        "#ffffff",
                      ],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -left-3 top-8 hidden h-10 w-10 rounded-full border border-lime-400/30 shadow-lg sm:block lg:-left-5 lg:top-12 lg:h-14 lg:w-14"
            />
          </motion.div>

          {/* RIGHT CONTENT */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              staggerChildren: shouldReduceMotion ? 0 : 0.13,
            }}
            className="min-w-0 pt-0 lg:pt-0"
          >
            {/* SECTION LABEL */}

            <motion.span
              variants={fadeUp}
              className="inline-flex max-w-full items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-600 sm:text-sm sm:tracking-[0.28em]"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                {!shouldReduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                )}

                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
              </span>

              <span>{about.sectionTitle}</span>
            </motion.span>

            {/* TITLE */}

            <motion.h2
              variants={fadeUp}
              className="mt-5 max-w-[680px] break-words text-[clamp(2rem,8.5vw,3rem)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-[#111111] sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {about.title}
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[620px] text-base leading-7 text-gray-600 sm:mt-8 sm:text-lg sm:leading-8"
            >
              {about.description}
            </motion.p>

            {/* FEATURE CARDS */}

            <motion.div
              variants={fadeUp}
              className="mt-8 grid min-w-0 grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:gap-4 xl:gap-6"
            >
              {/* FEATURE ONE */}

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -5 }
                }
                className="group min-w-0 rounded-2xl border border-black/10 p-5 transition-all duration-300 hover:border-lime-400 hover:bg-lime-50 hover:shadow-[0_20px_50px_rgba(163,230,53,0.18)] sm:rounded-[24px] sm:p-6"
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 0px rgba(163,230,53,0)",
                            "0 0 18px rgba(163,230,53,0.4)",
                            "0 0 0px rgba(163,230,53,0)",
                          ],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 sm:h-12 sm:w-12"
                >
                  <span className="text-base font-black text-black sm:text-lg">
                    01
                  </span>
                </motion.div>

                <h3 className="mt-5 break-words text-lg font-bold text-black sm:mt-6 sm:text-xl">
                  {about.featureOne}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                  Modern, thoughtful design systems built for growing
                  brands.
                </p>
              </motion.div>

              {/* FEATURE TWO */}

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -5 }
                }
                className="group min-w-0 rounded-2xl border border-black/10 p-5 transition-all duration-300 hover:border-lime-400 hover:bg-lime-50 hover:shadow-[0_20px_50px_rgba(163,230,53,0.18)] sm:rounded-[24px] sm:p-6"
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 0px rgba(163,230,53,0)",
                            "0 0 18px rgba(163,230,53,0.4)",
                            "0 0 0px rgba(163,230,53,0)",
                          ],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 sm:h-12 sm:w-12"
                >
                  <span className="text-base font-black text-black sm:text-lg">
                    02
                  </span>
                </motion.div>

                <h3 className="mt-5 break-words text-lg font-bold text-black sm:mt-6 sm:text-xl">
                  {about.featureTwo}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                  Fast, scalable and responsive applications built for
                  real users.
                </p>
              </motion.div>
            </motion.div>

            {/* MORE ABOUT US BUTTON */}

            <motion.div
              variants={fadeUp}
              className="mt-8 sm:mt-10"
            >
              <Link
                href="/about"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-bold uppercase text-white transition-all duration-300 hover:-translate-y-1 hover:bg-lime-400 hover:text-black hover:shadow-[0_20px_60px_rgba(163,230,53,0.35)] sm:w-auto sm:px-8 sm:py-5"
              >
                More About Us

                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}