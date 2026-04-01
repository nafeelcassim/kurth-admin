import { ProductService } from "@/service";
import type { UpdateProductModel } from "@/models";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UpdateProductPayload = {
  id: string;
  payload: UpdateProductModel;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.product.update(),
    mutationFn: ({ id, payload }: UpdateProductPayload) =>
      ProductService.updateProduct(id, payload),
    onSuccess: async (_res, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.product.list() });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(variables.id),
      });
    },
  });
}
