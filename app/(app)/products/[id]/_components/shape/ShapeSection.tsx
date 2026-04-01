import { SectionCard } from "../SectionCard";
import { BasicTable } from "../BasicTable";
import { RowActions } from "../RowActions";

export type ShapeRow = {
  id: string;
  shape: string;
  priceMultiplier: number | null;
  isActive: boolean;
};

type ShapeSectionProps = {
  data: ShapeRow[];
  addTrigger?: React.ReactNode;
  onAdd?: () => void;
  onUpdate?: (row: ShapeRow) => void;
  onDelete?: (row: ShapeRow) => void;
  renderActions?: (row: ShapeRow) => React.ReactNode;
};

export function ShapeSection({
  data,
  addTrigger,
  onAdd,
  onUpdate,
  onDelete,
  renderActions,
}: ShapeSectionProps) {
  return (
    <SectionCard
      title="Shape"
      description="Available product shapes."
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
        headers={["Name", "Price Multiplier", "Status"]}
        rows={data.map((r) => [
          r.shape,
          r.priceMultiplier ?? "-",
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
