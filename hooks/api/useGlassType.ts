import { GlassTypeService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

type UseGlassTypeOptions = {
  enabled?: boolean;
};

export function useGlassType(
  id: string | undefined,
  productId?: string,
  options: UseGlassTypeOptions = {}
) {
  return useQuery({
    queryKey: queryKeys.glassType.detail(id, productId),
    queryFn: () => {
      if (!id) throw new Error("Glass type id is required");
      return GlassTypeService.getGlassTypeById(id, productId);
    },
    enabled: (options.enabled ?? true) && !!id,
  });
}
