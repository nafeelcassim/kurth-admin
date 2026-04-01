import { api } from "../http.service";

import type {
  CreateThicknessModel,
  ThicknessDetail,
  ThicknessListItem,
  UpdateThicknessModel,
} from "@/models/thickness";

export const ThicknessService = {
  getAllThicknesses: async () => {
    const res = await api.get<ThicknessListItem[]>("/thickness");
    return res.data;
  },

  getThicknessById: async (id: string) => {
    const res = await api.get<ThicknessDetail>(`/thickness/${id}`);
    return res.data;
  },

  createThickness: async (payload: CreateThicknessModel) => {
    const res = await api.post("/thickness", payload);
    return res.data;
  },

  updateThickness: async (id: string, payload: UpdateThicknessModel) => {
    const res = await api.patch(`/thickness/${id}`, payload);
    return res.data;
  },

  deleteThickness: async (id: string) => {
    const res = await api.delete(`/thickness/${id}`);
    return res.data;
  },
};
