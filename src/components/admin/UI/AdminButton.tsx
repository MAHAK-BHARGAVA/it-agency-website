import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

const styles = {
  primary:
    "bg-[#4648d4] text-white hover:bg-[#393bc7] hover:shadow-[0_12px_28px_rgba(70,72,212,0.2)]",
  secondary:
    "border border-[#d8d5e4] bg-white text-[#353541] hover:bg-[#f5f2fe]",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
};

export default function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}