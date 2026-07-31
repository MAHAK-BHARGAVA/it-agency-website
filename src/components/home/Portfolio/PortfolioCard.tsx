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
          ? undefined
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
        margin: "-80px",
      }}
      transition={{
        duration: 0.6,
        delay: Math.min(index, 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`View ${project.projectName} case study`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[32px] bg-[#121212] ring-1 ring-white/[0.06] transition-all duration-500 hover:-translate-y-2 hover:bg-[#161616] hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
      >
        {/* Lime hover line */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 z-20 h-[3px] w-0 bg-lime-400 transition-all duration-500 ease-out group-hover:w-full"
        />

        {/* Image frame */}
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
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
              <span className="font-mono text-xs uppercase tracking-widest text-white/30">
                Preview coming soon
              </span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.04]"
          />

          <span className="absolute bottom-5 left-5 z-10 flex translate-y-3 items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black opacity-0 transition-all duration-[400ms] ease-out group-hover:translate-y-0 group-hover:opacity-100">
            View case study
            <ArrowUpRight size={14} />
          </span>
        </div>

        {/* Card content */}
        <div className="flex min-h-[240px] flex-1 items-center justify-between gap-6 p-6 sm:p-8">
          <div className="min-w-0">
            <span className="font-mono text-xs text-gray-500">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
              {project.projectName}
            </h3>

            <p className="mt-4 line-clamp-2 leading-7 text-gray-400">
              {summary}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime-400 transition-transform duration-500 group-hover:rotate-45 sm:h-16 sm:w-16">
            <ArrowUpRight className="text-black" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}