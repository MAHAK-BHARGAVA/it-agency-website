"use client";

import Link from "next/link";
import type { FooterColumn as Column } from "./footer.types";

type Props = {
  column: Column;
};

export default function FooterColumn({ column }: Props) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white">
        {column.title}
      </h3>

      <ul className="mt-6 space-y-4">
        {column.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-white/60 transition hover:text-lime-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}