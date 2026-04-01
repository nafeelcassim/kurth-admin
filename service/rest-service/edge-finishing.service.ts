import { api } from "../http.service";

import type {
  CreateEdgeFinishingModel,
  EdgeFinishingDetail,
  EdgeFinishingListItem,
  UpdateEdgeFinishingModel,
} from "@/models/edge-finishing";

export const EdgeFinishingService = {
  getAllEdgeFinishings: async (productId?: string) => {
    const res = await api.get<EdgeFinishingListItem[]>("/edge-finishing", {
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  getEdgeFinishingById: async (id: string, productId?: string) => {
    const res = await api.get<EdgeFinishingDetail>(`/edge-finishing/${id}`, {
      params: productId ? { productId } : undefined,
    });
    return res.data;
  },

  createEdgeFinishing: async (payload: CreateEdgeFinishingModel) => {
    const res = await api.post("/edge-finishing", payload);
    return res.data;
  },

  updateEdgeFinishing: async (id: string, payload: UpdateEdgeFinishingModel) => {
    const res = await api.patch(`/edge-finishing/${id}`, payload);
    return res.data;
  },

  deleteEdgeFinishing: async (id: string) => {
    const res = await api.delete(`/edge-finishing/${id}`);
    return res.data;
  },
};
