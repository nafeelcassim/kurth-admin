export interface FindUsersDto {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isEmailVerified?: boolean;
  roleId?: string;
  search?: string;
  orderBy?: "email" | "firstName" | "lastName" | "createdAt" | "lastLoginAt";
  order?: "ASC" | "DESC";
}

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  lockUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  roles: unknown[];
}
