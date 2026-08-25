import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ServiceForm from "@/components/admin/services/ServiceForm";

export default function NewServicePage() {
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
          Add Service
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Create a new service page with content, image and SEO
          information.
        </p>
      </div>

      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}