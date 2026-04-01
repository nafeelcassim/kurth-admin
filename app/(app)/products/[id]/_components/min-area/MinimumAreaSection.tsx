import React from "react";

import { SectionCard } from "../SectionCard";

type MinimumAreaSectionProps = {
  minimumAreaM2: number;
  onChangeMinimumAreaM2: (value: number) => void;
  onSave: () => void;
  isSaving: boolean;
};

function MinimumAreaSectionComponent({
  minimumAreaM2,
  onChangeMinimumAreaM2,
  onSave,
  isSaving,
}: MinimumAreaSectionProps) {
  return (
    <SectionCard
      title="Minimum area (m²)"
      description="This minimum area can be used when calculating final prices."
      rightSlot={
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      }
    >
      <div className="max-w-sm">
        <label className="text-sm font-semibold text-zinc-900">Minimum area (m²)</label>
        <div className="relative mt-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pr-12 pl-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
            value={minimumAreaM2}
            onChange={(e) => onChangeMinimumAreaM2(Number(e.target.value))}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
            m²
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

export const MinimumAreaSection = React.memo(MinimumAreaSectionComponent);
