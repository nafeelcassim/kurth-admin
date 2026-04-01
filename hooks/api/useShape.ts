import { ShapeService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseShapeOptions = {
  enabled?: boolean;
};

export function useShape(id: string | undefined, options: UseShapeOptions = {}) {
  return useQuery({
    queryKey: queryKeys.shape.detail(id),
    queryFn: () => {
      if (!id) throw new Error("Shape id is required");
      return ShapeService.getShapeById(id);
    },
    enabled: (options.enabled ?? true) && !!id,
  });
}
