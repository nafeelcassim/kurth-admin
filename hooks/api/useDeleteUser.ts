import { UserService } from "@/service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.user.delete(),
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.list() });
    },
  });
}
