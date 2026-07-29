// src/app/portfolio/[project]/page.tsx/portfolio/some-project-slugOne single project's full detail page
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ project: string }>;
};

export async function generateStaticParams() {
  const projects = await prisma.portfolio.findMany();
  return projects.map((p) => ({ project: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params;
  const data = await prisma.portfolio.findUnique({ where: { slug: project } });
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.projectName} | Our Work`,
    description: data.resultSummary.slice(0, 160),
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { project } = await params;

  const item = await prisma.portfolio.findUnique({
    where: { slug: project },
    include: { services: true, industries: true, testimonial: true },
  });

  if (!item) notFound();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{item.projectName}</h1>
      {item.clientName && <p>Client: {item.clientName}</p>}
      <p>{item.resultSummary}</p>
      {item.challenge && (
        <>
          <h2>The Challenge</h2>
          <p>{item.challenge}</p>
        </>
      )}
      {item.solution && (
        <>
          <h2>Our Solution</h2>
          <p>{item.solution}</p>
        </>
      )}
      {item.process && (
        <>
          <h2>Our Process</h2>
          <p>{item.process}</p>
        </>
      )}
      {item.testimonial && (
        <blockquote>
          &ldquo;{item.testimonial.quote}&rdquo; — {item.testimonial.clientName}
        </blockquote>
      )}
      {item.projectUrl && (
        <p>
          <a href={item.projectUrl} target="_blank">
            View Live Project
          </a>
        </p>
      )}
      <p>Services: {item.services.map((s) => s.name).join(", ")}</p>
    </main>
  );
}