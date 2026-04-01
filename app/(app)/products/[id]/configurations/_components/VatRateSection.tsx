import React from "react";

type VatRateSectionProps = {
  vatRate: number;
  onChangeVatRate: (value: number) => void;
  onSave: () => void;
  isSaving: boolean;
};

function VatRateSectionComponent({
  vatRate,
  onChangeVatRate,
  onSave,
  isSaving,
}: VatRateSectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">VAT rate</h2>
          <p className="mt-1 text-sm text-zinc-600">
            This VAT rate can be used when calculating final prices.
          </p>
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
      <div className="mt-4 max-w-sm">
        <label className="text-sm font-semibold text-zinc-900">VAT (%)</label>
        <div className="relative mt-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pr-10 pl-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
            value={vatRate}
            onChange={(e) => onChangeVatRate(Number(e.target.value))}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
            %
          </span>
        </div>
      </div>
    </section>
  );
}

export const VatRateSection = React.memo(VatRateSectionComponent);
