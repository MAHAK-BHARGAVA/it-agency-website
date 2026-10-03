// What /industries/[industry]/page.tsx handles
// This is for URLs like:
// /industries/healthcare
// /industries/education
// /industries/real-estate

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ExternalLink,
  Layers3,
  Quote,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ industry: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { industry } = await params;

  const data = await prisma.industry.findUnique({
    where: { slug: industry },
  });

  if (!data) {
    return {
      title: "Industry Not Found",
    };
  }

  return {
    title: data.metaTitle || `${data.name} Solutions`,
    description:
      data.metaDescription ||
      data.description.slice(0, 160),

    alternates: data.canonicalUrl
      ? {
          canonical: data.canonicalUrl,
        }
      : undefined,

    openGraph: {
      title: data.metaTitle || `${data.name} Solutions`,
      description:
        data.metaDescription ||
        data.description.slice(0, 160),
      images: data.ogImage
        ? [{ url: data.ogImage }]
        : undefined,
    },
  };
}

export default async function IndustryPage({
  params,
}: Props) {
  const { industry } = await params;

  const industryData = await prisma.industry.findUnique({
    where: {
      slug: industry,
    },
    include: {
      serviceIndustries: {
        include: {
          service: true,
        },
      },

      portfolios: {
        include: {
          services: true,
          industries: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      testimonials: true,

      faqs: true,
    },
  });

  if (!industryData) {
    notFound();
  }

  let testimonials = industryData.testimonials;

  if (testimonials.length === 0) {
    testimonials = await prisma.testimonial.findMany({
      where: {
        services: {
          none: {},
        },
        cities: {
          none: {},
        },
        industries: {
          none: {},
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f0] text-[#111]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative px-6 pb-20 pt-28 sm:px-10 lg:px-16 lg:pb-28 lg:pt-36">

        <div className="mx-auto max-w-[1400px]">

          {/* Breadcrumb */}
          <Link
            href="/industries"
            className="group mb-14 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black/40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition group-hover:bg-black group-hover:text-white">
              <ArrowLeft size={14} />
            </span>

            All industries
          </Link>

          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">

            <div>

              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-lime-400" />

                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-black/40">
                  Industry expertise
                </span>
              </div>

              <h1 className="max-w-5xl text-[clamp(4rem,8vw,8rem)] font-black leading-[0.82] tracking-[-0.075em]">
                {industryData.name}
                <span className="text-black/20">.</span>
              </h1>

            </div>

            <div className="max-w-xl lg:pb-2">

              <p className="text-xl leading-9 text-black/55 sm:text-2xl">
                {industryData.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold">
                  {industryData.serviceIndustries.length} Services
                </span>

                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold">
                  {industryData.portfolios.length} Projects
                </span>

                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold">
                  {industryData.testimonials.length} Reviews
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      {industryData.serviceIndustries.length > 0 && (
        <section className="border-y border-black/10 bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="mx-auto max-w-[1400px]">

            <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr]">

              <div>

                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
                  What we do
                </p>

                <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                  Services built
                  <br />
                  for {industryData.name}.
                </h2>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {industryData.serviceIndustries.map(
                  (serviceIndustry, index) => (
                    <Link
                      key={serviceIndustry.id}
                      href={`/services/${serviceIndustry.service.slug}`}
                      className="group rounded-[26px] border border-black/10 bg-[#f5f5f0] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-[10px] font-black tracking-[0.2em] opacity-30">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <ArrowUpRight
                          size={18}
                          className="transition-transform group-hover:rotate-45"
                        />

                      </div>

                      <h3 className="mt-12 text-2xl font-black tracking-[-0.04em]">
                        {serviceIndustry.service.name}
                      </h3>

                      {serviceIndustry.introText && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-50">
                          {serviceIndustry.introText}
                        </p>
                      )}

                    </Link>
                  )
                )}

              </div>

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          PROJECTS
      ===================================================== */}

      {industryData.portfolios.length > 0 && (
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="mx-auto max-w-[1400px]">

            <div className="mb-12 flex items-end justify-between gap-8">

              <div>

                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
                  Selected work
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
                  Projects in
                  <br />
                  {industryData.name}.
                </h2>

              </div>

              <span className="hidden text-sm text-black/35 sm:block">
                {industryData.portfolios.length} projects
              </span>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {industryData.portfolios.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group block"
                >

                  <article className="overflow-hidden rounded-[30px] border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]">

                    {/* IMAGE */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e8e8e2]">

                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.projectName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BriefcaseBusiness
                            size={42}
                            className="text-black/15"
                          />
                        </div>
                      )}

                      <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform group-hover:rotate-45">
                        <ArrowUpRight size={18} />
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-7 sm:p-8">

                      <div className="flex flex-wrap gap-2">

                        {project.services.slice(0, 2).map(
                          (service) => (
                            <span
                              key={service.id}
                              className="rounded-full bg-[#f3f3ef] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black/45"
                            >
                              {service.name}
                            </span>
                          )
                        )}

                      </div>

                      <h3 className="mt-6 text-3xl font-black tracking-[-0.05em]">
                        {project.projectName}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/45">
                        {project.resultSummary}
                      </p>

                      <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">

                        <span className="text-[10px] font-black uppercase tracking-[0.17em] text-black/35">
                          View case study
                        </span>

                        <ChevronDown
                          size={16}
                          className="-rotate-90 transition-transform group-hover:translate-x-1"
                        />

                      </div>

                    </div>

                  </article>

                </Link>
              ))}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      {testimonials.length > 0 && (
        <section className="bg-black px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-28">

          <div className="mx-auto max-w-[1400px]">

            <div className="mb-14 flex items-center gap-3">

              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black">
                <Quote size={18} />
              </span>

              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                Client perspective
              </span>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {testimonials.slice(0, 4).map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 sm:p-10"
                >

                  <Quote
                    size={28}
                    className="text-lime-400"
                  />

                  <blockquote className="mt-8 text-2xl font-medium leading-9 tracking-[-0.025em] text-white/85">
                    “{testimonial.quote}”
                  </blockquote>

                  <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">

                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.clientName}
                        width={46}
                        height={46}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 font-black text-black">
                        {testimonial.clientName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold">
                        {testimonial.clientName}
                      </p>

                      {testimonial.company && (
                        <p className="mt-1 text-xs text-white/35">
                          {testimonial.company}
                        </p>
                      )}
                    </div>

                  </div>

                </article>
              ))}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          FAQ
      ===================================================== */}

      {industryData.faqs.length > 0 && (
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[0.4fr_0.6fr]">

            <div>

              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
                FAQ
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Questions,
                <br />
                answered.
              </h2>

            </div>

            <div className="divide-y divide-black/10">

              {industryData.faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group py-6"
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold tracking-[-0.02em]">
                    <span>{faq.question}</span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-transform group-open:rotate-45">
                      <ArrowUpRight size={15} />
                    </span>
                  </summary>

                  <p className="max-w-2xl pt-5 text-sm leading-7 text-black/50">
                    {faq.answer}
                  </p>

                </details>
              ))}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          CTA
      ===================================================== */}

     {/* =====================================================
    PREMIUM CTA
===================================================== */}

<section className="px-6 pb-20 sm:px-10 lg:px-16 lg:pb-32">
  <div className="mx-auto max-w-[1400px]">

    <div className="relative min-h-[500px] overflow-hidden rounded-[36px] bg-black">

      {/* Background lime glow */}
      <div
        className="
          pointer-events-none absolute
          -right-32 -top-32
          h-[520px] w-[520px]
          rounded-full
          bg-lime-400/20
          blur-[100px]
        "
      />

      {/* Giant background text */}
      <div
        className="
          pointer-events-none absolute
          -bottom-8 left-1/2
          -translate-x-1/2
          whitespace-nowrap
          text-[17vw]
          font-black
          leading-none
          tracking-[-0.08em]
          text-white/[0.035]
        "
      >
        LET&apos;S TALK
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-8 sm:p-12 lg:p-16">

        {/* Top */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
              Start a conversation
            </span>
          </div>

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 sm:block">
            01 / 01
          </span>

        </div>


        {/* Main content */}
        <div className="grid gap-12 lg:grid-cols-[1fr_0.45fr] lg:items-end">

          <div>

            <h2
              className="
                max-w-4xl
                text-[clamp(3rem,6vw,6.5rem)]
                font-black
                leading-[0.86]
                tracking-[-0.07em]
                text-white
              "
            >
              Let&apos;s build
              <br />
              something{" "}
              <span className="text-lime-400">meaningful.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Have a business challenge, a new idea, or a digital product
              you want to build? Let&apos;s turn it into something people
              actually want to use.
            </p>

          </div>


          {/* CTA */}
          <div className="lg:flex lg:justify-end">

            <Link
              href="/contact"
              className="
                group
                inline-flex
                items-center
                gap-4
                rounded-full
                bg-lime-400
                px-7
                py-4
                text-sm
                font-black
                text-black
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white
              "
            >
              Start a project

              <span
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-full
                  bg-black
                  text-white
                  transition-transform
                  duration-300
                  group-hover:rotate-45
                "
              >
                <ArrowUpRight size={15} />
              </span>

            </Link>

          </div>

        </div>


        {/* Bottom line */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            Strategy · Design · Technology
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            Let&apos;s make it happen →
          </p>

        </div>

      </div>

    </div>

  </div>
</section>

    </main>
  );
}