import { UserService } from "@/service";
import { copyToClipboard } from "@/utils/common.utils";
import type { CreateUserModel } from "@/models";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export type CreateUserResponse = {
  password?: string;
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.user.create(),
    mutationFn: (payload: CreateUserModel) =>
      UserService.createUser(payload) as Promise<CreateUserResponse>,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.list() });
      if (res.password) {
        try {
          await copyToClipboard(res.password);
        } catch (e) {
          // ignore clipboard failures
          console.log("Failed to copy password to clipboard",e);
        }
      }
    },
  });
}
