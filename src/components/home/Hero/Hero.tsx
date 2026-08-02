// "use client";

// import Link from "next/link";
// import { type PointerEvent } from "react";
// import { ArrowUpRight } from "lucide-react";
// import {
//   motion,
//   useReducedMotion,
//   useMotionValue,
//   useSpring,
//   useTransform,
// } from "framer-motion";
// import Container from "@/components/layout/Container";
// import ServiceOrbit from "./ServiceOrbit";

// const transitionBase = {
//   duration: 0.8,
//   ease: [0.22, 1, 0.36, 1] as const,
// };

// const fadeUp = {
//   hidden: { opacity: 0, y: 28, scale: 0.98 },
//   visible: { opacity: 1, y: 0, scale: 1, transition: transitionBase },
// };

// const fadeRight = {
//   hidden: { opacity: 0, x: 80, scale: 0.92 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     scale: 1,
//     transition: { ...transitionBase, delay: 0.25 },
//   },
// };

// const badgeVariant = {
//   hidden: { opacity: 0, y: 24, scale: 0.97 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { ...transitionBase, delay: 0.1 },
//   },
// };

// const staggerContainer = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.14, delayChildren: 0.12 },
//   },
// };

// const clamp = (value: number, min: number, max: number) =>
//   Math.max(min, Math.min(max, value));

// export default function Hero() {
//   const shouldReduceMotion = useReducedMotion();
//   const pointerX = useMotionValue(0);
//   const pointerY = useMotionValue(0);

//   const parallaxX = useSpring(useTransform(pointerX, [-1, 1], [-15, 15]), {
//     stiffness: 120,
//     damping: 18,
//   });
//   const parallaxY = useSpring(useTransform(pointerY, [-1, 1], [-15, 15]), {
//     stiffness: 120,
//     damping: 18,
//   });

//   const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
//     if (shouldReduceMotion) return;
//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
//     const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
//     pointerX.set(clamp(x, -1, 1));
//     pointerY.set(clamp(y, -1, 1));
//   };

//   const handlePointerLeave = () => {
//     if (shouldReduceMotion) return;
//     pointerX.set(0);
//     pointerY.set(0);
//   };

//   const headingLines = ["Creative", "Digital", "Agency"];

//   return (
//     <section className="relative min-h-screen overflow-hidden bg-[#080808] pt-[100px] text-white">
//       <div className="pointer-events-none absolute left-[40%] top-[30%] h-[500px] w-[500px] rounded-full bg-lime-400/5 blur-[140px]" />
// {/* 
//       <motion.div
//         animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute left-7 top-36 hidden h-28 w-28 border border-white/20 lg:block"
//       />

//       <motion.div
//         animate={{ y: [0, 18, 0], rotate: [0, -5, 0] }}
//         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute bottom-14 right-10 hidden h-20 w-20 border border-white/20 xl:block"
//       /> */}

//       <Container className="relative z-10">
//         <div className="grid min-h-[calc(100vh-100px)] items-center gap-14 py-16 lg:grid-cols-[1fr_0.95fr] lg:py-10">
//           {/* Left content */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//             className="relative z-20"
//           >
//             <motion.div
//               variants={badgeVariant}
//               className="inline-flex items-center rounded-full border border-lime-400 px-6 py-3"
//             >
//               <span className="text-xs font-bold uppercase tracking-[0.32em] text-lime-400 sm:text-sm">
//                 Digital Agency
//               </span>
//             </motion.div>

//             <motion.h1
//               variants={fadeUp}
//               className="mt-8 max-w-[780px] text-[58px] font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-[76px] lg:text-[92px] xl:text-[112px]"
//             >
//               {headingLines.map((line) => (
//                 <motion.span key={line} variants={fadeUp} className="block">
//                   {line}
//                 </motion.span>
//               ))}
//             </motion.h1>

//             <motion.p
//               variants={fadeUp}
//               className="mt-10 max-w-[620px] text-lg leading-8 text-white/70 sm:text-xl"
//             >
//               We build premium digital experiences that combine strategy,
//               creativity and technology.
//             </motion.p>

