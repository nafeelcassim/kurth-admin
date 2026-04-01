import { ShapeService } from "@/service";
import type { UpdateShapeModel } from "@/models/shape";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UpdateShapePayload = {
  id: string;
  payload: UpdateShapeModel;
};

export function useUpdateShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.shape.update(),
    mutationFn: ({ id, payload }: UpdateShapePayload) =>
      ShapeService.updateShape(id, payload),
    onSuccess: async (_res, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.shape.list() });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shape.detail(variables.id),
      });
    },
  });
}
