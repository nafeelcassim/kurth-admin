import React from "react";

type HoleThicknessId = string;
export type HoleDiameterRange = { key: string; min: number; max: number };
export type ThroughHoleCellValue = number | "";

type ThicknessColumn = { id: string; value: string };

type AddRangeResult = { ok: true } | { ok: false; message: string };

type ThroughHolePriceSectionProps = {
  diameterRanges: HoleDiameterRange[];
  thicknessColumns: ThicknessColumn[];
  effectivePrice: Record<string, Record<HoleThicknessId, ThroughHoleCellValue>>;
  hasNoPricing: boolean;
  hasPricingButNoRanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onChangeCell: (rangeKey: string, thicknessId: string, value: ThroughHoleCellValue) => void;
  onAddRange: (
    minDiameterMm: number,
    maxDiameterMm: number,
    pricesByThicknessId: Record<HoleThicknessId, ThroughHoleCellValue>,
  ) => AddRangeResult;
  onRemoveRange: (rangeKey: string) => void | Promise<void>;
};

function ThroughHolePriceSectionComponent({
  diameterRanges,
  thicknessColumns,
  effectivePrice,
  hasNoPricing,
  hasPricingButNoRanges,
  isSaving,
  onSave,
  onChangeCell,
  onAddRange,
  onRemoveRange,
}: ThroughHolePriceSectionProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [minDiameterMm, setMinDiameterMm] = React.useState<number | "">("");
  const [maxDiameterMm, setMaxDiameterMm] = React.useState<number | "">("");
  const [pricesByThicknessId, setPricesByThicknessId] = React.useState<
    Record<HoleThicknessId, ThroughHoleCellValue>
  >({});

  const handleAdd = React.useCallback(() => {
    const min = typeof minDiameterMm === "number" ? minDiameterMm : Number(minDiameterMm);
    const max = typeof maxDiameterMm === "number" ? maxDiameterMm : Number(maxDiameterMm);

    const result = onAddRange(min, max, pricesByThicknessId);
    if (!result.ok) return;

    setIsAddOpen(false);
    setMinDiameterMm("");
    setMaxDiameterMm("");
    setPricesByThicknessId({});
  }, [maxDiameterMm, minDiameterMm, onAddRange, pricesByThicknessId]);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Through-hole price</h2>
          <p className="mt-1 text-sm text-zinc-600">Edit prices by hole diameter range and thickness.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => setIsAddOpen((v) => !v)}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 sm:w-auto"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {isAddOpen && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-zinc-900">Min diameter (mm)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="mt-2 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                value={minDiameterMm}
                onChange={(e) =>
                  setMinDiameterMm(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-900">Max diameter (mm)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                className="mt-2 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                value={maxDiameterMm}
                onChange={(e) =>
                  setMaxDiameterMm(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Thickness
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Price per hole
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {thicknessColumns.map((t) => (
                  <tr key={`add-${t.id}`}>
                    <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-zinc-900">
                      {t.value} mm
                    </td>
                    <td className="px-3 py-2">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                          CHF
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          className="h-10 w-32 rounded-xl border border-zinc-200 bg-white pl-11 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                          value={pricesByThicknessId[t.id] ?? ""}
                          onChange={(e) =>
                            setPricesByThicknessId((prev) => ({
                              ...prev,
                              [t.id]: e.target.value === "" ? "" : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setMinDiameterMm("");
                setMaxDiameterMm("");
                setPricesByThicknessId({});
              }}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Add row
            </button>
          </div>
        </div>
      )}

      {hasNoPricing && (
        <p className="mt-3 text-sm text-zinc-600">No saved through-hole pricing rules found.</p>
      )}
      {hasPricingButNoRanges && <p className="mt-3 text-sm text-zinc-600">No diameter ranges found.</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Diameter
              </th>
              {thicknessColumns.map((t) => (
                <th
                  key={t.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700"
                >
                  {t.value} mm
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {diameterRanges.map((r) => (
              <tr key={r.key} className="hover:bg-zinc-50/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">{r.key}</td>
                {thicknessColumns.map((t) => (
                  <td key={`${r.key}-${t.id}`} className="px-4 py-3">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                        CHF
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        className="h-10 w-32 rounded-xl border border-zinc-200 bg-white pl-11 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                        value={effectivePrice[r.key]?.[t.id] ?? ""}
                        onChange={(e) =>
                          onChangeCell(
                            r.key,
                            t.id,
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      void onRemoveRange(r.key);
                    }}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const ThroughHolePriceSection = React.memo(ThroughHolePriceSectionComponent);
