// Industries Index — http://localhost:3000/industries
// Should show:

// Heading "Industries We Serve"
// like healthcare, finance, manufacturing

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Industries We Serve",
  description:
    "Explore the industries we help transform through digital products, technology, and growth solutions.",
};

export default async function IndustriesIndexPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          serviceIndustries: true,
          portfolios: true,
          testimonials: true,
          faqs: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f0] text-[#111]">

      {/* HERO */}
      <section className="relative px-4 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:px-10 lg:px-16 lg:pb-28 lg:pt-40">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 sm:mb-10 sm:text-[11px] sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-lime-400" />
            Industries
          </div>

          <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">

            <div className="min-w-0">
              <h1 className="max-w-5xl break-words text-[clamp(2.8rem,10vw,8rem)] font-black leading-[0.92] tracking-[-0.07em] sm:leading-[0.88] sm:tracking-[-0.075em]">
                Built around
                <br />
                <span className="text-black/25">
                  your industry.
                </span>
              </h1>
            </div>

            <div className="max-w-md lg:pb-2">
              <p className="text-base leading-7 text-black/55 sm:text-lg sm:leading-8">
                We combine strategy, design and technology to build digital
                experiences that solve real business problems across
                industries.
              </p>

              <div className="mt-6 flex items-center gap-3 sm:mt-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {String(industries.length).padStart(2, "0")}
                </span>

                <span className="text-sm text-black/45">
                  industries currently served
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-t border-black/10 px-4 py-12 sm:px-8 sm:py-16 md:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-7 flex flex-col items-start justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 sm:text-[11px]">
                Explore
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl md:text-5xl">
                Industries we work with
              </h2>
            </div>

            <div className="text-xs text-black/40 sm:text-sm">
              {industries.length} industries
            </div>
          </div>

          {industries.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white px-5 py-12 text-center sm:py-16">
              <p className="text-lg font-bold">
                No industries available yet.
              </p>
              <p className="mt-2 text-sm text-black/50">
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

              {industries.map((industry, index) => (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.slug}`}
                  className="group block min-w-0 rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-4 sm:rounded-[28px] lg:rounded-[32px]"
                >
                  <article
                    className="
                      relative flex min-h-[400px] flex-col
                      overflow-hidden rounded-[24px]
                      border border-black/[0.07] bg-white
                      p-5 transition-all duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]
                      sm:min-h-[440px] sm:rounded-[28px] sm:p-7
                      lg:min-h-[480px] lg:rounded-[32px] lg:p-9
                    "
                  >

                    {/* Background decoration */}
                    <div
                      className="
                        pointer-events-none absolute -right-20 -top-20
                        h-48 w-48 rounded-full bg-lime-300/20 blur-3xl
                        transition-transform duration-700
                        group-hover:scale-150
                        sm:-right-24 sm:-top-24 sm:h-64 sm:w-64
                      "
                    />

                    {/* TOP */}
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-black/25 sm:text-[11px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="
                          flex h-11 w-11 shrink-0 items-center
                          justify-center rounded-full border
                          border-black/10 transition-all duration-300
                          group-hover:border-black group-hover:bg-black
                          group-hover:text-white
                          sm:h-14 sm:w-14
                        "
                      >
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.8}
                          className="transition-transform duration-300 group-hover:rotate-45"
                        />
                      </span>
                    </div>

                    {/* ICON */}
                    <div className="relative z-10 mt-9 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f3f3ef] sm:mt-12 sm:h-16 sm:w-16 sm:rounded-[20px] lg:mt-16">
                      <BriefcaseBusiness
                        size={25}
                        strokeWidth={1.6}
                        className="text-black/60 sm:h-[27px] sm:w-[27px]"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 mt-6 sm:mt-8 lg:mt-9">
                      <h3 className="break-words text-[clamp(1.8rem,5vw,3rem)] font-black leading-tight tracking-[-0.055em]">
                        {industry.name}
                      </h3>

                      {industry.description && (
                        <p className="mt-3 line-clamp-3 max-w-xl break-words text-sm leading-6 text-black/50 sm:mt-5 sm:text-[15px] sm:leading-7">
                          {industry.description}
                        </p>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="relative z-10 mt-auto pt-8 sm:pt-10">
                      <div className="flex items-end justify-between gap-3 border-t border-black/10 pt-5 sm:pt-6">

                        <div className="flex min-w-0 items-center">

                          <div className="pr-3 sm:pr-6">
                            <p className="text-xl font-black tracking-[-0.04em] sm:text-2xl">
                              {industry._count.serviceIndustries}
                            </p>

                            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-black/35 sm:text-[10px] sm:tracking-[0.18em]">
                              Services
                            </p>
                          </div>

                          <div className="h-8 w-px shrink-0 bg-black/10 sm:h-10" />

                          <div className="pl-3 sm:pl-6">
                            <p className="text-xl font-black tracking-[-0.04em] sm:text-2xl">
                              {industry._count.portfolios}
                            </p>

                            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-black/35 sm:text-[10px] sm:tracking-[0.18em]">
                              Projects
                            </p>
                          </div>

                        </div>

                        <span className="hidden shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/40 transition-colors group-hover:text-black sm:flex">
                          Explore
                          <ArrowUpRight size={14} />
                        </span>

                      </div>
                    </div>

                  </article>
                </Link>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-14 pt-2 sm:px-8 sm:pb-20 md:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1400px]">

          <div className="relative overflow-hidden rounded-[26px] bg-black px-5 py-10 text-white sm:rounded-[32px] sm:px-8 sm:py-14 md:px-12 lg:rounded-[36px] lg:px-16 lg:py-20">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl sm:-right-20 sm:-top-32 sm:h-96 sm:w-96" />

            <div className="relative z-10 max-w-3xl">

              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black sm:mb-8 sm:h-12 sm:w-12">
                <Sparkles size={20} />
              </div>

              <h2 className="text-[clamp(2.1rem,7vw,3.75rem)] font-black leading-[0.98] tracking-[-0.055em] sm:leading-[0.95]">
                Have a business
                <br />
                challenge to solve?
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/50 sm:mt-7 sm:text-base sm:leading-7">
                Tell us what you are building. We can help turn your idea,
                challenge, or business requirement into a digital solution.
              </p>

              <Link
                href="/contact"
                className="
                  mt-7 inline-flex w-full items-center justify-center
                  gap-3 rounded-full bg-lime-400 px-5 py-4
                  text-sm font-black text-black
                  transition-transform duration-300
                  hover:scale-[1.02]
                  sm:mt-9 sm:w-auto sm:px-6
                  sm:hover:scale-105
                "
              >
                Start a conversation
                <ArrowUpRight size={17} />
              </Link>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}