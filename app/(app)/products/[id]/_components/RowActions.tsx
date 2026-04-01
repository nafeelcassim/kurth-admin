import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

type RowActionsProps = {
  onUpdate: () => void;
  onDelete: () => void;
};

export function RowActions({ onUpdate, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onUpdate}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
        aria-label="Update"
        title="Update"
      >
        <Pencil1Icon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-red-600 transition hover:bg-red-50"
        aria-label="Delete"
        title="Delete"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
