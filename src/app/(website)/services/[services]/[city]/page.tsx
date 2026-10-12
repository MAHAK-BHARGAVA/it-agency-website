// Logic: first try to match a Service+City combo. If nothing found, try Service+State using that same URL segment.  then service+industry combo. If neither matches, 404.

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{
    services: string;
    city: string;
  }>;
};

type TargetData =
  | {
      type: "city";
      id: number;
      heroHeading: string | null;
      introText: string | null;
      service: {
        id: number;
        name: string;
        slug: string;
        description: string;
        image: string | null;
      };
      city: {
        name: string;
        slug: string;
        state: { name: string } | null;
      };
    }
  | {
      type: "state";
      id: number;
      heroHeading: string | null;
      introText: string | null;
      service: {
        id: number;
        name: string;
        slug: string;
        description: string;
        image: string | null;
      };
      state: {
        name: string;
        slug: string;
      };
    }
  | {
      type: "industry";
      id: number;
      heroHeading: string | null;
      introText: string | null;
      service: {
        id: number;
        name: string;
        slug: string;
        description: string;
        image: string | null;
      };
      industry: {
        name: string;
        slug: string;
      };
    };

/* =========================================================
   STATIC PARAMS
========================================================= */

export async function generateStaticParams() {
  const serviceCities = await prisma.serviceCity.findMany({
    include: { service: true, city: true },
  });

  const serviceStates = await prisma.serviceState.findMany({
    include: { service: true, state: true },
  });

  const serviceIndustries =
    await prisma.serviceIndustry.findMany({
      include: { service: true, industry: true },
    });

  return [
    ...serviceCities.map((sc) => ({
      services: sc.service.slug,
      city: sc.city.slug,
    })),
    ...serviceStates.map((ss) => ({
      services: ss.service.slug,
      city: ss.state.slug,
    })),
    ...serviceIndustries.map((si) => ({
      services: si.service.slug,
      city: si.industry.slug,
    })),
  ];
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { services, city } = await params;

  const serviceCity = await prisma.serviceCity.findFirst({
    where: {
      service: { slug: services },
      city: { slug: city },
    },
    include: { service: true, city: true },
  });

  if (serviceCity) {
    return buildMetadata({
      title:
        serviceCity.heroHeading ||
        `${serviceCity.service.name} in ${serviceCity.city.name}`,
      description:
        serviceCity.introText?.slice(0, 160) ||
        serviceCity.service.description.slice(0, 160),
      path: `/services/${serviceCity.service.slug}/${serviceCity.city.slug}`,
    });
  }

  const serviceState = await prisma.serviceState.findFirst({
    where: {
      service: { slug: services },
      state: { slug: city },
    },
    include: { service: true, state: true },
  });

  if (serviceState) {
    return buildMetadata({
      title:
        serviceState.heroHeading ||
        `${serviceState.service.name} in ${serviceState.state.name}`,
      description:
        serviceState.introText?.slice(0, 160) ||
        serviceState.service.description.slice(0, 160),
      path: `/services/${serviceState.service.slug}/${serviceState.state.slug}`,
    });
  }

  const serviceIndustry =
    await prisma.serviceIndustry.findFirst({
      where: {
        service: { slug: services },
        industry: { slug: city },
      },
      include: { service: true, industry: true },
    });

  if (serviceIndustry) {
    return buildMetadata({
      title:
        serviceIndustry.heroHeading ||
        `${serviceIndustry.service.name} for ${serviceIndustry.industry.name}`,
      description:
        serviceIndustry.introText?.slice(0, 160) ||
        serviceIndustry.service.description.slice(0, 160),
      path: `/services/${serviceIndustry.service.slug}/${serviceIndustry.industry.slug}`,
    });
  }

  return { title: "Page Not Found" };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ServiceLocationPage({
  params,
}: Props) {
  const { services, city } = await params;

  let target: TargetData | null = null;

  /* CITY */

  const serviceCity = await prisma.serviceCity.findFirst({
    where: {
      service: { slug: services },
      city: { slug: city },
    },
    include: {
      service: true,
      city: { include: { state: true } },
    },
  });

  if (serviceCity) {
    target = {
      type: "city",
      id: serviceCity.id,
      heroHeading: serviceCity.heroHeading,
      introText: serviceCity.introText,
      service: {
        id: serviceCity.service.id,
        name: serviceCity.service.name,
        slug: serviceCity.service.slug,
        description: serviceCity.service.description,
        image: serviceCity.service.image,
      },
      city: {
        name: serviceCity.city.name,
        slug: serviceCity.city.slug,
        state: serviceCity.city.state
          ? { name: serviceCity.city.state.name }
          : null,
      },
    };
  }

  /* STATE */

  if (!target) {
    const serviceState = await prisma.serviceState.findFirst({
      where: {
        service: { slug: services },
        state: { slug: city },
      },
      include: { service: true, state: true },
    });

    if (serviceState) {
      target = {
        type: "state",
        id: serviceState.id,
        heroHeading: serviceState.heroHeading,
        introText: serviceState.introText,
        service: {
          id: serviceState.service.id,
          name: serviceState.service.name,
          slug: serviceState.service.slug,
          description: serviceState.service.description,
          image: serviceState.service.image,
        },
        state: {
          name: serviceState.state.name,
          slug: serviceState.state.slug,
        },
      };
    }
  }

  /* INDUSTRY */

  if (!target) {
    const serviceIndustry =
      await prisma.serviceIndustry.findFirst({
        where: {
          service: { slug: services },
          industry: { slug: city },
        },
        include: { service: true, industry: true },
      });

    if (serviceIndustry) {
      target = {
        type: "industry",
        id: serviceIndustry.id,
        heroHeading: serviceIndustry.heroHeading,
        introText: serviceIndustry.introText,
        service: {
          id: serviceIndustry.service.id,
          name: serviceIndustry.service.name,
          slug: serviceIndustry.service.slug,
          description: serviceIndustry.service.description,
          image: serviceIndustry.service.image,
        },
        industry: {
          name: serviceIndustry.industry.name,
          slug: serviceIndustry.industry.slug,
        },
      };
    }
  }

  if (!target) notFound();

  /* TARGET LABEL */

  let targetName = "";
  let targetLabel = "";

  if (target.type === "city") {
    targetName = target.city.name;
    targetLabel = target.city.state
      ? `${target.city.name}, ${target.city.state.name}`
      : target.city.name;
  }

  if (target.type === "state") {
    targetName = target.state.name;
    targetLabel = target.state.name;
  }

  if (target.type === "industry") {
    targetName = target.industry.name;
    targetLabel = `${target.industry.name} industry`;
  }

  /* RELATED CONTENT */

  const [faqs, testimonials] = await Promise.all([
    prisma.faq.findMany({
      where: {
        services: { some: { id: target.service.id } },
      },
      take: 5,
    }),
    prisma.testimonial.findMany({
      where: {
        services: { some: { id: target.service.id } },
      },
      take: 3,
    }),
  ]);

  const pageHeading =
    target.heroHeading ||
    (target.type === "city"
      ? `${target.service.name} in ${target.city.name}`
      : target.type === "state"
        ? `${target.service.name} in ${target.state.name}`
        : `${target.service.name} for ${target.industry.name}`);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="overflow-hidden bg-[#0B0B0B] text-white">
      {/* JSON-LD */}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: "/services",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: target.service.name,
              item: `/services/${target.service.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: targetName,
              item: `/services/${target.service.slug}/${city}`,
            },
          ],
        }}
      />

      {faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }}
        />
      )}

      {/* HERO */}

      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:px-10 md:pt-32 lg:px-16 lg:pb-36 lg:pt-40">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[350px] w-[350px] rounded-full bg-[#B7F000]/[0.055] blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px] lg:h-[600px] lg:w-[600px]" />

        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-x-2 gap-y-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 sm:mb-14 sm:gap-x-3 sm:text-[11px] sm:tracking-[0.18em] lg:mb-16"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/services"
              className="transition-colors hover:text-white"
            >
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/services/${target.service.slug}`}
              className="max-w-full break-words transition-colors hover:text-white"
            >
              {target.service.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-full break-words text-white/65">
              {targetName}
            </span>
          </nav>

          <div className="grid items-center gap-12 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Hero copy */}

            <div className="relative z-10 min-w-0">
              <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                <span className="h-px w-8 shrink-0 bg-[#B7F000] sm:w-12" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 sm:text-xs sm:tracking-[0.24em]">
                  {target.type === "city"
                    ? "Local service"
                    : target.type === "state"
                      ? "Regional service"
                      : "Industry solution"}
                </span>
              </div>

              <h1 className="max-w-5xl break-words text-[clamp(2.35rem,9vw,4.5rem)] font-bold leading-[0.96] tracking-[-0.055em] sm:text-[clamp(3.2rem,7vw,5.5rem)] sm:leading-[0.9] lg:text-[clamp(3.8rem,6.8vw,6.8rem)]">
                {pageHeading}
                <span className="text-[#B7F000]">.</span>
              </h1>

              <div className="mt-6 inline-flex max-w-full items-start gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold leading-5 text-white/60 sm:mt-8 sm:px-4 sm:py-2.5 sm:text-sm">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#B7F000]"
                />
                <span className="break-words">{targetLabel}</span>
              </div>

              <p className="mt-6 max-w-2xl break-words text-base leading-7 text-white/55 sm:mt-8 sm:text-xl sm:leading-8">
                {target.introText ||
                  `Looking for ${target.service.name.toLowerCase()} solutions for your business? We create scalable digital experiences designed around your goals.`}
              </p>

              {/* CTAs */}

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-[#B7F000] px-4 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(183,240,0,0.16)] sm:w-auto sm:justify-start sm:gap-4 sm:px-6 sm:py-3.5"
                >
                  <span>Start a project</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-[#B7F000] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                <Link
                  href={`/services/${target.service.slug}`}
                  className="group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black sm:w-auto sm:justify-start sm:gap-3 sm:px-6 sm:py-4"
                >
                  <span>View service</span>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>

              {/* Mini stats */}

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:mt-16 sm:gap-4 sm:pt-7">
                {[
                  ["01", "Local expertise"],
                  ["02", "Scalable delivery"],
                  ["03", "Modern technology"],
                ].map(([number, label]) => (
                  <div key={number} className="min-w-0">
                    <p className="text-xs font-bold text-[#B7F000]">
                      {number}
                    </p>
                    <p className="mt-2 break-words text-[11px] font-medium leading-4 text-white/40 sm:max-w-[125px] sm:text-sm sm:leading-5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}

            <div className="relative min-w-0 lg:pl-6">
              {target.service.image ? (
                <div className="relative mx-auto w-[calc(100%-8px)] sm:w-[calc(100%-12px)]">
                  <div className="absolute -bottom-2 -left-2 h-full w-full rounded-[22px] bg-[#B7F000] sm:-bottom-3 sm:-left-3 sm:rounded-[28px] lg:-bottom-4 lg:-left-4 lg:rounded-[32px]" />

                  <div className="relative aspect-[4/3.5] overflow-hidden rounded-[22px] bg-[#171717] sm:aspect-[4/4.2] sm:rounded-[28px] lg:aspect-[4/4.6] lg:rounded-[32px]">
                    <Image
                      src={target.service.image}
                      alt={`${target.service.name} in ${targetLabel}`}
                      fill
                      priority
                      sizes="(max-width: 639px) 90vw, (max-width: 1023px) 85vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55 sm:text-[10px] sm:tracking-[0.25em]">
                          {target.type === "industry"
                            ? "Industry focused"
                            : "Locally available"}
                        </p>
                        <p className="mt-1 break-words text-base font-bold text-white sm:text-xl">
                          {target.service.name}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B7F000] text-black sm:h-12 sm:w-12">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3.5] overflow-hidden rounded-[22px] bg-[#151515] sm:aspect-[4/4.2] sm:rounded-[28px] lg:aspect-[4/4.6] lg:rounded-[32px]">
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#B7F000] sm:h-64 sm:w-64" />
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 sm:text-xs sm:tracking-[0.25em]">
                      Digital solutions
                    </p>
                    <p className="mt-3 break-words text-2xl font-bold text-white sm:text-4xl">
                      {target.service.name}
                    </p>
                    <p className="mt-2 break-words text-sm text-white/40">
                      {targetLabel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}

      <section className="bg-[#111111] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7F000] sm:text-xs sm:tracking-[0.25em]">
                Why {targetName}
              </p>
              <h2 className="mt-5 max-w-xl break-words text-3xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Digital solutions built around your needs.
              </h2>
            </div>

            <div className="min-w-0">
              <p className="max-w-3xl break-words text-lg leading-8 text-white/55 sm:text-2xl sm:leading-9">
                Our{" "}
                <span className="text-white">
                  {target.service.name.toLowerCase()}
                </span>{" "}
                solutions combine modern technology with a clear
                understanding of your business, users and market.
              </p>

              <div className="mt-8 grid overflow-hidden rounded-[22px] border border-white/10 sm:mt-12 sm:grid-cols-2 sm:rounded-[28px]">
                {[
                  "Business-focused solutions",
                  "Scalable technology",
                  "Modern development",
                  "Performance-focused delivery",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="group border-b border-white/10 p-5 transition-colors duration-300 hover:bg-white/[0.04] sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-[#B7F000]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-white/25 transition-colors group-hover:text-[#B7F000]"
                      />
                    </div>

                    <h3 className="mt-7 break-words text-base font-bold text-white sm:mt-10 sm:text-lg">
                      {item}
                    </h3>

                    <div className="mt-6 h-px w-0 bg-[#B7F000] transition-all duration-500 group-hover:w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE SNAPSHOT */}

      <section className="bg-[#F5F5F0] px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#719900] sm:text-xs sm:tracking-[0.25em]">
              Service snapshot
            </p>
            <h2 className="mt-5 break-words text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
              A focused solution for {targetName}.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Service */}

            <div className="group flex min-h-[220px] min-w-0 flex-col rounded-[24px] border border-black/[0.06] bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] sm:min-h-[250px] sm:rounded-[30px] sm:p-8 lg:hover:-translate-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                  Service
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F0EB] transition-colors group-hover:bg-[#B7F000]">
                  <ArrowUpRight size={17} />
                </span>
              </div>
              <h3 className="mt-8 break-words text-xl font-bold sm:mt-12 sm:text-2xl">
                {target.service.name}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                Technology solutions designed around your business
                requirements.
              </p>
            </div>

            {/* Target */}

            <div className="group flex min-h-[220px] min-w-0 flex-col rounded-[24px] border border-black/[0.06] bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] sm:min-h-[250px] sm:rounded-[30px] sm:p-8 lg:hover:-translate-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/35 sm:text-xs sm:tracking-[0.2em]">
                  Target
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F0EB] transition-colors group-hover:bg-[#B7F000]">
                  <MapPin size={17} />
                </span>
              </div>
              <h3 className="mt-8 break-words text-xl font-bold sm:mt-12 sm:text-2xl">
                {targetName}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
                {target.type === "industry"
                  ? "Solutions tailored specifically to your industry."
                  : "Services available for businesses in this region."}
              </p>
            </div>

            {/* CTA */}

            <div className="group relative flex min-h-[220px] min-w-0 flex-col overflow-hidden rounded-[24px] bg-[#B7F000] p-6 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[250px] sm:rounded-[30px] sm:p-8 lg:hover:-translate-y-2">
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full border border-black/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/55 sm:text-xs sm:tracking-[0.2em]">
                Next step
              </span>
              <h3 className="mt-8 text-2xl font-bold tracking-tight sm:mt-12 sm:text-3xl">
                Let&apos;s talk.
              </h3>
              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold"
              >
                Start your project
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}

      {testimonials.length > 0 && (
        <section className="bg-white px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#719900] sm:text-xs sm:tracking-[0.25em]">
                  Client stories
                </p>
                <h2 className="mt-5 break-words text-3xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                  What our clients say.
                </h2>
              </div>
              <p className="text-sm text-black/40">
                Real words from our clients
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="group flex min-h-[280px] min-w-0 flex-col justify-between rounded-[24px] bg-[#F5F5F0] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)] sm:min-h-[340px] sm:rounded-[30px] sm:p-8 lg:hover:-translate-y-2"
                >
                  <div>
                    <div
                      aria-label={`${Math.min(testimonial.rating ?? 5, 5)} out of 5 stars`}
                      className="flex gap-1 text-[#A1D500]"
                    >
                      {"★★★★★".slice(
                        0,
                        Math.min(testimonial.rating ?? 5, 5)
                      )}
                    </div>

                    <p className="mt-6 break-words text-base leading-7 text-black/65 sm:mt-8 sm:text-lg sm:leading-8">
                      “{testimonial.quote}”
                    </p>
                  </div>

                  <div className="mt-8 border-t border-black/10 pt-5 sm:mt-10 sm:pt-6">
                    <p className="break-words font-bold">
                      {testimonial.clientName}
                    </p>
                    {testimonial.company && (
                      <p className="mt-1 break-words text-sm text-black/40">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}

      {faqs.length > 0 && (
        <section className="bg-[#F5F5F0] px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#719900] sm:text-xs sm:tracking-[0.25em]">
                FAQ
              </p>
              <h2 className="mt-5 break-words text-3xl font-bold tracking-[-0.04em] sm:text-6xl">
                Questions, answered.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/50 sm:mt-6 sm:text-base">
                Everything you need to know about our{" "}
                {target.service.name.toLowerCase()} services.
              </p>
            </div>

            <div className="mt-9 divide-y divide-black/10 border-y border-black/10 sm:mt-14">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="group py-6 sm:py-9">
                  <div className="flex items-start gap-3 sm:gap-6">
                    <span className="shrink-0 pt-1 text-[10px] font-bold text-black/30 sm:text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-base font-bold tracking-tight sm:text-xl">
                        {faq.question}
                      </h3>
                      <p className="mt-3 break-words text-sm leading-6 text-black/55 sm:mt-4 sm:text-base sm:leading-7">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:bg-[#B7F000] sm:flex">
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}

      <section className="bg-[#0B0B0B] px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[24px] bg-[#151515] sm:rounded-[34px]">
            {/* Decorative panel: removed from mobile to avoid covering content */}
            <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[22%] bg-[#B7F000] lg:block" />

            <div className="relative z-10 grid min-h-[360px] lg:min-h-[430px] lg:grid-cols-[1.35fr_0.65fr]">
              <div className="px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#B7F000] sm:gap-3 sm:text-xs sm:tracking-[0.25em]">
                  <span className="h-px w-6 shrink-0 bg-[#B7F000] sm:w-8" />
                  Ready to get started?
                </p>

                <h2 className="mt-6 max-w-3xl break-words text-3xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:mt-7 sm:text-6xl lg:text-7xl">
                  Let&apos;s build something
                  <br className="hidden sm:block" />
                  <span className="text-[#B7F000]">
                    {" "}remarkable.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl break-words text-sm leading-6 text-white/45 sm:mt-7 sm:text-lg sm:leading-7">
                  Tell us what you&apos;re working on and let&apos;s
                  turn your idea into a scalable digital product.
                </p>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex min-h-12 max-w-full items-center justify-between gap-3 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#181A1B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B7F000] sm:mt-9 sm:justify-start sm:gap-3 sm:px-6 sm:py-3.5"
                >
                  <span>Start a conversation</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#181A1B] text-[#B7F000] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </div>

              <div className="relative hidden min-h-[430px] lg:block">
                <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/15">
                  <ArrowUpRight
                    size={52}
                    strokeWidth={1.4}
                    className="text-[#181A1B]"
                  />
                </div>

                <div className="absolute bottom-12 right-10 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                    Digital
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                    Experiences
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                    That Matter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}