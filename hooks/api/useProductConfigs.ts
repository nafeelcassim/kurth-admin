import { ProductConfigService } from "@/service";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "./queryKeys";

type UseProductConfigsArgs = {
  productId?: string;
  key?: string;
};

export function useProductConfigs(args: UseProductConfigsArgs) {
  return useQuery({
    queryKey: queryKeys.productConfig.list(args),
    queryFn: () => ProductConfigService.getAll(args),
    enabled: !!args.productId,
  });
}
