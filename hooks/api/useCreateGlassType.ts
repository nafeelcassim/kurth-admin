import { GlassTypeService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateGlassTypeModel } from "@/models/glass-type";

import { queryKeys } from "./queryKeys";

export function useCreateGlassType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.glassType.create(),
    mutationFn: (payload: CreateGlassTypeModel) =>
      GlassTypeService.createGlassType(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.glassType.list(variables.productId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.glassType.list(),
      });
    },
  });
}
