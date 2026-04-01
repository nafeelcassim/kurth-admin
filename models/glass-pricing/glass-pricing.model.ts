export interface GlassPricingListItem {
  id: string;
  productId: string;
  glassTypeId: string;
  thicknessId: string;
  pricePerM2: number;
}

export interface BulkCreateGlassPricingItem {
  productId: string;
  glassTypeId: string;
  thicknessId: string;
  pricePerM2: number;
}

export interface BulkCreateGlassPricingDto {
  items: BulkCreateGlassPricingItem[];
}

export interface BulkUpdateGlassPricingItem {
  id: string;
  pricePerM2: number;
}

export interface BulkUpdateGlassPricingDto {
  items: BulkUpdateGlassPricingItem[];
}
