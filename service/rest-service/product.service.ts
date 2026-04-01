import { api } from "../http.service";
import type {
  CreateProductModel,
  ProductDetail,
  ProductListItem,
  UpdateProductModel,
} from "@/models";

export const ProductService = {
  getAllProducts: async () => {
    const res = await api.get<ProductListItem[]>("/product");
    return res.data;
  },

  getProductById: async (id: string) => {
    const res = await api.get<ProductDetail>(`/product/${id}`);
    return res.data;
  },

  updateProduct: async (id: string, payload: UpdateProductModel) => {
    const res = await api.patch(`/product/${id}`, payload);
    return res.data;
  },

  createProduct: async (payload: CreateProductModel) => {
    const res = await api.post("/product", payload);
    return res.data;
  },
};
