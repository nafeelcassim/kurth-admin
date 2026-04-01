import { useMutation, useQueryClient } from "@tanstack/react-query";

import { OrderService } from "@/service";

import { queryKeys } from "./queryKeys";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.order.delete(),
    mutationFn: (id: string) => OrderService.deleteOrder(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.order.list() });
    },
  });
}
