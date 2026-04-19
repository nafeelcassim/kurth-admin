export type EdgeFinishingLanguage = "en" | "fr" | "de";

export interface CreateEdgeFinishingTranslationModel {
  language: EdgeFinishingLanguage;
  name: string;
}

export interface EdgeFinishingTranslationDetailItem {
  id: string;
  language: EdgeFinishingLanguage;
  name: string;
}

export interface EdgeFinishingListItem {
  id: string;
  name: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4" | null;
  pricePerLfm: number;
  minLengthLfm: number;
  isActive: boolean;
  translations?: EdgeFinishingTranslationDetailItem[];
}

export interface EdgeFinishingDetail {
  id: string;
  name: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4" | null;
  pricePerLfm: number;
  minLengthLfm: number;
  isActive: boolean;
  translations?: EdgeFinishingTranslationDetailItem[];
}

export interface CreateEdgeFinishingModel {
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4";
  pricePerLfm: number;
  minLengthLfm: number;
  isActive?: boolean;
  translations: CreateEdgeFinishingTranslationModel[];
}

export interface UpdateEdgeFinishingTranslationModel {
  language: EdgeFinishingLanguage;
  name?: string;
}

export interface UpdateEdgeFinishingModel {
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:3" | "3:4";
  pricePerLfm?: number;
  minLengthLfm?: number;
  isActive?: boolean;
  translations?: UpdateEdgeFinishingTranslationModel[];
}
