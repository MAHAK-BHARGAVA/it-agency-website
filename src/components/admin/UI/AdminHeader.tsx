"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-black/5 bg-white/90 px-6 backdrop-blur-xl lg:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/35">
          Administration
        </p>

        <h2 className="mt-1 text-xl font-black text-black">
          Welcome back, Admin
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden h-11 items-center gap-2 rounded-full border border-black/10 px-4 text-sm text-black/50 transition hover:border-black/20 md:flex">
          <Search size={17} />
          Search
        </button>

        <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-lime-500" />
        </button>

        <div className="ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-black text-lime-400">
          A
        </div>
      </div>
    </header>
  );
}