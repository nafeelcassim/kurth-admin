export type ProductLanguage = "en" | "fr" | "de";

export enum ProductAspectRatio {
  ONE_ONE = "1:1",
  FOUR_THREE = "4:3",
  THREE_FOUR = "3:4",
}

export interface ProductTranslationModel {
  language: ProductLanguage;
  name: string;
  description?: string;
}

export interface ProductTranslationListItem {
  id: string;
  name: string;
  description?: string;
}

export interface ProductTranslationDetailItem {
  id: string;
  language: ProductLanguage;
  name: string;
  description?: string;
}

export interface ProductListItem {
  id: string;
  slug: string;
  isActive: boolean;
  imageUrl?: string | null;
  aspectRatio?: ProductAspectRatio | null;
  translations: ProductTranslationListItem[];
}

export interface ProductDetail {
  id: string;
  slug: string;
  isActive: boolean;
  imageUrl?: string | null;
  aspectRatio?: ProductAspectRatio | null;
  translations: ProductTranslationDetailItem[];
}

export interface UpdateProductTranslationModel {
  language: ProductLanguage;
  name?: string;
  description?: string;
}

export interface UpdateProductModel {
  slug?: string;
  isActive?: boolean;
  imageUrl?: string;
  aspectRatio?: ProductAspectRatio;
  translations?: UpdateProductTranslationModel[];
}

export interface CreateProductModel {
  slug: string;
  isActive?: boolean;
  imageUrl?: string;
  aspectRatio?: ProductAspectRatio;
  priceMultiplier?: number;
  translations: ProductTranslationModel[];
}
