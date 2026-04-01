import { ProductService } from "@/service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.product.list(),
    queryFn: () => ProductService.getAllProducts(),
  });
}
