import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="overflow-hidden bg-[#F5F5F0] text-[#171918]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#111313] text-white">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[650px] w-[650px] rounded-full bg-[#B7F000]/[0.07] blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:100px_100px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#B7F000]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B7F000]">
                  Client stories
                </span>
              </div>

              <h1 className="mt-10 max-w-[1000px] text-[clamp(4.5rem,9vw,9rem)] font-semibold leading-[0.76] tracking-[-0.09em]">
                What our
                <br />
                <span className="text-white/25">clients</span>
                <br />
                say.
              </h1>
            </div>

            <div className="lg:border-l lg:border-white/10 lg:pl-10">
              <p className="text-lg leading-8 text-white/45">
                Real experiences from the people and businesses we've had the
                opportunity to work with.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-4xl font-semibold tracking-[-0.05em] text-[#B7F000]">
                  {testimonials.length}
                </span>

                <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Client
                  <br />
                  stories
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="mx-auto max-w-[1500px]">
          {testimonials.length === 0 ? (
            <div className="border-y border-[#D6D6D0] py-20 text-center">
              <p className="text-sm text-[#777971]">
                No testimonials found.
              </p>
            </div>
          ) : (
            <div className="grid gap-0">
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.id}
                  className="group border-t border-[#D6D6D0] py-12 last:border-b sm:py-16 lg:py-20"
                >
                  <div className="grid gap-10 lg:grid-cols-[100px_1fr_280px] lg:items-start">
                    {/* Number */}
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.25em] text-[#999B94]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Main testimonial */}
                    <div>
                      {/* Quote icon */}
                      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-[#B7F000] text-black transition-transform duration-500 group-hover:rotate-6">
                        <Quote size={18} />
                      </div>

                      <blockquote className="max-w-4xl text-[clamp(1.8rem,3.5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.055em]">
                        “{testimonial.quote}”
                      </blockquote>

                      {/* Rating */}
                      {testimonial.rating !== null && (
                        <div className="mt-8 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              size={14}
                              fill={
                                starIndex < testimonial.rating!
                                  ? "#B7F000"
                                  : "transparent"
                              }
                              className={
                                starIndex < testimonial.rating!
                                  ? "text-[#B7F000]"
                                  : "text-[#C7C8C2]"
                              }
                            />
                          ))}

                          <span className="ml-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#999B94]">
                            {testimonial.rating}/5
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-5 lg:justify-end">
                      {testimonial.photo ? (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#E4E4DE]">
                          <img
                            src={testimonial.photo}
                            alt={testimonial.clientName}
                            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#181A1B] text-sm font-semibold text-[#B7F000]">
                          {testimonial.clientName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 lg:text-right">
                        <p className="font-semibold tracking-[-0.02em]">
                          {testimonial.clientName}
                        </p>

                        {testimonial.company && (
                          <p className="mt-1 text-xs text-[#888A83]">
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-[#B7F000] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                Start something new
              </p>

              <h2 className="mt-7 max-w-[900px] text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.8] tracking-[-0.08em]">
                Ready to
                <br />
                build
                <br />
                <span className="text-black/30">something?</span>
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-base leading-7 text-black/60">
                Have a project, idea or challenge in mind? Let's talk about
                what we can build together.
              </p>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#111313] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:gap-6"
              >
                Contact us

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B7F000] text-black">
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}