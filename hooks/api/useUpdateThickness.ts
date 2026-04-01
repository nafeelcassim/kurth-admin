import { ThicknessService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateThicknessModel } from "@/models/thickness";
import { queryKeys } from "./queryKeys";

type UpdateThicknessArgs = {
  id: string;
  payload: UpdateThicknessModel;
};

export function useUpdateThickness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.thickness.update(),
    mutationFn: ({ id, payload }: UpdateThicknessArgs) =>
      ThicknessService.updateThickness(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.thickness.list() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.thickness.detail(variables.id),
        }),
      ]);
    },
  });
}
