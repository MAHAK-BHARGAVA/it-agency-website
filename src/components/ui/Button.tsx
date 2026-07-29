import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";

  const styles = {
    primary:
      "bg-white text-black hover:bg-orange-500 hover:text-white",
    secondary:
      "border border-white/30 text-white hover:border-orange-500 hover:text-orange-500",
  };

  return (
    <Link
      href={href}
      className={cn(base, styles[variant], className)}
    >
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}