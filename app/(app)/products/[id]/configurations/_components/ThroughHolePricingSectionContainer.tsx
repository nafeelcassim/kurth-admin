import React from "react";

import { useToast } from "@/components/core/Toast/ToastProvider";
import {
  useBulkDeleteHolePricing,
  useBulkUpsertHolePricing,
  useDeleteHolePricing,
  useHolePricing,
  useThicknesses,
} from "@/hooks/api";
import type { BulkUpsertHolePricingItem } from "@/models/hole-pricing";

import { ThroughHolePriceSection } from "./ThroughHolePriceSection";

type HoleThicknessId = string;
type HoleDiameterRangeKey = string;
type ThroughHoleCellValue = number | "";

type ThroughHoleEditsState = Partial<
  Record<HoleDiameterRangeKey, Partial<Record<HoleThicknessId, ThroughHoleCellValue>>>
>;

type ThroughHolePricingSectionContainerProps = {
  productId: string;
};

function buildEmptyThroughHolePrice(
  rangeKeys: HoleDiameterRangeKey[],
  thicknessIds: HoleThicknessId[],
): Record<HoleDiameterRangeKey, Record<HoleThicknessId, ThroughHoleCellValue>> {
  const grid: Record<HoleDiameterRangeKey, Record<HoleThicknessId, ThroughHoleCellValue>> = {};
  for (const rangeKey of rangeKeys) {
    grid[rangeKey] = {};
    for (const thicknessId of thicknessIds) {
      grid[rangeKey][thicknessId] = "";
    }
  }
  return grid;
}

