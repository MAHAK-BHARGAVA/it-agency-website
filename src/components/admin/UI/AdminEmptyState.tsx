import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description: string;
};

export default function AdminEmptyState({
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece8ff] text-[#4648d4]">
          {icon}
        </div>
      )}

      <h3 className="mt-4 text-base font-semibold text-[#1b1b23]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7280]">
        {description}
      </p>
    </div>
  );
}