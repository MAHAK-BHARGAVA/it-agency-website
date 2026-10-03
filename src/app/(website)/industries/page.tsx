// Industries Index — http://localhost:3000/industries
// Should show:

// Heading "Industries We Serve"
// like healthcare, finance, manufacturing

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
  Layers3,
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
      <section className="relative px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:pb-28 lg:pt-40">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-10 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black/40">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            Industries
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">

            <div>
              <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.86] tracking-[-0.075em]">
                Built around
                <br />
                <span className="text-black/25">your industry.</span>
              </h1>
            </div>

            <div className="max-w-md lg:pb-2">
              <p className="text-lg leading-8 text-black/55">
                We combine strategy, design and technology to build digital
                experiences that solve real business problems across
                industries.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  {String(industries.length).padStart(2, "0")}
                </span>
                <span className="text-black/45">
                  industries currently served
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-t border-black/10 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/35">
                Explore
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                Industries we work with
              </h2>
            </div>

            <div className="hidden text-sm text-black/40 sm:block">
              {industries.length} industries
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {industries.map((industry, index) => (
              <Link
                key={industry.id}
                href={`/industries/${industry.slug}`}
                className="group block"
              >
                <article
                  className="
                    relative flex min-h-[480px] flex-col overflow-hidden
                    rounded-[32px] border border-black/[0.07]
                    bg-white p-7
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]
                    sm:p-9
                  "
                >

                  {/* subtle background */}
                  <div
                    className="
                      pointer-events-none absolute -right-24 -top-24
                      h-64 w-64 rounded-full
                      bg-lime-300/20 blur-3xl
                      transition-all duration-700
                      group-hover:scale-150
                    "
                  />

                  {/* TOP */}
                  <div className="relative z-10 flex items-start justify-between">

                    <span className="text-[11px] font-bold tracking-[0.2em] text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="
                        flex h-14 w-14 items-center justify-center
                        rounded-full border border-black/10
                        transition-all duration-300
                        group-hover:border-black
                        group-hover:bg-black
                        group-hover:text-white
                      "
                    >
                      <ArrowUpRight
                        size={21}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />
                    </span>

                  </div>

                  {/* ICON */}
                  <div className="relative z-10 mt-16 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f3f3ef]">
                    <BriefcaseBusiness
                      size={27}
                      strokeWidth={1.6}
                      className="text-black/60"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 mt-9">

                    <h3 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                      {industry.name}
                    </h3>

                    <p className="mt-5 line-clamp-3 max-w-xl text-[15px] leading-7 text-black/50">
                      {industry.description}
                    </p>

                  </div>

                  {/* FOOTER
                      IMPORTANT:
                      This is NOT absolute.
                      mt-auto keeps it at the bottom and prevents overlap.
                  */}
                  <div className="relative z-10 mt-auto pt-10">

                    <div className="flex items-end justify-between border-t border-black/10 pt-6">

                      <div className="flex items-center">

                        <div className="pr-6">
                          <p className="text-2xl font-black tracking-[-0.04em]">
                            {industry._count.serviceIndustries}
                          </p>

                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                            Services
                          </p>
                        </div>

                        <div className="h-10 w-px bg-black/10" />

                        <div className="pl-6">
                          <p className="text-2xl font-black tracking-[-0.04em]">
                            {industry._count.portfolios}
                          </p>

                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                            Projects
                          </p>
                        </div>

                      </div>

                      <span className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/40 sm:flex">
                        Explore
                        <ArrowUpRight size={14} />
                      </span>

                    </div>

                  </div>

                </article>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 pt-4 sm:px-10 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1400px]">

          <div className="relative overflow-hidden rounded-[36px] bg-black px-7 py-16 text-white sm:px-12 lg:px-16 lg:py-20">

            <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-lime-400/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-black">
                <Sparkles size={20} />
              </div>

              <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Have a business
                <br />
                challenge to solve?
              </h2>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/50">
                Tell us what you are building. We can help turn your idea,
                challenge, or business requirement into a digital solution.
              </p>

              <Link
                href="/contact"
                className="
                  mt-9 inline-flex items-center gap-3
                  rounded-full bg-lime-400 px-6 py-4
                  text-sm font-black text-black
                  transition-transform duration-300
                  hover:scale-105
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