import { EdgeFinishingService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

export function useEdgeFinishings(productId?: string) {
  return useQuery({
    queryKey: queryKeys.edgeFinishing.list(productId),
    queryFn: () => EdgeFinishingService.getAllEdgeFinishings(productId),
  });
}
