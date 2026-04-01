import { api } from "../http.service";

import type {
  BulkUpsertHolePricingItem,
  BulkUpsertHolePricingModel,
  BulkDeleteHolePricingDto,
  HolePricingListItem,
} from "@/models/hole-pricing";

export const HolePricingService = {
  getAllHolePricing: async (productId?: string) => {
    const res = await api.get<HolePricingListItem[]>("/hole-pricing", {
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  bulkUpsertHolePricing: async (productId: string, items: BulkUpsertHolePricingItem[]) => {
    const payload: BulkUpsertHolePricingModel = {
      productId,
      items,
    };
    const res = await api.post<HolePricingListItem[]>("/hole-pricing/bulk", payload);
    return res.data;
  },

  bulkDeleteHolePricing: async (ids: string[]) => {
    const payload: BulkDeleteHolePricingDto = { ids };
    const res = await api.post("/hole-pricing/bulk-delete", payload);
    return res.data;
  },

  deleteHolePricing: async (id: string) => {
    const res = await api.delete(`/hole-pricing/${id}`);
    return res.data;
  },
};
