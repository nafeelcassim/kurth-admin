import { ThicknessService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseThicknessOptions = {
  enabled?: boolean;
};

export function useThickness(
  id: string | undefined,
  options: UseThicknessOptions = {}
) {
  return useQuery({
    queryKey: queryKeys.thickness.detail(id),
    queryFn: () => {
      if (!id) throw new Error("Thickness id is required");
      return ThicknessService.getThicknessById(id);
    },
    enabled: (options.enabled ?? true) && !!id,
  });
}
