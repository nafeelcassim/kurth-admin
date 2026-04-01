import { api } from "../http.service";

import type {
  GetOrdersQueryDto,
  Order,
  OrderItemsResponse,
  OrderStatus,
  OrdersPaginatedResponse,
} from "@/models/order";

export type Locale = "en" | "fr" | "de";

type UpdateOrderPayload = {
  status?: OrderStatus;
  isPaid?: boolean;
};

export const OrderService = {
  getAllOrders: async (params: GetOrdersQueryDto = {}) => {
    const res = await api.get<OrdersPaginatedResponse>("/order", { params });
    return res.data;
  },

  getOrder: async (orderId: string, locale: Locale) => {
    const res = await api.get<Order>(`/order/${orderId}`, {
      headers: { "accept-language": locale },
    });
    return res.data;
  },

  getOrderItems: async (orderId: string, locale: Locale, page = 1, limit = 20) => {
    const res = await api.get<OrderItemsResponse>(`/order/${orderId}/items`, {
      params: { page, limit },
      headers: { "accept-language": locale },
    });
    return res.data;
  },

  updateOrder: async (id: string, payload: UpdateOrderPayload) => {
    const res = await api.patch(`/order/${id}`, payload);
    return res.data;
  },

  deleteOrder: async (id: string) => {
    const res = await api.delete(`/order/${id}`);
    return res.data;
  },
};
