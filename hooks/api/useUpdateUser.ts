import { UserService } from "@/service";
import type { UpdateUserModel } from "@/models";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

type UpdateUserPayload = {
  id: string;
  payload: UpdateUserModel;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.user.update(),
    mutationFn: ({ id, payload }: UpdateUserPayload) =>
      UserService.updateUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.list() });
    },
  });
}
