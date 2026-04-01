import { HolePricingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

type BulkDeleteHolePricingArgs = {
  ids: string[];
  productId?: string;
};

export function useBulkDeleteHolePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.holePricing.bulkDelete(),
    mutationFn: ({ ids }: BulkDeleteHolePricingArgs) => HolePricingService.bulkDeleteHolePricing(ids),
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
