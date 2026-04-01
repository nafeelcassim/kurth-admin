import { HolePricingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BulkUpsertHolePricingItem } from "@/models/hole-pricing";

import { queryKeys } from "./queryKeys";

type BulkUpsertHolePricingArgs = {
  productId: string;
  items: BulkUpsertHolePricingItem[];
};

export function useBulkUpsertHolePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.holePricing.bulkUpsert(),
    mutationFn: ({ productId, items }: BulkUpsertHolePricingArgs) =>
      HolePricingService.bulkUpsertHolePricing(productId, items),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.holePricing.list(variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.holePricing.list(),
        }),
      ]);
    },
  });
}
