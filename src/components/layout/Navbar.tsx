"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import Container from "@/components/layout/Container";

type MenuItem = {
  title: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

type SiteSettings = {
  companyName: string;
  logo: string;
  whiteLogo: string | null;
};

type NavbarProps = {
  settings: SiteSettings;
};

const menu: MenuItem[] = [
  { title: "Home", href: "/" },
  {
    title: "Pages",
    href: "#",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      {
        label: "AI & Business Automation",
        href: "/services/ai-business-automation",
      },
      {
        label: "Branding & Graphic Design",
        href: "/services/branding-graphic-design",
      },
      {
        label: "Digital Marketing & Paid Advertising",
        href: "/services/digital-marketing-paid-advertising",
      },
      {
        label: "E-Commerce Development",
        href: "/services/e-commerce-development",
      },
      {
        label: "Influencer & Creator Marketing",
        href: "/services/influencer-creator-marketing",
      },
      {
        label: "IT Support & Cloud Solutions",
        href: "/services/it-support-cloud-solutions",
      },
      {
        label: "Marketing Automation & CRM",
        href: "/services/marketing-automation-crm",
      },
      {
        label: "Photography & Video Production",
        href: "/services/photography-video-production",
      },
      {
        label: "SEO & Content Marketing",
        href: "/services/seo-content-marketing",
      },
      {
        label: "Social Media Management",
        href: "/services/social-media-management",
      },
      {
        label: "Software & Mobile App Development",
        href: "/services/software-mobile-app-development",
      },
      {
        label: "Website Design & Development",
        href: "/services/website-design-development",
      },
    ],
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    children: [{ label: "All Projects", href: "/portfolio" }],
  },
  {
    title: "Blog",
    href: "/blog",
    children: [{ label: "All Articles", href: "/blog" }],
  },
  { title: "Contact", href: "/contact" },
];

export default function Navbar({ settings }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    null,
  );

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between sm:h-24 lg:h-28">
        <Link
          href="/"
          aria-label={`${settings.companyName || "Soclthry"} homepage`}
          onClick={closeMobileMenu}
          className="flex min-w-0 shrink items-center"
        >
          <Image
            src="/assets/images/logo/soclthry-navbar.png"
            alt={settings.companyName || "Soclthry"}
            width={220}
            height={60}
            priority
            className="h-9 w-auto max-w-[180px] object-contain sm:h-10 sm:max-w-[220px]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden xl:block" aria-label="Main navigation">
          <ul className="flex items-center gap-8 2xl:gap-10">
            {menu.map((item) => (
              <li key={item.title} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 whitespace-nowrap text-[14px] font-bold uppercase tracking-[1px] text-white transition-colors duration-300 hover:text-lime-400"
                >
                  {item.title}
                  {item.children && (
                    <ChevronDown
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute left-0 top-[38px] z-50 w-[320px] translate-y-3 overflow-hidden rounded-2xl border border-black/10 bg-white opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="navbar-dropdown-scroll max-h-[420px] overflow-y-auto overscroll-contain">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block border-b border-black/5 px-6 py-4 text-sm font-semibold text-black transition-colors duration-300 last:border-b-0 hover:bg-lime-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA and mobile menu toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-300 lg:inline-flex"
          >
            Let's Talk
          </Link>

          <button
            type="button"
            aria-label={
              isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-lime-400 xl:hidden"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={30} />}
          </button>
        </div>
      </Container>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-black shadow-2xl xl:hidden"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-4 sm:px-8">
            <ul className="divide-y divide-white/10">
              {menu.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = openMobileSection === item.title;

                return (
                  <li key={item.title} className="py-1">
                    <div className="flex min-h-12 items-center justify-between gap-3">
                      {item.href !== "#" ? (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-lime-400"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="flex-1 py-3 text-sm font-bold uppercase tracking-wider text-white">
                          {item.title}
                        </span>
                      )}

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.title}`}
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setOpenMobileSection(isExpanded ? null : item.title)
                          }
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 hover:text-lime-400"
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && isExpanded && (
                      <ul className="mb-3 ml-3 border-l border-lime-400/40 pl-4">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={closeMobileMenu}
                              className="block rounded-md px-3 py-3 text-sm leading-5 text-white/75 transition-colors hover:bg-white/5 hover:text-lime-400"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-lime-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-lime-300"
            >
              Let's Talk
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
