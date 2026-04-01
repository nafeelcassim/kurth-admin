import { EdgeFinishingService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateEdgeFinishingModel } from "@/models/edge-finishing";

import { queryKeys } from "./queryKeys";

type CreateEdgeFinishingArgs = {
  payload: CreateEdgeFinishingModel;
  productId?: string;
};

export function useCreateEdgeFinishing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.edgeFinishing.create(),
    mutationFn: ({ payload }: CreateEdgeFinishingArgs) =>
      EdgeFinishingService.createEdgeFinishing(payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
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
