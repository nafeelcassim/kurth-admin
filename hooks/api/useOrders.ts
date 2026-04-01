import { useQuery } from "@tanstack/react-query";

import type { GetOrdersQueryDto } from "@/models/order";
import { OrderService } from "@/service";

import { queryKeys } from "./queryKeys";

type UseOrdersOptions = {
  enabled?: boolean;
};

export function useOrders(params: GetOrdersQueryDto, options: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: queryKeys.order.list(params),
    queryFn: () => OrderService.getAllOrders(params),
    enabled: options.enabled ?? true,
  });
}
