import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact | Let's Build Something",
  description:
    "Start a conversation with Soclthry about your next digital project.",
};

export default async function ContactPage() {
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f4f4ef] text-[#111]">
      {/* HERO */}
      <section className="relative px-5 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-16 lg:pb-32 lg:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-16 h-72 w-72 rounded-full bg-lime-300/30 blur-[90px] sm:-right-32 sm:h-[420px] sm:w-[420px]"
        />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
            <div className="min-w-0">
              <div className="mb-8 flex items-center gap-3 sm:mb-10">
                <span className="h-2 w-2 shrink-0 rounded-full bg-lime-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-black/40 sm:tracking-[0.25em]">
                  Contact us
                </span>
              </div>

              <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-black leading-[0.84] tracking-[-0.075em] sm:leading-[0.8] sm:tracking-[-0.085em]">
                Let&apos;s
                <br />
                make it
                <br />
                <span className="text-black/20">happen.</span>
              </h1>
            </div>

            <div className="flex items-end lg:justify-end">
              <div className="max-w-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white sm:mb-7 sm:h-12 sm:w-12">
                  <ArrowDownRight size={19} />
                </div>

                <p className="text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
                  Have an idea, a challenge, or a project in mind? Tell us
                  about it. We&apos;d love to hear what you&apos;re building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS + FORM */}
      <section
        id="contact-form"
        className="scroll-mt-24 px-4 pb-16 sm:px-8 sm:pb-24 lg:px-16 lg:pb-32"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="grid overflow-hidden rounded-[26px] bg-black sm:rounded-[36px] lg:grid-cols-[0.38fr_0.62fr]">
            {/* LEFT PANEL */}
            <div className="relative overflow-hidden p-6 text-white sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-36 -left-36 h-80 w-80 rounded-full bg-lime-400/15 blur-[90px] sm:h-[450px] sm:w-[450px]"
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Let&apos;s talk
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/30">
                    01
                  </span>
                </div>

                <div className="mt-12 sm:mt-16 lg:mt-20">
                  <h2 className="max-w-sm text-3xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl">
                    Good work
                    <br />
                    starts with
                    <br />
                    a conversation.
                  </h2>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/50 sm:mt-7">
                    Give us a little context and we&apos;ll figure out the
                    next step together.
                  </p>
                </div>

                <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16 sm:pt-10 lg:mt-auto lg:pt-20">
                  <div className="space-y-6">
                    <a
                      href="mailto:contact@soclthry.com"
                      className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-lime-400 sm:gap-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors group-hover:bg-lime-400 group-hover:text-black">
                        <Mail size={15} />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                          Email
                        </span>
                        <span className="mt-1 block break-all text-sm font-semibold text-white/80 transition-colors group-hover:text-lime-300">
                          contact@soclthry.com
                        </span>
                      </span>
                    </a>

                    <a
                      href="tel:+9170733377833"
                      className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-lime-400 sm:gap-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors group-hover:bg-lime-400 group-hover:text-black">
                        <Phone size={15} />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                          Phone
                        </span>
                        <span className="mt-1 block break-words text-sm font-semibold text-white/80 transition-colors group-hover:text-lime-300">
                          +91 70733377833
                        </span>
                      </span>
                    </a>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <MapPin size={15} />
                      </span>

                      <span>
                        <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                          Location
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-white/80">
                          India
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="min-w-0 bg-[#f8f8f4] p-5 sm:p-9 md:p-12 lg:p-14 xl:p-16">
              <div className="mb-8 flex items-start justify-between gap-4 border-b border-black/10 pb-6 sm:mb-12 sm:items-end sm:pb-7">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                    Project enquiry
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">
                    Tell us what you need.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-black/50">
                    Share a few details and let&apos;s explore how we can
                    help.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-white sm:flex">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <ContactForm services={services} />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM STATEMENT */}
      <section className="border-t border-black/10 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-8 sm:gap-10 md:flex-row md:items-end">
            <h2 className="max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              No complicated
              <br />
              process.
              <span className="text-black/20"> Just good work.</span>
            </h2>

            <a
              href="#contact-form"
              aria-label="Go to the contact form"
              className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-full bg-lime-400 transition-transform hover:rotate-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 sm:h-16 sm:w-16 md:self-auto"
            >
              <ArrowUpRight size={23} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}