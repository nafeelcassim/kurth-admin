export type ShapeLanguage = "en" | "fr" | "de";

export interface CreateShapeTranslationModel {
  language: ShapeLanguage;
  name: string;
}

export interface ShapeTranslationDetailItem {
  id: string;
  language: ShapeLanguage;
  name: string;
}

export interface ShapeListItem {
  id: string;
  name: string;
  isActive: boolean;
  priceMultiplier?: number;
  translations?: ShapeTranslationDetailItem[];
}

export interface ShapeDetail {
  id: string;
  name: string;
  isActive: boolean;
  priceMultiplier?: number;
  translations: ShapeTranslationDetailItem[];
}

export interface CreateShapeModel {
  productId: string;
  name: string;
  translations: CreateShapeTranslationModel[];
  priceMultiplier?: number;
  isActive?: boolean;
}

export interface UpdateShapeTranslationModel {
  language: ShapeLanguage;
  name?: string;
}

export interface UpdateShapeModel {
  productId?: string;
  name?: string;
  translations?: UpdateShapeTranslationModel[];
  priceMultiplier?: number;
  isActive?: boolean;
}
