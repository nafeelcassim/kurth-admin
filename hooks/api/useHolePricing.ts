import { HolePricingService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

export function useHolePricing(productId?: string) {
  return useQuery({
    queryKey: queryKeys.holePricing.list(productId),
    queryFn: () => HolePricingService.getAllHolePricing(productId),
    enabled: !!productId,
  });
}
