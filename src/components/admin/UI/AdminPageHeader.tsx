import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#1b1b23]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}