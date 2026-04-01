import { GlassPricingService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

export function useGlassPricing(productId?: string) {
  return useQuery({
    queryKey: queryKeys.glassPricing.list(productId),
    queryFn: () => GlassPricingService.getAllGlassPricing(productId),
  });
}
