import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lightbulb,
  Rocket,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

const processSteps = [
  {
    number: "01",
    title: "Discover",
    label: "Understand",
    description:
      "We start by understanding your business, audience, goals, challenges, and opportunities. No assumptions. Just the right questions.",
    points: [
      "Business & goal discovery",
      "Audience understanding",
      "Requirement analysis",
      "Project scope definition",
    ],
    icon: Search,
  },
  {
    number: "02",
    title: "Strategize",
    label: "Plan",
    description:
      "Once we know where you want to go, we build a clear roadmap that connects strategy, design, technology, and measurable outcomes.",
    points: [
      "Project roadmap",
      "Technology selection",
      "Information architecture",
      "Timeline & milestones",
    ],
    icon: Target,
  },
  {
    number: "03",
    title: "Design",
    label: "Create",
    description:
      "We turn strategy into an experience that feels distinctive, intuitive, and aligned with your brand.",
    points: [
      "UX & user journeys",
      "Visual direction",
      "UI design",
      "Responsive experiences",
    ],
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Build",
    label: "Develop",
    description:
      "Our developers transform the approved direction into a fast, scalable, and reliable digital product.",
    points: [
      "Frontend development",
      "Backend & integrations",
      "CMS & database",
      "Performance optimization",
    ],
    icon: Lightbulb,
  },
  {
    number: "05",
    title: "Launch",
    label: "Deliver",
    description:
      "Before anything goes live, we test every important detail and make sure the final experience is ready for real users.",
    points: [
      "Quality assurance",
      "Cross-device testing",
      "SEO & performance checks",
      "Production deployment",
    ],
    icon: Rocket,
  },
];

export default function ProcessPage() {
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
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-bold text-[#B7F000]">
                05
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                Our Process
              </span>
            </div>

            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/40 sm:block">
              Strategy · Design · Technology
            </span>
          </div>

          {/* Heading */}
          <div className="mt-24 max-w-7xl lg:mt-32">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-[#B7F000]">
              How we work
            </p>

            <h1 className="text-[clamp(4rem,11vw,10rem)] font-black leading-[0.82] tracking-[-0.07em]">
              From
              <br />
              <span className="text-white/30">idea</span> to
              <br />
              <span className="text-[#B7F000]">impact.</span>
            </h1>
          </div>

          {/* Bottom */}
          <div className="mt-20 flex flex-col justify-between gap-10 border-t border-white/10 pt-8 lg:flex-row lg:items-end">
            <p className="max-w-2xl text-lg leading-8 text-white/55 sm:text-xl">
              Great digital products don't happen by accident. Our process
              brings strategy, creativity, and technology together to turn
              ambitious ideas into meaningful digital experiences.
            </p>

            <div className="flex items-center gap-3 text-sm text-white/40">
              <ArrowDown className="h-5 w-5 text-[#B7F000]" />
              <span>Scroll to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#777971]">
              The approach
            </p>

            <div className="mt-8 h-px w-20 bg-[#B7F000]" />
          </div>

          <div>
            <h2 className="max-w-5xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              No unnecessary layers.
              <br />
              <span className="text-[#999B94]">
                Just a smarter way to build.
              </span>
            </h2>

            <p className="mt-10 max-w-3xl text-lg leading-8 text-[#666861]">
              We believe the best work comes from collaboration, clarity, and
              continuous iteration. That's why our process is structured enough
              to keep projects moving, but flexible enough to adapt when better
              ideas emerge.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROCESS STEPS
      ========================================================= */}

      <section className="bg-[#111313] text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">

          {/* Section heading */}
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B7F000]">
                The journey
              </p>

              <h2 className="mt-5 text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                Five steps.
              </h2>
            </div>

            <p className="max-w-md text-base leading-7 text-white/45">
              Every project is different. The framework stays consistent while
              the thinking adapts to what your business actually needs.
            </p>
          </div>

          {/* Steps */}
          <div className="mt-16">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group border-b border-white/10 py-14 lg:py-20"
                >
                  <div className="grid gap-10 lg:grid-cols-[100px_1fr_1.1fr] lg:gap-16">

                    {/* Number */}
                    <div>
                      <span className="font-mono text-sm text-[#B7F000]">
                        {step.number}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <div className="flex items-center gap-4">
                        <Icon className="h-6 w-6 text-[#B7F000] transition-transform duration-500 group-hover:rotate-6" />

                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                          {step.label}
                        </span>
                      </div>

                      <h3 className="mt-7 text-5xl font-black tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-2 sm:text-6xl lg:text-7xl">
                        {step.title}
                        <span className="text-[#B7F000]">.</span>
                      </h3>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="max-w-xl text-lg leading-8 text-white/55">
                        {step.description}
                      </p>

                      <ul className="mt-8 space-y-3">
                        {step.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-center gap-3 text-sm text-white/65"
                          >
                            <Check className="h-4 w-4 shrink-0 text-[#B7F000]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPLES
      ========================================================= */}

      <section className="bg-[#B7F000]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
                What matters
              </p>

              <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                Built
                <br />
                differently.
              </h2>
            </div>

            <div className="grid gap-px bg-black/15 sm:grid-cols-2">

              <div className="bg-[#B7F000] p-8 sm:p-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
                  01
                </span>

                <h3 className="mt-16 text-2xl font-black">
                  Strategy first
                </h3>

                <p className="mt-4 leading-7 text-black/60">
                  We solve the right problem before we start building.
                </p>
              </div>

              <div className="bg-[#B7F000] p-8 sm:p-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
                  02
                </span>

                <h3 className="mt-16 text-2xl font-black">
                  User obsessed
                </h3>

                <p className="mt-4 leading-7 text-black/60">
                  Every decision starts with the people using the product.
                </p>
              </div>

              <div className="bg-[#B7F000] p-8 sm:p-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
                  03
                </span>

                <h3 className="mt-16 text-2xl font-black">
                  Built to scale
                </h3>

                <p className="mt-4 leading-7 text-black/60">
                  We create systems that can evolve as your business grows.
                </p>
              </div>

              <div className="bg-[#B7F000] p-8 sm:p-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/40">
                  04
                </span>

                <h3 className="mt-16 text-2xl font-black">
                  Always improving
                </h3>

                <p className="mt-4 leading-7 text-black/60">
                  Launch is not the finish line. It's where the next iteration
                  begins.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#F5F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">

          <div className="flex flex-col justify-between gap-14 lg:flex-row lg:items-end">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#777971]">
                Ready when you are
              </p>

              <h2 className="mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                Have an idea?
                <br />
                <span className="text-[#999B94]">
                  Let's make it real.
                </span>
              </h2>
            </div>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#111313] px-8 py-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
            >
              Start a project

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}