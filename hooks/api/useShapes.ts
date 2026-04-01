import { ShapeService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useShapes() {
  return useQuery({
    queryKey: queryKeys.shape.list(),
    queryFn: () => ShapeService.getAllShapes(),
  });
}
