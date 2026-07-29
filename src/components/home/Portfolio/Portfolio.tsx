import { Portfolio as PortfolioType } from "@/generated/prisma/client";
import SectionTitle from "@/components/common/SectionTitle";
import PortfolioCard from "./PortfolioCard";
import Container from "@/components/layout/Container";

type Props = {
  portfolio: PortfolioType[];
};

export default function Portfolio({
  portfolio,
}: Props) {
  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
  <Container>
    <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8bea00]">
      Our Projects
    </p>

    <h2 className="mt-4 text-5xl font-black uppercase text-white lg:text-7xl">
      Selected Work
    </h2>

    <div className="mt-16 grid gap-8 lg:grid-cols-2">
      {portfolio.map((project) => (
        <PortfolioCard key={project.id} project={project} />
      ))}
    </div>
  </Container>
</section>
  );
}