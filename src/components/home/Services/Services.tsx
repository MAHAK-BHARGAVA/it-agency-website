import ServiceCard from "./ServiceCard";
import Container from "@/components/layout/Container";
import type { getServices } from "@/repositories/service.repository";

type ServiceItem = Awaited<ReturnType<typeof getServices>>[number];

type Props = {
  services: ServiceItem[];
};

export default function Services({ services }: Props) {
  return (
    <section className="bg-[#f7f7f7] py-32">
      <Container>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8bea00]">
          Our Services
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase text-black lg:text-7xl">
          What We Do
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}