import { EdgeFinishingService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

type UseEdgeFinishingOptions = {
  enabled?: boolean;
};

export function useEdgeFinishing(
  id: string | undefined,
  productId?: string,
  options: UseEdgeFinishingOptions = {}
) {
  return useQuery({
    queryKey: queryKeys.edgeFinishing.detail(id, productId),
    queryFn: () => {
      if (!id) throw new Error("Edge finishing id is required");
      return EdgeFinishingService.getEdgeFinishingById(id, productId);
    },
    enabled: (options.enabled ?? true) && !!id,
  });
}
