// Logic: first try to match a City. If nothing found, try State using that same URL segment. If neither matches, 404.

import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ location: string }>;
};

export const dynamic = "force-dynamic";

/* =========================================================
   STATIC PARAMS
========================================================= */

export async function generateStaticParams() {
  const [cities, states] = await Promise.all([
    prisma.city.findMany({
      select: { slug: true },
    }),
    prisma.state.findMany({
      select: { slug: true },
    }),
  ]);

  return [
    ...cities.map((city) => ({
      location: city.slug,
    })),
    ...states.map((state) => ({
      location: state.slug,
    })),
  ];
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { location } = await params;

  const city = await prisma.city.findUnique({
    where: { slug: location },
    include: { state: true },
  });

  if (city) {
    const title =
      city.metaTitle ||
      `Digital Solutions in ${city.name}${
        city.state ? `, ${city.state.name}` : ""
      } | Soclthry`;

    const description =
      city.metaDescription ||
      `Soclthry provides web development, AI automation, SEO, digital marketing and technology solutions for businesses in ${city.name}.`;

    return {
      title,
      description,
      alternates: city.canonicalUrl
        ? { canonical: city.canonicalUrl }
        : undefined,
      openGraph: {
        title,
        description,
        ...(city.ogImage
          ? {
              images: [{ url: city.ogImage }],
            }
          : {}),
      },
    };
  }

  const state = await prisma.state.findUnique({
    where: { slug: location },
  });

  if (state) {
    const title =
      state.metaTitle ||
      `Digital Solutions in ${state.name} | Soclthry`;

    const description =
      state.metaDescription ||
      `Soclthry provides digital and technology solutions for businesses across ${state.name}.`;

    return {
      title,
      description,
      alternates: state.canonicalUrl
        ? { canonical: state.canonicalUrl }
        : undefined,
      openGraph: {
        title,
        description,
        ...(state.ogImage
          ? {
              images: [{ url: state.ogImage }],
            }
          : {}),
      },
    };
  }

  return {
    title: "Location Not Found | Soclthry",
  };
}

/* =========================================================
   FAQ
========================================================= */

