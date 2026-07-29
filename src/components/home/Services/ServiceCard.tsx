import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { getServices } from "@/repositories/service.repository";

type ServiceItem = Awaited<ReturnType<typeof getServices>>[number];

type Props = {
  service: ServiceItem;
};

export default function ServiceCard({ service }: Props) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group overflow-hidden rounded-[28px] bg-white transition-all duration-500 hover:-translate-y-2 hover:bg-black hover:shadow-[0_25px_70px_rgba(0,0,0,0.18)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#ededed]">
        {service.image ? (
          <Image
            src={service.image}
            alt={`${service.name} service`}
            fill
            quality={95}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#8bea00] text-black transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight size={25} />
        </div>
      </div>

      <div className="flex min-h-[220px] flex-col justify-between p-8 sm:p-10">
        <div>
          <h3 className="text-2xl font-bold leading-tight text-[#202638] transition-colors group-hover:text-white">
            {service.name}
          </h3>

          <p className="mt-5 line-clamp-3 leading-7 text-gray-600 transition-colors group-hover:text-gray-300">
            {service.description}
          </p>
        </div>

        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black transition-colors group-hover:text-[#8bea00]">
          View service
          <ArrowUpRight size={17} />
        </span>
      </div>
    </Link>
  );
}