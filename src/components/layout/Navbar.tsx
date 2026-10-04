// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ChevronDown, Menu} from "lucide-react";

// import Container from "@/components/layout/Container";

// type MenuItem = {
//   title: string;
//   href: string;
//   children?: {
//     label: string;
//     href: string;
//   }[];
// };

// type SiteSettings = {
//   companyName: string;
//   logo: string;
//   whiteLogo: string | null;
// };

// type NavbarProps = {
//   settings: SiteSettings;
// };

// const menu: MenuItem[] = [
//   {
//     title: "Home",
//     href: "/",
//   },

//   {
//     title: "Pages",
//     href: "#",
//     children: [
//       { label: "About Us", href: "/about" },
//       { label: "Testimonials", href: "/testimonials" },
//       { label: "FAQ", href: "/faq" },
//     ],
//   },

//   {
//     title: "Services",
//     href: "/services",
//     children: [
//       { label: "All Services", href: "/services" },

//       {
//         label: "AI & Business Automation",
//         href: "/services/ai-business-automation",
//       },
//       {
//         label: "Branding & Graphic Design",
//         href: "/services/branding-graphic-design",
//       },
//       {
//         label: "Digital Marketing & Paid Advertising",
//         href: "/services/digital-marketing-paid-advertising",
//       },
//       {
//         label: "E-Commerce Development",
//         href: "/services/e-commerce-development",
//       },
//       {
//         label: "Influencer & Creator Marketing",
//         href: "/services/influencer-creator-marketing",
//       },
//       {
//         label: "IT Support & Cloud Solutions",
//         href: "/services/it-support-cloud-solutions",
//       },
//       {
//         label: "Marketing Automation & CRM",
//         href: "/services/marketing-automation-crm",
//       },
//       {
//         label: "Photography & Video Production",
//         href: "/services/photography-video-production",
//       },
//       {
//         label: "SEO & Content Marketing",
//         href: "/services/seo-content-marketing",
//       },
//       {
//         label: "Social Media Management",
//         href: "/services/social-media-management",
//       },
//       {
//         label: "Software & Mobile App Development",
//         href: "/services/software-mobile-app-development",
//       },
//       {
//         label: "Website Design & Development",
//         href: "/services/website-design-development",
//       },
//     ],
//   },

//   {
//     title: "Portfolio",
//     href: "/portfolio",
//     children: [{ label: "All Projects", href: "/portfolio" }],
//   },

//   {
//     title: "Blog",
//     href: "/blog",
//     children: [{ label: "All Articles", href: "/blog" }],
//   },

//   {
//     title: "Contact",
//     href: "/contact",
//   },
// ];

// export default function Navbar({ settings }: NavbarProps) {
//   return (
//     <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
//       <Container className="flex h-28 items-center justify-between">
//         {/* Logo */}
//         <Link href="/" aria-label="Go to homepage">
//           <Image
//             src={
//               settings.whiteLogo?.trim() ||
//               settings.logo?.trim() ||
//               "/assets/images/logo/01.svg"
//             }
//             alt={settings.companyName || "Soclthry"}
//             width={170}
//             height={48}
//             priority
//             className="h-10 w-auto"
//           />
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden xl:block" aria-label="Main navigation">
//           <ul className="flex items-center gap-10">
//             {menu.map((item) => (
//               <li key={item.title} className="group relative">
//                 {/* Main menu item */}
//                 <Link
//                   href={item.href}
//                   className="flex items-center gap-1.5 text-[15px] font-bold uppercase tracking-[1px] text-white transition-colors duration-300 hover:text-lime-400"
//                 >
//                   {item.title}

//                   {item.children && (
//                     <ChevronDown
//                       size={16}
//                       className="transition-transform duration-300 group-hover:rotate-180"
//                     />
//                   )}
//                 </Link>

//                 {/* Dropdown */}
//                 {item.children && (
//                   <div className="invisible absolute left-0 top-[42px] z-50 w-[320px] translate-y-4 overflow-hidden rounded-2xl border border-black/10 bg-white opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
//                     <div className="navbar-dropdown-scroll max-h-[420px] overflow-y-auto overscroll-contain">
//                       {item.children.map((child) => (
//                         <Link
//                           key={child.href}
//                           href={child.href}
//                           className="block border-b border-black/5 px-6 py-4 text-sm font-semibold text-black transition-colors duration-300 last:border-b-0 hover:bg-lime-400"
//                         >
//                           {child.label}
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Right Actions */}
//         <div className="flex items-center gap-5">


//           <Link
//             href="/contact"
//             className="hidden rounded-full bg-lime-400 px-8 py-4 text-sm font-bold uppercase text-black transition-transform duration-300 hover:scale-105 lg:inline-flex"
//           >
//             Let&apos;s Talk
//           </Link>

//           <button
//             type="button"
//             aria-label="Open mobile menu"
//             className="text-white xl:hidden"
//           >
//             <Menu size={34} />
//           </button>
//         </div>
//       </Container>
//     </header>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

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
  {
    title: "Home",
    href: "/",
  },

  {
    title: "Pages",
    href: "#",
    children: [
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Testimonials",
        href: "/testimonials",
      },
      {
        label: "FAQ",
        href: "/faq",
      },
    ],
  },

  {
    title: "Services",
    href: "/services",
    children: [
      {
        label: "All Services",
        href: "/services",
      },
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
    children: [
      {
        label: "All Projects",
        href: "/portfolio",
      },
    ],
  },

  {
    title: "Blog",
    href: "/blog",
    children: [
      {
        label: "All Articles",
        href: "/blog",
      },
    ],
  },

  {
    title: "Contact",
    href: "/contact",
  },
];

export default function Navbar({
  settings,
}: NavbarProps) {
  /*
   * BLACK NAVBAR
   * Prefer the white/light version of Soclthry logo.
   *
   * If whiteLogo is not available, fallback to the
   * normal logo and finally to the local logo path.
   */
const navbarLogo =
  settings.whiteLogo?.trim() ||
  settings.logo?.trim() ||
  "/assets/images/logo/it_agency_logo3.png";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <Container className="flex h-24 items-center justify-between lg:h-28">
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href="/"
          aria-label={`${settings.companyName || "Soclthry"} homepage`}
          className="flex shrink-0 items-center"
        >
          <Image
  src="/assets/images/logo/soclthry-navbar.png"
  alt="Soclthry"
  width={220}
  height={60}
  priority
  className="h-10 w-auto object-contain"
/>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav
          className="hidden xl:block"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-8 2xl:gap-10">
            {menu.map((item) => (
              <li
                key={item.title}
                className="group relative"
              >
                {/* Main menu item */}

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

                {/* =================================================
                    DROPDOWN
                ================================================= */}

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

        {/* =====================================================
            RIGHT ACTIONS
        ===================================================== */}

        <div className="flex items-center gap-4">
          {/* Let's Talk */}

          <Link
            href="/contact"
            className="hidden rounded-full bg-lime-400 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-[0_12px_35px_rgba(163,230,53,0.25)] lg:inline-flex"
          >
            Let&apos;s Talk
          </Link>

          {/* Mobile menu button */}

          <button
            type="button"
            aria-label="Open mobile menu"
            className="flex items-center justify-center text-white transition-colors duration-300 hover:text-lime-400 xl:hidden"
          >
            <Menu
              size={32}
              strokeWidth={2}
            />
          </button>
        </div>
      </Container>
    </header>
  );
}