import { ThicknessService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useThicknesses() {
  return useQuery({
    queryKey: queryKeys.thickness.list(),
    queryFn: () => ThicknessService.getAllThicknesses(),
  });
}
