import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/services/ServiceForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({
  params,
}: Props) {
  const { id } = await params;
  const serviceId = Number(id);

  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    notFound();
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft size={16} />
        Back to Services
      </Link>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          Services
        </p>

        <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
          Edit Service
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Update service content, imagery and search engine
          information.
        </p>
      </div>

      <div className="mt-8">
        <ServiceForm
          initialData={{
            id: service.id,
            name: service.name,
            slug: service.slug,
            description: service.description,
            image: service.image,
            metaTitle: service.metaTitle,
            metaDescription: service.metaDescription,
            canonicalUrl: service.canonicalUrl,
            ogImage: service.ogImage,
          }}
        />
      </div>
    </div>
  );
}