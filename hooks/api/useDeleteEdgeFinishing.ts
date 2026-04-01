import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EdgeFinishingService } from "@/service";

import { queryKeys } from "./queryKeys";

type DeleteEdgeFinishingArgs = {
  id: string;
  productId?: string;
};

export function useDeleteEdgeFinishing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.edgeFinishing.delete(),
    mutationFn: ({ id }: DeleteEdgeFinishingArgs) => EdgeFinishingService.deleteEdgeFinishing(id),
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