export function ThroughHolePricingSectionContainer({
  productId,
}: ThroughHolePricingSectionContainerProps) {
  const { toast } = useToast();

  const bulkUpsertHolePricingMutation = useBulkUpsertHolePricing();
  const bulkDeleteHolePricingMutation = useBulkDeleteHolePricing();
  const deleteHolePricingMutation = useDeleteHolePricing();

  const { data: thicknesses } = useThicknesses();
  const { data: holePricing } = useHolePricing(productId);

  const [throughHoleEdits, setThroughHoleEdits] = React.useState<ThroughHoleEditsState>({});
  const [removedThroughHoleRangeKeys, setRemovedThroughHoleRangeKeys] = React.useState<
    Record<HoleDiameterRangeKey, true>
  >({});

  const productThicknessColumns = React.useMemo(
    () =>
      (thicknesses ?? [])
        .filter((t) => t.productId === productId)
        .slice()
        .sort((a, b) => {
          const an = Number(String(a.value).replace(/[^0-9.]/g, ""));
          const bn = Number(String(b.value).replace(/[^0-9.]/g, ""));
          if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
          return String(a.value).localeCompare(String(b.value));
        }),
    [thicknesses, productId],
  );

  const productThicknessIds = React.useMemo(
    () => productThicknessColumns.map((t) => t.id),
    [productThicknessColumns],
  );

  const diameterRanges = React.useMemo(() => {
    const rows = holePricing ?? [];
    const byKey = new Map<string, { key: string; min: number; max: number }>();
    const removedKeySet = new Set(Object.keys(removedThroughHoleRangeKeys));

    for (const rangeKey of Object.keys(throughHoleEdits)) {
      if (removedKeySet.has(rangeKey)) continue;
      const [minStr, maxStr] = rangeKey.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);
      if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
      if (!byKey.has(rangeKey)) byKey.set(rangeKey, { key: rangeKey, min, max });
    }

    for (const row of rows) {
      const min = Number(row.minDiameterMm);
      const max = Number(row.maxDiameterMm);
      if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
      const key = `${min}-${max}`;
      if (removedKeySet.has(key)) continue;
      if (!byKey.has(key)) byKey.set(key, { key, min, max });
    }

    return Array.from(byKey.values()).sort((a, b) =>
      a.min !== b.min ? a.min - b.min : a.max - b.max,
    );
  }, [holePricing, removedThroughHoleRangeKeys, throughHoleEdits]);

  const diameterRangeKeys = React.useMemo(
    () => diameterRanges.map((r) => r.key),
    [diameterRanges],
  );

  const effectiveThroughHolePrice = React.useMemo(() => {
    const validThicknessIdSet = new Set(productThicknessIds);
    const validRangeKeySet = new Set(diameterRangeKeys);
    const merged = buildEmptyThroughHolePrice(diameterRangeKeys, productThicknessIds);

    for (const row of holePricing ?? []) {
      const rangeKey = `${row.minDiameterMm}-${row.maxDiameterMm}`;
      if (!validRangeKeySet.has(rangeKey) || !validThicknessIdSet.has(row.thicknessId)) continue;
      const apiValue = Number(row.pricePerHole);
      merged[rangeKey][row.thicknessId] = Number.isFinite(apiValue) ? apiValue : "";
    }

    for (const rangeKey of diameterRangeKeys) {
      const rangeEdits = throughHoleEdits[rangeKey];
      if (!rangeEdits) continue;
      for (const thicknessId of productThicknessIds) {
        const next = rangeEdits[thicknessId];
        if (next === "" || (typeof next === "number" && Number.isFinite(next))) {
          merged[rangeKey][thicknessId] = next;
        }
      }
    }

    return merged;
  }, [diameterRangeKeys, holePricing, productThicknessIds, throughHoleEdits]);

  const hasNoPricing = Array.isArray(holePricing) && holePricing.length === 0;
  const hasPricingButNoRanges =
    Array.isArray(holePricing) && holePricing.length > 0 && diameterRanges.length === 0;

  const setThroughHolePrice = React.useCallback(
    (rangeKey: HoleDiameterRangeKey, thicknessId: HoleThicknessId, value: ThroughHoleCellValue) =>
      setThroughHoleEdits((prev) => ({
        ...prev,
        [rangeKey]: { ...(prev[rangeKey] ?? {}), [thicknessId]: value },
      })),
    [],
  );

  const addThroughHoleRange = React.useCallback(
    (
      minDiameterMm: number,
      maxDiameterMm: number,
      pricesByThicknessId: Record<HoleThicknessId, ThroughHoleCellValue>,
    ): { ok: true } | { ok: false; message: string } => {
      if (productThicknessIds.length === 0) {
        return { ok: false, message: "No thicknesses found for this product" };
      }
      if (!Number.isFinite(minDiameterMm) || !Number.isFinite(maxDiameterMm)) {
        return { ok: false, message: "Min and max diameter must be valid numbers" };
      }
      if (minDiameterMm >= maxDiameterMm) {
        return { ok: false, message: "Min diameter must be smaller than max diameter" };
      }

      const rangeKey = `${minDiameterMm}-${maxDiameterMm}`;

      setRemovedThroughHoleRangeKeys((prev) => {
        if (!prev[rangeKey]) return prev;
        const next = { ...prev };
        delete next[rangeKey];
        return next;
      });

      setThroughHoleEdits((prev) => {
        const next: ThroughHoleEditsState = {
          ...prev,
          [rangeKey]: { ...(prev[rangeKey] ?? {}) },
        };
        for (const thicknessId of productThicknessIds) {
          const v = pricesByThicknessId[thicknessId];
          if (v === "" || (typeof v === "number" && Number.isFinite(v))) {
            next[rangeKey] = { ...(next[rangeKey] ?? {}), [thicknessId]: v };
          }
        }
        return next;
      });

      return { ok: true };
    },
    [productThicknessIds],
  );

  const handleSaveThroughHolePrice = React.useCallback(() => {
    if (productThicknessIds.length === 0) {
      toast("No thicknesses found for this product", { variant: "error" });
      return;
    }
    if (diameterRangeKeys.length === 0) {
      toast("No diameter ranges found for this product", { variant: "error" });
      return;
    }

    const items: BulkUpsertHolePricingItem[] = [];

    for (const rangeKey of diameterRangeKeys) {
      const [minStr, maxStr] = rangeKey.split("-");
      const minDiameterMm = Number(minStr);
      const maxDiameterMm = Number(maxStr);

      for (const thicknessId of productThicknessIds) {
        const cellValue = effectiveThroughHolePrice[rangeKey]?.[thicknessId] ?? "";
        if (cellValue === "") continue;
        const pricePerHole = Number(cellValue);
        if (!Number.isFinite(pricePerHole)) continue;
        items.push({ thicknessId, minDiameterMm, maxDiameterMm, pricePerHole });
      }
    }

    if (items.length === 0) {
      toast("Nothing to save", { variant: "error" });
      return;
    }

    bulkUpsertHolePricingMutation
      .mutateAsync({ productId, items })
      .then(() => toast("Through-hole pricing saved", { variant: "success" }))
      .catch(() => toast("Failed to save through-hole pricing", { variant: "error" }));
  }, [
    bulkUpsertHolePricingMutation,
    diameterRangeKeys,
    effectiveThroughHolePrice,
    productId,
    productThicknessIds,
    toast,
  ]);

  const removeThroughHoleRange = React.useCallback((rangeKey: HoleDiameterRangeKey) => {
    setRemovedThroughHoleRangeKeys((prev) => ({ ...prev, [rangeKey]: true }));
    setThroughHoleEdits((prev) => {
      if (!prev[rangeKey]) return prev;
      const next = { ...prev };
      delete next[rangeKey];
      return next;
    });
  }, []);

  const handleRemoveRange = React.useCallback(
    async (rangeKey: string) => {
      const [minStr, maxStr] = rangeKey.split("-");
      const minDiameterMm = Number(minStr);
      const maxDiameterMm = Number(maxStr);

      const persistedRows = (holePricing ?? []).filter(
        (r) =>
          Number(r.minDiameterMm) === minDiameterMm &&
          Number(r.maxDiameterMm) === maxDiameterMm,
      );

      if (persistedRows.length > 0) {
        const ids = persistedRows.map((r) => r.id);
        try {
          await bulkDeleteHolePricingMutation.mutateAsync({ ids, productId });
          toast("Row deleted", { variant: "success" });
        } catch {
          try {
            await Promise.all(
              persistedRows.map((r) =>
                deleteHolePricingMutation.mutateAsync({ id: r.id, productId }),
              ),
            );
            toast("Row deleted", { variant: "success" });
          } catch {
            toast("Failed to delete row", { variant: "error" });
            return;
          }
        }
      }

      removeThroughHoleRange(rangeKey);
    },
    [
      bulkDeleteHolePricingMutation,
      deleteHolePricingMutation,
      holePricing,
      productId,
      removeThroughHoleRange,
      toast,
    ],
  );

  return (
    <ThroughHolePriceSection
      diameterRanges={diameterRanges}
      thicknessColumns={productThicknessColumns}
      effectivePrice={effectiveThroughHolePrice}
      hasNoPricing={hasNoPricing}
      hasPricingButNoRanges={hasPricingButNoRanges}
      isSaving={bulkUpsertHolePricingMutation.isPending}
      onSave={handleSaveThroughHolePrice}
      onChangeCell={setThroughHolePrice}
      onAddRange={(min, max, prices) => {
        const result = addThroughHoleRange(min, max, prices);
        if (!result.ok) toast(result.message, { variant: "error" });
        return result;
      }}
      onRemoveRange={handleRemoveRange}
    />
  );
}
