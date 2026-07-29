import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function PrimaryButton({
  href,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-full bg-lime-400 px-8 py-5 text-sm font-bold uppercase tracking-[1px] text-black transition duration-300 hover:scale-105"
    >
      {children}
    </Link>
  );
}