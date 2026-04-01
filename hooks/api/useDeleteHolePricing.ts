import { HolePricingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

type DeleteHolePricingArgs = {
  id: string;
  productId?: string;
};

export function useDeleteHolePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.holePricing.delete(),
    mutationFn: ({ id }: DeleteHolePricingArgs) => HolePricingService.deleteHolePricing(id),
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
