import React from "react";

import { useToast } from "@/components/core/Toast/ToastProvider";
import { useProductConfigs, useUpdateProductConfig } from "@/hooks/api";

import { VatRateSection } from "./VatRateSection";

type VatRateSectionContainerProps = {
  productId: string;
};

const VAT_RATE_KEY = "VAT_RATE";

function parseVatRate(configValue: unknown): number | null {
  if (!configValue || typeof configValue !== "object") return null;

  const value = (configValue as { value?: unknown }).value;

  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const numeric = Number.parseFloat(value.replace("%", "").trim());
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

export function VatRateSectionContainer({ productId }: VatRateSectionContainerProps) {
  const { toast } = useToast();

  const { data: configs } = useProductConfigs({
    productId,
    key: VAT_RATE_KEY,
  });

  const updateMutation = useUpdateProductConfig();

  const vatConfig = React.useMemo(() => (configs ?? [])[0], [configs]);

  const [vatRate, setVatRate] = React.useState<number>(8.1);

  React.useEffect(() => {
    const parsed = parseVatRate(vatConfig?.configValue);
    if (typeof parsed === "number") setVatRate(parsed);
  }, [vatConfig]);

  const handleSave = () => {
    if (!vatConfig?.id) {
      toast("VAT config not found", { variant: "error" });
      return;
    }

    updateMutation
      .mutateAsync({
        id: vatConfig.id,
        dto: {
          configValue: { value: `${vatRate}%` },
        },
        productId,
        key: VAT_RATE_KEY,
      })
      .then(() => toast("VAT updated", { variant: "success" }))
      .catch(() => toast("Failed to update VAT", { variant: "error" }));
  };

  return (
    <VatRateSection
      vatRate={vatRate}
      onChangeVatRate={setVatRate}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
    />
  );
}
