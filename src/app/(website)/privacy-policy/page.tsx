import Link from "next/link";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    id: "information",
    number: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>
          When you interact with Soclthry, we may collect information that you
          voluntarily provide, such as your name, email address, phone number,
          company details, and project requirements.
        </p>

        <p>
          We may also collect basic technical information such as browser type,
          device information, IP address, and website usage data.
        </p>
      </>
    ),
  },
  {
    id: "usage",
    number: "02",
    title: "How We Use Your Information",
    content: (
      <>
        <p>
          Information collected through our website may be used to respond to
          enquiries, provide requested services, communicate with you, and
          improve our website and services.
        </p>

        <ul className="mt-6 space-y-4">
          {[
            "Respond to enquiries and requests.",
            "Provide and manage our services.",
            "Communicate about projects and service updates.",
            "Improve our website, services, and user experience.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-[#B7F000]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "protection",
    number: "03",
    title: "How We Protect Your Information",
    content: (
      <>
        <p>
          We take reasonable technical and organizational measures to protect
          the information we handle against unauthorized access, alteration,
          disclosure, or destruction.
        </p>

        <p>
          However, no method of transmission or electronic storage can be
          guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    number: "04",
    title: "Information Sharing",
    content: (
      <>
        <p>
          Soclthry does not sell your personal information. Information may be
          shared with trusted service providers when necessary to operate our
          business, provide services, or process requests.
        </p>

        <p>
          We may also disclose information where required by applicable law or
          to protect our legal rights and the security of our services.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "05",
    title: "Cookies & Analytics",
    content: (
      <>
        <p>
          Our website may use cookies and similar technologies to remember
          preferences, understand website usage, and improve the overall user
          experience.
        </p>

        <p>
          You can manage or disable cookies through your browser settings.
          Some website functionality may be affected when cookies are disabled.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    number: "06",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Our website or services may use third-party platforms and tools for
          purposes such as analytics, communication, hosting, payments, or
          media management.
        </p>

        <p>
          These third parties may process information according to their own
          privacy policies and terms.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    number: "07",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain information only for as long as reasonably necessary for
          the purposes for which it was collected, to provide our services,
          maintain business records, or comply with applicable legal
          obligations.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    number: "08",
    title: "Your Rights",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights regarding your
          personal information, including requesting access, correction, or
          deletion of certain information.
        </p>

        <p>
          To make a privacy-related request, please contact our team using the
          information provided on our Contact page.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our services, technology, business practices, or applicable
          requirements.
        </p>

        <p>
          Any updated version will be published on this page with a revised
          effective date.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "10",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how Soclthry
          handles information, please contact our team.
        </p>

        <div className="mt-8">
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

export default function PrivacyPolicyPage() {
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
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#B7F000]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-24 pt-12 sm:px-10 lg:px-16 lg:pb-32 lg:pt-16">

          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                <LockKeyhole className="h-4 w-4 text-[#B7F000]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                Privacy
              </span>
            </div>

            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/40 sm:block">
              Last updated · October 2026
            </span>
          </div>

          {/* Hero */}
          <div className="mt-24 max-w-6xl lg:mt-32">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-[#B7F000]">
              Privacy Policy
            </p>

            <h1 className="text-[clamp(4rem,11vw,10rem)] font-black leading-[0.82] tracking-[-0.07em]">
              Your
              <br />
              <span className="text-white/30">privacy</span>
              <span className="text-[#B7F000]">.</span>
            </h1>
          </div>

          {/* Bottom */}
          <div className="mt-20 flex flex-col justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
            <p className="max-w-xl text-lg leading-8 text-white/55">
              How Soclthry collects, uses, protects, and handles information
              when you interact with our website and services.
            </p>

            <div className="flex items-center gap-3 text-sm text-white/40">
              <ShieldCheck className="h-5 w-5 text-[#B7F000]" />
              <span>Privacy matters.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[260px_1fr] lg:gap-24">

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-10 lg:h-fit">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#777971]">
              On this page
            </p>

            <nav className="mt-6 space-y-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center gap-3 text-sm text-[#777971] transition-colors hover:text-[#181A1B]"
                >
                  <span className="font-mono text-[10px] text-[#B7F000]">
                    {section.number}
                  </span>

                  <span>{section.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="max-w-4xl">

            {/* Intro */}
            <div className="mb-20 border-b border-black/10 pb-12">
              <p className="max-w-3xl text-xl leading-9 text-[#555750] sm:text-2xl sm:leading-10">
                At Soclthry, we respect your privacy and aim to be transparent
                about how information is collected and used when you interact
                with our website and services.
              </p>
            </div>

            {/* Sections */}
            <div>
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20 border-b border-black/10 py-12 first:pt-0 last:border-b-0"
                >
                  <div className="grid gap-8 md:grid-cols-[90px_1fr]">

                    {/* Number */}
                    <div>
                      <span className="font-mono text-sm font-bold text-[#B7F000]">
                        {section.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                        {section.title}
                      </h2>

                      <div className="mt-7 space-y-5 text-base leading-8 text-[#666861]">
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

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#B7F000]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
                Need clarity?
              </p>

              <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                Let&apos;s talk
                <br />
                about privacy.
              </h2>
            </div>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#111313] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
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