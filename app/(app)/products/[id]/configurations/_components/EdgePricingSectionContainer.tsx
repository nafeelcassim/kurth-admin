import React from "react";

import { useToast } from "@/components/core/Toast/ToastProvider";
import { useEdgeFinishings, useUpdateEdgeFinishing } from "@/hooks/api";

import { EdgePriceSection } from "./EdgePriceSection";

type EdgePricingSectionContainerProps = {
  productId: string;
};

export function EdgePricingSectionContainer({ productId }: EdgePricingSectionContainerProps) {
  const { toast } = useToast();

  const { data: edgeFinishings } = useEdgeFinishings(productId);
  const updateEdgeFinishingMutation = useUpdateEdgeFinishing();

  const [edgeFinishingPriceEdits, setEdgeFinishingPriceEdits] = React.useState<Record<string, number>>(
    {},
  );

  const effectiveEdgeFinishings = React.useMemo(() => {
    const rows = edgeFinishings ?? [];
    return rows.map((r) => ({
      id: r.id,
      name: r.translations?.find((t) => t.language === "en")?.name || r.name,
      pricePerLfm:
        typeof edgeFinishingPriceEdits[r.id] === "number" &&
        Number.isFinite(edgeFinishingPriceEdits[r.id])
          ? edgeFinishingPriceEdits[r.id]
          : r.pricePerLfm,
    }));
  }, [edgeFinishings, edgeFinishingPriceEdits]);

  const setEdgePrice = React.useCallback((edgeFinishingId: string, value: number) => {
    setEdgeFinishingPriceEdits((prev) => ({ ...prev, [edgeFinishingId]: value }));
  }, []);

  const handleSaveEdgePricePerLfm = React.useCallback(() => {
    const rows = edgeFinishings ?? [];
    const updates = rows
      .map((row) => {
        const next = edgeFinishingPriceEdits[row.id];
        if (typeof next !== "number" || !Number.isFinite(next)) return null;
        if (next === row.pricePerLfm) return null;
        return { id: row.id, pricePerLfm: next };
      })
      .filter((x): x is { id: string; pricePerLfm: number } => !!x);

    if (updates.length === 0) {
      toast("Nothing to save", { variant: "error" });
      return;
    }

    Promise.all(
      updates.map((u) =>
        updateEdgeFinishingMutation.mutateAsync({
          id: u.id,
          payload: { pricePerLfm: u.pricePerLfm },
          productId,
        }),
      ),
    )
      .then(() => {
        toast("Edge pricing saved", { variant: "success" });
        setEdgeFinishingPriceEdits({});
      })
      .catch(() => toast("Failed to save edge pricing", { variant: "error" }));
  }, [edgeFinishings, edgeFinishingPriceEdits, productId, toast, updateEdgeFinishingMutation]);

  return (
    <EdgePriceSection
      edgeFinishings={effectiveEdgeFinishings}
      onChangeEdgePrice={setEdgePrice}
      onSave={handleSaveEdgePricePerLfm}
      isSaving={updateEdgeFinishingMutation.isPending}
    />
  );
}
