// 7. Services Index — http://localhost:3000/services
// Should show:

// Heading "Our Services"
// like seo,web-development etc.
import ServiceCard from "@/components/home/Services/ServiceCard";
import { getServices } from "@/repositories/service.repository";
import { ArrowDownRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Our Services | ABC Technologies",
  description:
    "Explore our web development, mobile app development, SEO, AI automation, branding, and digital technology services.",
};

export default async function ServicesIndexPage() {
  const services = await getServices();

  return (
    <main className="overflow-hidden bg-[#F6F6F2] text-[#181A1B]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative px-6 pb-24 pt-32 sm:px-10 lg:px-16 lg:pb-32 lg:pt-40">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#B7F000]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* Top row */}
          <div className="flex flex-col gap-8 border-b border-[#DDDDD7] pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#DCDCD6] bg-white px-4 py-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B7F000] text-black">
                  <Sparkles size={14} />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#555750]">
                  What we do
                </span>
              </div>

              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[7.5rem]">
                Digital
                <br />
                <span className="text-[#777971]">solutions.</span>
              </h1>
            </div>

            {/* Scroll indicator */}
            <div className="hidden items-center gap-3 pb-2 text-sm font-medium text-[#686A64] sm:flex">
              <span>Explore our capabilities</span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8D8D2] bg-white">
                <ArrowDownRight size={18} />
              </span>
            </div>
          </div>

          {/* Intro */}
          <div className="grid gap-8 pt-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <p className="max-w-3xl text-lg leading-8 text-[#666861] sm:text-xl sm:leading-9">
              We build digital products and technology solutions that help
              businesses grow, scale, and stand out in a constantly changing
              digital world.
            </p>

            <div className="lg:border-l lg:border-[#DDDDD7] lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A8C85]">
                Our approach
              </p>

              <p className="mt-3 text-base leading-7 text-[#444640]">
                Strategy, design and engineering brought together to create
                digital experiences that work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-10 flex items-end justify-between border-b border-[#DDDDD7] pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A8C85]">
                Capabilities
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                What we can build
              </h2>
            </div>

            {services.length > 0 && (
              <div className="hidden text-sm font-medium text-[#777971] sm:block">
                {services.length.toString().padStart(2, "0")} services
              </div>
            )}
          </div>

          {services.length === 0 ? (
            <div className="rounded-[32px] border border-[#E2E2DC] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F0EB]">
                <Sparkles size={22} className="text-[#777971]" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                No services available
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-[#6B6D68]">
                Services will appear here once they are added from the admin
                panel.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service, index) => (
                <div key={service.id} className="relative">
                  {/* Number */}
                  <span className="pointer-events-none absolute left-6 top-6 z-20 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/30 bg-black/70 px-2 text-[11px] font-bold tracking-wider text-white backdrop-blur-md">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BOTTOM STATEMENT
      ========================================================= */}
      <section className="bg-[#181A1B] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B7F000]">
              Built with purpose
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              The right technology should make your business{" "}
              <span className="text-[#B7F000]">move forward.</span>
            </h2>
          </div>

          <div className="border-l border-white/15 pl-6">
            <p className="leading-8 text-white/60">
              From websites and applications to automation and digital growth,
              explore the services that can turn your next idea into something
              real.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}