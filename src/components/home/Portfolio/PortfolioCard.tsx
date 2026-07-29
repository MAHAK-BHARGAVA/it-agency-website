import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Portfolio } from "@/generated/prisma/client";

type Props = {
  project: Portfolio;
};

export default function PortfolioCard({ project }: Props) {
  const imageSrc =
    project.thumbnail?.trim() ||
    "/assets/images/banner/center-hero.webp";

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-[32px] bg-[#141414]"
    >
      <div className="relative h-[300px] overflow-hidden sm:h-[380px] lg:h-[440px]">
        <Image
          src={imageSrc}
          alt={project.projectName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex items-center justify-between gap-6 p-6 sm:p-8">
        <div>
          <h3 className="text-3xl font-black text-white">
            {project.projectName}
          </h3>

          <p className="mt-4 line-clamp-2 text-gray-400">
            {project.resultSummary}
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime-400">
          <ArrowUpRight className="text-black" />
        </div>
      </div>
    </Link>
  );
}