function FAQSection({
  faqs,
}: {
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
}) {
  if (!faqs.length) return null;

  return (
    <section className="bg-[#F5F5F0] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
  <div className="mx-auto max-w-[1400px]">

    <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">

      {/* Left */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#999B94]">
          05 / FAQ
        </p>

        <h2 className="mt-7 text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.8] tracking-[-0.08em]">
          Questions
          <br />
          <span className="text-[#999B94]">& answers.</span>
        </h2>

        <p className="mt-8 max-w-sm text-sm leading-7 text-[#70726B]">
          Find answers to some of the most common questions about our
          services and working with us.
        </p>
      </div>

      {/* Right */}
      <div>
        {faqs.length > 0 ? (
          <div className="border-t border-[#D6D6D0]">
            {faqs.map((faq, index) => (
              <details
                key={faq.id}
                className="group border-b border-[#D6D6D0]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-7 [&::-webkit-details-marker]:hidden">

                  <div className="flex items-start gap-5">
                    <span className="pt-1 text-[9px] font-semibold tracking-[0.25em] text-[#A0A19B]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="max-w-2xl text-lg font-semibold leading-snug tracking-[-0.025em] transition-colors duration-300 group-hover:text-[#555750] sm:text-xl">
                      {faq.question}
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D2D2CC] transition-all duration-500 group-open:rotate-45 group-open:border-[#B7F000] group-open:bg-[#B7F000]">
                    <span className="relative block h-3.5 w-3.5">
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#181A1B]" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#181A1B]" />
                    </span>
                  </span>

                </summary>

                <div className="pb-8 pl-10 pr-14 sm:pl-12">
                  <p className="max-w-2xl text-sm leading-7 text-[#70726B]">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="border-t border-[#D6D6D0] py-10">
            <p className="text-sm text-[#777971]">
              No FAQs available at the moment.
            </p>
          </div>
        )}

        {/* Still have a question */}
        <div className="mt-12 flex flex-col gap-7 rounded-[2rem] bg-[#111313] p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#B7F000]">
              Need more information?
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Still have a question?
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
              Can't find what you're looking for? Talk to our team directly.
            </p>
          </div>

          <Link
            href="/contact"
            className="group flex w-fit shrink-0 items-center gap-4 rounded-full bg-[#B7F000] px-6 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:gap-6"
          >
            Contact us

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </Link>

        </div>

      </div>
    </div>
  </div>
</section>
  );
}

/* =========================================================
   TESTIMONIALS
========================================================= */

function TestimonialsSection({
  testimonials,
}: {
  testimonials: {
    id: number;
    clientName: string;
    company: string | null;
    quote: string;
    rating: number | null;
  }[];
}) {
  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#111313] px-6 py-28 text-white sm:px-10 lg:px-16 lg:py-36">
      <div className="pointer-events-none absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-[#B7F000]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B7F000]">
              03 / Client stories
            </p>

            <h2 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl">
              Good work
              <br />
              speaks for itself.
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15">
            <ArrowDownRight size={19} />
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={`group flex min-h-[340px] flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.035] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#B7F000]/30 hover:bg-white/[0.055] ${
                index === 0 ? "lg:translate-y-8" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/30">
                    0{index + 1}
                  </span>

                  {testimonial.rating && (
                    <span className="text-sm tracking-widest text-[#B7F000]">
                      {"★".repeat(Math.min(testimonial.rating, 5))}
                    </span>
                  )}
                </div>

                <p className="mt-12 text-xl leading-8 tracking-[-0.02em] text-white/80">
                  “{testimonial.quote}”
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="font-semibold">
                  {testimonial.clientName}
                </p>

                {testimonial.company && (
                  <p className="mt-1 text-sm text-white/40">
                    {testimonial.company}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CITY PAGE
========================================================= */

async function CityPage({
  city,
}: {
  city: Awaited<ReturnType<typeof prisma.city.findUnique>> & {
    state: {
      id: number;
      name: string;
      slug: string;
    } | null;
    serviceCities: {
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
    }[];
    faqs: {
      id: number;
      question: string;
      answer: string;
    }[];
    testimonials: {
      id: number;
      clientName: string;
      company: string | null;
      quote: string;
      rating: number | null;
    }[];
  };
}) {
  if (!city) return null;

  let testimonials = city.testimonials;

  if (!testimonials.length) {
    testimonials = await prisma.testimonial.findMany({
      where: {
        services: { none: {} },
        cities: { none: {} },
        industries: { none: {} },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  }

  let faqs = city.faqs;

  if (!faqs.length) {
    faqs = await prisma.faq.findMany({
      where: {
        cities: { none: {} },
        states: { none: {} },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  }

  const company = await prisma.siteSetting.findUnique({
    where: { id: 1 },
  });

  const companyName = company?.companyName || "Soclthry";

  return (
    <main className="overflow-hidden bg-[#F6F6F2] text-[#181A1B]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `${companyName} - ${city.name}`,
          description:
            city.metaDescription ||
            `Digital solutions and technology services for businesses in ${city.name}.`,
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.state?.name,
            addressCountry: "IN",
          },
          url: city.canonicalUrl || undefined,
        }}
      />

      {/* =====================================================
          PREMIUM HERO
      ===================================================== */}

      <section className="relative min-h-[780px] overflow-hidden bg-[#111313] px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16 lg:pt-36">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-40 top-20 h-[650px] w-[650px] rounded-full bg-[#B7F000]/10 blur-[140px]" />

        <div className="pointer-events-none absolute bottom-[-300px] left-[20%] h-[500px] w-[500px] rounded-full bg-[#B7F000]/5 blur-[130px]" />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B7F000] text-black">
                <MapPin size={15} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
                Local digital partner
              </span>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              {city.state?.name
                ? `${city.name} / ${city.state.name}`
                : city.name}
            </span>
          </div>

          <div className="grid gap-14 pb-12 pt-24 lg:grid-cols-[1fr_310px] lg:items-end">
            <div>
              <p className="mb-7 text-[11px] font-bold uppercase tracking-[0.3em] text-[#B7F000]">
                Digital solutions / {city.name}
              </p>

              <h1 className="max-w-6xl text-[4rem] font-semibold leading-[0.82] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8.5rem]">
                Build.
                <br />
                <span className="text-white/35">Grow.</span>
                <br />
                <span className="text-[#B7F000]">Move.</span>
              </h1>
            </div>

            <div className="lg:border-l lg:border-white/10 lg:pl-8">
              <p className="text-base leading-7 text-white/55">
                We build digital experiences, products and technology
                solutions for ambitious businesses in{" "}
                <span className="text-white">
                  {city.name}.
                </span>
              </p>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#B7F000] px-6 py-3.5 text-sm font-bold text-black transition duration-300 hover:gap-6"
              >
                Start a project
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            <span>Scroll to explore</span>

            <ArrowDownRight size={16} />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.3fr_1fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8C85]">
                01 / Local expertise
              </p>
            </div>

            <div>
              <h2 className="max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Technology should make your business{" "}
                <span className="text-[#8A8C85]">
                  easier to run, easier to grow and harder to ignore.
                </span>
              </h2>

              <div className="mt-14 grid gap-5 border-t border-[#D9D9D3] pt-8 sm:grid-cols-3">
                <div>
                  <p className="text-4xl font-semibold tracking-tight">
                    {city.serviceCities.length
                      .toString()
                      .padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Services
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-semibold tracking-tight">
                    {city.state?.name || "India"}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Region
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-semibold tracking-tight">
                    24/7
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Digital presence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="bg-white px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 border-b border-[#DCDCD6] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8C85]">
                02 / Capabilities
              </p>

              <h2 className="mt-5 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl">
                What we
                <br />
                <span className="text-[#858780]">can build.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#70726B]">
              Digital services designed around real business goals,
              from first idea to long-term growth.
            </p>
          </div>

          {city.serviceCities.length === 0 ? (
            <div className="py-20 text-center text-[#777971]">
              Services will appear here once they are added from the
              admin panel.
            </div>
          ) : (
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {city.serviceCities.map((item, index) => {
                const service = item.service;

                return (
                  <Link
                    key={item.id}
                    href={`/services/${service.slug}/${city.slug}`}
                    className="group relative min-h-[340px] overflow-hidden rounded-[30px] border border-[#DFDFD9] bg-[#F6F6F2] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.09)] sm:p-9"
                  >
                    {service.image && (
                      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-15">
                        <img
                          src={service.image}
                          alt=""
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    )}

                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#181A1B] text-white transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-[#B7F000] group-hover:text-black">
                          <ArrowDownRight size={19} />
                        </span>

                        <span className="text-[11px] font-bold tracking-[0.2em] text-[#999B94]">
                          {(index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-20">
                        <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                          {service.name}
                        </h3>

                        <p className="mt-4 max-w-lg line-clamp-2 text-sm leading-7 text-[#70726B]">
                          {item.introText ||
                            service.description}
                        </p>

                        <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]">
                          Explore
                          <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY SOC LTHRY
      ===================================================== */}

      <section className="bg-[#111313] px-6 py-28 text-white sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B7F000]">
                Why Soclthry
              </p>

              <h2 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                Not just
                <br />
                another
                <br />
                <span className="text-white/30">
                  agency.
                </span>
              </h2>
            </div>

            <div className="border-t border-white/10">
              {[
                "Business-first thinking",
                "Modern technology",
                "Design that communicates",
                "Solutions built to scale",
              ].map((item, index) => (
                <div
                  key={item}
                  className="group flex items-center gap-7 border-b border-white/10 py-7"
                >
                  <span className="text-[11px] font-bold text-[#B7F000]">
                    0{index + 1}
                  </span>

                  <h3 className="text-xl font-semibold tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-2 sm:text-2xl">
                    {item}
                  </h3>

                  <ArrowRight
                    size={18}
                    className="ml-auto text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#B7F000]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <FAQSection faqs={faqs} />

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[40px] bg-[#B7F000] px-7 py-16 sm:px-12 lg:px-16 lg:py-24">
            <div className="pointer-events-none absolute right-[-150px] top-[-220px] h-[600px] w-[600px] rounded-full bg-white/25 blur-[100px]" />

            <div className="relative grid gap-14 lg:grid-cols-[1fr_300px] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/55">
                  Ready when you are
                </p>

                <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.85] tracking-[-0.065em] sm:text-7xl lg:text-[6.5rem]">
                  Let's build
                  <br />
                  something
                  <br />
                  <span className="text-black/35">
                    meaningful.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-sm leading-7 text-black/65">
                  Have a project in {city.name}? Tell us what you're
                  building and let's turn the idea into something
                  real.
                </p>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex items-center gap-4 rounded-full bg-[#181A1B] px-6 py-4 text-sm font-bold text-white transition duration-300 hover:gap-6"
                >
                  Start a conversation
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STATE PAGE
========================================================= */

async function StatePage({
  state,
}: {
  state: Awaited<ReturnType<typeof prisma.state.findUnique>> & {
    cities: {
      id: number;
      name: string;
      slug: string;
    }[];
    serviceStates: {
      id: number;
      introText: string | null;
      service: {
        id: number;
        name: string;
        slug: string;
        description: string;
        image: string | null;
      };
    }[];
    faqs: {
      id: number;
      question: string;
      answer: string;
    }[];
  };
}) {
  if (!state) return null;

  let faqs = state.faqs;

  if (!faqs.length) {
    faqs = await prisma.faq.findMany({
      where: {
        cities: { none: {} },
        states: { none: {} },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  }

  const testimonials = await prisma.testimonial.findMany({
    where: {
      services: { none: {} },
      cities: { none: {} },
      industries: { none: {} },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="overflow-hidden bg-[#F6F6F2] text-[#181A1B]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Soclthry",
          description:
            state.metaDescription ||
            `Digital solutions across ${state.name}.`,
          areaServed: {
            "@type": "AdministrativeArea",
            name: state.name,
          },
        }}
      />

      {/* HERO */}

      <section className="relative min-h-[760px] overflow-hidden bg-[#111313] px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16 lg:pt-36">
        <div className="pointer-events-none absolute -right-40 top-20 h-[650px] w-[650px] rounded-full bg-[#B7F000]/10 blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="relative mx-auto flex min-h-[630px] max-w-7xl flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B7F000] text-black">
                <MapPin size={15} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
                Regional digital partner
              </span>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              {state.name}
            </span>
          </div>

          <div className="grid gap-14 pb-12 pt-24 lg:grid-cols-[1fr_310px] lg:items-end">
            <div>
              <p className="mb-7 text-[11px] font-bold uppercase tracking-[0.3em] text-[#B7F000]">
                Digital solutions / {state.name}
              </p>

              <h1 className="max-w-6xl text-[4rem] font-semibold leading-[0.82] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8.5rem]">
                Think.
                <br />
                <span className="text-white/35">
                  Build.
                </span>
                <br />
                <span className="text-[#B7F000]">
                  Scale.
                </span>
              </h1>
            </div>

            <div className="lg:border-l lg:border-white/10 lg:pl-8">
              <p className="text-base leading-7 text-white/55">
                Digital products and technology solutions for businesses
                across{" "}
                <span className="text-white">
                  {state.name}.
                </span>
              </p>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#B7F000] px-6 py-3.5 text-sm font-bold text-black transition hover:gap-6"
              >
                Start a project
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            <span>Explore {state.name}</span>
            <ArrowDownRight size={16} />
          </div>
        </div>
      </section>

      {/* INTRO */}

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.3fr_1fr]">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8C85]">
              01 / Regional expertise
            </p>

            <div>
              <h2 className="max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                One digital partner for businesses across{" "}
                <span className="text-[#858780]">
                  {state.name}.
                </span>
              </h2>

              <div className="mt-14 grid gap-5 border-t border-[#D9D9D3] pt-8 sm:grid-cols-3">
                <div>
                  <p className="text-4xl font-semibold">
                    {state.cities.length
                      .toString()
                      .padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Cities
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-semibold">
                    {state.serviceStates.length
                      .toString()
                      .padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Services
                  </p>
                </div>

                <div>
                  <p className="text-4xl font-semibold">
                    01
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-[#858780]">
                    Region
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}

      <section className="bg-white px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-[#DCDCD6] pb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8C85]">
              02 / Capabilities
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl">
              Services across
              <br />
              <span className="text-[#858780]">
                {state.name}.
              </span>
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {state.serviceStates.map((item, index) => (
              <Link
                key={item.id}
                href={`/services/${item.service.slug}/${state.slug}`}
                className="group relative min-h-[330px] overflow-hidden rounded-[30px] border border-[#DFDFD9] bg-[#F6F6F2] p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.09)]"
              >
                {item.service.image && (
                  <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-15">
                    <img
                      src={item.service.image}
                      alt=""
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                )}

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#181A1B] text-white transition group-hover:bg-[#B7F000] group-hover:text-black">
                      <ArrowDownRight size={19} />
                    </span>

                    <span className="text-[11px] font-bold tracking-[0.2em] text-[#999B94]">
                      {(index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-20">
                    <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                      {item.service.name}
                    </h3>

                    <p className="mt-4 line-clamp-2 text-sm leading-7 text-[#70726B]">
                      {item.introText ||
                        item.service.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]">
                      Explore
                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-2"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A8C85]">
            03 / Local presence
          </p>

          <div className="mt-5 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-6xl">
              Cities we
              <br />
              <span className="text-[#858780]">
                serve.
              </span>
            </h2>

            <p className="max-w-sm text-sm leading-7 text-[#70726B]">
              Explore our location-specific digital services and
              solutions.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.cities.map((city, index) => (
              <Link
                key={city.id}
                href={`/${city.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-[#DCDCD6] bg-white px-6 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#181A1B]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#999B94]">
                    {(index + 1)
                      .toString()
                      .padStart(2, "0")}
                  </span>

                  <span className="font-semibold">
                    {city.name}
                  </span>
                </div>

                <ArrowRight
                  size={16}
                  className="text-[#999B94] transition group-hover:translate-x-1 group-hover:text-black"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <FAQSection faqs={faqs} />

      {/* CTA */}

      <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[40px] bg-[#B7F000] px-7 py-16 sm:px-12 lg:px-16 lg:py-24">
            <div className="pointer-events-none absolute right-[-150px] top-[-220px] h-[600px] w-[600px] rounded-full bg-white/25 blur-[100px]" />

            <div className="relative grid gap-14 lg:grid-cols-[1fr_300px] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/55">
                  Let's build something
                </p>

                <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.85] tracking-[-0.065em] sm:text-7xl lg:text-[6.5rem]">
                  Your next
                  <br />
                  big move
                  <br />
                  <span className="text-black/35">
                    starts here.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-sm leading-7 text-black/65">
                  Tell us about your project and let's explore what
                  we can build together.
                </p>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex items-center gap-4 rounded-full bg-[#181A1B] px-6 py-4 text-sm font-bold text-white transition hover:gap-6"
                >
                  Start a conversation
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   MAIN LOCATION ROUTER
========================================================= */

export default async function LocationPage({ params }: Props) {
  const { location } = await params;

  /* CITY FIRST */

  const city = await prisma.city.findUnique({
    where: {
      slug: location,
    },
    include: {
      state: true,

      serviceCities: {
        include: {
          service: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },

      testimonials: true,
      faqs: true,
    },
  });

  if (city) {
    return <CityPage city={city as any} />;
  }

  /* STATE SECOND */

  const state = await prisma.state.findUnique({
    where: {
      slug: location,
    },
    include: {
      cities: {
        orderBy: {
          name: "asc",
        },
      },

      serviceStates: {
        include: {
          service: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },

      faqs: true,
    },
  });

  if (state) {
    return <StatePage state={state as any} />;
  }

  /* 404 */

  const { notFound } = await import("next/navigation");

  notFound();
}