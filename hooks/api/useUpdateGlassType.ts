import { GlassTypeService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateGlassTypeModel } from "@/models/glass-type";

import { queryKeys } from "./queryKeys";

type UpdateGlassTypeArgs = {
  id: string;
  payload: UpdateGlassTypeModel;
  productId?: string;
};

export function useUpdateGlassType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.glassType.update(),
    mutationFn: ({ id, payload }: UpdateGlassTypeArgs) =>
      GlassTypeService.updateGlassType(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassType.detail(variables.id, variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassType.detail(variables.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassType.list(variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.glassType.list(),
        }),
      ]);
    },
  });
}
