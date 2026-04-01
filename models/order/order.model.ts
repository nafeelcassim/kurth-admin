export type OrderType = "pickup" | "delivery";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "completed"
  | "cancelled";

export type SortOrder = "ASC" | "DESC";

export interface GuestUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderListItem {
  id: string;
  orderType: OrderType;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  guestUser?: GuestUserListItem;
}

export type GetOrdersQueryDto = {
  page?: number;
  limit?: number;
  orderId?: string;
  isPaid?: boolean;
  orderType?: OrderType;
  status?: OrderStatus;
  guestUserName?: string;
  sortOrder?: SortOrder;
};

export interface OrdersPaginatedResponse {
  data: OrderListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface Hole {
  diameterMm: number;
  quantity: number;
}

export interface Translation {
  id: string;
  language: string;
  name: string;
  description?: string;
  productId?: string;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  slug: string;
  isActive: boolean;
  translations: Translation[];
}

export interface GlassType {
  id: string;
  imageUrl: string | null;
  translations: { id: string; language: string; name: string }[];
}

export interface Thickness {
  id: string;
  value: number;
}

export interface Shape {
  id: string;
  priceMultiplier: string;
  translations: { id: string; language: string; name: string }[];
}

export interface EdgeFinishing {
  id: string;
  imageUrl: string | null;
  pricePerLfm: string;
  minLengthLfm: string;
  translations: { id: string; language: string; name: string }[];
}

export interface OrderItem {
  createdAt: string;
  id: string;
  orderId: string;
  productId: string;
  widthMm: number;
  heightMm: number;
  shapeId: string;
  glassTypeId: string;
  thicknessId: string;
  edgeFinishingId: string;
  holes: Hole[];
  netPrice: string;
  vatPercent: string;
  vatAmount: string;
  grossPrice: string;
  sketchUrl: string | null;
  quantity: number;
  product: Product;
  glassType: GlassType;
  thickness: Thickness;
  shape: Shape;
  edgeFinishing: EdgeFinishing;
}

export interface OrderItemsResponse {
  items: OrderItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GuestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  street?: string;
  village?: string;
  country?: string;
  postalCode?: string;
}

export interface Order {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  guestUserId: string;
  guestUser?: GuestUser;
  status: OrderStatus;
  totalNet: string;
  totalVat: string;
  totalGross: string;
  notes: string;
  orderType: OrderType;
  isPaid: boolean;
}
