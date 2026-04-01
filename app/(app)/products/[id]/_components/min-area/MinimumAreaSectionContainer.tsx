import React from "react";

import { useToast } from "@/components/core/Toast/ToastProvider";
import { useProductConfigs, useUpdateProductConfig } from "@/hooks/api";

import { MinimumAreaSection } from "./MinimumAreaSection";

type MinimumAreaSectionContainerProps = {
  productId: string;
};

const MIN_AREA_M2_KEY = "MIN_AREA_M2";

function parseMinimumAreaM2(configValue: unknown): number | null {
  if (!configValue || typeof configValue !== "object") return null;

  const value = (configValue as { value?: unknown }).value;

  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const numeric = Number.parseFloat(value.trim());
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

export function MinimumAreaSectionContainer({ productId }: MinimumAreaSectionContainerProps) {
  const { toast } = useToast();

  const { data: configs } = useProductConfigs({
    productId,
    key: MIN_AREA_M2_KEY,
  });

  const updateMutation = useUpdateProductConfig();

  const minAreaConfig = React.useMemo(() => (configs ?? [])[0], [configs]);

  const [minimumAreaM2, setMinimumAreaM2] = React.useState<number>(0);

  React.useEffect(() => {
    const parsed = parseMinimumAreaM2(minAreaConfig?.configValue);
    if (typeof parsed === "number") setMinimumAreaM2(parsed);
  }, [minAreaConfig]);

  const handleSave = () => {
    if (!minAreaConfig?.id) {
      toast("Minimum area config not found", { variant: "error" });
      return;
    }

    updateMutation
      .mutateAsync({
        id: minAreaConfig.id,
        dto: {
          configValue: { value: minimumAreaM2 },
        },
      })
      .then(() => toast("Minimum area updated", { variant: "success" }))
      .catch(() => toast("Failed to update minimum area", { variant: "error" }));
  };

  return (
    <MinimumAreaSection
      minimumAreaM2={minimumAreaM2}
      onChangeMinimumAreaM2={setMinimumAreaM2}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
    />
  );
}
