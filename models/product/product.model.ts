export type ProductLanguage = "en" | "fr" | "de";

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
  translations: ProductTranslationListItem[];
}

export interface ProductDetail {
  id: string;
  slug: string;
  isActive: boolean;
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
  translations?: UpdateProductTranslationModel[];
}

export interface CreateProductModel {
  slug: string;
  isActive?: boolean;
  priceMultiplier?: number;
  translations: ProductTranslationModel[];
}
