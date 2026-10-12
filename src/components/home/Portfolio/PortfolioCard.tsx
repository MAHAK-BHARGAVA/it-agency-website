
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { PortfolioItem } from "./Portfolio";

type Props = {
  project: PortfolioItem;
  index: number;
};

export default function PortfolioCard({ project, index }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const thumbnail = project.thumbnail?.trim() ?? "";
  const hasThumbnail = thumbnail.length > 0 && !imageFailed;

  const summary =
    project.resultSummary?.trim() || "Full case study coming soon.";

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 32,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        once: true,
        margin: "-40px",
      }}
      transition={{
        duration: 0.6,
        delay: Math.min(index, 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full min-w-0"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`View ${project.projectName} case study`}
        className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-[#121212] ring-1 ring-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:bg-[#161616] hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:rounded-[32px] sm:hover:-translate-y-2"
      >
        {/* Lime hover line */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 z-20 h-[3px] w-0 bg-lime-400 transition-all duration-500 ease-out group-hover:w-full"
        />

        {/* Project image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
          {hasThumbnail ? (
            <Image
              src={thumbnail}
              alt={`${project.projectName} project preview`}
              fill
              quality={100}
              priority={index < 2}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 640px"
              onError={() => setImageFailed(true)}
              className="object-contain transition-transform duration-700 ease-out sm:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
              <span className="px-3 text-center font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                Preview coming soon
              </span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 sm:group-hover:bg-black/[0.04]"
          />

          {/* Visible on touch devices; hover treatment on desktop */}
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black sm:bottom-5 sm:left-5 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-widest sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            View case study
            <ArrowUpRight size={14} />
          </span>
        </div>

        {/* Project details */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4 sm:gap-5 sm:p-6 lg:p-8">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs text-gray-500">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-2 break-words text-xl font-black leading-tight text-white sm:text-2xl lg:text-3xl">
              {project.projectName}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400 sm:mt-4 sm:line-clamp-2 sm:text-base sm:leading-7">
              {summary}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 transition-transform duration-500 group-hover:rotate-45 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
            <ArrowUpRight className="h-5 w-5 text-black sm:h-6 sm:w-6" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}