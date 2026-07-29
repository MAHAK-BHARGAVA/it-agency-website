"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Counter({ to = 15 }: { to?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24 lg:py-32">
      {/* Colorful ambient blobs */}
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.08, 0.95] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-lime-300/25 blur-[110px]"
      />
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.3, 0.55, 0.3], scale: [1, 1.1, 1] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-sky-300/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.2, 0.4, 0.2] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute right-1/3 top-0 h-[300px] w-[300px] rounded-full bg-fuchsia-300/10 blur-[100px]"
      />

      {/* Floating decorative shapes (matches Hero corners) */}
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -16, 0], rotate: [0, 5, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-8 top-16 hidden h-16 w-16 rounded-2xl border border-lime-400/40 lg:block"
      />
      <motion.div
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, 14, 0], rotate: [0, -6, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 right-12 hidden h-12 w-12 rounded-full border border-black/10 xl:block"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 xl:gap-24">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[620px] lg:mx-0"
          >
            {/* Continuously rotating dashed ring — colorful accent */}
            <motion.div
              aria-hidden
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-[42px] border border-dashed border-lime-400/40 will-change-transform"
            />

            {/* Soft glow hugging the image */}
            <motion.div
              aria-hidden
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: [0.3, 0.55, 0.3], scale: [0.96, 1.03, 0.96] }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-3 rounded-[36px] bg-lime-400/10 blur-2xl"
            />

            <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-black">
              <Image
                src="/assets/images/about/01.webp"
                alt="Team overlooking a city"
                fill
                quality={100}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            {/* Experience card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotate: -2 }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 20px 60px rgba(132,204,22,0.28)",
                        "0 24px 80px rgba(132,204,22,0.45)",
                        "0 20px 60px rgba(132,204,22,0.28)",
                      ],
                    }
              }
              transition={{
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -bottom-8 right-3 rounded-[28px] bg-lime-400 px-8 py-7 will-change-transform sm:right-[-20px] sm:px-10 sm:py-9"
            >
              <h3 className="text-5xl font-black leading-none text-black sm:text-6xl">
                <Counter to={15} />
              </h3>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-black sm:text-sm">
                Years Experience
              </p>
            </motion.div>

            {/* Floating colored dot */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -12, 0], backgroundColor: ["#ffffff", "#ecfccb", "#ffffff"] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-5 top-12 hidden h-14 w-14 rounded-full border border-lime-400/30 shadow-lg sm:block"
            />
          </motion.div>

          {/* Right content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.13 }}
            className="pt-8 lg:pt-0"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.32em] text-lime-500"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
              </span>
              About Company
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-6 max-w-[680px] text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-[#111111] sm:text-6xl lg:text-7xl"
            >
              We Create
              <br />
              <span className="text-lime-500">Digital</span>
              <br />
              Experiences
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[620px] text-lg leading-8 text-gray-600"
            >
              We help businesses grow with premium web development, branding,
              UI/UX design and marketing solutions that combine creativity,
              strategy and technology.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 grid gap-6 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -5 }}
                className="group rounded-[24px] border border-black/10 p-6 transition-all duration-300 hover:border-lime-400 hover:bg-lime-50 hover:shadow-[0_20px_50px_rgba(163,230,53,0.18)]"
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 0px rgba(163,230,53,0)",
                            "0 0 18px rgba(163,230,53,0.5)",
                            "0 0 0px rgba(163,230,53,0)",
                          ],
                        }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400"
                >
                  <span className="text-lg font-black text-black">01</span>
                </motion.div>

                <h3 className="mt-6 text-xl font-bold text-black">
                  Creative Design
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Modern, thoughtful design systems built for growing brands.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group rounded-[24px] border border-black/10 p-6 transition-all duration-300 hover:border-lime-400 hover:bg-lime-50 hover:shadow-[0_20px_50px_rgba(163,230,53,0.18)]"
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 0px rgba(163,230,53,0)",
                            "0 0 18px rgba(163,230,53,0.5)",
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
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400"
                >
                  <span className="text-lg font-black text-black">02</span>
                </motion.div>

                <h3 className="mt-6 text-xl font-bold text-black">
                  Development
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  Fast, scalable and responsive applications built for real
                  users.
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-5 text-sm font-bold uppercase text-white transition-all duration-300 hover:-translate-y-1 hover:bg-lime-400 hover:text-black hover:shadow-[0_20px_60px_rgba(163,230,53,0.35)] will-change-transform"
              >
                More About Us
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}