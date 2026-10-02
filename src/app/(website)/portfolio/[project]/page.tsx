// src/app/portfolio/[project]/page.tsx/portfolio/some-project-slugOne single project's full detail page
// src/app/portfolio/[project]/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getPortfolioBySlug } from "@/repositories/portfolio.repository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    project: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { project } = await params;

  const item = await getPortfolioBySlug(project);

  if (!item) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${item.projectName} | Our Work`,
    description: item.resultSummary.slice(0, 160),

    openGraph: {
      title: `${item.projectName} | Our Work`,
      description: item.resultSummary.slice(0, 160),

      images: item.thumbnail
        ? [
            {
              url: item.thumbnail,
            },
          ]
        : undefined,
    },
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { project } = await params;

  const item = await getPortfolioBySlug(project);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f0] text-[#111]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-black/[0.07]">

        {/* Background glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-lime-300/25 blur-[150px]" />

        <div className="pointer-events-none absolute left-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-lime-200/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pb-24 pt-10 sm:px-8 lg:px-12 lg:pb-32 lg:pt-16">

          {/* Back to portfolio */}
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-black/45 transition-colors duration-300 hover:text-black"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/40 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
              <ArrowLeft size={15} />
            </span>

            Back to Work
          </Link>

          {/* Hero content */}
          <div className="mt-20 grid min-w-0 gap-14 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-20">

            {/* LEFT */}
            <div className="min-w-0">

              {/* Services */}
              {item.services.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {item.services.slice(0, 3).map((service) => (
                    <span
                      key={service.id}
                      className="rounded-full bg-lime-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black"
                    >
                      {service.name}
                    </span>
                  ))}

                  {item.services.length > 3 && (
                    <span className="rounded-full border border-black/10 bg-white/50 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black/40">
                      +{item.services.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Project title */}
              <h1 className="max-w-[1050px] break-words text-[clamp(3.4rem,7vw,8rem)] font-black leading-[0.82] tracking-[-0.07em] text-black">
                {item.projectName}
              </h1>

              {/* Client */}
              <div className="mt-9 flex items-center gap-3">
                <span className="h-px w-10 bg-black/20" />

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40">
                  Client — {item.clientName || item.projectName}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="min-w-0 lg:pb-1">

              {/* Small label */}
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/35">
                  Project Overview
                </span>
              </div>

              {/* Result summary */}
              <p className="text-base leading-8 text-black/55 sm:text-lg">
                {item.resultSummary}
              </p>

              {/* Live project */}
              {item.projectUrl && (
                <a
                  href={item.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-lime-400 hover:text-black"
                >
                  Visit Live Project

                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          HERO IMAGE
      ========================================================= */}

      {item.thumbnail && (
        <section className="mx-auto max-w-[1500px] px-4 pt-4 sm:px-8 lg:px-12 lg:pt-10">

          <div className="group relative aspect-[16/8.2] overflow-hidden rounded-[28px] bg-[#e8e8e2] sm:rounded-[36px]">

            <Image
              src={item.thumbnail}
              alt={item.projectName}
              fill
              priority
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.025]"
              sizes="100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {/* Featured badge */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md sm:bottom-7 sm:left-7">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Featured Project
            </div>

            {/* Corner arrow */}
            <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md sm:right-7 sm:top-7">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </section>
      )}


      {/* =========================================================
          CASE STUDY
      ========================================================= */}

      <section className="mt-10 bg-black px-6 py-24 text-white sm:px-8 lg:mt-20 lg:px-12 lg:py-32">

        <div className="mx-auto max-w-[1400px]">

          {/* Case study header */}
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-20">

            {/* LEFT LABEL */}
            <div>
              <div className="lg:sticky lg:top-24">

                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-lime-400" />

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
                    Case Study
                  </span>
                </div>

                <h2 className="mt-6 max-w-[250px] text-3xl font-black leading-[0.95] tracking-[-0.04em] sm:text-4xl">
                  Behind the
                  <br />
                  project.
                </h2>

                <p className="mt-6 max-w-[240px] text-sm leading-7 text-white/35">
                  A closer look at the challenge, thinking and process behind
                  this project.
                </p>

              </div>
            </div>


            {/* RIGHT CARDS */}
            <div className="space-y-5">

              {item.challenge && (
                <CaseStudyCard
                  number="01"
                  label="The Challenge"
                  title="Understanding the problem."
                  content={item.challenge}
                />
              )}

              {item.solution && (
                <CaseStudyCard
                  number="02"
                  label="The Solution"
                  title="Building the right experience."
                  content={item.solution}
                />
              )}

              {item.process && (
                <CaseStudyCard
                  number="03"
                  label="The Process"
                  title="From idea to execution."
                  content={item.process}
                />
              )}

            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          SERVICES / INDUSTRIES
      ========================================================= */}

      <section className="border-y border-black/[0.07] bg-white">

        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">

          <div className="grid gap-20 lg:grid-cols-2 lg:gap-32">

            {/* SERVICES */}
            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-600">
                Capabilities
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                What we delivered.
              </h2>

              {item.services.length > 0 && (
                <div className="mt-10 divide-y divide-black/[0.08] border-y border-black/[0.08]">

                  {item.services.map((service, index) => (
                    <div
                      key={service.id}
                      className="group flex items-center justify-between py-5"
                    >

                      <div className="flex items-center gap-5">

                        <span className="text-[10px] font-black text-black/20">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-base font-black">
                          {service.name}
                        </span>

                      </div>

                      <Check
                        size={18}
                        className="text-lime-500 transition-transform duration-300 group-hover:scale-125"
                      />

                    </div>
                  ))}

                </div>
              )}

            </div>


            {/* INDUSTRIES */}
            {item.industries.length > 0 && (
              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-600">
                  Expertise
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Industry knowledge.
                </h2>

                <div className="mt-10 flex flex-wrap gap-3">

                  {item.industries.map((industry) => (
                    <span
                      key={industry.id}
                      className="rounded-full border border-black/10 bg-[#f5f5f0] px-5 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:border-lime-400 hover:bg-lime-100"
                    >
                      {industry.name}
                    </span>
                  ))}

                </div>

              </div>
            )}

          </div>
        </div>
      </section>


      {/* =========================================================
          TESTIMONIAL
      ========================================================= */}

      {item.testimonial && (
        <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 lg:py-36">

          <div className="relative overflow-hidden rounded-[32px] bg-black px-7 py-14 text-white sm:px-12 lg:px-20 lg:py-20">

            {/* Glow */}
            <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full bg-lime-400/15 blur-[110px]" />

            <div className="relative">

              <div className="flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-lime-400" />

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
                  Client Words
                </p>

              </div>

              <blockquote className="mt-10 max-w-5xl text-3xl font-black leading-[1.15] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                “{item.testimonial.quote}”
              </blockquote>

              <div className="mt-12 flex items-center gap-4">

                {item.testimonial.photo ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={item.testimonial.photo}
                      alt={item.testimonial.clientName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 font-black text-black">
                    {item.testimonial.clientName.charAt(0)}
                  </div>
                )}

                <div>

                  <p className="text-sm font-black">
                    {item.testimonial.clientName}
                  </p>

                  {item.testimonial.company && (
                    <p className="mt-1 text-xs text-white/40">
                      {item.testimonial.company}
                    </p>
                  )}

                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* =========================================================
          CTA
      ========================================================= */}

{/* =========================================================
    FINAL CTA
========================================================= */}

<section className="border-t border-black/[0.08] bg-[#f5f5f0]">

  <div className="mx-auto max-w-[1500px] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">

    <div className="relative overflow-hidden border-y border-black/[0.08] py-16 sm:py-20 lg:py-24">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-lime-300/20 blur-[120px]" />

      <div className="relative grid gap-14 lg:grid-cols-[1fr_auto] lg:items-end">

        {/* LEFT */}
        <div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-lime-400" />

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              Have a project in mind?
            </p>
          </div>

          {/* Heading */}
          <h2 className="mt-7 max-w-5xl text-[clamp(3rem,6vw,6.5rem)] font-black leading-[0.86] tracking-[-0.065em]">
            Let&apos;s create
            <br />
            <span className="text-black/25">something</span>{" "}
            <span className="relative inline-block">
              remarkable.
              <span className="absolute -bottom-2 left-0 h-2 w-1/3 rounded-full bg-lime-400 sm:-bottom-3 sm:h-3" />
            </span>
          </h2>

          {/* Supporting text */}
          <p className="mt-8 max-w-xl text-sm leading-7 text-black/45 sm:text-base">
            Have an idea, a challenge, or a product that needs to move
            forward? Let&apos;s turn it into a digital experience that makes
            an impact.
          </p>

        </div>


        {/* RIGHT CTA */}
        <div className="flex lg:pb-1">

          <Link
            href="/contact"
            className="group relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-lime-400 text-black transition-all duration-500 hover:scale-110 hover:bg-black hover:text-white sm:h-40 sm:w-40"
          >

            {/* Text */}
            <span className="relative z-10 flex flex-col items-center text-center text-[11px] font-black uppercase tracking-[0.12em]">
              Start
              <br />
              a Project
            </span>

            {/* Arrow */}
            <ArrowUpRight
              size={20}
              className="absolute right-5 top-5 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 sm:right-7 sm:top-7"
            />

          </Link>

        </div>

      </div>


      {/* Bottom metadata */}
      <div className="relative mt-16 flex flex-col gap-4 border-t border-black/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">

        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/25">
          Let&apos;s work together
        </span>

        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">
          Next chapter →
        </span>

      </div>

    </div>

  </div>

</section>

    </main>
  );
}


/* =========================================================
   CASE STUDY CARD
========================================================= */

function CaseStudyCard({
  number,
  label,
  title,
  content,
}: {
  number: string;
  label: string;
  title: string;
  content: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-7 transition-all duration-500 hover:border-lime-400/40 hover:bg-white/[0.07] sm:p-10 lg:p-12">

      {/* Huge background number */}
      <div className="pointer-events-none absolute -right-4 -top-8 select-none text-[150px] font-black leading-none tracking-[-0.08em] text-white/[0.035] transition-all duration-700 group-hover:text-lime-400/[0.07] sm:text-[180px]">
        {number}
      </div>


      {/* Top */}
      <div className="relative flex items-center justify-between">

        <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-lime-400">
          {label}
        </span>

        <span className="text-xs font-black tracking-[0.2em] text-white/20">
          {number}
        </span>

      </div>


      {/* Heading */}
      <h3 className="relative mt-10 max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
        {title}
      </h3>


      {/* Content */}
      <div className="relative mt-8 max-w-3xl border-l border-white/10 pl-5 sm:pl-6">

        <p className="whitespace-pre-line text-sm leading-8 text-white/50 sm:text-base sm:leading-8">
          {content}
        </p>

      </div>


      {/* Bottom interaction */}
      <div className="relative mt-10 h-px w-full overflow-hidden bg-white/10">

        <div className="h-full w-0 bg-lime-400 transition-all duration-700 group-hover:w-full" />

      </div>

    </article>
  );
}