import { EdgeFinishingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateEdgeFinishingModel } from "@/models/edge-finishing";

import { queryKeys } from "./queryKeys";

type UpdateEdgeFinishingArgs = {
  id: string;
  payload: UpdateEdgeFinishingModel;
  productId?: string;
};

export function useUpdateEdgeFinishing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.edgeFinishing.update(),
    mutationFn: ({ id, payload }: UpdateEdgeFinishingArgs) =>
      EdgeFinishingService.updateEdgeFinishing(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.edgeFinishing.detail(variables.id, variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.edgeFinishing.detail(variables.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.edgeFinishing.list(variables.productId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.edgeFinishing.list(),
        }),
      ]);
    },
  });
}
