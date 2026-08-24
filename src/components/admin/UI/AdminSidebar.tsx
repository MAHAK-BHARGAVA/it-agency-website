"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Wrench,
  BriefcaseBusiness,
  Newspaper,
  MessageSquareQuote,
  CircleHelp,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Inbox,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    name: "Portfolio",
    href: "/admin/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: Newspaper,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "FAQs",
    href: "/admin/faqs",
    icon: CircleHelp,
  },
  {
    name: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[270px] border-r border-white/10 bg-[#090909] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-24 items-center border-b border-white/10 px-8">
        <Link href="/admin">
          <span className="text-xl font-black uppercase tracking-tight text-white">
            ABC
            <span className="text-lime-400"> Admin</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/30">
          Management
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                  active
                    ? "bg-lime-400 text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? "text-black"
                      : "text-white/40 transition group-hover:text-lime-400"
                  }
                />

                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-white/50 transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}