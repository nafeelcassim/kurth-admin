export interface ProductConfigListItem {
  id: string;
  productId: string;
  configKey: string;
  configValue: unknown;
}

export interface UpdateProductConfigDto {
  productId?: string;
  configKey?: string;
  configValue?: unknown;
}
