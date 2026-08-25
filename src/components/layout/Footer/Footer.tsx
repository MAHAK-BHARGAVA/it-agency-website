import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import Container from "@/components/layout/Container";
import FooterColumn from "./FooterColumn";
import { companyLinks, resourceLinks } from "./footer.data";
import type {
  FooterColumnType,
  FooterData,
} from "./footer.types";

type SiteSettings = {
  companyName: string;
  footerCopyright: string | null;

  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  youtube: string | null;

  phone: string;
  email: string;
  address: string;
};

type FooterProps = {
  data: FooterData;
  settings: SiteSettings;
};

export default function Footer({
  data,
  settings,
}: FooterProps) {
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
        {/* ================= CONTACT + SOCIAL SECTION ================= */}

        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          {/* Company Information */}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-lime-400">
              Get In Touch
            </p>

            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              {settings.companyName}
            </h2>

            <div className="mt-7 space-y-4">
              {/* Phone */}

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-lime-400"
                >
                  <Phone className="h-4 w-4 shrink-0" />

                  <span>{settings.phone}</span>
                </a>
              )}

              {/* Email */}

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-lime-400"
                >
                  <Mail className="h-4 w-4 shrink-0" />

                  <span>{settings.email}</span>
                </a>
              )}

              {/* Address */}

              {settings.address && (
                <div className="flex max-w-md items-start gap-3 text-sm leading-6 text-white/60">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" />

                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}

          <div className="lg:text-right">
            <p className="text-sm font-bold text-white">
              Follow us
            </p>

            <div className="mt-4 flex flex-wrap gap-3 lg:justify-end">
              {settings.facebook && (
                <SocialLink
                  href={settings.facebook}
                  label="Facebook"
                  icon={<FaFacebookF size={18} />}
                />
              )}

              {settings.instagram && (
                <SocialLink
                  href={settings.instagram}
                  label="Instagram"
                  icon={<FaInstagram size={18} />}
                />
              )}

              {settings.linkedin && (
                <SocialLink
                  href={settings.linkedin}
                  label="LinkedIn"
                  icon={<FaLinkedinIn size={18} />}
                />
              )}

              {settings.twitter && (
                <SocialLink
                  href={settings.twitter}
                  label="Twitter"
                  icon={<FaXTwitter size={18} />}
                />
              )}

              {settings.youtube && (
                <SocialLink
                  href={settings.youtube}
                  label="YouTube"
                  icon={<FaYoutube size={18} />}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================= FOOTER NAVIGATION ================= */}

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-20">
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              column={column}
            />
          ))}
        </div>

        {/* ================= BOTTOM FOOTER ================= */}

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {settings.footerCopyright ||
              `© ${new Date().getFullYear()} ${settings.companyName}. All rights reserved.`}
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

/* ================= SOCIAL BUTTON ================= */

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-lime-400 hover:bg-lime-400 hover:text-black"
    >
      {icon}
    </a>
  );
}
