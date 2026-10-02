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
        state: {
          name: string;
        } | null;
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

/* ========================================================= */
/* STATIC PARAMS */
/* ========================================================= */

export async function generateStaticParams() {
  const serviceCities = await prisma.serviceCity.findMany({
    include: {
      service: true,
      city: true,
    },
  });

  const serviceStates = await prisma.serviceState.findMany({
    include: {
      service: true,
      state: true,
    },
  });

  const serviceIndustries = await prisma.serviceIndustry.findMany({
    include: {
      service: true,
      industry: true,
    },
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

/* ========================================================= */
/* METADATA */
/* ========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { services, city } = await params;

  const serviceCity = await prisma.serviceCity.findFirst({
    where: {
      service: {
        slug: services,
      },
      city: {
        slug: city,
      },
    },
    include: {
      service: true,
      city: true,
    },
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
      service: {
        slug: services,
      },
      state: {
        slug: city,
      },
    },
    include: {
      service: true,
      state: true,
    },
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
        service: {
          slug: services,
        },
        industry: {
          slug: city,
        },
      },
      include: {
        service: true,
        industry: true,
      },
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

  return {
    title: "Page Not Found",
  };
}

/* ========================================================= */
/* PAGE */
/* ========================================================= */

export default async function ServiceLocationPage({
  params,
}: Props) {
  const { services, city } = await params;

  let target: TargetData | null = null;

  /* --------------------------------------------------------- */
  /* CITY */
  /* --------------------------------------------------------- */

  const serviceCity = await prisma.serviceCity.findFirst({
    where: {
      service: {
        slug: services,
      },
      city: {
        slug: city,
      },
    },
    include: {
      service: true,
      city: {
        include: {
          state: true,
        },
      },
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
          ? {
              name: serviceCity.city.state.name,
            }
          : null,
      },
    };
  }

  /* --------------------------------------------------------- */
  /* STATE */
  /* --------------------------------------------------------- */

  if (!target) {
    const serviceState = await prisma.serviceState.findFirst({
      where: {
        service: {
          slug: services,
        },
        state: {
          slug: city,
        },
      },
      include: {
        service: true,
        state: true,
      },
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

  /* --------------------------------------------------------- */
  /* INDUSTRY */
  /* --------------------------------------------------------- */

  if (!target) {
    const serviceIndustry =
      await prisma.serviceIndustry.findFirst({
        where: {
          service: {
            slug: services,
          },
          industry: {
            slug: city,
          },
        },
        include: {
          service: true,
          industry: true,
        },
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

  if (!target) {
    notFound();
  }

  /* ========================================================= */
  /* TARGET LABEL */
  /* ========================================================= */

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

  /* ========================================================= */
  /* RELATED CONTENT */
  /* ========================================================= */

  const [faqs, testimonials] = await Promise.all([
    prisma.faq.findMany({
      where: {
        services: {
          some: {
            id: target.service.id,
          },
        },
      },
      take: 5,
    }),

    prisma.testimonial.findMany({
      where: {
        services: {
          some: {
            id: target.service.id,
          },
        },
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

  /* ========================================================= */
  /* UI */
  /* ========================================================= */

  return (
    <main className="overflow-hidden bg-[#0B0B0B] text-white">
      {/* ===================================================== */}
      {/* JSON-LD */}
      {/* ===================================================== */}

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

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden px-6 pb-24 pt-24 sm:px-10 sm:pb-28 sm:pt-32 lg:px-16 lg:pb-36 lg:pt-40">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#B7F000]/[0.055] blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-16 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/services"
              className="transition-colors hover:text-white"
            >
              Services
            </Link>

            <span>/</span>

            <Link
              href={`/services/${target.service.slug}`}
              className="transition-colors hover:text-white"
            >
              {target.service.name}
            </Link>

            <span>/</span>

            <span className="text-white/60">
              {targetName}
            </span>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Hero copy */}
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-12 bg-[#B7F000]" />

                <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/40">
                  {target.type === "city"
                    ? "Local service"
                    : target.type === "state"
                      ? "Regional service"
                      : "Industry solution"}
                </span>
              </div>

              <h1 className="max-w-5xl text-[clamp(3.1rem,6.8vw,6.8rem)] font-bold leading-[0.88] tracking-[-0.065em]">
                {pageHeading}
                <span className="text-[#B7F000]">.</span>
              </h1>

              {/* Location */}
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/55">
                <MapPin
                  size={16}
                  className="text-[#B7F000]"
                />

                {targetLabel}
              </div>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/50 sm:text-xl">
                {target.introText ||
                  `Looking for ${target.service.name.toLowerCase()} solutions for your business? We create scalable digital experiences designed around your goals.`}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-4 rounded-full bg-[#B7F000] px-6 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(183,240,0,0.16)]"
                >
                  Start a project

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[#B7F000] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                <Link
                  href={`/services/${target.service.slug}`}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black"
                >
                  View service

                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>

              {/* Mini stats */}
              <div className="mt-16 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7">
                {[
                  ["01", "Local expertise"],
                  ["02", "Scalable delivery"],
                  ["03", "Modern technology"],
                ].map(([number, label]) => (
                  <div key={number}>
                    <p className="text-xs font-bold text-[#B7F000]">
                      {number}
                    </p>

                    <p className="mt-2 max-w-[125px] text-sm font-medium leading-5 text-white/35">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative lg:pl-6">
              {target.service.image ? (
                <div className="relative">
                  <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[32px] bg-[#B7F000]" />

                  <div className="relative aspect-[4/4.6] overflow-hidden rounded-[32px] bg-[#171717]">
                    <Image
                      src={target.service.image}
                      alt={`${target.service.name} in ${targetLabel}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                          {target.type === "industry"
                            ? "Industry focused"
                            : "Locally available"}
                        </p>

                        <p className="mt-1 text-xl font-bold text-white">
                          {target.service.name}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B7F000] text-black">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/4.6] overflow-hidden rounded-[32px] bg-[#151515]">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B7F000]" />

                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">
                      Digital solutions
                    </p>

                    <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                      {target.service.name}
                    </p>

                    <p className="mt-2 text-sm text-white/35">
                      {targetLabel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* WHY SECTION */}
      {/* ===================================================== */}

      <section className="bg-[#111111] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B7F000]">
                Why {targetName}
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Digital solutions built around your needs.
              </h2>
            </div>

            <div>
              <p className="max-w-3xl text-xl leading-9 text-white/50 sm:text-2xl">
                Our{" "}
                <span className="text-white">
                  {target.service.name.toLowerCase()}
                </span>{" "}
                solutions combine modern technology with a clear
                understanding of your business, users and market.
              </p>

              <div className="mt-12 grid overflow-hidden rounded-[28px] border border-white/10 sm:grid-cols-2">
                {[
                  "Business-focused solutions",
                  "Scalable technology",
                  "Modern development",
                  "Performance-focused delivery",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="group border-b border-white/10 p-7 transition-colors duration-300 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-[#B7F000]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <CheckCircle2
                        size={18}
                        className="text-white/20 transition-colors group-hover:text-[#B7F000]"
                      />
                    </div>

                    <h3 className="mt-10 text-lg font-bold text-white">
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

      {/* ===================================================== */}
      {/* SERVICE SNAPSHOT */}
      {/* ===================================================== */}

      <section className="bg-[#F5F5F0] px-6 py-24 text-[#181A1B] sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
              Service snapshot
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              A focused solution for {targetName}.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Service */}
            <div className="group min-h-[250px] rounded-[30px] border border-black/[0.06] bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/30">
                  Service
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0EB] transition-colors group-hover:bg-[#B7F000]">
                  <ArrowUpRight size={17} />
                </span>
              </div>

              <h3 className="mt-12 text-2xl font-bold">
                {target.service.name}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
                Technology solutions designed around your business
                requirements.
              </p>
            </div>

            {/* Target */}
            <div className="group min-h-[250px] rounded-[30px] border border-black/[0.06] bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/30">
                  Target
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0EB] transition-colors group-hover:bg-[#B7F000]">
                  <MapPin size={17} />
                </span>
              </div>

              <h3 className="mt-12 text-2xl font-bold">
                {targetName}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
                {target.type === "industry"
                  ? "Solutions tailored specifically to your industry."
                  : "Services available for businesses in this region."}
              </p>
            </div>

            {/* CTA */}
            <div className="group relative min-h-[250px] overflow-hidden rounded-[30px] bg-[#B7F000] p-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full border border-black/10" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">
                Next step
              </span>

              <h3 className="mt-12 text-3xl font-bold tracking-tight">
                Let&apos;s talk.
              </h3>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold"
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

      {/* ===================================================== */}
      {/* TESTIMONIALS */}
      {/* ===================================================== */}

      {testimonials.length > 0 && (
        <section className="bg-white px-6 py-24 text-[#181A1B] sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
                  Client stories
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1] tracking-[-0.045em] sm:text-6xl">
                  What our clients say.
                </h2>
              </div>

              <p className="text-sm text-black/35">
                Real words from our clients
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="group flex min-h-[340px] flex-col justify-between rounded-[30px] bg-[#F5F5F0] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)]"
                >
                  <div>
                    <div className="flex gap-1 text-[#A1D500]">
                      {"★★★★★".slice(
                        0,
                        Math.min(testimonial.rating ?? 5, 5)
                      )}
                    </div>

                    <p className="mt-8 text-lg leading-8 text-black/65">
                      “{testimonial.quote}”
                    </p>
                  </div>

                  <div className="mt-10 border-t border-black/10 pt-6">
                    <p className="font-bold">
                      {testimonial.clientName}
                    </p>

                    {testimonial.company && (
                      <p className="mt-1 text-sm text-black/35">
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

      {/* ===================================================== */}
      {/* FAQ */}
      {/* ===================================================== */}

      {faqs.length > 0 && (
        <section className="bg-[#F5F5F0] px-6 py-24 text-[#181A1B] sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
                FAQ
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">
                Questions, answered.
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-black/45">
                Everything you need to know about our{" "}
                {target.service.name.toLowerCase()} services.
              </p>
            </div>

            <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="group py-7 sm:py-9"
                >
                  <div className="flex gap-6">
                    <span className="pt-1 text-xs font-bold text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                        {faq.question}
                      </h3>

                      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50 sm:text-base">
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

      {/* ===================================================== */}
      {/* FINAL CTA */}
      {/* ===================================================== */}

      <section className="bg-[#0B0B0B] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] bg-[#151515]">
            <div className="absolute right-0 top-0 h-full w-[22%] bg-[#B7F000]" />

            <div className="relative z-10 grid min-h-[430px] lg:grid-cols-[1.35fr_0.65fr]">
              <div className="px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
                <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#B7F000]">
                  <span className="h-px w-8 bg-[#B7F000]" />
                  Ready to get started?
                </p>

                <h2 className="mt-7 max-w-3xl text-4xl font-bold leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Let&apos;s build something
                  <br />
                  <span className="text-[#B7F000]">
                    remarkable.
                  </span>
                </h2>

                <p className="mt-7 max-w-xl text-base leading-7 text-white/40 sm:text-lg">
                  Tell us what you&apos;re working on and let&apos;s
                  turn your idea into a scalable digital product.
                </p>

                <Link
                  href="/contact"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#181A1B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B7F000]"
                >
                  Start a conversation

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181A1B] text-[#B7F000] transition-transform duration-300 group-hover:rotate-45">
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