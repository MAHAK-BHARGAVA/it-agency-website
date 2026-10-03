import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cookie, ShieldCheck } from "lucide-react";

export default function CookiesPage() {
  return (
    <main className="bg-[#F5F5F0] text-[#111313]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#111313] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-lime-400 blur-[160px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10 lg:pb-32">
          <Link
            href="/"
            className="mb-24 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <p className="mb-8 text-sm font-bold uppercase tracking-[0.25em] text-lime-400">
                Legal / 03
              </p>

              <h1 className="max-w-5xl text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                Cookie
                <br />
                <span className="text-white/35">Policy.</span>
              </h1>
            </div>

            <div className="lg:pb-2">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-black">
                <Cookie size={25} />
              </div>

              <p className="max-w-sm text-lg leading-relaxed text-white/60">
                How Soclthry uses cookies and similar technologies to operate,
                understand, and improve our website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.3fr_1fr]">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-black/40">
              Last updated
              <br />
              October 2026
            </div>

            <div className="max-w-3xl">
              <h2 className="mb-8 text-3xl font-medium tracking-[-0.04em] md:text-5xl">
                A little transparency goes a long way.
              </h2>

              <p className="text-lg leading-relaxed text-black/60">
                This Cookie Policy explains what cookies are, how Soclthry
                may use them on its website, and the choices available to you
                when managing cookies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.28fr_1fr]">

            {/* SIDEBAR */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-black/40">
                  On this page
                </p>

                <nav className="space-y-3 text-sm">
                  <a href="#what-are-cookies" className="block hover:text-lime-600">
                    01 / What are cookies?
                  </a>
                  <a href="#how-we-use" className="block hover:text-lime-600">
                    02 / How we use cookies
                  </a>
                  <a href="#types" className="block hover:text-lime-600">
                    03 / Types of cookies
                  </a>
                  <a href="#third-party" className="block hover:text-lime-600">
                    04 / Third-party services
                  </a>
                  <a href="#manage" className="block hover:text-lime-600">
                    05 / Managing cookies
                  </a>
                  <a href="#updates" className="block hover:text-lime-600">
                    06 / Policy updates
                  </a>
                  <a href="#contact" className="block hover:text-lime-600">
                    07 / Contact us
                  </a>
                </nav>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="max-w-4xl">

              {/* 01 */}
              <article
                id="what-are-cookies"
                className="scroll-mt-32 border-b border-black/10 pb-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  01
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  What are cookies?
                </h2>

                <p className="leading-8 text-black/60">
                  Cookies are small text files that websites may place on your
                  device when you visit them. They can help a website remember
                  information about your visit, maintain functionality, and
                  understand how visitors interact with its pages.
                </p>
              </article>

              {/* 02 */}
              <article
                id="how-we-use"
                className="scroll-mt-32 border-b border-black/10 py-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  02
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  How we use cookies
                </h2>

                <p className="mb-8 leading-8 text-black/60">
                  Depending on how our website is configured, cookies and
                  similar technologies may be used to:
                </p>

                <ul className="space-y-4 text-black/60">
                  {[
                    "Keep essential website functionality working.",
                    "Remember certain preferences or settings.",
                    "Understand website traffic and visitor behaviour.",
                    "Improve website performance and user experience.",
                    "Support security and prevent misuse of our services.",
                  ].map((item) => (
                    <li key={item} className="flex gap-4">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-500" />
                      <span className="leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* 03 */}
              <article
                id="types"
                className="scroll-mt-32 border-b border-black/10 py-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  03
                </p>

                <h2 className="mb-10 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Types of cookies
                </h2>

                <div className="space-y-8">
                  <CookieType
                    title="Essential cookies"
                    description="These may be necessary for core website functionality, security, navigation, and basic features."
                  />

                  <CookieType
                    title="Functional cookies"
                    description="These may help remember preferences and settings so that the website can provide a more consistent experience."
                  />

                  <CookieType
                    title="Analytics cookies"
                    description="Where analytics tools are enabled, these technologies may help us understand website traffic and how visitors use different pages."
                  />

                  <CookieType
                    title="Marketing cookies"
                    description="If marketing or advertising technologies are enabled, these may be used to understand interactions with marketing content or deliver more relevant communications."
                  />
                </div>

                <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6">
                  <p className="text-sm leading-7 text-black/60">
                    The specific cookies or technologies used on the website
                    may change as our website and services evolve. We do not
                    claim that every category above is active at all times.
                  </p>
                </div>
              </article>

              {/* 04 */}
              <article
                id="third-party"
                className="scroll-mt-32 border-b border-black/10 py-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  04
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Third-party services
                </h2>

                <p className="leading-8 text-black/60">
                  Some website features may rely on third-party services.
                  Depending on which services are active, those providers may
                  use their own cookies or similar technologies. Their use of
                  information is governed by their own privacy and cookie
                  policies.
                </p>

                <p className="mt-6 leading-8 text-black/60">
                  Third-party services should only be listed here once they
                  are actually enabled on the production website.
                </p>
              </article>

              {/* 05 */}
              <article
                id="manage"
                className="scroll-mt-32 border-b border-black/10 py-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  05
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Managing cookies
                </h2>

                <p className="leading-8 text-black/60">
                  Most modern web browsers allow you to view, delete, block,
                  or restrict cookies through their settings. Disabling some
                  cookies may affect the availability or functionality of
                  certain parts of a website.
                </p>

                <p className="mt-6 leading-8 text-black/60">
                  Your browser provider&apos;s documentation will explain how
                  to manage cookie preferences for your particular device and
                  browser.
                </p>
              </article>

              {/* 06 */}
              <article
                id="updates"
                className="scroll-mt-32 border-b border-black/10 py-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  06
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Policy updates
                </h2>

                <p className="leading-8 text-black/60">
                  We may update this Cookie Policy when our website,
                  technologies, services, or legal requirements change. The
                  updated version will be published on this page with a
                  revised date.
                </p>
              </article>

              {/* 07 */}
              <article
                id="contact"
                className="scroll-mt-32 pt-16"
              >
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-black/40">
                  07
                </p>

                <h2 className="mb-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                  Contact us
                </h2>

                <p className="leading-8 text-black/60">
                  If you have questions about this Cookie Policy or how
                  cookies are used on our website, you can contact the Soclthry
                  team through our contact page.
                </p>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#111313] px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-lime-400 hover:text-black"
                >
                  Contact Soclthry
                  <ArrowUpRight size={17} />
                </Link>
              </article>

            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lime-400">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-lime-400">
                <ShieldCheck size={22} />
              </div>

              <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.05em] text-black md:text-6xl">
                Your privacy matters.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/60">
                For information about how we handle personal information,
                read our Privacy Policy.
              </p>
            </div>

            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:scale-105"
            >
              Privacy Policy
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

function CookieType({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-lime-400 pl-6">
      <h3 className="mb-3 text-xl font-semibold tracking-[-0.02em]">
        {title}
      </h3>

      <p className="leading-7 text-black/60">{description}</p>
    </div>
  );
}