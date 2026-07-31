"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Portfolio } from "@/generated/prisma/client";

type Props = {
  project: Portfolio;
  index: number;
  featured?: boolean;
};

export default function PortfolioCard({ project, index, featured = false }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const hasThumbnail = Boolean(project.thumbnail?.trim()) && !imgFailed;
  const summary = project.resultSummary?.trim() || "Full case study coming soon.";

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className={`group relative block overflow-hidden rounded-[32px] bg-[#121212] ring-1 ring-white/[0.06] transition-colors duration-500 hover:bg-[#161616] ${
          featured ? "lg:flex lg:items-center" : ""
        }`}
      >
        {/* hover progress line */}
        <span className="absolute left-0 top-0 z-10 h-[3px] w-0 bg-lime-400 transition-all duration-500 ease-out group-hover:w-full" />

        <div
          className={`relative w-full overflow-hidden ${
            featured ? "aspect-[16/10] lg:w-3/5" : "aspect-[4/3]"
          }`}
        >
          {hasThumbnail ? (
            <Image
              src={project.thumbnail!.trim()}
              alt={project.projectName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
              onError={() => setImgFailed(true)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
              <span className="font-mono text-xs uppercase tracking-widest text-white/30">
                Preview coming soon
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          <span className="absolute bottom-5 left-5 z-10 flex translate-y-3 items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            View case study
            <ArrowUpRight size={14} />
          </span>
        </div>

        <div
          className={`flex items-center justify-between gap-6 p-6 sm:p-8 ${
            featured ? "lg:w-2/5 lg:flex-col lg:items-start lg:justify-center" : ""
          }`}
        >
          <div>
            <span className="font-mono text-xs text-gray-500">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3
              className={`mt-2 font-black text-white ${
                featured ? "text-4xl lg:text-5xl" : "text-3xl"
              }`}
            >
              {project.projectName}
            </h3>

            <p className="mt-4 line-clamp-2 text-gray-400">{summary}</p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime-400 transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="text-black" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}