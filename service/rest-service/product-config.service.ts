import { api } from "../http.service";

import type { ProductConfigListItem, UpdateProductConfigDto } from "@/models/product-config";

export type GetProductConfigsParams = {
  productId?: string;
  key?: string;
};

export const ProductConfigService = {
  getAll: async (params?: GetProductConfigsParams) => {
    const res = await api.get<ProductConfigListItem[]>("/product-config", {
      params,
    });
    return res.data;
  },

  update: async (id: string, dto: UpdateProductConfigDto) => {
    const res = await api.patch(`/product-config/${id}`, dto);
    return res.data;
  },
};
