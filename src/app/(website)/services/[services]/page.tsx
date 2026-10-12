// Standalone Service page — /services/seo (just the service alone, no city/state). This is actually a core page type from the PRD (Section 11)

// generateMetadata → handles "optimizing page titles, headings, meta descriptions" for every dynamic page automatically
// generateStaticParams → handles "making your website load quickly" by pre-building pages instead of generating them on-demand every time

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ services: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { services } = await params;

  const service = await prisma.service.findUnique({
    where: { slug: services },
  });

  if (!service) {
    return { title: "Service Not Found" };
  }

  return buildMetadata({
    title: service.metaTitle || `${service.name} Services | Soclthry`,
    description:
      service.metaDescription || service.description.slice(0, 160),
    path: `/services/${service.slug}`,
    image: service.ogImage || undefined,
  });
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    select: { slug: true },
  });

  return services.map((service) => ({
    services: service.slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { services } = await params;

  const service = await prisma.service.findUnique({
    where: { slug: services },
    include: {
      serviceCities: {
        include: { city: true },
        take: 6,
      },
      serviceStates: {
        include: { state: true },
        take: 6,
      },
      serviceIndustries: {
        include: { industry: true },
        take: 6,
      },
      testimonials: true,
      faqs: true,
    },
  });

  if (!service) notFound();

  let displayTestimonials = service.testimonials;

  if (displayTestimonials.length === 0) {
    displayTestimonials = await prisma.testimonial.findMany({
      where: {
        services: { none: {} },
        cities: { none: {} },
        industries: { none: {} },
      },
      take: 3,
    });
  }

  return (
    <main className="w-full overflow-x-clip bg-[#0B0B0B] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:px-10 md:pt-32 lg:px-16 lg:pb-36 lg:pt-40">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#B7F000]/[0.06] blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40 sm:mb-16 sm:gap-3 sm:text-[11px] sm:tracking-[0.2em]">
            <Link href="/" className="transition-colors hover:text-white">
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
            <span className="max-w-[160px] break-words text-white/70 sm:max-w-none">
              {service.name}
            </span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="relative z-10 min-w-0">
              <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                <span className="h-px w-8 bg-[#B7F000] sm:w-12" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40 sm:text-xs sm:tracking-[0.28em]">
                  Our expertise
                </span>
              </div>

              <h1 className="max-w-5xl break-words text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-[-0.065em] sm:leading-[0.88]">
                {service.name}
                <span className="text-[#B7F000]">.</span>
              </h1>

              <p className="mt-6 max-w-2xl break-words text-base leading-7 text-white/50 sm:mt-9 sm:text-xl sm:leading-8">
                {service.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-10 sm:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-14 items-center justify-between gap-3 rounded-full bg-[#B7F000] px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(183,240,0,0.18)] sm:justify-start sm:px-6"
                >
                  Start a project
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-[#B7F000] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>

                <Link
                  href="/portfolio"
                  className="group inline-flex min-h-14 items-center justify-between gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black sm:justify-start sm:px-6"
                >
                  Explore our work
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-16 sm:gap-4 sm:pt-7">
                {[
                  ["01", "Business focused"],
                  ["02", "Scalable solutions"],
                  ["03", "Modern technology"],
                ].map(([number, label]) => (
                  <div key={number} className="min-w-0">
                    <p className="text-xs font-bold text-[#B7F000]">
                      {number}
                    </p>
                    <p className="mt-2 max-w-[120px] break-words text-xs font-medium leading-5 text-white/40 sm:text-sm">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-w-0 lg:pl-6">
              {service.image ? (
                <div className="relative">
                  <div className="absolute -bottom-2 -left-2 h-full w-full rounded-[24px] bg-[#B7F000] sm:-bottom-4 sm:-left-4 sm:rounded-[32px]" />

                  <div className="relative aspect-[4/3.5] overflow-hidden rounded-[24px] bg-[#171717] sm:aspect-[4/4.6] sm:rounded-[32px]">
                    <Image
                      src={service.image}
                      alt={`${service.name} services`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 sm:text-[10px] sm:tracking-[0.25em]">
                          Digital solutions
                        </p>
                        <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                          Built to scale.
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B7F000] text-black sm:h-12 sm:w-12">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3.5] overflow-hidden rounded-[24px] bg-[#151515] sm:aspect-[4/4.6] sm:rounded-[32px]">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B7F000]" />
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">
                      Digital solutions
                    </p>
                    <p className="mt-3 break-words text-3xl font-bold text-white sm:text-4xl">
                      {service.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-[#111111] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B7F000]">
                Why it matters
              </p>
              <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[0.98] tracking-[-0.045em] sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
                Technology should solve real business problems.
              </h2>
            </div>

            <div>
              <p className="max-w-3xl text-lg leading-8 text-white/50 sm:text-2xl sm:leading-9">
                We approach{" "}
                <span className="text-white">
                  {service.name.toLowerCase()}
                </span>{" "}
                with a focus on business outcomes, user experience,
                performance and long-term scalability.
              </p>

              <div className="mt-8 grid overflow-hidden rounded-[22px] border border-white/10 sm:mt-12 sm:grid-cols-2 sm:rounded-[28px]">
                {[
                  ["01", "Business-first approach"],
                  ["02", "Scalable architecture"],
                  ["03", "Modern technology"],
                  ["04", "Performance focused"],
                ].map(([number, title]) => (
                  <div
                    key={number}
                    className="group border-b border-white/10 p-5 transition-colors duration-300 hover:bg-white/[0.04] sm:p-7"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-[#B7F000]">
                        {number}
                      </span>
                      <Check
                        size={17}
                        className="text-white/20 transition-colors group-hover:text-[#B7F000]"
                      />
                    </div>
                    <h3 className="mt-7 text-base font-bold sm:mt-10 sm:text-lg">
                      {title}
                    </h3>
                    <div className="mt-6 h-px w-0 bg-[#B7F000] transition-all duration-500 group-hover:w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITIES */}
      {service.serviceCities.length > 0 && (
        <section className="bg-[#F5F5F0] px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end sm:gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
                  01 / Locations
                </p>
                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-5xl md:text-6xl">
                  Find us near you.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-black/45 sm:text-base">
                Explore our {service.name.toLowerCase()} services across the
                locations we serve.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {service.serviceCities.map((sc, index) => (
                <Link
                  key={sc.id}
                  href={`/services/${service.slug}/${sc.city.slug}`}
                  className="group relative min-h-[210px] overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:bg-[#181A1B] hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] sm:min-h-[220px] sm:rounded-[28px] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-black/25 transition-colors group-hover:text-[#B7F000]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F1EC] text-black transition-all duration-300 group-hover:bg-[#B7F000] sm:h-11 sm:w-11">
                      <ArrowUpRight
                        size={19}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                    <p className="break-words text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 transition-colors group-hover:text-white/35 sm:text-xs sm:tracking-[0.18em]">
                      {service.name}
                    </p>
                    <h3 className="mt-2 break-words text-xl font-bold tracking-tight transition-colors group-hover:text-white sm:text-2xl">
                      {sc.city.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATES */}
      {service.serviceStates.length > 0 && (
        <section className="bg-white px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
              02 / Service areas
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end sm:gap-8">
              <h2 className="max-w-3xl text-3xl font-bold leading-[1] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                Serving businesses across states.
              </h2>
              <p className="max-w-md text-sm leading-7 text-black/45 sm:text-base">
                Local expertise with the technology capabilities to support
                businesses at scale.
              </p>
            </div>

            <div className="mt-9 divide-y divide-black/10 border-y border-black/10 sm:mt-14">
              {service.serviceStates.map((ss, index) => (
                <Link
                  key={ss.id}
                  href={`/services/${service.slug}/${ss.state.slug}`}
                  className="group flex items-center justify-between gap-4 py-5 transition-all duration-300 hover:px-2 sm:py-7 sm:hover:px-4"
                >
                  <div className="flex min-w-0 items-center gap-5 sm:gap-10">
                    <span className="shrink-0 text-xs font-bold text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="break-words text-base font-bold tracking-tight sm:text-xl md:text-2xl">
                      {ss.state.name}
                    </span>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover:border-black group-hover:bg-[#181A1B] group-hover:text-white sm:h-11 sm:w-11">
                    <ArrowUpRight
                      size={19}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INDUSTRIES */}
      {service.serviceIndustries.length > 0 && (
        <section className="bg-[#F5F5F0] px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
              03 / Industries
            </p>

            <h2 className="mt-5 max-w-4xl text-3xl font-bold leading-[1] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Technology designed around your industry.
            </h2>

            <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {service.serviceIndustries.map((si, index) => (
                <Link
                  key={si.id}
                  href={`/services/${service.slug}/${si.industry.slug}`}
                  className="group relative min-h-[250px] overflow-hidden rounded-[22px] border border-black/[0.07] bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#B7F000] hover:shadow-[0_25px_70px_rgba(0,0,0,0.10)] sm:min-h-[260px] sm:rounded-[28px] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F1EC] transition-all duration-300 group-hover:bg-[#B7F000] sm:h-11 sm:w-11">
                      <ArrowUpRight
                        size={19}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/30">
                      Industry
                    </p>
                    <h3 className="mt-3 break-words text-xl font-bold tracking-tight sm:text-2xl">
                      {si.industry.name}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
                      {service.name} solutions tailored to your industry.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {displayTestimonials.length > 0 && (
        <section className="bg-[#0B0B0B] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end sm:gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B7F000]">
                  Client stories
                </p>
                <h2 className="mt-5 text-3xl font-bold leading-[1] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                  Trusted by businesses.
                </h2>
              </div>
              <p className="text-sm text-white/30">
                Real words from our clients
              </p>
            </div>

            <div className="mt-9 grid gap-5 sm:mt-14 lg:grid-cols-3">
              {displayTestimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="group flex min-h-[300px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.035] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/15 hover:bg-white/[0.06] sm:min-h-[340px] sm:rounded-[30px] sm:p-8"
                >
                  <div>
                    <div className="flex gap-1 text-[#B7F000]">
                      {"★★★★★".slice(
                        0,
                        Math.min(testimonial.rating ?? 5, 5)
                      )}
                    </div>
                    <p className="mt-6 break-words text-base leading-7 text-white/65 sm:mt-8 sm:text-lg sm:leading-8">
                      “{testimonial.quote}”
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6 sm:mt-10">
                    <p className="break-words font-bold">
                      {testimonial.clientName}
                    </p>
                    {testimonial.company && (
                      <p className="mt-1 break-words text-sm text-white/35">
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
      {service.faqs.length > 0 && (
        <section className="bg-white px-4 py-16 text-[#181A1B] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#719900]">
                FAQ
              </p>
              <h2 className="mt-5 text-3xl font-bold leading-[1] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                Questions, answered.
              </h2>
              <p className="mt-5 text-sm leading-7 text-black/45 sm:mt-6 sm:text-base">
                Everything you need to know about our{" "}
                {service.name.toLowerCase()} services.
              </p>
            </div>

            <div className="mt-9 divide-y divide-black/10 border-y border-black/10 sm:mt-14">
              {service.faqs.map((faq, index) => (
                <div key={faq.id} className="group py-6 sm:py-9">
                  <div className="flex gap-3 sm:gap-6">
                    <span className="pt-1 text-xs font-bold text-black/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-base font-bold tracking-tight sm:text-lg md:text-xl">
                        {faq.question}
                      </h3>
                      <p className="mt-3 break-words text-sm leading-6 text-black/50 sm:mt-4 sm:text-base sm:leading-7">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F1EC] transition-all duration-300 group-hover:bg-[#B7F000] sm:flex">
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
            <div className="absolute right-0 top-0 h-full w-[12%] bg-[#B7F000] sm:w-[18%] lg:w-[22%]" />

            <div className="absolute right-[5%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-black/15 lg:block" />

            <div className="relative z-10 grid min-h-[350px] lg:min-h-[430px] lg:grid-cols-[1.35fr_0.65fr]">
              <div className="px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7F000] sm:text-xs sm:tracking-[0.25em]">
                  <span className="h-px w-6 bg-[#B7F000] sm:w-8" />
                  Have a project in mind?
                </p>

                <h2 className="mt-6 max-w-3xl break-words text-3xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:mt-7 sm:text-5xl md:text-6xl lg:text-7xl">
                  Let&apos;s build something{" "}
                  <span className="text-[#B7F000]">remarkable.</span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-6 text-white/40 sm:mt-7 sm:text-lg sm:leading-7">
                  Tell us what you&apos;re working on and let&apos;s turn your
                  idea into a scalable digital product.
                </p>

                <Link
                  href="/contact"
                  className="group mt-8 inline-flex max-w-full items-center gap-3 rounded-full bg-white px-4 py-3 text-xs font-bold text-[#181A1B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B7F000] sm:mt-9 sm:px-6 sm:py-3.5 sm:text-sm"
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