import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export function SectionCard({ title, description, children, rightSlot }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
        </div>
        {rightSlot ? <div className="flex items-center gap-3">{rightSlot}</div> : null}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}
