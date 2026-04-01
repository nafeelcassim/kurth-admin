import { ProductService } from "@/service";
import type { CreateProductModel } from "@/models";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.product.create(),
    mutationFn: (payload: CreateProductModel) => ProductService.createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.product.list() });
    },
  });
}
