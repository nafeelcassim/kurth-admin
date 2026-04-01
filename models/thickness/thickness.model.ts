export interface ThicknessListItem {
  id: string;
  productId: string;
  value: string;
  isActive: boolean;
}

export interface ThicknessDetail {
  id: string;
  productId: string;
  value: string;
  isActive: boolean;
}

export interface CreateThicknessModel {
  productId: string;
  value: string;
  isActive?: boolean;
}

export interface UpdateThicknessModel {
  productId?: string;
  value?: string;
  isActive?: boolean;
}
