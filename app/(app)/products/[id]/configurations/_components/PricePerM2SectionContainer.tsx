import React from "react";

import { useToast } from "@/components/core/Toast/ToastProvider";
import {
  useBulkCreateGlassPricing,
  useBulkUpdateGlassPricing,
  useGlassPricing,
  useGlassTypes,
  useThicknesses,
} from "@/hooks/api";

import { PricePerM2Section } from "./PricePerM2Section";

type PricePerM2SectionContainerProps = {
  productId: string;
};

type CellValue = number | "";

type PriceGrid = Record<string, Record<string, CellValue>>;

type EditsState = Partial<Record<string, Partial<Record<string, CellValue>>>>;

function buildEmptyGrid(glassTypeIds: string[], thicknessIds: string[]): PriceGrid {
  const grid: PriceGrid = {};
  for (const glassTypeId of glassTypeIds) {
    grid[glassTypeId] = {};
    for (const thicknessId of thicknessIds) {
      grid[glassTypeId][thicknessId] = "";
    }
  }
  return grid;
}

export function PricePerM2SectionContainer({ productId }: PricePerM2SectionContainerProps) {
  const { toast } = useToast();

  const { data: glassTypes } = useGlassTypes(productId);
  const { data: thicknesses } = useThicknesses();
  const { data: glassPricing } = useGlassPricing(productId);

  const bulkCreateMutation = useBulkCreateGlassPricing();
  const bulkUpdateMutation = useBulkUpdateGlassPricing();

  const productThicknesses = React.useMemo(
    () => (thicknesses ?? []).filter((t) => t.productId === productId),
    [productId, thicknesses],
  );

  const [edits, setEdits] = React.useState<EditsState>({});

  const glassTypeIds = React.useMemo(() => (glassTypes ?? []).map((g) => g.id), [glassTypes]);
  const thicknessIds = React.useMemo(
    () => productThicknesses.map((t) => t.id),
    [productThicknesses],
  );

  const persistedByKey = React.useMemo(() => {
    const map = new Map<string, { id: string; pricePerM2: number }>();
    for (const row of glassPricing ?? []) {
      map.set(`${row.glassTypeId}:${row.thicknessId}`, {
        id: row.id,
        pricePerM2: Number(row.pricePerM2),
      });
    }
    return map;
  }, [glassPricing]);

  const effectiveGrid = React.useMemo(() => {
    const grid = buildEmptyGrid(glassTypeIds, thicknessIds);

    for (const [key, row] of persistedByKey.entries()) {
      const [glassTypeId, thicknessId] = key.split(":");
      if (!grid[glassTypeId] || !(thicknessId in grid[glassTypeId])) continue;
      grid[glassTypeId][thicknessId] = Number.isFinite(row.pricePerM2) ? row.pricePerM2 : "";
    }

    for (const glassTypeId of glassTypeIds) {
      const glassEdits = edits[glassTypeId];
      if (!glassEdits) continue;
      for (const thicknessId of thicknessIds) {
        const v = glassEdits[thicknessId];
        if (v === "" || (typeof v === "number" && Number.isFinite(v))) {
          grid[glassTypeId][thicknessId] = v;
        }
      }
    }

    return grid;
  }, [edits, glassTypeIds, persistedByKey, thicknessIds]);

  const setPrice = React.useCallback((glassTypeId: string, thicknessId: string, value: CellValue) => {
    setEdits((prev) => ({
      ...prev,
      [glassTypeId]: { ...(prev[glassTypeId] ?? {}), [thicknessId]: value },
    }));
  }, []);

  const handleSave = React.useCallback(() => {
    if (!glassTypes || glassTypes.length === 0) {
      toast("No glass types found for this product", { variant: "error" });
      return;
    }
    if (productThicknesses.length === 0) {
      toast("No thicknesses found for this product", { variant: "error" });
      return;
    }

    const createItems: {
      productId: string;
      glassTypeId: string;
      thicknessId: string;
      pricePerM2: number;
    }[] = [];

    const updateItems: { id: string; pricePerM2: number }[] = [];

    for (const g of glassTypes) {
      for (const t of productThicknesses) {
        const cell = effectiveGrid[g.id]?.[t.id] ?? "";
        if (cell === "") continue;
        const next = Number(cell);
        if (!Number.isFinite(next)) continue;

        const persisted = persistedByKey.get(`${g.id}:${t.id}`);
        if (!persisted) {
          createItems.push({
            productId,
            glassTypeId: g.id,
            thicknessId: t.id,
            pricePerM2: next,
          });
          continue;
        }

        if (next !== persisted.pricePerM2) {
          updateItems.push({ id: persisted.id, pricePerM2: next });
        }
      }
    }

    if (createItems.length === 0 && updateItems.length === 0) {
      toast("Nothing to save", { variant: "error" });
      return;
    }

    Promise.all([
      createItems.length > 0
        ? bulkCreateMutation.mutateAsync({ productId, items: createItems })
        : Promise.resolve(null),
      updateItems.length > 0
        ? bulkUpdateMutation.mutateAsync({ productId, items: updateItems })
        : Promise.resolve(null),
    ])
      .then(() => {
        toast("Price per m² saved", { variant: "success" });
        setEdits({});
      })
      .catch(() => toast("Failed to save price per m²", { variant: "error" }));
  }, [
    bulkCreateMutation,
    bulkUpdateMutation,
    effectiveGrid,
    glassTypes,
    persistedByKey,
    productId,
    productThicknesses,
    toast,
  ]);

  const isSaving = bulkCreateMutation.isPending || bulkUpdateMutation.isPending;

  return (
    <PricePerM2Section
      glassTypes={(glassTypes ?? []).map((g) => ({ id: g.id, name: g.name, translations: g.translations ?? [] }))}
      thicknesses={productThicknesses.map((t) => ({ id: t.id, value: t.value }))}
      pricePerM2={effectiveGrid}
      onChangeCell={setPrice}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
