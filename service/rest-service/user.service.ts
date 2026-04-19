import { CreateUserResponse } from "@/hooks";
import { api } from "../http.service";
import type { CreateUserModel, FindUsersDto, MeResponse, PaginatedResponse, UpdateUserModel, UserListItem } from "@/models";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const UserService = {
     getMe: async ()  => {
        const res = await api.get<MeResponse>('/user/me');
        return res.data;
    },

    getAllUsers: async (params: FindUsersDto) => {
      const res = await api.get<PaginatedResponse<UserListItem>>("/user", {
        params,
      });
      return res.data;
    },

    getAllUsersList: async () => {
        const res = await api.get('/users');
        return res.data;
    },

    createUser: async (createUserModel:CreateUserModel) => {
        const res = await api.post<CreateUserResponse>('/user',createUserModel);
        return res.data;
    },

    deleteUser: async (id:string) => {
        const res = await api.delete(`/user/${id}`);
        return res.data;
    },
    
    updateUser: async (id:string,updateUserModel:UpdateUserModel) => {
        const res = await api.patch(`/user/${id}`,updateUserModel);
        return res.data;
    },

    changePassword: async (payload: ChangePasswordPayload) => {
      const res = await api.patch('/user/change-password', payload);
      return res.data;
    },
}