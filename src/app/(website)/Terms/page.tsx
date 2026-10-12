import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using the Soclthry website and services, you agree
          to be bound by these Terms & Conditions. If you do not agree with
          these terms, please do not use our website or services.
        </p>
        <p>
          These terms apply to all visitors, users, clients, and other
          individuals who access or use our services.
        </p>
      </>
    ),
  },
  {
    id: "services",
    number: "02",
    title: "Our Services",
    content: (
      <>
        <p>
          Soclthry provides digital and technology services including website
          development, software solutions, digital marketing, SEO, branding,
          AI automation, and related technology services.
        </p>
        <p>
          The exact scope, timeline, deliverables, and pricing of a project
          will depend on the agreement between Soclthry and the client.
        </p>
      </>
    ),
  },
  {
    id: "website-use",
    number: "03",
    title: "Use of Our Website",
    content: (
      <>
        <p>
          You agree to use this website only for lawful purposes and in a way
          that does not infringe upon the rights of others.
        </p>
        <ul className="mt-5 space-y-4 sm:mt-6">
          {[
            "Do not attempt to gain unauthorized access to our systems.",
            "Do not use the website for fraudulent or unlawful activities.",
            "Do not knowingly introduce malicious software or harmful code.",
            "Do not interfere with the security or operation of the website.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#91C000]" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    number: "04",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          Unless otherwise agreed in writing, the content, branding, design,
          graphics, text, code, and other materials available on this website
          are owned by or licensed to Soclthry.
        </p>
        <p>
          You may not reproduce, distribute, modify, publish, or commercially
          exploit our materials without prior written permission.
        </p>
      </>
    ),
  },
  {
    id: "client-responsibilities",
    number: "05",
    title: "Client Responsibilities",
    content: (
      <>
        <p>
          Clients are responsible for providing accurate information,
          materials, credentials, approvals, and feedback required for their
          projects.
        </p>
        <p>
          Delays caused by missing information, delayed approvals, or
          incomplete client requirements may affect project timelines.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    number: "06",
    title: "Payments & Projects",
    content: (
      <>
        <p>
          Project pricing, payment schedules, milestones, and deliverables
          will be communicated and agreed upon before or during the engagement.
        </p>
        <p>
          Additional work outside the agreed scope may require additional
          charges and a separate agreement.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    number: "07",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          Soclthry makes reasonable efforts to provide reliable services and
          maintain the availability of its website. However, we do not
          guarantee that the website or services will always be uninterrupted,
          error-free, or completely secure.
        </p>
        <p>
          To the extent permitted by applicable law, Soclthry will not be
          responsible for indirect, incidental, or consequential losses arising
          from the use of our website or services.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "08",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms & Conditions from time to time to reflect
          changes to our services, business practices, or applicable
          requirements.
        </p>
        <p>
          Updated terms will be published on this page with a revised
          effective date.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "09",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have questions about these Terms & Conditions, you can contact
          our team.
        </p>
        <div className="mt-6 sm:mt-8">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-b border-[#B7F000] pb-2 text-sm font-bold text-white transition-colors hover:text-[#B7F000]"
          >
            Contact Soclthry
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F5F0] text-[#181A1B]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#111313] text-white">
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

        <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-[#B7F000]/10 blur-3xl sm:-right-32 sm:top-20 sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-[1400px] px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 md:px-10 lg:px-16 lg:pb-32 lg:pt-16">

          {/* TOP LABEL */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 sm:h-10 sm:w-10">
                <FileText className="h-4 w-4 text-[#B7F000]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 sm:text-xs sm:tracking-[0.25em]">
                Legal
              </span>
            </div>

            <span className="max-w-[150px] text-right text-[9px] uppercase leading-5 tracking-[0.12em] text-white/40 sm:max-w-none sm:text-xs sm:tracking-[0.2em]">
              Last updated · October 2026
            </span>
          </div>

          {/* HERO CONTENT */}
          <div className="mt-16 max-w-6xl sm:mt-20 lg:mt-32">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#B7F000] sm:mb-6 sm:text-sm sm:tracking-[0.25em]">
              Terms & Conditions
            </p>

            <h1 className="text-[clamp(3.3rem,12vw,10rem)] font-black leading-[0.86] tracking-[-0.075em] sm:leading-[0.82] sm:tracking-[-0.07em]">
              Terms
              <br />
              <span className="text-white/30">&amp;</span>{" "}
              <span className="break-words">Conditions</span>
              <span className="text-[#B7F000]">.</span>
            </h1>
          </div>

          {/* HERO BOTTOM */}
          <div className="mt-12 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 sm:mt-16 sm:gap-8 sm:pt-8 md:flex-row md:items-end lg:mt-20">
            <p className="max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              The rules, responsibilities, and guidelines that govern your use
              of the Soclthry website and services.
            </p>

            <div className="flex items-center gap-3 text-xs leading-5 text-white/40 sm:text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#B7F000]" />
              <span>Clear. Transparent. Straightforward.</span>
            </div>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 sm:py-16 md:px-10 lg:px-16 lg:py-28">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-24">

          {/* SIDEBAR / MOBILE NAVIGATION */}
          <aside className="min-w-0 lg:sticky lg:top-10 lg:h-fit">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#777971] sm:text-xs sm:tracking-[0.25em]">
              On this page
            </p>

            <nav
              aria-label="Terms and Conditions sections"
              className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1"
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex min-w-0 items-start gap-3 rounded-xl border border-black/[0.06] bg-white/60 px-3 py-3 text-xs leading-5 text-[#777971] transition-colors hover:border-black/15 hover:text-[#181A1B] sm:text-sm lg:border-0 lg:bg-transparent lg:px-0 lg:py-1"
                >
                  <span className="shrink-0 font-mono text-[10px] text-[#769B00]">
                    {section.number}
                  </span>
                  <span className="min-w-0 break-words">{section.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN LEGAL CONTENT */}
          <div className="min-w-0 max-w-4xl">
            <div className="mb-12 border-b border-black/10 pb-8 sm:mb-16 sm:pb-12 lg:mb-20">
              <p className="max-w-3xl text-lg leading-8 text-[#555750] sm:text-xl sm:leading-9 md:text-2xl md:leading-10">
                These Terms & Conditions explain the conditions under which you
                may access and use the Soclthry website and services. Please
                read them carefully before using our services.
              </p>
            </div>

            <div>
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-b border-black/10 py-8 first:pt-0 last:border-b-0 sm:py-10 md:py-12"
                >
                  <div className="grid min-w-0 gap-3 sm:gap-5 md:grid-cols-[60px_minmax(0,1fr)] md:gap-8">

                    {/* NUMBER */}
                    <div>
                      <span className="font-mono text-xs font-bold text-[#769B00] sm:text-sm">
                        {section.number}
                      </span>
                    </div>

                    {/* SECTION CONTENT */}
                    <div className="min-w-0">
                      <h2 className="break-words text-xl font-black leading-tight tracking-tight sm:text-2xl md:text-3xl">
                        {section.title}
                      </h2>

                      <div className="mt-5 space-y-4 break-words text-sm leading-7 text-[#666861] sm:mt-7 sm:space-y-5 sm:text-base sm:leading-8">
                        {section.content}
                      </div>
                    </div>

                  </div>
                </section>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#B7F000]">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8 sm:py-20 md:px-10 lg:px-16 lg:py-28">

          <div className="flex flex-col justify-between gap-8 sm:gap-12 lg:flex-row lg:items-end">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 sm:text-xs sm:tracking-[0.25em]">
                Questions?
              </p>

              <h2 className="mt-4 text-[clamp(2.8rem,10vw,6rem)] font-black leading-[0.92] tracking-[-0.06em] sm:mt-5 sm:text-6xl lg:text-8xl">
                Let&apos;s talk
                <br />
                about it.
              </h2>
            </div>

            <Link
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-4 rounded-full bg-[#111313] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 sm:w-fit sm:px-7"
            >
              Contact us
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}