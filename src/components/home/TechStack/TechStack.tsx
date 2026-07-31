import Container from "@/components/layout/Container";
import { technologies } from "./tech-stack.data";

export default function TechStack() {
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <section className="overflow-hidden bg-white py-20 md:py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-500">
            Our Technology Stack
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] text-black sm:text-5xl lg:text-6xl">
            Technologies We Use To
            <span className="block text-black/30">Build Digital Products</span>
          </h2>
        </div>
      </Container>

      <div className="relative overflow-hidden border-y border-black/10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-white to-transparent sm:w-36" />

        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-white to-transparent sm:w-36" />

        <div className="tech-stack-track flex w-max">
          {duplicatedTechnologies.map((technology, index) => {
            const Icon = technology.icon;
            const color = technology.color;

            return (
              <div
                key={`${technology.name}-${index}`}
                className="group flex h-[210px] w-[220px] shrink-0 flex-col items-center justify-center border-r border-black/10 bg-white px-6 transition-all duration-500 hover:bg-black sm:h-[240px] sm:w-[260px]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-black/10 bg-[#f5f5f0] transition-all duration-500 group-hover:scale-110 group-hover:border-lime-400/40 group-hover:bg-white
                group-hover:shadow-[0_0_30px_rgba(132,255,0,0.35)]">
                  <Icon
                    className="h-10 w-10 transition-all duration-300 group-hover:scale-110"
                    style={{ color }}
                  />
                </div>

                <h3 className="mt-6 text-center text-lg font-black uppercase tracking-wide text-black transition-colors duration-500 group-hover:text-white sm:text-xl">
                  {technology.name}
                </h3>

                <span className="mt-3 h-[2px] w-0 bg-lime-400 transition-all duration-500 group-hover:w-12" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
