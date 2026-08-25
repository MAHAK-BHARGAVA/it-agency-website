import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import FaqForm from "@/components/admin/faqs/FaqForm";

export default function NewFaqPage() {
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
          Add FAQ
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Create a frequently asked question and connect it with
          relevant services, industries and locations.
        </p>
      </div>

      <div className="mt-8">
        <FaqForm />
      </div>
    </div>
  );
}