import { useQuery } from "@tanstack/react-query";

import { OrderService, type Locale } from "@/service";

import { queryKeys } from "./queryKeys";

type UseGetOrderOptions = {
  enabled?: boolean;
};

export function useGetOrder(orderId?: string, locale?: Locale, options: UseGetOrderOptions = {}) {
  return useQuery({
    queryKey: queryKeys.order.detail(orderId, locale),
    queryFn: async () => {
      if (!orderId || !locale) throw new Error("Missing orderId or locale");
      return OrderService.getOrder(orderId, locale);
    },
    enabled: (options.enabled ?? true) && Boolean(orderId) && Boolean(locale),
  });
}
