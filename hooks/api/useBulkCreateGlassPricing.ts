import { GlassPricingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BulkCreateGlassPricingItem } from "@/models/glass-pricing";

import { queryKeys } from "./queryKeys";

type BulkCreateGlassPricingArgs = {
  productId: string;
  items: BulkCreateGlassPricingItem[];
};

export function useBulkCreateGlassPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.glassPricing.bulkCreate(),
    mutationFn: ({ items }: BulkCreateGlassPricingArgs) =>
      GlassPricingService.bulkCreateGlassPricing({ items }),
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
