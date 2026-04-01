import React from "react";

type PricePerM2SectionProps = {
  glassTypes: { id: string; name: string, translations: { language: string; name: string }[] }[];
  thicknesses: { id: string; value: string }[];
  pricePerM2: Record<string, Record<string, number | "">>;
  onChangeCell: (glassTypeId: string, thicknessId: string, value: number | "") => void;
  onSave: () => void;
  isSaving: boolean;
};

function PricePerM2SectionComponent({
  glassTypes,
  thicknesses,
  pricePerM2,
  onChangeCell,
  onSave,
  isSaving,
}: PricePerM2SectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Price per m²</h2>
          <p className="mt-1 text-sm text-zinc-600">Edit prices by glass type and thickness.(-1 means not available)</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Glass type
              </th>
              {thicknesses.map((t) => (
                <th
                  key={t.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700"
                >
                  {t.value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {glassTypes.map((gt) => (
              <tr key={gt.id} className="hover:bg-zinc-50/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">{gt.translations?.find((t) => t.language === "en")?.name}</td>
                {thicknesses.map((t) => (
                  <td key={`${gt.id}-${t.id}`} className="px-4 py-3">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                        CHF
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        className="h-10 w-32 rounded-xl border border-zinc-200 bg-white pl-11 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-950/10"
                        value={pricePerM2[gt.id]?.[t.id] ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          onChangeCell(gt.id, t.id, raw === "" ? "" : Number(raw));
                        }}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const PricePerM2Section = React.memo(PricePerM2SectionComponent);
