import React from "react";

type EdgePriceSectionProps = {
  edgeFinishings: { id: string; name: string; pricePerLfm: number }[];
  onChangeEdgePrice: (edgeFinishingId: string, value: number) => void;
  onSave: () => void;
  isSaving: boolean;
};

function EdgePriceSectionComponent({
  edgeFinishings,
  onChangeEdgePrice,
  onSave,
  isSaving,
}: EdgePriceSectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Edge price per LFM</h2>
          <p className="mt-1 text-sm text-zinc-600">Edit prices by edge finishing.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {edgeFinishings.map((edge) => (
          <div key={edge.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-semibold text-zinc-900">{edge.name}</div>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">CHF</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                value={edge.pricePerLfm}
                onChange={(e) => onChangeEdgePrice(edge.id, Number(e.target.value))}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const EdgePriceSection = React.memo(EdgePriceSectionComponent);
