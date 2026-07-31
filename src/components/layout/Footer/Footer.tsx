import Link from "next/link";

import Container from "@/components/layout/Container";
import FooterColumn from "./FooterColumn";
import { companyLinks, resourceLinks } from "./footer.data";
import type {
  FooterColumnType,
  FooterData,
} from "./footer.types";

type FooterProps = {
  data: FooterData;
};

export default function Footer({ data }: FooterProps) {
  const serviceColumn: FooterColumnType = {
    title: "Services",
    links: data.services.map((service) => ({
      label: service.name,
      href: `/services/${service.slug}`,
    })),
  };

  const industryColumn: FooterColumnType = {
    title: "Industries",
    links: data.industries.map((industry) => ({
      label: industry.name,
      href: `/industries/${industry.slug}`,
    })),
  };

  const locationColumn: FooterColumnType = {
    title: "Locations",
    links: data.cities.map((city) => ({
      label: city.name,
      href: `/locations/${city.slug}`,
    })),
  };

  const columns = [
    companyLinks,
    serviceColumn,
    industryColumn,
    locationColumn,
    resourceLinks,
  ];

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-20">
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              column={column}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ABC Technologies. All rights
            reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-lime-400"
            >
              Privacy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-lime-400"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-lime-400"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}