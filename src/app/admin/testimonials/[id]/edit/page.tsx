import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTestimonialPage({
  params,
}: Props) {
  const { id } = await params;
  const testimonialId = Number(id);

  if (!Number.isInteger(testimonialId) || testimonialId <= 0) {
    notFound();
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: {
      id: testimonialId,
    },
    include: {
      services: {
        select: {
          id: true,
          name: true,
        },
      },
      cities: {
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

  if (!testimonial) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft size={16} />
        Back to Testimonials
      </Link>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          Testimonials
        </p>

        <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
          Edit Testimonial
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Update client feedback, rating, photo and related content.
        </p>
      </div>

      <div className="mt-8">
        <TestimonialForm
          initialData={{
            id: testimonial.id,
            clientName: testimonial.clientName,
            company: testimonial.company,
            quote: testimonial.quote,
            rating: testimonial.rating,
            photo: testimonial.photo,
            services: testimonial.services,
            cities: testimonial.cities,
            industries: testimonial.industries,
          }}
        />
      </div>
    </div>
  );
}