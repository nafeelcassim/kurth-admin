import type { ReactNode } from "react";

import { SectionCard } from "../SectionCard";
import { BasicTable } from "../BasicTable";
import { RowActions } from "../RowActions";

export type EdgeFinishingRow = {
  id: string;
  name: string;
  pricePerLfm: number;
  minLengthLfm: number;
  isActive: boolean;
};

type EdgeFinishingSectionProps = {
  data: EdgeFinishingRow[];
  addTrigger?: ReactNode;
  onAdd?: () => void;
  onUpdate?: (row: EdgeFinishingRow) => void;
  onDelete?: (row: EdgeFinishingRow) => void;
  renderActions?: (row: EdgeFinishingRow) => ReactNode;
};

export function EdgeFinishingSection({
  data,
  addTrigger,
  onAdd,
  onUpdate,
  onDelete,
  renderActions,
}: EdgeFinishingSectionProps) {
  return (
    <SectionCard
      title="Edge Finishing"
      description="Available edge finishing options."
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
        headers={["Name", "Price / LFM","Status", "Min Length/ LFM",]}
        rows={data.map((r) => [
          r.name,
          Number(r.pricePerLfm).toFixed(2),
          <span
            key={`${r.id}-status`}
            className={
              "inline-flex rounded-full px-2 py-1 text-xs font-semibold " +
              (r.isActive ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-700")
            }
          >
            {r.isActive ? "Active" : "Inactive"}
          </span>,
          r.minLengthLfm,
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
