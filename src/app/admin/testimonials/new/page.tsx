import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";

export default function NewTestimonialPage() {
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
          Add Testimonial
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Add client feedback and connect it with relevant services,
          industries and cities.
        </p>
      </div>

      <div className="mt-8">
        <TestimonialForm />
      </div>
    </div>
  );
}