import { api } from "../http.service";
import type {
  CreateShapeModel,
  ShapeDetail,
  ShapeListItem,
  UpdateShapeModel,
} from "@/models/shape";

export const ShapeService = {
  getAllShapes: async () => {
    const res = await api.get<ShapeListItem[]>("/shape");
    return res.data;
  },

  getShapeById: async (id: string) => {
    const res = await api.get<ShapeDetail>(`/shape/${id}`);
    return res.data;
  },

  createShape: async (payload: CreateShapeModel) => {
    const res = await api.post("/shape", payload);
    return res.data;
  },

  updateShape: async (id: string, payload: UpdateShapeModel) => {
    const res = await api.patch(`/shape/${id}`, payload);
    return res.data;
  },

  deleteShape: async (id: string) => {
    const res = await api.delete(`/shape/${id}`);
    return res.data;
  },
};
