// "use client";

// import Link from "next/link";
// import { Menu, Search, ChevronDown } from "lucide-react";
// import { useState, useEffect } from "react";
// import Container from "@/components/layout/Container";

// const menu = [
//   {
//     title: "Home",
//     href: "/",
//     children: ["Home One", "Home Two"],
//   },
//   {
//     title: "Pages",
//     href: "#",
//     children: ["About", "Team", "Pricing", "FAQ"],
//   },
//   {
//     title: "Services",
//     href: "#",
//     children: ["Service", "Service Details"],
//   },
//   {
//     title: "Portfolio",
//     href: "#",
//     children: ["Portfolio", "Portfolio Details"],
//   },
//   {
//     title: "Blog",
//     href: "#",
//     children: ["Blog", "Blog Details"],
//   },
//   {
//     title: "Contact",
//     href: "/contact",
//   },
// ];

// export default function Navbar() {
//   const [sticky, setSticky] = useState(false);

//   useEffect(() => {
//     const scroll = () => setSticky(window.scrollY > 40);
//     window.addEventListener("scroll", scroll);
//     return () => window.removeEventListener("scroll", scroll);
//   }, []);

//   return (
//    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
//       <Container className="flex h-28 items-center justify-between">

//         <Link href="/">
//           <img
//             src="/assets/images/logo/01.svg"
//             alt="logo"
//             className="h-10 w-auto"
//           />
//         </Link>

//         <nav className="hidden xl:block">
//           <ul className="flex items-center gap-10">

//             {menu.map((item) => (
//               <li
//                 key={item.title}
//                 className="group relative"
//               >
//                 <Link
//                   href={item.href}
//                   className="flex items-center gap-1 text-[15px] font-bold uppercase tracking-[1px] text-white transition hover:text-lime-400"
//                 >
//                   {item.title}

//                   {item.children && (
//                     <ChevronDown
//                       size={16}
//                       className="transition group-hover:rotate-180"
//                     />
//                   )}
//                 </Link>

//                 {item.children && (
//                   <div className="absolute left-0 top-[55px] invisible min-w-[240px] translate-y-8 rounded-xl bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

//                     {item.children.map((child) => (
//                       <Link
//                         key={child}
//                         href="#"
//                         className="block border-b px-6 py-4 text-sm font-semibold transition hover:bg-lime-300"
//                       >
//                         {child}
//                       </Link>
//                     ))}

//                   </div>
//                 )}

//               </li>
//             ))}

//           </ul>
//         </nav>

//         <div className="flex items-center gap-5">

//           <button className="hidden lg:flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-lime-400 hover:text-lime-400">
//             <Search size={18} />
//           </button>

//           <Link
//             href="/contact"
//             className="hidden rounded-full bg-lime-400 px-8 py-4 text-sm font-bold uppercase text-black transition hover:scale-105 lg:inline-flex"
//           >
//             Let's Talk
//           </Link>

//           <button className="xl:hidden text-white">
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
import { ChevronDown, Menu, Search } from "lucide-react";

import Container from "@/components/layout/Container";

type MenuItem = {
  title: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
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
      { label: "Web Development", href: "/services/web-development" },
      { label: "UI/UX Design", href: "/services/ui-ux-design" },
      { label: "SEO Audit", href: "/services/seo-audit" },
      { label: "App Development", href: "/services/app-development" },
    ],
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "All Projects", href: "/portfolio" },
    ],
  },
  {
    title: "Blog",
    href: "/blog",
    children: [
      { label: "All Articles", href: "/blog" },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <Container className="flex h-28 items-center justify-between">
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/assets/images/logo/01.svg"
            alt="Agenio"
            width={170}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden xl:block" aria-label="Main navigation">
          <ul className="flex items-center gap-10">
            {menu.map((item) => (
              <li key={item.title} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-[15px] font-bold uppercase tracking-[1px] text-white transition-colors duration-300 hover:text-lime-400"
                >
                  {item.title}

                  {item.children && (
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute left-0 top-[42px] z-50 min-w-[250px] translate-y-4 overflow-hidden rounded-2xl border border-black/10 bg-white opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-lime-400 hover:text-lime-400 lg:flex"
          >
            <Search size={18} />
          </button>

          <Link
            href="/contact"
            className="hidden rounded-full bg-lime-400 px-8 py-4 text-sm font-bold uppercase text-black transition-transform duration-300 hover:scale-105 lg:inline-flex"
          >
            Let&apos;s Talk
          </Link>

          <button
            type="button"
            aria-label="Open mobile menu"
            className="text-white xl:hidden"
          >
            <Menu size={34} />
          </button>
        </div>
      </Container>
    </header>
  );
}