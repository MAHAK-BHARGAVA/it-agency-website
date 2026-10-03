import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  MoveUpRight,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#F5F5F0] text-[#171918]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-[#101212] text-white">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-[15%] top-[8%] h-[700px] w-[700px] rounded-full bg-[#B7F000]/[0.07] blur-[150px]" />

        <div className="pointer-events-none absolute -bottom-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-[#B7F000]/[0.035] blur-[140px]" />

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:100px_100px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 sm:px-10 lg:px-16">
          {/* Header line */}
          <div className="flex items-center justify-between border-b border-white/[0.08] py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B7F000] text-black">
                <Sparkles size={14} />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Soclthry
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
              About / 001
            </span>
          </div>

          {/* Hero */}
          <div className="flex flex-1 flex-col justify-center py-24">
            <div className="mb-10 flex items-center gap-4">
              <span className="h-px w-10 bg-[#B7F000]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#B7F000]">
                Digital agency
              </span>
            </div>

            <h1 className="max-w-[1300px] text-[16vw] font-semibold leading-[0.76] tracking-[-0.09em] sm:text-[12vw] lg:text-[10.5rem]">
              We make
              <br />
              <span className="text-white/20">digital</span>
              <br />
              <span className="text-[#B7F000]">matter.</span>
            </h1>

            <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <p className="max-w-2xl text-lg leading-8 text-white/45 sm:text-xl">
                Soclthry is a digital agency building websites, products and
                digital experiences that help ambitious businesses move
                forward.
              </p>

              <div className="lg:border-l lg:border-white/10 lg:pl-8">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/25">
                  Scroll to explore
                </p>

                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/10">
                  <ArrowDownRight size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom metadata */}
          <div className="grid grid-cols-2 border-t border-white/[0.08] py-5 text-[9px] uppercase tracking-[0.25em] text-white/25 sm:grid-cols-4">
            <span>Strategy</span>
            <span>Design</span>
            <span>Technology</span>
            <span className="text-right">Growth</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="px-6 py-32 sm:px-10 lg:px-16 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[180px_1fr]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#999B94]">
              01
              <br />
              Philosophy
            </div>

            <div>
              <h2 className="max-w-[1200px] text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Good digital work
                <span className="text-[#969890]">
                  {" "}
                  doesn't just look beautiful.
                </span>
                <br />
                It makes things
                <span className="text-[#969890]"> better.</span>
              </h2>

              <div className="mt-20 grid gap-12 lg:grid-cols-2">
                <p className="max-w-lg text-[16px] leading-8 text-[#6E7069]">
                  We believe technology should solve problems, remove
                  friction and create opportunities — not simply add another
                  layer of complexity.
                </p>

                <p className="max-w-lg text-[16px] leading-8 text-[#6E7069]">
                  That's why we bring strategy, design, development and growth
                  together from the beginning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BIG NUMBER / IDENTITY
      ===================================================== */}

      <section className="bg-[#111313] px-6 py-32 text-white sm:px-10 lg:px-16 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B7F000]">
                02 / Who we are
              </p>

              <div className="mt-16 text-[clamp(9rem,20vw,20rem)] font-semibold leading-[0.65] tracking-[-0.1em] text-white/[0.035]">
                01
              </div>
            </div>

            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
                A small team
                <br />
                with a
                <span className="text-white/25"> big digital mindset.</span>
              </h2>

              <p className="mt-12 max-w-2xl text-lg leading-8 text-white/45">
                Soclthry brings together creative thinking, engineering and
                digital strategy to create practical solutions for modern
                businesses.
              </p>

              <div className="mt-20 grid border-t border-white/10 sm:grid-cols-2">
                <div className="border-b border-white/10 py-8 sm:border-r sm:pr-10">
                  <p className="text-4xl font-semibold tracking-tight">
                    Strategy
                  </p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/35">
                    Understanding the business before building the solution.
                  </p>
                </div>

                <div className="border-b border-white/10 py-8 sm:pl-10">
                  <p className="text-4xl font-semibold tracking-tight">
                    Design
                  </p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/35">
                    Creating experiences people actually enjoy using.
                  </p>
                </div>

                <div className="py-8 sm:border-r sm:pr-10">
                  <p className="text-4xl font-semibold tracking-tight">
                    Build
                  </p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/35">
                    Engineering reliable and scalable digital products.
                  </p>
                </div>

                <div className="py-8 sm:pl-10">
                  <p className="text-4xl font-semibold tracking-tight">
                    Grow
                  </p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/35">
                    Helping businesses turn digital presence into business
                    value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#F5F5F0] px-6 py-32 sm:px-10 lg:px-16 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          {/* Section header */}
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#999B94]">
                03 / Capabilities
              </p>

              <h2 className="mt-7 max-w-[900px] text-[clamp(4rem,8vw,8rem)] font-semibold leading-[0.78] tracking-[-0.08em]">
                What
                <br />
                <span className="text-[#999B94]">we do.</span>
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 text-[#70726B]">
                From digital products to growth, automation and brand
                experience — we bring the capabilities needed to move an idea
                forward.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-10 bg-[#B7F000]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#999B94]">
                  Explore our services
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic DB-driven services */}
          <Capabilities />
        </div>
      </section>

      {/* =====================================================
          MISSION STATEMENT
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#B7F000] px-6 py-32 sm:px-10 lg:px-16 lg:py-48">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-white/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
            04 / Mission
          </p>

          <h2 className="mt-12 max-w-[1250px] text-[clamp(3.5rem,8vw,9rem)] font-semibold leading-[0.8] tracking-[-0.085em]">
            Make technology
            <br />
            <span className="text-black/30">useful.</span>
            <br />
            Make design
            <br />
            <span className="text-black/30">meaningful.</span>
          </h2>

          <div className="mt-20 flex flex-col justify-between gap-10 border-t border-black/15 pt-7 lg:flex-row lg:items-end">
            <p className="max-w-xl text-lg leading-8 text-black/65">
              Our mission is to help businesses use digital technology with
              clarity — creating experiences that are useful, memorable and
              built to last.
            </p>

            <Link
              href="/contact"
              className="group flex w-fit items-center gap-4 text-sm font-bold"
            >
              Work with Soclthry

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#181A1B] text-white transition group-hover:translate-x-1">
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="bg-[#111313] px-6 py-32 text-white sm:px-10 lg:px-16 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-20 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B7F000]">
                05 / Principles
              </p>

              <h2 className="mt-7 text-[clamp(4rem,7vw,7rem)] font-semibold leading-[0.78] tracking-[-0.08em]">
                How
                <br />
                <span className="text-white/25">we work.</span>
              </h2>
            </div>

            <div>
              {[
                [
                  "01",
                  "Transparency",
                  "Clear communication. Clear expectations. No unnecessary complexity.",
                ],
                [
                  "02",
                  "Curiosity",
                  "We stay interested, keep learning and continuously question how things can be better.",
                ],
                [
                  "03",
                  "Craft",
                  "Details matter. From a line of code to the final interaction, we care about the work.",
                ],
                [
                  "04",
                  "Ownership",
                  "We take responsibility for the outcome, not just the deliverables.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="grid gap-6 border-b border-white/10 py-9 sm:grid-cols-[70px_1fr]"
                >
                  <span className="text-[10px] tracking-[0.25em] text-[#B7F000]">
                    {number}
                  </span>

                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                      {title}
                    </h3>

                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/40">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#F5F5F0] px-6 py-32 sm:px-10 lg:px-16 lg:py-48">
        <div className="mx-auto max-w-[1500px]">
          <div className="border-t border-[#D5D5CF] pt-12">
            <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#999B94]">
                  06 / Next
                </p>

                <h2 className="mt-8 text-[clamp(4rem,9vw,10rem)] font-semibold leading-[0.76] tracking-[-0.09em]">
                  Have
                  <br />
                  something
                  <br />
                  <span className="text-[#999B94]">in mind?</span>
                </h2>
              </div>

              <div className="max-w-sm">
                <p className="text-base leading-7 text-[#70726B]">
                  Let's talk about what you're building, where you're stuck,
                  or where you want to go next.
                </p>

                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-5 rounded-full bg-[#181A1B] px-7 py-4 text-sm font-bold text-white transition duration-300 hover:gap-7"
                >
                  Start a conversation

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B7F000] text-black">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   CAPABILITIES / SERVICES
============================================================ */

async function Capabilities() {
  const services = await prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  });

  const categories = [
    {
      number: "01",
      title: "Web & Digital",
      subtitle: "Products",
      description:
        "Digital products and platforms designed around real users and real business goals.",
      services: [
        "website-design-development",
        "software-mobile-app-development",
      ],
    },
    {
      number: "02",
      title: "E-Commerce",
      subtitle: "Development",
      description:
        "Scalable online experiences built to make discovery, shopping and conversion seamless.",
      services: ["e-commerce-development"],
    },
    {
      number: "03",
      title: "Marketing",
      subtitle: "& Growth",
      description:
        "Strategies that help businesses become more visible, relevant and connected to their audience.",
      services: [
        "seo-content-marketing",
        "digital-marketing-paid-advertising",
        "social-media-management",
        "influencer-creator-marketing",
      ],
    },
    {
      number: "04",
      title: "AI &",
      subtitle: "Automation",
      description:
        "Intelligent systems and automated workflows that reduce friction and improve efficiency.",
      services: [
        "ai-business-automation",
        "marketing-automation-crm",
      ],
    },
    {
      number: "05",
      title: "Brand &",
      subtitle: "Experience",
      description:
        "Distinctive visual identities and digital experiences that make businesses memorable.",
      services: [
        "branding-graphic-design",
        "photography-video-production",
        "it-support-cloud-solutions",
      ],
    },
  ];

  return (
    <div className="mt-24">
      {categories.map((category, categoryIndex) => {
        const categoryServices = category.services
          .map((slug) => services.find((service) => service.slug === slug))
          .filter((service): service is (typeof services)[number] => Boolean(service));

        if (categoryServices.length === 0) {
          return null;
        }

        return (
          <div
            key={category.number}
            className="group/category border-t border-[#D6D6D0]"
          >
            {/* Category header */}
            <div className="grid gap-8 py-12 lg:grid-cols-[100px_1fr_320px] lg:items-start">
              <div className="flex items-start">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#999B94]">
                  {category.number}
                </span>
              </div>

              <div>
                <h3 className="text-[clamp(2.8rem,5vw,5.5rem)] font-semibold leading-[0.82] tracking-[-0.07em]">
                  {category.title}
                  <br />
                  <span className="text-[#A0A19B]">
                    {category.subtitle}
                  </span>
                </h3>
              </div>

              <div className="lg:pt-2">
                <p className="max-w-sm text-sm leading-7 text-[#70726B]">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Individual services */}
            <div className="mb-3 border-t border-[#D6D6D0]">
              {categoryServices.map((service, serviceIndex) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group/service relative block overflow-hidden border-b border-[#D6D6D0]"
                >
                  {/* Service image on hover */}
                  {service.image && (
                    <div
                      className="pointer-events-none absolute inset-0 scale-[1.04] bg-cover bg-center opacity-0 transition-all duration-700 ease-out group-hover/service:scale-100 group-hover/service:opacity-100"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(17,19,19,0.97), rgba(17,19,19,0.78), rgba(17,19,19,0.45)), url("${service.image}")`,
                      }}
                    />
                  )}

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#B7F000]/20 opacity-0 blur-[70px] transition-opacity duration-700 group-hover/service:opacity-100" />

                  {/* Service content */}
                  <div className="relative z-10 grid gap-5 px-4 py-7 transition-all duration-500 group-hover/service:px-7 sm:px-6 sm:py-8 sm:group-hover/service:px-9 lg:grid-cols-[80px_1fr_auto] lg:items-center">
                    {/* Number */}
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#999B94] transition-colors duration-500 group-hover/service:text-[#B7F000]">
                      {category.number}.
                      {String(serviceIndex + 1).padStart(2, "0")}
                    </span>

                    {/* Service info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-4">
                        <h4 className="text-xl font-semibold tracking-[-0.04em] transition-colors duration-500 sm:text-2xl lg:text-[2rem] group-hover/service:text-white">
                          {service.name}
                        </h4>

                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B7F000] opacity-0 transition-all duration-500 group-hover/service:opacity-100" />
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777971] transition-colors duration-500 group-hover/service:text-white/55">
                        {service.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center gap-4">
                      <span className="hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40 transition-opacity duration-500 lg:block lg:opacity-0 lg:group-hover/service:opacity-100">
                        Explore
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D2D2CC] text-[#181A1B] transition-all duration-500 group-hover/service:-translate-y-1 group-hover/service:border-[#B7F000] group-hover/service:bg-[#B7F000] group-hover/service:text-black">
                        <MoveUpRight
                          size={17}
                          className="transition-transform duration-500 group-hover/service:rotate-12"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Category footer */}
            <div className="flex items-center justify-between pb-12 pt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A0A19B]">
                {categoryServices.length}{" "}
                {categoryServices.length === 1 ? "service" : "services"}
              </span>

              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A0A19B]">
                {categoryIndex === 0 && "Digital foundation"}
                {categoryIndex === 1 && "Commerce"}
                {categoryIndex === 2 && "Visibility"}
                {categoryIndex === 3 && "Intelligence"}
                {categoryIndex === 4 && "Identity"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}