import type { FooterColumnType } from "./footer.types";

export const companyLinks: FooterColumnType = {
  title: "Company",
  links: [
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Our Process",
      href: "/process",
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ],
};

export const resourceLinks: FooterColumnType = {
  title: "Resources",
  links: [
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
  ],
};