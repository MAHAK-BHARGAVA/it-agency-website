import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AdminCard({
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-2xl border border-[#e4e2f0] bg-white shadow-[0_8px_30px_rgba(36,32,74,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}