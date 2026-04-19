export type GlassTypeLanguage = "en" | "fr" | "de";

export interface CreateGlassTypeTranslationModel {
  language: GlassTypeLanguage;
  name: string;
}

export interface GlassTypeTranslationDetailItem {
  id: string;
  language: GlassTypeLanguage;
  name: string;
}

export interface GlassTypeListItem {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4" | null;
  isActive: boolean;
  translations?: GlassTypeTranslationDetailItem[];
}

export interface GlassTypeDetail {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4" | null;
  isActive: boolean;
  translations?: GlassTypeTranslationDetailItem[];
}

export interface CreateGlassTypeModel {
  productId: string;
  name: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4";
  isActive?: boolean;
  translations?: CreateGlassTypeTranslationModel[];
}

export interface UpdateGlassTypeTranslationModel {
  language: GlassTypeLanguage;
  name?: string;
}

export interface UpdateGlassTypeModel {
  productId?: string;
  name?: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4";
  isActive?: boolean;
  translations?: UpdateGlassTypeTranslationModel[];
}
