import { LoginModel } from "@/models";
import { api } from "../http.service";

export const AuthService = {
     login: async (data:LoginModel)  => {
        const res = await api.post('auth/login',data);
        return res;
    },
    logout: async () => {
        const res = await api.post('auth/logout');
        return res;
    },
}