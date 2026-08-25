import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import FaqForm from "@/components/admin/faqs/FaqForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditFaqPage({
  params,
}: Props) {
  const { id } = await params;
  const faqId = Number(id);

  if (!Number.isInteger(faqId) || faqId <= 0) {
    notFound();
  }

  const faq = await prisma.faq.findUnique({
    where: {
      id: faqId,
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

      states: {
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

  if (!faq) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#6466e8] transition hover:text-[#393bc7]"
      >
        <ArrowLeft size={16} />
        Back to FAQs
      </Link>

      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-600">
          FAQs
        </p>

        <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
          Edit FAQ
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Update the question, answer and its related pages.
        </p>
      </div>

      <div className="mt-8">
        <FaqForm
          initialData={{
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            services: faq.services,
            cities: faq.cities,
            states: faq.states,
            industries: faq.industries,
          }}
        />
      </div>
    </div>
  );
}