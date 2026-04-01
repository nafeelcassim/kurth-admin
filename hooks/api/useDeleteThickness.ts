import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ThicknessService } from "@/service";
import { queryKeys } from "./queryKeys";

export function useDeleteThickness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.thickness.delete(),
    mutationFn: (id: string) => ThicknessService.deleteThickness(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.thickness.list(),
      });
    },
  });
}
