import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { OrderStatus } from "@/models/order";
import { OrderService } from "@/service";

import { queryKeys } from "./queryKeys";

type UpdateOrderArgs = {
  id: string;
  payload: {
    status?: OrderStatus;
    isPaid?: boolean;
  };
};

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.order.update(),
    mutationFn: ({ id, payload }: UpdateOrderArgs) => OrderService.updateOrder(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.order.list() });
    },
  });
}
