import { GlassTypeService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

export function useGlassTypes(productId?: string) {
  return useQuery({
    queryKey: queryKeys.glassType.list(productId),
    queryFn: () => GlassTypeService.getAllGlassTypes(productId),
  });
}
