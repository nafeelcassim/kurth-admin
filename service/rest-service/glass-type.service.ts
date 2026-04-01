import { api } from "../http.service";

import type {
  CreateGlassTypeModel,
  GlassTypeDetail,
  GlassTypeListItem,
  UpdateGlassTypeModel,
} from "@/models/glass-type";

export const GlassTypeService = {
  getAllGlassTypes: async (productId?: string) => {
    const res = await api.get<GlassTypeListItem[]>("/glass-type", {
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  getGlassTypeById: async (id: string, productId?: string) => {
    const res = await api.get<GlassTypeDetail>(`/glass-type/${id}`,{
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  createGlassType: async (payload: CreateGlassTypeModel) => {
    const res = await api.post("/glass-type", payload);
    return res.data;
  },

  updateGlassType: async (id: string, payload: UpdateGlassTypeModel) => {
    const res = await api.patch(`/glass-type/${id}`, payload);
    return res.data;
  },

  deleteGlassType: async (id: string) => {
    const res = await api.delete(`/glass-type/${id}`);
    return res.data;
  },
};
