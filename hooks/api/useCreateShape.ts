import { ShapeService } from "@/service";
import type { CreateShapeModel } from "@/models/shape";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useCreateShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.shape.create(),
    mutationFn: (payload: CreateShapeModel) => ShapeService.createShape(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.shape.list() });
    },
  });
}
