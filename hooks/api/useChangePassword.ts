import { useMutation } from "@tanstack/react-query";

import {  UserService, type ChangePasswordPayload } from "@/service";

import { queryKeys } from "./queryKeys";

type UseChangePasswordOptions = {
  onSuccess?: () => void;
};

export function useChangePassword(options: UseChangePasswordOptions = {}) {

  return useMutation({
    mutationKey: queryKeys.user.changePassword(),
    mutationFn: (payload: ChangePasswordPayload) => UserService.changePassword(payload),
    onSuccess: async () => {
      options.onSuccess?.();
    },
  });
}
