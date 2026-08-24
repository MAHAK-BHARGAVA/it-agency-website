import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import PortfolioForm from "@/components/admin/portfolio/PortfolioForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPortfolioPage({
  params,
}: Props) {
  const { id } = await params;

  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound();
  }

  const project = await prisma.portfolio.findUnique({
    where: {
      id: projectId,
    },

    include: {
      services: {
        select: {
          id: true,
          name: true,
        },
      },

      industries: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/portfolio"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </Link>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          Portfolio
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
          Edit Project
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Update project information, case study content and relationships.
        </p>
      </div>

      <div className="mt-8">
        <PortfolioForm
          initialData={{
            id: project.id,
            projectName: project.projectName,
            slug: project.slug,
            thumbnail: project.thumbnail,
            resultSummary: project.resultSummary,
            clientName: project.clientName,
            projectUrl: project.projectUrl,
            challenge: project.challenge,
            solution: project.solution,
            process: project.process,
            testimonialId: project.testimonialId,
            services: project.services,
            industries: project.industries,
          }}
        />
      </div>
    </div>
  );
}