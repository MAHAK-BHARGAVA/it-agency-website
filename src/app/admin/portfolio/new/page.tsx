import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PortfolioForm from "@/components/admin/portfolio/PortfolioForm";

export default function NewPortfolioPage() {
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
          Add Project
        </h1>

        <p className="mt-2 text-sm text-black/50">
          Create a new portfolio project and connect it with services,
          industries and an optional testimonial.
        </p>
      </div>

      <div className="mt-8">
        <PortfolioForm />
      </div>
    </div>
  );
}