
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { ShapeService } from "@/service";

export function useDeleteShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.shape.delete(),
    mutationFn: (id: string) => ShapeService.deleteShape(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.shape.list() });
    },
  });
}
