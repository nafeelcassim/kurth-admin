export interface HolePricingThickness {
  id: string;
  value: string;
}

export interface HolePricingListItem {
  id: string;
  productId: string;
  thicknessId: string;
  minDiameterMm: number;
  maxDiameterMm: number;
  pricePerHole: number;
  thickness?: HolePricingThickness;
}

export interface BulkUpsertHolePricingItem {
  thicknessId: string;
  minDiameterMm: number;
  maxDiameterMm: number;
  pricePerHole: number;
}

export interface BulkUpsertHolePricingModel {
  productId: string;
  items: BulkUpsertHolePricingItem[];
}

export interface BulkDeleteHolePricingDto {
  ids: string[];
}
