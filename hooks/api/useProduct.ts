import { ProductService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UseProductOptions = {
  enabled?: boolean;
};

export function useProduct(id: string | undefined, options: UseProductOptions = {}) {
  return useQuery({
    queryKey: queryKeys.product.detail(id),
    queryFn: () => {
      if (!id) throw new Error("Product id is required");
      return ProductService.getProductById(id);
    },
    enabled: (options.enabled ?? true) && !!id,
  });
}
