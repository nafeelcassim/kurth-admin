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
  pricePerLfm: number;
  minLengthLfm: number;
  isActive: boolean;
  translations?: EdgeFinishingTranslationDetailItem[];
}

export interface EdgeFinishingDetail {
  id: string;
  name: string;
  imageUrl?: string;
  pricePerLfm: number;
  minLengthLfm: number;
  isActive: boolean;
  translations?: EdgeFinishingTranslationDetailItem[];
}

export interface CreateEdgeFinishingModel {
  imageUrl?: string;
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
  pricePerLfm?: number;
  minLengthLfm?: number;
  isActive?: boolean;
  translations?: UpdateEdgeFinishingTranslationModel[];
}
