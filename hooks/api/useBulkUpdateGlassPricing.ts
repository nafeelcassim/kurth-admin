import { GlassPricingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BulkUpdateGlassPricingItem } from "@/models/glass-pricing";

import { queryKeys } from "./queryKeys";

type BulkUpdateGlassPricingArgs = {
  productId: string;
  items: BulkUpdateGlassPricingItem[];
};

export function useBulkUpdateGlassPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.glassPricing.bulkUpdate(),
    mutationFn: ({ items }: BulkUpdateGlassPricingArgs) =>
      GlassPricingService.bulkUpdateGlassPricing({ items }),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassPricing.list(variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassPricing.list(),
        }),
      ]);
    },
  });
}
