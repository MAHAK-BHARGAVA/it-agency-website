import Link from "next/link";
import { ArrowRight, ChevronDown, MessageCircleQuestion } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#181A1B]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#111313] text-white">

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Glow */}
        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-[#B7F000]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-12 sm:px-10 lg:px-16 lg:pb-32 lg:pt-16">

          {/* Top */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                <MessageCircleQuestion className="h-4 w-4 text-[#B7F000]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                FAQ
              </span>
            </div>

            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/40 sm:block">
              Answers · Clarity · Support
            </span>
          </div>

          {/* Hero */}
          <div className="mt-24 max-w-7xl lg:mt-32">

            <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-[#B7F000]">
              Frequently asked
            </p>

            <h1 className="text-[clamp(4rem,11vw,10rem)] font-black leading-[0.82] tracking-[-0.07em]">
              Questions
              <br />
              <span className="text-white/30">&amp;</span>{" "}
              answers<span className="text-[#B7F000]">.</span>
            </h1>
          </div>

          {/* Bottom */}
          <div className="mt-20 flex flex-col justify-between gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-end">

            <p className="max-w-2xl text-lg leading-8 text-white/55 sm:text-xl">
              Everything you need to know about working with Soclthry,
              our services, projects, and the way we work.
            </p>

            <span className="text-sm text-white/35">
              {faqs.length} {faqs.length === 1 ? "question" : "questions"}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ CONTENT
      ========================================================= */}

      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 lg:px-16 lg:py-32">

        {faqs.length === 0 ? (
          <div className="border-y border-black/10 py-20 text-center">
            <MessageCircleQuestion className="mx-auto h-10 w-10 text-[#B7F000]" />

            <h2 className="mt-6 text-3xl font-black">
              No FAQs available yet.
            </h2>

            <p className="mt-3 text-[#777971]">
              Check back soon for answers to common questions.
            </p>
          </div>
        ) : (
          <div>

            {/* Intro */}
            <div className="mb-16 grid gap-8 border-b border-black/10 pb-12 md:grid-cols-[0.7fr_1.3fr] md:gap-16">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#777971]">
                  Need to know
                </p>
              </div>

              <p className="max-w-3xl text-xl leading-9 text-[#555750] sm:text-2xl">
                We've collected some of the questions we hear most often.
                Open any question to explore the answer.
              </p>

            </div>

            {/* FAQ Accordion */}
            <div className="border-t border-black/10">

              {faqs.map((faq, index) => (
                <details
                  key={faq.id}
                  className="group border-b border-black/10"
                >

                  <summary className="flex cursor-pointer list-none items-start gap-6 py-8 sm:py-10">
                    
                    {/* Number */}
                    <span className="pt-1 font-mono text-xs font-bold text-[#B7F000]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Question */}
                    <span className="flex-1 pr-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                      {faq.question}
                    </span>

                    {/* Icon */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-open:rotate-180 group-open:border-[#B7F000] group-open:bg-[#B7F000]">
                      <ChevronDown className="h-4 w-4" />
                    </span>

                  </summary>

                  {/* Answer */}
                  <div className="grid grid-cols-[40px_1fr] gap-6 pb-10 sm:grid-cols-[48px_1fr]">

                    <div />

                    <p className="max-w-3xl text-base leading-8 text-[#666861] sm:text-lg">
                      {faq.answer}
                    </p>

                  </div>

                </details>
              ))}

            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#B7F000]">

        <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
                Still have questions?
              </p>

              <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                Let&apos;s talk
                <br />
                about it.
              </h2>

            </div>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#111313] px-8 py-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
            >
              Contact us

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}