//             <motion.div
//               variants={fadeUp}
//               className="mt-12 flex flex-wrap items-center gap-5"
//             >
//               <Link
//                 href="/about"
//                 className="group inline-flex items-center gap-3 rounded-full bg-lime-400 px-8 py-5 text-sm font-bold uppercase text-black transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_24px_70px_rgba(163,230,53,0.22)] will-change-transform"
//               >
//                 Discover More
//                 <ArrowUpRight
//                   size={18}
//                   className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                 />
//               </Link>

//               <Link
//                 href="/portfolio"
//                 className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-5 text-sm font-bold uppercase text-white transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)] hover:border-lime-400 hover:text-lime-400 will-change-transform"
//               >
//                 Our Work
//                 <ArrowUpRight
//                   size={18}
//                   className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                 />
//               </Link>
//             </motion.div>
//           </motion.div>

//           {/* Right visual — animated service orbit */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={fadeRight}
//             onPointerMove={handlePointerMove}
//             onPointerLeave={handlePointerLeave}
//             className="relative mx-auto w-full max-w-[720px]"
//           >
//             <motion.div
//               animate={shouldReduceMotion ? undefined : { y: [0, -12, 0] }}
//               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//               className="relative will-change-transform"
//             >
//               <motion.div style={{ x: parallaxX, y: parallaxY }}>
//                 <ServiceOrbit />
//               </motion.div>
//             </motion.div>

//             {/* Floating label */}
//             <motion.div
//               animate={{ y: [0, 10, 0] }}
//               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//               className="absolute -bottom-6 left-6 hidden rounded-full border border-white/15 bg-black/80 px-6 py-4 backdrop-blur-md sm:flex"
//             >
//               <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime-400">
//                 Design • Build • Scale
//               </span>
//             </motion.div>
//           </motion.div>
//         </div>
//       </Container>

//       {/* Scroll indicator */}
//       {/* <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeUp}
//         transition={{ ...transitionBase, delay: 1.55 }}
//         className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
//       >
//         <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/40">
//           Scroll
//         </span>
//         <motion.div
//           aria-hidden="true"
//           animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
//           transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//           className="h-12 w-px bg-gradient-to-b from-lime-400 to-transparent"
//         />
//       </motion.div> */}
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import QuickEnquiryForm from "./QuickEnquiryForm";

type ServiceOption = {
  id: number;
  name: string;
};

type Props = {
  services: ServiceOption[];
};

const transitionBase = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionBase,
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 80,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      ...transitionBase,
      delay: 0.25,
    },
  },
};

const badgeVariant = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

export default function Hero({ services }: Props) {
  const headingLines = ["Creative", "Digital", "Agency"];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080808] pt-[100px] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[38%] top-[24%] h-[520px] w-[520px] rounded-full bg-lime-400/[0.06] blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full border border-white/[0.05]"
      />

      <Container className="relative z-10">
        <div className="grid min-h-[calc(100vh-100px)] items-center gap-14 py-12 lg:grid-cols-[1fr_0.9fr] lg:py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-20"
          >
            <motion.div
              variants={badgeVariant}
              className="inline-flex items-center rounded-full border border-lime-400 px-6 py-3"
            >
              <span className="text-xs font-bold uppercase tracking-[0.32em] text-lime-400 sm:text-sm">
                Digital Agency
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-8 max-w-[780px] text-[58px] font-black uppercase leading-[0.86] tracking-[-0.055em] sm:text-[76px] lg:text-[92px] xl:text-[112px]"
            >
              {headingLines.map((line) => (
                <motion.span
                  key={line}
                  variants={fadeUp}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-10 max-w-[620px] text-lg leading-8 text-white/70 sm:text-xl"
            >
              We build premium digital experiences that combine strategy,
              creativity and technology.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-5"
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-lime-400 px-8 py-5 text-sm font-bold uppercase text-black transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_24px_70px_rgba(163,230,53,0.22)]"
              >
                Discover More

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-5 text-sm font-bold uppercase text-white transition-all duration-300 hover:-translate-y-[5px] hover:border-lime-400 hover:text-lime-400 hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)]"
              >
                Our Work

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeRight}
            className="relative mx-auto w-full max-w-[590px]"
          >
            <QuickEnquiryForm services={services} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}