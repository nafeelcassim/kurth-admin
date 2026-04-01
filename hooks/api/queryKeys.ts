export const queryKeys = {
  auth: {
    login: () => ["login"] as const,
    logout: () => ["logout"] as const,
  },
  productConfig: {
    list: (params?: { productId?: string; key?: string }) =>
      params && (params.productId || params.key)
        ? (["product-config", params] as const)
        : (["product-config"] as const),
    update: () => ["update-product-config"] as const,
  },
  glassPricing: {
    list: (productId?: string) =>
      productId
        ? (["glass-pricing", { productId }] as const)
        : (["glass-pricing"] as const),
    bulkCreate: () => ["bulk-create-glass-pricing"] as const,
    bulkUpdate: () => ["bulk-update-glass-pricing"] as const,
  },
  holePricing: {
    list: (productId?: string) =>
      productId
        ? (["hole-pricing", { productId }] as const)
        : (["hole-pricing"] as const),
    bulkUpsert: () => ["bulk-upsert-hole-pricing"] as const,
    bulkDelete: () => ["bulk-delete-hole-pricing"] as const,
    delete: () => ["delete-hole-pricing"] as const,
  },
  edgeFinishing: {
    list: (productId?: string) =>
      productId
        ? (["edge-finishings", { productId }] as const)
        : (["edge-finishings"] as const),
    detail: (id: string | undefined, productId?: string) =>
      productId
        ? (["edge-finishing", id, { productId }] as const)
        : (["edge-finishing", id] as const),
    create: () => ["create-edge-finishing"] as const,
    update: () => ["update-edge-finishing"] as const,
    delete: () => ["delete-edge-finishing"] as const,
  },
  shape: {
    list: () => ["shapes"] as const,
    detail: (id: string | undefined) => ["shape", id] as const,
    create: () => ["create-shape"] as const,
    update: () => ["update-shape"] as const,
    delete: () => ["delete-shape"] as const,
  },
  thickness: {
    list: () => ["thicknesses"] as const,
    detail: (id: string | undefined) => ["thickness", id] as const,
    create: () => ["create-thickness"] as const,
    update: () => ["update-thickness"] as const,
    delete: () => ["delete-thickness"] as const,
  },
  glassType: {
    list: (productId?: string) =>
      productId
        ? (["glass-types", { productId }] as const)
        : (["glass-types"] as const),
    detail: (id: string | undefined, productId?: string) =>
      productId
        ? (["glass-type", id, { productId }] as const)
        : (["glass-type", id] as const),
    create: () => ["create-glass-type"] as const,
    update: () => ["update-glass-type"] as const,
    delete: () => ["delete-glass-type"] as const,
  },
  user: {
    me: () => ["me"] as const,
    list: (params?: unknown) => (params ? (["users", params] as const) : (["users"] as const)),
    create: () => ["create-user"] as const,
    update: () => ["update-user"] as const,
    delete: () => ["delete-user"] as const,
  },
  product: {
    list: () => ["products"] as const,
    detail: (id: string | undefined) => ["product", id] as const,
    create: () => ["create-product"] as const,
    update: () => ["update-product"] as const,
    delete: () => ['delete-product'] as const,
  },

  order: {
    list: (params?: unknown) => (params ? (["orders", params] as const) : (["orders"] as const)),
    detail: (orderId: string | undefined, locale?: string) =>
      locale ? (["order", orderId, { locale }] as const) : (["order", orderId] as const),
    items: (orderId: string | undefined, locale: string | undefined, page: number, limit: number) =>
      (["order-items", orderId, { locale, page, limit }] as const),
    update: () => ["update-order"] as const,
    delete: () => ["delete-order"] as const,
  },
} as const;
