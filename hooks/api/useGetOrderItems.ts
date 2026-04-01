import { useQuery } from "@tanstack/react-query";

import { OrderService, type Locale } from "@/service";

import { queryKeys } from "./queryKeys";

type UseGetOrderItemsOptions = {
  enabled?: boolean;
};

export function useGetOrderItems(
  orderId?: string,
  locale?: Locale,
  page: number = 1,
  limit: number = 20,
  options: UseGetOrderItemsOptions = {}
) {
  return useQuery({
    queryKey: queryKeys.order.items(orderId, locale, page, limit),
    queryFn: async () => {
      if (!orderId || !locale) throw new Error("Missing orderId or locale");
      return OrderService.getOrderItems(orderId, locale, page, limit);
    },
    enabled: (options.enabled ?? true) && Boolean(orderId) && Boolean(locale),
  });
}
