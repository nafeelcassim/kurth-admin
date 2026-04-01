import { ProductConfigService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateProductConfigDto } from "@/models/product-config";

import { queryKeys } from "./queryKeys";

type UpdateProductConfigArgs = {
  id: string;
  dto: UpdateProductConfigDto;
  productId?: string;
  key?: string;
};

export function useUpdateProductConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.productConfig.update(),
    mutationFn: ({ id, dto }: UpdateProductConfigArgs) => ProductConfigService.update(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productConfig.list({}),
        }),
      ]);
    },
  });
}
