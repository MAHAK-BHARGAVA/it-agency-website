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
  ChevronDown,
  Quote,
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
    return { title: "Industry Not Found" };
  }

  return {
    title: data.metaTitle || `${data.name} Solutions`,
    description:
      data.metaDescription || data.description.slice(0, 160),
    alternates: data.canonicalUrl
      ? { canonical: data.canonicalUrl }
      : undefined,
    openGraph: {
      title: data.metaTitle || `${data.name} Solutions`,
      description:
        data.metaDescription || data.description.slice(0, 160),
      images: data.ogImage ? [{ url: data.ogImage }] : undefined,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;

  const industryData = await prisma.industry.findUnique({
    where: { slug: industry },
    include: {
      serviceIndustries: {
        include: { service: true },
      },
      portfolios: {
        include: {
          services: true,
          industries: true,
        },
        orderBy: { createdAt: "desc" },
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
        services: { none: {} },
        cities: { none: {} },
        industries: { none: {} },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f0] text-[#111]">

      {/* HERO */}
      <section className="relative px-4 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28 md:px-10 lg:px-16 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">

          <Link
            href="/industries"
            className="group mb-9 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40 sm:mb-14 sm:text-[11px] sm:tracking-[0.2em]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition group-hover:bg-black group-hover:text-white">
              <ArrowLeft size={14} />
            </span>
            All industries
          </Link>

          <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">

            <div className="min-w-0">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 sm:text-[11px] sm:tracking-[0.22em]">
                  Industry expertise
                </span>
              </div>

              <h1 className="break-words text-[clamp(2.8rem,10vw,8rem)] font-black leading-[0.9] tracking-[-0.07em] sm:leading-[0.82] sm:tracking-[-0.075em]">
                {industryData.name}
                <span className="text-black/20">.</span>
              </h1>
            </div>

            <div className="max-w-xl lg:pb-2">
              <p className="break-words text-base leading-7 text-black/55 sm:text-xl sm:leading-8 md:text-2xl md:leading-9">
                {industryData.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:mt-9 sm:gap-3">
                <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-bold sm:px-4 sm:text-xs">
                  {industryData.serviceIndustries.length} Services
                </span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-bold sm:px-4 sm:text-xs">
                  {industryData.portfolios.length} Projects
                </span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-bold sm:px-4 sm:text-xs">
                  {testimonials.length} Reviews
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      {industryData.serviceIndustries.length > 0 && (
        <section className="border-y border-black/10 bg-white px-4 py-14 sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1400px]">

            <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.35fr_1fr]">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/30 sm:text-[11px] sm:tracking-[0.2em]">
                  What we do
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] sm:mt-5 sm:text-4xl md:text-5xl">
                  Services built
                  <br className="hidden sm:block" />
                  {" "}for {industryData.name}.
                </h2>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {industryData.serviceIndustries.map(
                  (serviceIndustry, index) => (
                    <Link
                      key={serviceIndustry.id}
                      href={`/services/${serviceIndustry.service.slug}`}
                      className="group min-w-0 rounded-[22px] border border-black/10 bg-[#f5f5f0] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white sm:rounded-[26px] sm:p-7"
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

                      <h3 className="mt-8 break-words text-xl font-black tracking-[-0.04em] sm:mt-12 sm:text-2xl">
                        {serviceIndustry.service.name}
                      </h3>

                      {serviceIndustry.introText && (
                        <p className="mt-3 line-clamp-3 break-words text-sm leading-6 opacity-50 sm:mt-4">
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

      {/* PROJECTS */}
      {industryData.portfolios.length > 0 && (
        <section className="px-4 py-14 sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1400px]">

            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end sm:gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/30 sm:text-[11px] sm:tracking-[0.2em]">
                  Selected work
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl md:text-6xl">
                  Projects in
                  <br />
                  {industryData.name}.
                </h2>
              </div>

              <span className="text-xs text-black/35 sm:text-sm">
                {industryData.portfolios.length} projects
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              {industryData.portfolios.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group block min-w-0 rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-4 sm:rounded-[30px]"
                >
                  <article className="h-full overflow-hidden rounded-[24px] border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:rounded-[30px]">

                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e8e8e2]">
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.projectName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1400px) 50vw, 680px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BriefcaseBusiness
                            size={36}
                            className="text-black/15 sm:h-[42px] sm:w-[42px]"
                          />
                        </div>
                      )}

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-[10px]">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform group-hover:rotate-45 sm:right-5 sm:top-5 sm:h-11 sm:w-11">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    <div className="p-5 sm:p-8">
                      <div className="flex flex-wrap gap-2">
                        {project.services.slice(0, 2).map((service) => (
                          <span
                            key={service.id}
                            className="max-w-full break-words rounded-full bg-[#f3f3ef] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-black/45 sm:tracking-[0.12em]"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>

                      <h3 className="mt-5 break-words text-2xl font-black leading-tight tracking-[-0.05em] sm:mt-6 sm:text-3xl">
                        {project.projectName}
                      </h3>

                      {project.resultSummary && (
                        <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-black/45">
                          {project.resultSummary}
                        </p>
                      )}

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/10 pt-5 sm:mt-7">
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-black/35 sm:text-[10px] sm:tracking-[0.17em]">
                          View case study
                        </span>

                        <ArrowUpRight
                          size={16}
                          className="shrink-0 transition-transform group-hover:translate-x-1"
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

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-black px-4 py-14 text-white sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1400px]">

            <div className="mb-9 flex items-center gap-3 sm:mb-14">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-black sm:h-11 sm:w-11">
                <Quote size={18} />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 sm:text-[11px] sm:tracking-[0.2em]">
                Client perspective
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              {testimonials.slice(0, 4).map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="min-w-0 rounded-[22px] border border-white/10 bg-white/[0.04] p-5 sm:rounded-[28px] sm:p-8 md:p-10"
                >
                  <Quote
                    size={25}
                    className="text-lime-400 sm:h-7 sm:w-7"
                  />

                  <blockquote className="mt-6 break-words text-xl font-medium leading-8 tracking-[-0.025em] text-white/85 sm:mt-8 sm:text-2xl sm:leading-9">
                    “{testimonial.quote}”
                  </blockquote>

                  <div className="mt-8 flex min-w-0 items-center gap-3 border-t border-white/10 pt-5 sm:mt-10 sm:gap-4 sm:pt-6">
                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.clientName}
                        width={46}
                        height={46}
                        className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-black sm:h-11 sm:w-11">
                        {testimonial.clientName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold">
                        {testimonial.clientName}
                      </p>

                      {testimonial.company && (
                        <p className="mt-1 break-words text-xs text-white/35">
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

      {/* FAQ */}
      {industryData.faqs.length > 0 && (
        <section className="px-4 py-14 sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-8 sm:gap-14 lg:grid-cols-[0.4fr_0.6fr]">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/30 sm:text-[11px] sm:tracking-[0.2em]">
                FAQ
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] sm:mt-5 sm:text-4xl md:text-5xl">
                Questions,
                <br />
                answered.
              </h2>
            </div>

            <div className="min-w-0 divide-y divide-black/10">
              {industryData.faqs.map((faq) => (
                <details key={faq.id} className="group py-5 sm:py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold leading-6 tracking-[-0.02em] sm:gap-6 sm:text-lg">
                    <span className="min-w-0 break-words">
                      {faq.question}
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-transform group-open:rotate-45">
                      <ArrowUpRight size={15} />
                    </span>
                  </summary>

                  <p className="max-w-2xl break-words pt-4 text-sm leading-7 text-black/50 sm:pt-5">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* PREMIUM CTA */}
      <section className="px-4 pb-14 sm:px-8 sm:pb-20 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1400px]">

          <div className="relative overflow-hidden rounded-[26px] bg-black sm:rounded-[32px] lg:rounded-[36px]">

            {/* Lime glow */}
            <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-lime-400/20 blur-[80px] sm:-right-32 sm:-top-32 sm:h-[520px] sm:w-[520px] sm:blur-[100px]" />

            {/* Background text */}
            <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[18vw] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:-bottom-8 sm:text-[17vw]">
              LET&apos;S TALK
            </div>

            <div className="relative z-10 flex flex-col justify-between p-5 sm:p-8 md:p-12 lg:min-h-[500px] lg:p-16">

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-400" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40 sm:text-[10px] sm:tracking-[0.22em]">
                    Start a conversation
                  </span>
                </div>

                <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 sm:block">
                  01 / 01
                </span>
              </div>

              <div className="mt-12 grid gap-8 sm:mt-16 sm:gap-12 lg:mt-0 lg:grid-cols-[1fr_0.45fr] lg:items-end">

                <div>
                  <h2 className="max-w-4xl text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.065em] text-white sm:leading-[0.86] sm:tracking-[-0.07em]">
                    Let&apos;s build
                    <br />
                    something{" "}
                    <span className="text-lime-400">meaningful.</span>
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-6 text-white/45 sm:mt-7 sm:text-base sm:leading-7 md:text-lg">
                    Have a business challenge, a new idea, or a digital
                    product you want to build? Let&apos;s turn it into
                    something people actually want to use.
                  </p>
                </div>

                <div className="lg:flex lg:justify-end">
                  <Link
                    href="/contact"
                    className="group inline-flex w-full items-center justify-center gap-4 rounded-full bg-lime-400 px-5 py-3.5 text-sm font-black text-black transition-all duration-300 hover:bg-white sm:w-auto sm:px-7 sm:py-4 sm:hover:scale-105"
                  >
                    Start a project

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </div>

              </div>

              <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25 sm:text-[10px] sm:tracking-[0.18em]">
                  Strategy · Design · Technology
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25 sm:text-[10px] sm:tracking-[0.18em]">
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