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
    "Start a conversation with our team about your next digital project.",
};

export default async function ContactPage() {
  const services = await prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f4ef] text-[#111]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative px-6 pb-24 pt-28 sm:px-10 lg:px-16 lg:pb-32 lg:pt-40">

        {/* Decorative circle */}
        <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-lime-300/30 blur-[100px]" />

        <div className="relative mx-auto max-w-[1500px]">

          <div className="grid lg:grid-cols-[1fr_320px]">

            <div>

              <div className="mb-10 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/35">
                  Contact us
                </span>
              </div>

              <h1 className="max-w-6xl text-[clamp(4.2rem,10vw,10rem)] font-black leading-[0.78] tracking-[-0.085em]">
                Let&apos;s
                <br />
                make it
                <br />
                <span className="text-black/20">happen.</span>
              </h1>

            </div>

            <div className="mt-14 lg:mt-0 lg:flex lg:items-end">

              <div className="max-w-xs lg:pb-3">

                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <ArrowDownRight size={19} />
                </div>

                <p className="text-lg leading-8 text-black/55">
                  Have an idea, a challenge, or a project in mind?
                  Tell us about it. We&apos;d love to hear what you&apos;re
                  building.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT / FORM
      ===================================================== */}

      <section className="px-6 pb-24 sm:px-10 lg:px-16 lg:pb-32">

        <div className="mx-auto max-w-[1500px]">

          <div className="grid overflow-hidden rounded-[38px] bg-black lg:grid-cols-[0.38fr_0.62fr]">

            {/* =================================================
                LEFT DARK PANEL
            ================================================= */}

            <div className="relative overflow-hidden p-8 text-white sm:p-12 lg:p-14">

              {/* lime glow */}
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-lime-400/15 blur-[100px]" />

              <div className="relative z-10 flex h-full flex-col">

                <div className="flex items-center justify-between">

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                    Let&apos;s talk
                  </span>

                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">
                    01
                  </span>

                </div>


                <div className="mt-20">

                  <h2 className="max-w-sm text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-5xl">
                    Good work
                    <br />
                    starts with
                    <br />
                    a conversation.
                  </h2>

                  <p className="mt-7 max-w-sm text-sm leading-7 text-white/40">
                    Give us a little context and we&apos;ll figure out
                    the next step together.
                  </p>

                </div>


                {/* CONTACT DETAILS */}
                <div className="mt-auto pt-20">

                  <div className="space-y-5">

                    <a
                      href="mailto:hello@yourcompany.com"
                      className="group flex items-center gap-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition group-hover:bg-lime-400 group-hover:text-black">
                        <Mail size={15} />
                      </span>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                          Email
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white/75">
                          Contact@soclthry.com
                        </p>
                      </div>
                    </a>


                    <a
                      href="tel:+910000000000"
                      className="group flex items-center gap-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition group-hover:bg-lime-400 group-hover:text-black">
                        <Phone size={15} />
                      </span>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white/75">
                          +9170733377833
                        </p>
                      </div>
                    </a>


                    <div className="group flex items-center gap-4">

                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <MapPin size={15} />
                      </span>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white/75">
                          India
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>


            {/* =================================================
                RIGHT FORM PANEL
            ================================================= */}

            <div className="bg-[#f8f8f4] p-7 sm:p-12 lg:p-14 xl:p-16">

              <div className="mb-12 flex items-end justify-between border-b border-black/10 pb-7">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
                    Project enquiry
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-[-0.055em] sm:text-4xl">
                    Tell us what you need.
                  </h2>

                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-black text-white sm:flex">
                  <ArrowUpRight size={18} />
                </div>

              </div>

              <ContactForm services={services} />

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          BOTTOM STATEMENT
      ===================================================== */}

      <section className="border-t border-black/10 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

        <div className="mx-auto max-w-[1500px]">

          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

            <h2 className="max-w-4xl text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              No complicated
              <br />
              process.
              <span className="text-black/20"> Just good work.</span>
            </h2>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime-400">
              <ArrowUpRight size={23} />
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}