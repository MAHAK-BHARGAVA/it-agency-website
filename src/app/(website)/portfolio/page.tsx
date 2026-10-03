// src/app/portfolio/page.tsx/portfolioThe index/list — every project, as a grid or list of links
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers3, Sparkles } from "lucide-react";

import { getAllPortfolio } from "@/repositories/portfolio.repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Portfolio | Our Work",
  description:
    "Explore our latest digital projects, case studies, and solutions delivered for clients across industries.",
};

export default async function PortfolioPage() {
  const projects = await getAllPortfolio();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f0] text-[#111]">
      {/* HERO */}
      <section className="relative border-b border-black/[0.07]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-lime-300/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-20 sm:px-8 lg:px-12 lg:pb-32 lg:pt-28">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400">
              <Sparkles size={14} />
            </span>

            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/50">
              Selected Work
            </p>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.065em]">
              Ideas.
              <br />
              <span className="text-black/25">Built.</span>
              <br />
              <span className="relative inline-block">
                Delivered.
                <span className="absolute -bottom-2 left-0 h-2 w-1/3 rounded-full bg-lime-400 sm:-bottom-3 sm:h-3" />
              </span>
            </h1>

            <div className="lg:pb-2">
              <p className="max-w-sm text-base leading-8 text-black/50 sm:text-lg">
                A selection of digital products, websites and technology
                experiences we've created to solve real business problems.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-12 bg-black/20" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
                  {projects.length}{" "}
                  {projects.length === 1 ? "Project" : "Projects"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        {projects.length === 0 ? (
          <EmptyPortfolio />
        ) : (
          <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 lg:gap-x-10 lg:gap-y-28">
            {projects.map((project, index) => (
              <PortfolioCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* FOOTER CTA */}
      <section className="border-t border-black/[0.07]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="relative overflow-hidden rounded-[32px] bg-black px-7 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-40 h-[400px] w-[400px] rounded-full bg-lime-400/20 blur-[100px]" />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-lime-400">
                  Your project could be next
                </p>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Have an idea?
                  <br />
                  Let's make it real.
                </h2>
              </div>

              <Link
                href="/contact"
                className="group inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-lime-400 px-7 text-sm font-black text-black transition-all duration-300 hover:scale-105 hover:bg-white"
              >
                Start a Project
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PortfolioCard({
  project,
  index,
}: {
  project: Awaited<ReturnType<typeof getAllPortfolio>>[number];
  index: number;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`group block ${
        index % 2 === 1 ? "md:translate-y-16" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="relative aspect-[1.18/1] overflow-hidden rounded-[30px] bg-[#e9e9e3]">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.projectName}
            fill
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers3 className="h-16 w-16 text-black/10" />
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        {/* Number */}
        <div className="absolute left-5 top-5 flex h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 px-3 text-[11px] font-black text-white backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* View button */}
        <div className="absolute bottom-5 right-5 flex h-14 w-14 translate-y-3 items-center justify-center rounded-full bg-lime-400 text-black opacity-0 shadow-2xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight
            size={22}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.services.slice(0, 3).map((service) => (
              <span
                key={service.id}
                className="rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black/55 transition-colors group-hover:border-lime-300 group-hover:bg-lime-100 group-hover:text-lime-900"
              >
                {service.name}
              </span>
            ))}

            {project.services.length > 3 && (
              <span className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-black text-black/35">
                +{project.services.length - 3}
              </span>
            )}
          </div>

          <span className="hidden text-[10px] font-black uppercase tracking-[0.2em] text-black/25 sm:block">
            Case Study
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
              {project.projectName}
            </h2>

            {project.clientName && (
              <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-black/35">
                {project.clientName}
              </p>
            )}
          </div>

          <ArrowUpRight
            size={22}
            className="mt-1 shrink-0 text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
          />
        </div>

        <p className="mt-4 max-w-xl text-sm leading-7 text-black/45">
          {project.resultSummary}
        </p>

        {project.industries.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-2 text-[10px] font-black uppercase tracking-[0.16em] text-black/25">
            {project.industries.map((industry, i) => (
              <span key={industry.id}>
                {industry.name}
                {i < project.industries.length - 1 && (
                  <span className="ml-2 text-lime-500">•</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function EmptyPortfolio() {
  return (
    <div className="rounded-[32px] border border-black/[0.07] bg-white px-6 py-28 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-100">
        <Layers3 className="h-7 w-7 text-lime-700" />
      </div>

      <h2 className="mt-7 text-3xl font-black tracking-tight">
        Our portfolio is coming soon.
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/40">
        We're currently preparing our latest projects and case studies.
      </p>
    </div>
  );
}