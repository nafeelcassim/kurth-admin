import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GlassTypeService } from "@/service";

import { queryKeys } from "./queryKeys";

type DeleteGlassTypeArgs = {
  id: string;
  productId?: string;
};

export function useDeleteGlassType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.glassType.delete(),
    mutationFn: ({ id }: DeleteGlassTypeArgs) => GlassTypeService.deleteGlassType(id),
    onSuccess: async (_data, variables) => {
      await Promise.all([
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
