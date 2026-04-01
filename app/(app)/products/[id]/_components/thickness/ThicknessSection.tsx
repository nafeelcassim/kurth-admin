import type { ReactNode } from "react";

import { SectionCard } from "../SectionCard";
import { BasicTable } from "../BasicTable";
import { RowActions } from "../RowActions";

export type ThicknessRow = {
  id: string;
  value: string;
  isActive: boolean;
};

type ThicknessSectionProps = {
  data: ThicknessRow[];
  addTrigger?: ReactNode;
  onAdd?: () => void;
  onUpdate?: (row: ThicknessRow) => void;
  onDelete?: (row: ThicknessRow) => void;
  renderActions?: (row: ThicknessRow) => ReactNode;
};

export function ThicknessSection({
  data,
  addTrigger,
  onAdd,
  onUpdate,
  onDelete,
  renderActions,
}: ThicknessSectionProps) {
  return (
    <SectionCard
      title="Thickness"
      description="Supported thickness values for this product."
      rightSlot={
        addTrigger ?? (
          <button
            type="button"
            onClick={onAdd}
            className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
          >
            Add
          </button>
        )
      }
    >
      <BasicTable
        headers={["Thickness", "Status"]}
        rows={data.map((r) => [
          r.value,
          <span
            key={`${r.id}-status`}
            className={
              "inline-flex rounded-full px-2 py-1 text-xs font-semibold " +
              (r.isActive
                ? "bg-green-100 text-green-700"
                : "bg-zinc-100 text-zinc-700")
            }
          >
            {r.isActive ? "Active" : "Inactive"}
          </span>,
        ])}
        actions={data.map((r) =>
          renderActions ? (
            <span key={`${r.id}-actions`}>{renderActions(r)}</span>
          ) : (
            <RowActions
              key={`${r.id}-actions`}
              onUpdate={() => onUpdate?.(r)}
              onDelete={() => onDelete?.(r)}
            />
          )
        )}
      />
    </SectionCard>
  );
}
