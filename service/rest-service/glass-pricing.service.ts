import { api } from "../http.service";

import type {
  BulkCreateGlassPricingDto,
  BulkUpdateGlassPricingDto,
  GlassPricingListItem,
} from "@/models/glass-pricing";

export const GlassPricingService = {
  getAllGlassPricing: async (productId?: string) => {
    const res = await api.get<GlassPricingListItem[]>("/glass-pricing", {
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  bulkCreateGlassPricing: async (dto: BulkCreateGlassPricingDto) => {
    const res = await api.post("/glass-pricing", dto);
    return res.data;
  },

  bulkUpdateGlassPricing: async (dto: BulkUpdateGlassPricingDto) => {
    const res = await api.patch("/glass-pricing/bulk/update", dto);
    return res.data;
  },
};
